import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserProgress } from '@/models';

const USER_ID = 'default_user';

export async function GET() {
  try {
    await dbConnect();

    // Get data for past year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const reviews = await UserProgress.aggregate([
      {
        $match: {
          user_id: USER_ID,
          last_reviewed_at: { $gte: oneYearAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$last_reviewed_at' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get overall statistics
    const totalLearning = await UserProgress.countDocuments({
      user_id: USER_ID,
      status: 'learning'
    });

    const totalMastered = await UserProgress.countDocuments({
      user_id: USER_ID,
      status: 'mastered'
    });

    // Get top wrong words
    const topWrongWords = await UserProgress.find({
      user_id: USER_ID,
      wrong_count: { $gt: 0 }
    })
      .sort({ wrong_count: -1 })
      .limit(10)
      .populate('word_id');

    return NextResponse.json({
      heatmap: reviews.map(r => ({
        date: r._id,
        count: r.count
      })),
      stats: {
        learning: totalLearning,
        mastered: totalMastered,
        total: totalLearning + totalMastered
      },
      topWrongWords: topWrongWords.map(w => ({
        word: w.word_id,
        wrongCount: w.wrong_count
      }))
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
