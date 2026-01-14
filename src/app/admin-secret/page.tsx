'use client';

import { useState, useEffect } from 'react';

interface Word {
  _id: string;
  word: string;
  phonetic: string;
  meanings: string[];
  collocations: string[];
  sentences: { en: string; cn: string }[];
  is_custom: boolean;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newWord, setNewWord] = useState({
    word: '',
    phonetic: '',
    meanings: '',
    collocations: '',
    sentences: '',
    is_custom: true,
  });

  const authHeader = `Bearer ${password}`;

  async function fetchWords() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/words?search=${search}`, {
        headers: { Authorization: authHeader },
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      setWords(data.words || []);
    } catch (error) {
      console.error('Failed to fetch words:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/words?limit=1', {
      headers: { Authorization: `Bearer ${password}` },
    });
    if (res.ok) {
      setIsAuthenticated(true);
      fetchWords();
    } else {
      alert('密码错误');
    }
  }

  async function handleAddWord(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({
          word: newWord.word,
          phonetic: newWord.phonetic,
          meanings: newWord.meanings.split('\n').filter(Boolean),
          collocations: newWord.collocations.split('\n').filter(Boolean),
          sentences: newWord.sentences.split('\n\n').filter(Boolean).map(s => {
            const [en, cn] = s.split('\n');
            return { en: en || '', cn: cn || '' };
          }),
          is_custom: newWord.is_custom,
        }),
      });

      if (res.ok) {
        setShowAddForm(false);
        setNewWord({ word: '', phonetic: '', meanings: '', collocations: '', sentences: '', is_custom: true });
        fetchWords();
      }
    } catch (error) {
      console.error('Failed to add word:', error);
    }
  }

  async function handleDeleteWord(id: string) {
    if (!confirm('确定要删除这个单词吗？')) return;

    try {
      await fetch(`/api/admin/words?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });
      fetchWords();
    } catch (error) {
      console.error('Failed to delete word:', error);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchWords();
    }
  }, [search, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">管理员登录</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入管理员密码"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-mint-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-mint-500 text-white rounded-xl font-medium hover:bg-mint-600 transition-colors"
          >
            登录
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">词库管理</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-mint-500 text-white rounded-xl font-medium hover:bg-mint-600 transition-colors"
          >
            添加单词
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索单词..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-mint-500"
          />
        </div>

        {/* Word List */}
        {loading ? (
          <div className="text-center text-gray-500">加载中...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
            {words.map((word) => (
              <div key={word._id} className="p-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{word.word}</span>
                    {word.phonetic && <span className="text-gray-500 text-sm">{word.phonetic}</span>}
                    {word.is_custom && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-xs rounded-full">惊喜</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {word.meanings?.slice(0, 2).join('; ')}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteWord(word._id)}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  删除
                </button>
              </div>
            ))}
            {words.length === 0 && (
              <div className="p-8 text-center text-gray-500">暂无单词</div>
            )}
          </div>
        )}

        {/* Add Word Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">添加新单词</h2>
              <form onSubmit={handleAddWord} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">单词</label>
                  <input
                    type="text"
                    value={newWord.word}
                    onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-mint-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">音标</label>
                  <input
                    type="text"
                    value={newWord.phonetic}
                    onChange={(e) => setNewWord({ ...newWord, phonetic: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-mint-500"
                    placeholder="/həˈloʊ/"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">释义 (每行一个)</label>
                  <textarea
                    value={newWord.meanings}
                    onChange={(e) => setNewWord({ ...newWord, meanings: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-mint-500 h-24"
                    placeholder="n. 你好&#10;int. 喂"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">固定搭配 (每行一个)</label>
                  <textarea
                    value={newWord.collocations}
                    onChange={(e) => setNewWord({ ...newWord, collocations: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-mint-500 h-20"
                    placeholder="say hello&#10;hello world"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">例句 (英文和中文各一行，空行分隔)</label>
                  <textarea
                    value={newWord.sentences}
                    onChange={(e) => setNewWord({ ...newWord, sentences: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-mint-500 h-32"
                    placeholder="Hello, how are you?&#10;你好，你怎么样？&#10;&#10;Say hello to your mom for me.&#10;代我向你妈妈问好。"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_custom"
                    checked={newWord.is_custom}
                    onChange={(e) => setNewWord({ ...newWord, is_custom: e.target.checked })}
                    className="w-4 h-4 text-mint-500"
                  />
                  <label htmlFor="is_custom" className="text-sm text-gray-700">标记为惊喜词汇（优先推送）</label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-mint-500 text-white rounded-xl font-medium hover:bg-mint-600 transition-colors"
                  >
                    添加
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
