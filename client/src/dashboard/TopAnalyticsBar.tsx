import React, { useState, useEffect } from 'react';
import { Globe, Clock, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

interface AnalyticsData {
  live_visitors: number;
  median_response_time: string;
  median_resolution_time: string;
  percent_handled_by_ai: string;
  satisfaction_index: number;
  unique_visitors_7d: number;
}

interface TopAnalyticsBarProps {
  onOpenLiveOverlay?: () => void;
}

export const TopAnalyticsBar: React.FC<TopAnalyticsBarProps> = ({ onOpenLiveOverlay }) => {
  const [dateRange, setDateRange] = useState<'7d' | '14d' | '30d'>('7d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    live_visitors: 3,
    median_response_time: '18s',
    median_resolution_time: '2m 14s',
    percent_handled_by_ai: '78%',
    satisfaction_index: 94,
    unique_visitors_7d: 142,
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchAnalytics() {
      try {
        const res = await fetch('http://localhost:8000/api/v1/analytics/overview');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) {
            setAnalytics(data);
          }
        }
      } catch (err) {
        console.error('Failed to load live analytics:', err);
      }
    }
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="border-b border-neutral-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0d0e12] px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 select-none shrink-0 transition-colors">
      {/* Title & Action */}
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <span>Operations Cockpit</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
        </h2>

        <button
          type="button"
          onClick={onOpenLiveOverlay}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-[4px] bg-neutral-100 dark:bg-white/[0.03] hover:bg-neutral-200/70 dark:hover:bg-white/[0.08] border border-neutral-200 dark:border-white/[0.08] text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span>Live visitors overlay</span>
        </button>
      </div>

      {/* 5 KPI Metric Badges with tabular-nums from live API */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {/* Metric 1: Live Visitors */}
        <div className="px-2.5 py-1 bg-neutral-50 dark:bg-[#121319] border border-neutral-200 dark:border-white/[0.08] rounded-[4px] flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
          <div>
            <div className="text-[10px] uppercase font-mono text-neutral-500 dark:text-neutral-400">Live Visitors</div>
            <div className="text-xs font-semibold font-mono text-neutral-900 dark:text-white tabular-nums">
              {analytics.live_visitors} active
            </div>
          </div>
        </div>

        {/* Metric 2: Median Response Time */}
        <div className="px-2.5 py-1 bg-neutral-50 dark:bg-[#121319] border border-neutral-200 dark:border-white/[0.08] rounded-[4px] flex items-center gap-2 shrink-0">
          <Clock className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <div>
            <div className="text-[10px] uppercase font-mono text-neutral-500 dark:text-neutral-400">Median Response</div>
            <div className="text-xs font-semibold font-mono text-neutral-900 dark:text-white tabular-nums">
              {analytics.median_response_time}
            </div>
          </div>
        </div>

        {/* Metric 3: Time to Resolution */}
        <div className="px-2.5 py-1 bg-neutral-50 dark:bg-[#121319] border border-neutral-200 dark:border-white/[0.08] rounded-[4px] flex items-center gap-2 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <div>
            <div className="text-[10px] uppercase font-mono text-neutral-500 dark:text-neutral-400">Resolution Time</div>
            <div className="text-xs font-semibold font-mono text-neutral-900 dark:text-white tabular-nums">
              {analytics.median_resolution_time}
            </div>
          </div>
        </div>

        {/* Metric 4: % Handled by AI */}
        <div className="px-2.5 py-1 bg-neutral-50 dark:bg-[#121319] border border-neutral-200 dark:border-white/[0.08] rounded-[4px] flex items-center gap-2 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <div>
            <div className="text-[10px] uppercase font-mono text-neutral-500 dark:text-neutral-400">Handled by AI</div>
            <div className="text-xs font-semibold font-mono text-neutral-900 dark:text-white tabular-nums">
              {analytics.percent_handled_by_ai}
            </div>
          </div>
        </div>

        {/* Metric 5: CSAT Index */}
        <div className="px-2.5 py-1 bg-neutral-50 dark:bg-[#121319] border border-neutral-200 dark:border-white/[0.08] rounded-[4px] flex items-center gap-2 shrink-0">
          <TrendingUp className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <div>
            <div className="text-[10px] uppercase font-mono text-neutral-500 dark:text-neutral-400">Satisfaction</div>
            <div className="text-xs font-semibold font-mono text-neutral-900 dark:text-white tabular-nums">
              {analytics.satisfaction_index} / 100
            </div>
          </div>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center rounded-[4px] bg-neutral-100 dark:bg-[#121319] border border-neutral-200 dark:border-white/[0.08] p-0.5 shrink-0">
          {(['7d', '14d', '30d'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDateRange(r)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded-[3px] transition-colors cursor-pointer ${
                dateRange === r
                  ? 'bg-white dark:bg-white/10 text-neutral-950 dark:text-white font-semibold shadow-xs'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
