import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { UserProgress, Word } from '@/models';
import { calculateNextReview, Feedback } from '@/lib/ebbinghaus';

const USER_ID = 'default_user';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { wordId, progressId, feedback, isNewWord } = body as {
      wordId?: string;
      progressId?: string;
      feedback: Feedback;
      isNewWord?: boolean;
    };

    if (!feedback || !['green', 'yellow', 'red'].includes(feedback)) {
      return NextResponse.json({ error: 'Invalid feedback' }, { status: 400 });
    }

    let progress;

    if (isNewWord && wordId) {
      // Create new progress for a new word
      const wordExists = await Word.findById(wordId);
      if (!wordExists) {
        return NextResponse.json({ error: 'Word not found' }, { status: 404 });
      }

      // For new words, start at stage 0
      const { nextStage, nextReviewTime } = calculateNextReview(0, feedback);

      progress = await UserProgress.findOneAndUpdate(
        { user_id: USER_ID, word_id: wordId },
        {
          stage: nextStage,
          next_review_time: nextReviewTime,
          last_reviewed_at: new Date(),
          wrong_count: feedback === 'red' ? 1 : 0
        },
        { upsert: true, new: true }
      );
    } else if (progressId) {
      // Update existing progress
      progress = await UserProgress.findById(progressId);
      if (!progress) {
        return NextResponse.json({ error: 'Progress not found' }, { status: 404 });
      }

      const { nextStage, nextReviewTime } = calculateNextReview(progress.stage, feedback);

      progress.stage = nextStage;
      progress.next_review_time = nextReviewTime;
      progress.last_reviewed_at = new Date();

      if (feedback === 'red') {
        progress.wrong_count += 1;
      }

      // Mark as mastered if completed all stages
      if (nextStage >= 8 && feedback === 'green') {
        progress.status = 'mastered';
      }

      await progress.save();
    } else {
      return NextResponse.json({ error: 'wordId or progressId required' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      progress: {
        id: progress._id,
        stage: progress.stage,
        nextReviewTime: progress.next_review_time,
        status: progress.status
      }
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
