'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import WordCard from '@/components/WordCard';

interface Word {
  _id: string;
  word: string;
  phonetic: string;
  meanings: string[];
  collocations: string[];
  sentences: { en: string; cn: string }[];
}

interface NewWordItem {
  wordId: string;
  word: Word;
}

export default function LearnPage() {
  const router = useRouter();
  const [words, setWords] = useState<NewWordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWords() {
      try {
        const res = await fetch('/api/words/today');
        const data = await res.json();
        setWords(data.newWords || []);
      } catch (error) {
        console.error('Failed to fetch words:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWords();
  }, []);

  const handleComplete = async () => {
    const currentWord = words[currentIndex];

    try {
      await fetch('/api/words/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wordId: currentWord.wordId,
          feedback: 'green',
          isNewWord: true,
        }),
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
    }

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </main>
    );
  }

  if (words.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">琴子太棒啦！</h2>
          <p className="text-gray-500 mb-2">今天的新词都学完了</p>
          <p className="text-mint-600 mb-6">好好休息一下，明天继续加油哦 💕</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-mint-500 text-white rounded-xl font-medium"
          >
            返回首页
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4">
      {/* Progress */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <button onClick={() => router.push('/')} className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
          <span>{currentIndex + 1} / {words.length}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-mint-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Word Card */}
      <AnimatePresence mode="wait">
        <WordCard
          key={words[currentIndex].wordId}
          word={words[currentIndex].word}
          onComplete={handleComplete}
        />
      </AnimatePresence>
    </main>
  );
}
