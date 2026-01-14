'use client';

interface HeatmapData {
  date: string;
  count: number;
}

interface HeatmapProps {
  data: HeatmapData[];
}

function getColor(count: number): string {
  if (count === 0) return 'bg-gray-100';
  if (count <= 2) return 'bg-mint-200';
  if (count <= 5) return 'bg-mint-300';
  if (count <= 10) return 'bg-mint-400';
  return 'bg-mint-500';
}

function generateDateRange(): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}

export default function Heatmap({ data }: HeatmapProps) {
  const dates = generateDateRange();
  const dataMap = new Map(data.map(d => [d.date, d.count]));

  // Group dates by week
  const weeks: string[][] = [];
  let currentWeek: string[] = [];

  dates.forEach((date, index) => {
    const dayOfWeek = new Date(date).getDay();

    if (index === 0) {
      // Fill in empty days at start
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push('');
      }
    }

    currentWeek.push(date);

    if (dayOfWeek === 6 || index === dates.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Month labels */}
        <div className="flex text-xs text-gray-400 mb-1 ml-8">
          {months.map((month, i) => (
            <span key={i} className="flex-1">{month}</span>
          ))}
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col text-xs text-gray-400 mr-1 gap-[2px]">
            <span className="h-3"></span>
            <span className="h-3">一</span>
            <span className="h-3"></span>
            <span className="h-3">三</span>
            <span className="h-3"></span>
            <span className="h-3">五</span>
            <span className="h-3"></span>
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-[2px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {week.map((date, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${
                      date ? getColor(dataMap.get(date) || 0) : 'bg-transparent'
                    }`}
                    title={date ? `${date}: ${dataMap.get(date) || 0} 次复习` : ''}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1 mt-2 text-xs text-gray-400">
          <span>少</span>
          <div className="w-3 h-3 rounded-sm bg-gray-100" />
          <div className="w-3 h-3 rounded-sm bg-mint-200" />
          <div className="w-3 h-3 rounded-sm bg-mint-300" />
          <div className="w-3 h-3 rounded-sm bg-mint-400" />
          <div className="w-3 h-3 rounded-sm bg-mint-500" />
          <span>多</span>
        </div>
      </div>
    </div>
  );
}
