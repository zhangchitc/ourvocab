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
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [batchInput, setBatchInput] = useState('');
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<{
    total: number;
    success: number;
    failed: number;
    skipped: number;
    details: {
      success: string[];
      failed: { word: string; reason: string }[];
      skipped: string[];
    };
  } | null>(null);

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

  async function handleBatchImport(e: React.FormEvent) {
    e.preventDefault();
    if (!batchInput.trim()) return;

    setBatchLoading(true);
    setBatchResult(null);

    try {
      const res = await fetch('/api/admin/words/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({ words: batchInput }),
      });

      const data = await res.json();

      if (res.ok) {
        setBatchResult(data);
        fetchWords();
      } else {
        alert(data.error || '导入失败');
      }
    } catch (error) {
      console.error('Failed to batch import:', error);
      alert('导入失败，请重试');
    } finally {
      setBatchLoading(false);
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
          <div className="flex gap-2">
            <button
              onClick={() => setShowBatchImport(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              批量导入
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-mint-500 text-white rounded-xl font-medium hover:bg-mint-600 transition-colors"
            >
              添加单词
            </button>
          </div>
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
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    {word.collocations?.length > 0 && (
                      <span>搭配: {word.collocations.length}</span>
                    )}
                    {word.sentences?.length > 0 && (
                      <span>例句: {word.sentences.length}</span>
                    )}
                  </div>
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

        {/* Batch Import Modal */}
        {showBatchImport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">批量导入单词</h2>

              {!batchResult ? (
                <form onSubmit={handleBatchImport} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      单词列表 (每行一个：英文 中文)
                    </label>
                    <textarea
                      value={batchInput}
                      onChange={(e) => setBatchInput(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 h-64 font-mono text-sm"
                      placeholder="apple 苹果&#10;banana 香蕉&#10;orange 橙子&#10;grape 葡萄"
                      disabled={batchLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      系统将自动为每个单词获取音标、搭配和例句
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBatchImport(false);
                        setBatchInput('');
                        setBatchResult(null);
                      }}
                      className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                      disabled={batchLoading}
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={batchLoading || !batchInput.trim()}
                    >
                      {batchLoading ? '导入中...' : '开始导入'}
                    </button>
                  </div>
                  {batchLoading && (
                    <p className="text-center text-sm text-gray-500">
                      正在处理，每个单词需要几秒钟，请耐心等待...
                    </p>
                  )}
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-3 bg-gray-100 rounded-xl">
                      <div className="text-2xl font-bold text-gray-800">{batchResult.total}</div>
                      <div className="text-xs text-gray-500">总数</div>
                    </div>
                    <div className="p-3 bg-green-100 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">{batchResult.success}</div>
                      <div className="text-xs text-green-600">成功</div>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      <div className="text-2xl font-bold text-yellow-600">{batchResult.skipped}</div>
                      <div className="text-xs text-yellow-600">跳过</div>
                    </div>
                    <div className="p-3 bg-red-100 rounded-xl">
                      <div className="text-2xl font-bold text-red-600">{batchResult.failed}</div>
                      <div className="text-xs text-red-600">失败</div>
                    </div>
                  </div>

                  {batchResult.details.success.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-green-600 mb-1">成功导入:</h3>
                      <div className="text-sm text-gray-600 bg-green-50 p-2 rounded-lg">
                        {batchResult.details.success.join(', ')}
                      </div>
                    </div>
                  )}

                  {batchResult.details.skipped.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-yellow-600 mb-1">已存在跳过:</h3>
                      <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded-lg">
                        {batchResult.details.skipped.join(', ')}
                      </div>
                    </div>
                  )}

                  {batchResult.details.failed.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-red-600 mb-1">导入失败:</h3>
                      <div className="text-sm text-gray-600 bg-red-50 p-2 rounded-lg space-y-1">
                        {batchResult.details.failed.map((item, i) => (
                          <div key={i}>
                            <span className="font-medium">{item.word}</span>: {item.reason}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setShowBatchImport(false);
                      setBatchInput('');
                      setBatchResult(null);
                    }}
                    className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                  >
                    完成
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
