import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Word, UserProgress } from '@/models';

const DAILY_NEW_WORDS = 10;
const USER_ID = 'default_user';

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();

    // Get all word IDs that user has started learning
    const learnedWordIds = await UserProgress.find({ user_id: USER_ID })
      .distinct('word_id');

    // Check how many new words we need today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const newWordsToday = await UserProgress.countDocuments({
      user_id: USER_ID,
      last_reviewed_at: { $gte: todayStart },
      stage: { $lte: 1 }
    });

    const newWordsNeeded = Math.max(0, DAILY_NEW_WORDS - newWordsToday);
    let newWords: any[] = [];

    if (newWordsNeeded > 0) {
      // First, get custom words not yet learned
      const customWords = await Word.find({
        _id: { $nin: learnedWordIds },
        is_custom: true
      }).limit(newWordsNeeded);

      // Then fill with regular words if needed
      const remaining = newWordsNeeded - customWords.length;
      let regularWords: any[] = [];

      if (remaining > 0) {
        regularWords = await Word.find({
          _id: { $nin: learnedWordIds },
          is_custom: false
        }).limit(remaining);
      }

      newWords = [...customWords, ...regularWords];
    }

    // Count total learning words (for stats)
    const learningCount = await UserProgress.countDocuments({
      user_id: USER_ID,
      status: 'learning'
    });

    return NextResponse.json({
      newWords: newWords.map(w => ({
        wordId: w._id,
        word: w
      })),
      stats: {
        newCount: newWords.length,
        learningCount
      }
    });
  } catch (error) {
    console.error('Error fetching today tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
