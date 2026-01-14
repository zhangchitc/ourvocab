import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserProgress } from '@/models';

const USER_ID = 'default_user';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const excludeWordId = searchParams.get('exclude'); // Exclude current word to avoid immediate repeat

    const now = new Date();

    // Build query - exclude the word just reviewed to avoid immediate repetition
    const query: any = {
      user_id: USER_ID,
      status: 'learning'
    };

    if (excludeWordId) {
      query.word_id = { $ne: excludeWordId };
    }

    // Get all learning words, sorted by priority:
    // 1. Due words first (next_review_time <= now)
    // 2. Then by wrong_count (harder words)
    // 3. Then by stage (less mastered)
    // 4. Random factor for variety
    const allWords = await UserProgress.find(query)
      .populate('word_id')
      .lean();

    if (allWords.length === 0) {
      // If no other words, include the excluded one too
      if (excludeWordId) {
        const allIncluding = await UserProgress.find({
          user_id: USER_ID,
          status: 'learning'
        }).populate('word_id').lean();

        return NextResponse.json({
          reviews: allIncluding.map((r: any) => ({
            progressId: r._id,
            word: r.word_id,
            stage: r.stage,
            wrongCount: r.wrong_count
          })),
          stats: { total: allIncluding.length }
        });
      }

      return NextResponse.json({ reviews: [], stats: { total: 0 } });
    }

    // Sort: due words first, then by wrong_count and stage
    const sorted = allWords.sort((a: any, b: any) => {
      const aIsDue = new Date(a.next_review_time) <= now;
      const bIsDue = new Date(b.next_review_time) <= now;

      // Due words come first
      if (aIsDue && !bIsDue) return -1;
      if (!aIsDue && bIsDue) return 1;

      // Then by wrong_count (higher first)
      if (a.wrong_count !== b.wrong_count) {
        return b.wrong_count - a.wrong_count;
      }

      // Then by stage (lower first)
      if (a.stage !== b.stage) {
        return a.stage - b.stage;
      }

      // Add randomness for variety
      return Math.random() - 0.5;
    });

    // Take limited number
    const selected = sorted.slice(0, limit);

    // Shuffle slightly for variety while keeping priority roughly intact
    for (let i = selected.length - 1; i > 0; i--) {
      // Only shuffle with nearby elements to maintain rough priority
      const j = Math.max(0, i - Math.floor(Math.random() * 3));
      [selected[i], selected[j]] = [selected[j], selected[i]];
    }

    return NextResponse.json({
      reviews: selected.map((r: any) => ({
        progressId: r._id,
        word: r.word_id,
        stage: r.stage,
        wrongCount: r.wrong_count
      })),
      stats: {
        total: selected.length,
        allLearning: allWords.length
      }
    });
  } catch (error) {
    console.error('Error fetching review list:', error);
    return NextResponse.json({ error: 'Failed to fetch review list' }, { status: 500 });
  }
}
