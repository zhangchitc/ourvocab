'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sentence {
  en: string;
  cn: string;
}

interface Word {
  _id: string;
  word: string;
  phonetic: string;
  meanings: string[];
  collocations: string[];
  sentences: Sentence[];
}

interface FlipCardProps {
  word: Word;
  onFeedback: (feedback: 'green' | 'yellow' | 'red') => void;
}

function speak(text: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
}

export default function FlipCard({ word, onFeedback }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, x: 100 }}
        className="perspective-1000"
      >
        <motion.div
          className="relative w-full min-h-[300px] cursor-pointer"
          onClick={() => !isFlipped && setIsFlipped(true)}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front - Word Only */}
          <div
            className="absolute inset-0 bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{word.word}</h2>
            {word.phonetic && (
              <p className="text-gray-500 mb-4">{word.phonetic}</p>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak(word.word);
              }}
              className="p-3 rounded-full bg-mint-100 text-mint-600 hover:bg-mint-200 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
            <p className="text-gray-400 mt-6 text-sm">点击卡片看看记得不 👆</p>
          </div>

          {/* Back - Full Content */}
          <div
            className="absolute inset-0 bg-white rounded-3xl shadow-lg p-6 overflow-y-auto"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{word.word}</h2>
              {word.phonetic && (
                <p className="text-gray-500 text-sm">{word.phonetic}</p>
              )}
            </div>

            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-500 mb-1">释义</h3>
              <ul className="space-y-1">
                {word.meanings.map((meaning, index) => (
                  <li key={index} className="text-gray-800 text-sm">{meaning}</li>
                ))}
              </ul>
            </div>

            {word.collocations.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-medium text-gray-500 mb-1">搭配</h3>
                <div className="flex flex-wrap gap-1">
                  {word.collocations.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-mint-50 text-mint-700 rounded-full text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {word.sentences.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-500 mb-1">例句</h3>
                <ul className="space-y-2">
                  {word.sentences.slice(0, 2).map((s, i) => (
                    <li key={i} className="text-xs">
                      <p className="text-gray-800">{s.en}</p>
                      <p className="text-gray-500">{s.cn}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Feedback Buttons */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-4 mt-6"
          >
            <button
              onClick={() => onFeedback('red')}
              className="flex flex-col items-center px-6 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
            >
              <span className="text-2xl">🤯</span>
              <span className="text-sm font-medium">忘了</span>
            </button>
            <button
              onClick={() => onFeedback('yellow')}
              className="flex flex-col items-center px-6 py-3 bg-amber-100 text-amber-600 rounded-xl hover:bg-amber-200 transition-colors"
            >
              <span className="text-2xl">🤔</span>
              <span className="text-sm font-medium">有点印象</span>
            </button>
            <button
              onClick={() => onFeedback('green')}
              className="flex flex-col items-center px-6 py-3 bg-mint-100 text-mint-600 rounded-xl hover:bg-mint-200 transition-colors"
            >
              <span className="text-2xl">😎</span>
              <span className="text-sm font-medium">记得！</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
