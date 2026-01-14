'use client';

import BottomNav from '@/components/BottomNav';

export default function SettingsPage() {
  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-md mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">设置 ⚙️</h1>

        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          <div className="p-4">
            <h3 className="font-medium text-gray-800">每日新词数量</h3>
            <p className="text-sm text-gray-500 mt-1">10 个/天（不多不少刚刚好）</p>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-800">发音</h3>
            <p className="text-sm text-gray-500 mt-1">使用系统语音合成</p>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-800">关于这个小应用</h3>
            <p className="text-sm text-gray-500 mt-1">琴子的单词本 v1.0</p>
            <p className="text-sm text-mint-600 mt-2">💕 专属于琴子的英语学习小天地</p>
            <p className="text-sm text-gray-400 mt-1">用艾宾浩斯记忆法，让学习更轻松</p>
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
