import Anthropic from '@anthropic-ai/sdk';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export interface EnrichedWordData {
  word: string;
  meaning: string;
  phonetic: string;
  collocations: string[];
  sentences: { en: string; cn: string }[];
}

interface WordInput {
  word: string;
  meaning: string;
}

export async function enrichWordsBatch(words: WordInput[]): Promise<EnrichedWordData[]> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Please define the ANTHROPIC_API_KEY environment variable');
  }

  if (words.length === 0) {
    return [];
  }

  const client = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
  });

  const wordList = words.map((w, i) => `${i + 1}. ${w.word} - ${w.meaning}`).join('\n');

  const prompt = `为以下英语单词批量生成学习资料：

${wordList}

请严格按照以下JSON数组格式返回（不要包含任何其他文字，只返回JSON）：
[
  {
    "word": "单词原文",
    "meaning": "中文含义",
    "phonetic": "音标，如 /ˈæpl/",
    "collocations": ["常用搭配1", "常用搭配2", "常用搭配3"],
    "sentences": [
      {"en": "英文例句1", "cn": "中文翻译1"},
      {"en": "英文例句2", "cn": "中文翻译2"}
    ]
  }
]

要求：
1. 按输入顺序返回每个单词的数据
2. phonetic 使用国际音标格式
3. collocations 提供3-5个常用搭配短语
4. sentences 提供2-3个实用例句，难度适中，适合英语学习者
5. 确保返回的是有效的JSON数组`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096 * Math.min(Math.ceil(words.length / 5), 4),
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  try {
    // 尝试提取JSON（处理可能的markdown代码块）
    let jsonText = content.text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const data = JSON.parse(jsonText) as EnrichedWordData[];
    return data.map((item, index) => ({
      word: item.word || words[index].word,
      meaning: item.meaning || words[index].meaning,
      phonetic: item.phonetic || '',
      collocations: item.collocations || [],
      sentences: item.sentences || [],
    }));
  } catch {
    throw new Error(`Failed to parse Claude response: ${content.text}`);
  }
}
