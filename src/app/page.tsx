'use client';

import { useEffect, useState } from 'react';
import BottomNav from '@/components/BottomNav';
import TaskCard from '@/components/TaskCard';

interface TaskData {
  stats: {
    dueCount?: number;
    newCount: number;
    learningCount?: number;
  };
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了，琴子要早点休息哦';
  if (hour < 9) return '早安，琴子 ☀️';
  if (hour < 12) return '上午好，琴子';
  if (hour < 14) return '中午好，琴子 🍱';
  if (hour < 18) return '下午好，琴子 ☕';
  if (hour < 22) return '晚上好，琴子 🌙';
  return '夜深了，琴子要早点休息哦 💤';
}

function formatDate(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  return now.toLocaleDateString('zh-CN', options);
}

export default function Home() {
  const [data, setData] = useState<TaskData | null>(null);
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tasksRes, quotesRes] = await Promise.all([
          fetch('/api/words/today'),
          fetch('/api/admin/quote'),
        ]);

        const tasksData = await tasksRes.json();
        const quotesData = await quotesRes.json();

        setData(tasksData);

        if (quotesData.quotes?.length > 0) {
          const randomQuote = quotesData.quotes[Math.floor(Math.random() * quotesData.quotes.length)];
          setQuote(randomQuote);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-md mx-auto px-4 pt-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {getGreeting()}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{formatDate()}</p>
          {quote && (
            <p className="text-mint-600 mt-4 italic">&ldquo;{quote}&rdquo;</p>
          )}
        </div>

        {/* Task Cards */}
        {loading ? (
          <div className="space-y-4">
            <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        ) : (
          <div className="space-y-4">
            <TaskCard
              title="今日新词 📖"
              count={data?.stats?.newCount ?? 0}
              total={10}
              href="/learn"
              color="mint"
              icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
            <TaskCard
              title="去复习 🔄"
              count={data?.stats?.learningCount ?? 0}
              href="/review"
              color="amber"
              icon="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              hideCount
            />
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
