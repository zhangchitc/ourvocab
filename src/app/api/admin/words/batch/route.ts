import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Word } from '@/models';
import { enrichWordsBatch } from '@/lib/claude';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) return true;
  return authHeader === `Bearer ${adminPassword}`;
}

interface ParsedWord {
  word: string;
  meaning: string;
}

function parseInput(text: string): ParsedWord[] {
  const lines = text.split('\n').filter(line => line.trim());
  const result: ParsedWord[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // 支持空格或制表符分隔
    const match = trimmed.match(/^([a-zA-Z][a-zA-Z\s'-]*?)\s+(.+)$/);
    if (match) {
      result.push({
        word: match[1].trim().toLowerCase(),
        meaning: match[2].trim(),
      });
    }
  }

  return result;
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const body = await request.json();
    const { words: wordsText } = body;

    if (!wordsText || typeof wordsText !== 'string') {
      return NextResponse.json({ error: 'Words text is required' }, { status: 400 });
    }

    const parsedWords = parseInput(wordsText);

    if (parsedWords.length === 0) {
      return NextResponse.json({ error: 'No valid words found in input' }, { status: 400 });
    }

    const results = {
      success: [] as string[],
      failed: [] as { word: string; reason: string }[],
      skipped: [] as string[],
    };

    // 1. 检查哪些单词已存在
    const existingWords = await Word.find({
      word: { $in: parsedWords.map(w => w.word.toLowerCase()) }
    }).select('word');

    const existingSet = new Set(existingWords.map(w => w.word.toLowerCase()));

    const newWords: ParsedWord[] = [];
    for (const parsed of parsedWords) {
      if (existingSet.has(parsed.word.toLowerCase())) {
        results.skipped.push(parsed.word);
      } else {
        newWords.push(parsed);
      }
    }

    // 2. 如果没有新单词需要处理，直接返回
    if (newWords.length === 0) {
      return NextResponse.json({
        total: parsedWords.length,
        success: 0,
        failed: 0,
        skipped: results.skipped.length,
        details: results,
      });
    }

    // 3. 一次性调用Claude批量获取数据
    let enrichedData;
    try {
      enrichedData = await enrichWordsBatch(newWords);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'AI service error';
      // 如果AI调用失败，所有新单词都标记为失败
      for (const w of newWords) {
        results.failed.push({ word: w.word, reason: errorMessage });
      }
      return NextResponse.json({
        total: parsedWords.length,
        success: 0,
        failed: results.failed.length,
        skipped: results.skipped.length,
        details: results,
      });
    }

    // 4. 逐个插入数据库
    for (const data of enrichedData) {
      try {
        await Word.create({
          word: data.word.toLowerCase(),
          phonetic: data.phonetic,
          meanings: [data.meaning],
          collocations: data.collocations,
          sentences: data.sentences,
          is_custom: true,
        });
        results.success.push(data.word);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Database error';
        results.failed.push({ word: data.word, reason: errorMessage });
      }
    }

    return NextResponse.json({
      total: parsedWords.length,
      success: results.success.length,
      failed: results.failed.length,
      skipped: results.skipped.length,
      details: results,
    });
  } catch (error) {
    console.error('Error in batch import:', error);
    return NextResponse.json({ error: 'Failed to process batch import' }, { status: 500 });
  }
}
