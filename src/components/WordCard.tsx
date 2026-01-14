'use client';

import { motion } from 'framer-motion';

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

interface WordCardProps {
  word: Word;
  onComplete: () => void;
}

function speak(text: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
}

export default function WordCard({ word, onComplete }: WordCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="bg-white rounded-3xl shadow-lg p-6 max-w-md mx-auto"
    >
      {/* Word and Phonetic */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-3xl font-bold text-gray-800">{word.word}</h2>
          <button
            onClick={() => speak(word.word)}
            className="p-2 rounded-full bg-mint-100 text-mint-600 hover:bg-mint-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
        </div>
        {word.phonetic && (
          <p className="text-gray-500 mt-1">{word.phonetic}</p>
        )}
      </div>

      {/* Meanings */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">释义</h3>
        <ul className="space-y-1">
          {word.meanings.map((meaning, index) => (
            <li key={index} className="text-gray-800">{meaning}</li>
          ))}
        </ul>
      </div>

      {/* Collocations */}
      {word.collocations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">固定搭配</h3>
          <div className="flex flex-wrap gap-2">
            {word.collocations.map((collocation, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-mint-50 text-mint-700 rounded-full text-sm"
              >
                {collocation}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sentences */}
      {word.sentences.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">例句</h3>
          <ul className="space-y-3">
            {word.sentences.map((sentence, index) => (
              <li key={index} className="text-sm">
                <p className="text-gray-800">{sentence.en}</p>
                <p className="text-gray-500">{sentence.cn}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Complete Button */}
      <button
        onClick={onComplete}
        className="w-full py-3 bg-mint-500 text-white rounded-xl font-medium hover:bg-mint-600 transition-colors"
      >
        记住啦，下一个 ✨
      </button>
    </motion.div>
  );
}
