'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import FlipCard from '@/components/FlipCard';

interface Word {
  _id: string;
  word: string;
  phonetic: string;
  meanings: string[];
  collocations: string[];
  sentences: { en: string; cn: string }[];
}

interface ReviewItem {
  progressId: string;
  word: Word;
  stage: number;
  wrongCount: number;
}

export default function ReviewPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(0);
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  // Use ref to track current reviews to avoid stale closure issues
  const reviewsRef = useRef<ReviewItem[]>([]);
  reviewsRef.current = reviews;

  // Fetch reviews from API
  const fetchReviews = useCallback(async (excludeWordId?: string) => {
    try {
      const url = excludeWordId
        ? `/api/words/review-list?limit=20&exclude=${excludeWordId}`
        : '/api/words/review-list?limit=20';
      const res = await fetch(url);
      const data = await res.json();
      return data.reviews || [];
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      return [];
    }
  }, []);

  // Initial load
  useEffect(() => {
    async function init() {
      const initialReviews = await fetchReviews();
      setReviews(initialReviews);
      setLoading(false);
    }
    init();
  }, [fetchReviews]);

  const handleFeedback = async (feedback: 'green' | 'yellow' | 'red') => {
    const currentReview = reviewsRef.current[currentIndex];
    if (!currentReview) return;

    const currentWordId = currentReview.word._id;

    // Submit feedback
    try {
      await fetch('/api/words/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progressId: currentReview.progressId,
          feedback,
        }),
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }

    setCompleted(prev => prev + 1);

    // Fetch fresh reviews (excluding current word to avoid immediate repeat)
    const freshReviews = await fetchReviews(currentWordId);

    if (freshReviews.length > 0) {
      // We have reviews to show
      setReviews(freshReviews);
      setCurrentIndex(0);
    } else {
      // No other words available - fetch without exclude to get current word back
      const allReviews = await fetchReviews();
      if (allReviews.length > 0) {
        setReviews(allReviews);
        setCurrentIndex(0);
      }
      // If still no reviews, keep showing current (shouldn't happen if user has learned words)
    }
  };

  const handleStop = () => {
    setShowStopConfirm(true);
  };

  const confirmStop = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </main>
    );
  }

  if (reviews.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">还没有学过单词呢</h2>
          <p className="text-gray-500 mb-2">先去学习一些新词吧！</p>
          <p className="text-mint-600 mb-6">学完新词后就可以来复习啦 💪</p>
          <button
            onClick={() => router.push('/learn')}
            className="px-6 py-3 bg-mint-500 text-white rounded-xl font-medium"
          >
            去学新词
          </button>
        </div>
      </main>
    );
  }

  const currentWord = reviews[currentIndex]?.word;

  return (
    <main className="min-h-screen py-8 px-4">
      {/* Header */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <button onClick={handleStop} className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            停止复习
          </button>
          <span>已复习 {completed} 个 ✨</span>
        </div>
      </div>

      {/* Flip Card */}
      {currentWord && (
        <AnimatePresence mode="wait">
          <FlipCard
            key={`${reviews[currentIndex].progressId}-${currentIndex}`}
            word={currentWord}
            onFeedback={handleFeedback}
          />
        </AnimatePresence>
      )}

      {/* Stop Confirmation Modal */}
      {showStopConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">休息一下？</h3>
            <p className="text-gray-500 mb-1">琴子已经复习了 <span className="text-amber-500 font-bold">{completed}</span> 个单词啦</p>
            <p className="text-mint-600 mb-4">超级棒！💕</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStopConfirm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
              >
                继续复习
              </button>
              <button
                onClick={confirmStop}
                className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-medium"
              >
                休息一下
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
