import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Config } from '@/models';

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) return true;
  return authHeader === `Bearer ${adminPassword}`;
}

export async function GET() {
  try {
    await dbConnect();

    const config = await Config.findOne({ key: 'daily_quotes' });

    const defaultQuotes = [
      '琴子今天也要加油哦，我一直在你身边 💕',
      '每学会一个单词，就离梦想更近一步',
      '琴子是最棒的，相信自己！',
      '学累了就休息一下，不要太辛苦啦',
      '今天的琴子也很努力呢，超级棒！',
      '一点一滴的积累，终将汇成星辰大海',
      '琴子加油！我为你骄傲 ✨',
      '慢慢来，比较快。琴子不要着急哦',
      '每一次坚持都是对未来的投资',
      '想你的时候，就做了这个给你 💝',
    ];

    return NextResponse.json({
      quotes: config?.value || defaultQuotes
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const body = await request.json();
    const { quotes } = body as { quotes: string[] };

    if (!Array.isArray(quotes)) {
      return NextResponse.json({ error: 'Quotes must be an array' }, { status: 400 });
    }

    await Config.findOneAndUpdate(
      { key: 'daily_quotes' },
      { value: quotes, updated_at: new Date() },
      { upsert: true }
    );

    return NextResponse.json({ success: true, quotes });
  } catch (error) {
    console.error('Error updating quotes:', error);
    return NextResponse.json({ error: 'Failed to update quotes' }, { status: 500 });
  }
}
