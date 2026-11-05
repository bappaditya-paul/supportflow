import React from 'react';

interface HeatmapCalendarProps {
  commits?: number;
  prs?: number;
  totalCommits?: number;
  totalPRs?: number;
  className?: string;
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({
  commits,
  prs,
  totalCommits,
  totalPRs,
  className = '',
}) => {
  const commitCount = totalCommits ?? commits ?? 1157;
  const prCount = totalPRs ?? prs ?? 159;
  // Generate 52 weeks x 7 days grid with realistic clustering
  const weeks = 52;
  const daysPerWeek = 7;

  const getIntensity = (w: number, d: number) => {
    // Generate cluster peaks matching Cossistant screenshot
    const peak =
      Math.sin(w / 4) * 2 +
      Math.cos(w / 7) * 2 +
      Math.sin((w + d) / 3) * 1.5;
    if (w > 48 || (w > 20 && w < 28) || (w > 2 && w < 12)) {
      return Math.min(4, Math.max(1, Math.floor(Math.abs(peak) + 1.5)));
    }
    if (Math.random() > 0.6) return 1;
    return 0;
  };

  const levelColors = [
    'bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800',
    'bg-[#FFD7C7] dark:bg-[#7A290E]/60 border border-[#FFAE8F]/40',
    'bg-[#FFAE8F] dark:bg-[#B83E12]/80 border border-[#FF7243]/60',
    'bg-[#FF7243] dark:bg-[#DF3E03] border border-[#DF3E03]',
    'bg-[#DF3E03] dark:bg-[#FF5A1F] border border-[#FF7243]',
  ];

  return (
    <div className={`w-full select-none ${className}`}>
      {/* Subtitle Summary */}
      <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-4 font-mono">
        We're shipping a lot,{' '}
        <span className="text-[#DF3E03] dark:text-[#FF7243] font-bold">{commitCount.toLocaleString()} commits</span> and{' '}
        <span className="text-[#DF3E03] dark:text-[#FF7243] font-bold">{prCount} PRs</span> in the past year.
      </div>

      {/* Grid Container */}
      <div className="p-4 rounded-[4px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121319] overflow-x-auto">
        <div className="flex gap-1 min-w-[720px]">
          {Array.from({ length: weeks }).map((_, w) => (
            <div key={w} className="flex flex-col gap-1">
              {Array.from({ length: daysPerWeek }).map((_, d) => {
                const intensity = getIntensity(w, d);
                return (
                  <div
                    key={d}
                    className={`w-2.5 h-2.5 rounded-[1px] transition-all hover:scale-125 hover:z-10 cursor-pointer ${levelColors[intensity]}`}
                    title={`Week ${w + 1}, Day ${d + 1}: ${intensity * 3} events`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] font-mono text-neutral-400">
          <span>Less</span>
          {levelColors.map((color, i) => (
            <span key={i} className={`w-2.5 h-2.5 rounded-[1px] ${color}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
};