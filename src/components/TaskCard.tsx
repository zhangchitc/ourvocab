'use client';

import Link from 'next/link';

interface TaskCardProps {
  title: string;
  count: number;
  total?: number;
  href: string;
  color: 'mint' | 'amber';
  icon: string;
  hideCount?: boolean;
}

export default function TaskCard({ title, count, total, href, color, icon, hideCount }: TaskCardProps) {
  const bgColor = color === 'mint' ? 'bg-mint-100' : 'bg-amber-100';
  const textColor = color === 'mint' ? 'text-mint-600' : 'text-amber-600';
  const borderColor = color === 'mint' ? 'border-mint-200' : 'border-amber-200';

  return (
    <Link
      href={href}
      className={`block p-6 rounded-2xl ${bgColor} border ${borderColor} transition-transform active:scale-95`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-medium ${textColor}`}>{title}</h3>
          {hideCount ? (
            <p className="text-lg text-gray-600 mt-2">巩固已学单词 →</p>
          ) : (
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {count}
              {total !== undefined && (
                <span className="text-lg text-gray-500">/{total}</span>
              )}
            </p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center`}>
          <svg
            className={`w-8 h-8 ${textColor}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={icon}
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
