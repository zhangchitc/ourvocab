'use client';

import { useEffect, useState } from 'react';
import BottomNav from '@/components/BottomNav';
import Heatmap from '@/components/Heatmap';

interface Word {
  _id: string;
  word: string;
  meanings: string[];
}

interface StatsData {
  heatmap: { date: string; count: number }[];
  stats: {
    learning: number;
    mastered: number;
    total: number;
  };
  topWrongWords: {
    word: Word;
    wrongCount: number;
  }[];
}

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats/heatmap');
        const stats = await res.json();
        setData(stats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen pb-20">
        <div className="max-w-md mx-auto px-4 pt-8">
          <div className="h-8 bg-gray-100 rounded animate-pulse mb-6" />
          <div className="h-40 bg-gray-100 rounded animate-pulse mb-6" />
          <div className="h-32 bg-gray-100 rounded animate-pulse" />
        </div>
        <BottomNav />
      </main>
    );
  }

  const masteredPercent = data?.stats.total
    ? Math.round((data.stats.mastered / data.stats.total) * 100)
    : 0;

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-md mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">琴子的学习足迹 📚</h1>

        {/* Progress Ring */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#22c55e"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${masteredPercent * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{masteredPercent}%</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-mint-500" />
                <span className="text-sm text-gray-600">已掌握: {data?.stats.mastered || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-sm text-gray-600">学习中: {data?.stats.learning || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">学习热力图</h2>
          <Heatmap data={data?.heatmap || []} />
        </div>

        {/* Top Wrong Words */}
        {data?.topWrongWords && data.topWrongWords.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">错词榜 Top 10</h2>
            <ul className="space-y-3">
              {data.topWrongWords.map((item, index) => (
                <li key={item.word._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      index < 3 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-medium text-gray-800">{item.word.word}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {item.word.meanings?.[0]?.slice(0, 15)}...
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-red-500">{item.wrongCount}次</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
