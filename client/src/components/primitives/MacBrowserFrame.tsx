import React from 'react';
import { Lock } from 'lucide-react';

interface MacBrowserFrameProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

export const MacBrowserFrame: React.FC<MacBrowserFrameProps> = ({
  url = 'https://supportflow.ai/shadcn/inbox',
  children,
  className = '',
  headerRight,
}) => {
  return (
    <div
      className={`w-full rounded-[6px] border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#121319] shadow-xl overflow-hidden transition-colors ${className}`}
    >
      {/* Window Header */}
      <div className="px-4 py-2.5 bg-neutral-100 dark:bg-[#161722] border-b border-neutral-200 dark:border-white/[0.08] flex items-center justify-between select-none">
        {/* macOS Traffic Lights */}
        <div className="flex items-center gap-1.5 w-16" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 inline-block" />
        </div>

        {/* Center URL Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#0d0e12] border border-neutral-200 dark:border-white/[0.08] rounded-[3px] text-[11px] font-mono text-neutral-500 dark:text-neutral-400 max-w-sm truncate shadow-xs">
          <Lock className="w-3 h-3 text-neutral-400 shrink-0" aria-hidden="true" />
          <span className="truncate">{url}</span>
        </div>

        {/* Right Header Slot */}
        <div className="w-16 flex justify-end text-xs text-neutral-400">
          {headerRight}
        </div>
      </div>

      {/* Frame Body */}
      <div className="w-full relative overflow-hidden bg-[#FCFCFB] dark:bg-[#0d0e12]">
        {children}
      </div>
    </div>
  );
};
