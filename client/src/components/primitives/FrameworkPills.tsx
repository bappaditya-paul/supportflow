import React from 'react';
import { motion } from 'motion/react';

interface FrameworkPillsProps {
  mode: 'inbox' | 'conversation';
  onModeChange: (mode: 'inbox' | 'conversation') => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  className?: string;
}

export const FrameworkPills: React.FC<FrameworkPillsProps> = ({
  mode,
  onModeChange,
  isPlaying = true,
  onTogglePlay,
  className = '',
}) => {
  return (
    <div
      className={`w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800 text-xs font-mono select-none ${className}`}
    >
      {/* Ecosystem Logos */}
      <div className="flex items-center gap-3 text-neutral-500">
        <span className="text-[11px] text-neutral-400">Works well with</span>
        <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
          {/* React */}
          <svg className="w-4 h-4 hover:text-[#00D8FF] transition-colors" viewBox="0 0 115.3 100" fill="currentColor">
            <ellipse cx="57.65" cy="50" rx="14.3" ry="50" transform="rotate(30 57.65 50)" fill="none" stroke="currentColor" strokeWidth="6" />
            <ellipse cx="57.65" cy="50" rx="14.3" ry="50" transform="rotate(90 57.65 50)" fill="none" stroke="currentColor" strokeWidth="6" />
            <ellipse cx="57.65" cy="50" rx="14.3" ry="50" transform="rotate(150 57.65 50)" fill="none" stroke="currentColor" strokeWidth="6" />
            <circle cx="57.65" cy="50" r="8" fill="currentColor" />
          </svg>

          {/* Next.js */}
          <svg className="w-3.5 h-3.5 hover:text-white transition-colors" viewBox="0 0 180 180" fill="currentColor">
            <mask height="180" id="mask-next" maskUnits="userSpaceOnUse" width="180" x="0" y="0">
              <circle cx="90" cy="90" fill="white" r="90" />
            </mask>
            <g mask="url(#mask-next)">
              <circle cx="90" cy="90" fill="currentColor" r="90" />
              <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" />
              <path d="M115 54H127V126H115V54Z" fill="white" />
            </g>
          </svg>

          {/* Mattermost / Team Chat */}
          <span className="font-bold text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
            Mattermost
          </span>

          {/* Switch AI */}
          <span className="font-bold text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            Switch AI
          </span>
        </div>
      </div>

      {/* Interactive Mode Slider Switcher */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center p-0.5 bg-neutral-100 dark:bg-[#161720] border border-neutral-300 dark:border-neutral-800 rounded-[3px] relative">
          <button
            onClick={() => onModeChange('inbox')}
            className={`relative z-10 px-3 py-1 text-xs font-medium rounded-[2px] transition-colors cursor-pointer ${
              mode === 'inbox'
                ? 'text-neutral-900 dark:text-white font-semibold'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {mode === 'inbox' && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 bg-white dark:bg-[#222432] rounded-[2px] shadow-xs -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            Support inbox
          </button>

          <button
            onClick={() => onModeChange('conversation')}
            className={`relative z-10 px-3 py-1 text-xs font-medium rounded-[2px] transition-colors cursor-pointer ${
              mode === 'conversation'
                ? 'text-neutral-900 dark:text-white font-semibold'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {mode === 'conversation' && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 bg-white dark:bg-[#222432] rounded-[2px] shadow-xs -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            Real-time conversation
          </button>
        </div>

        {onTogglePlay && (
          <button
            onClick={onTogglePlay}
            className="p-1.5 text-neutral-400 hover:text-white rounded-[2px] border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-[#161720] cursor-pointer"
            title={isPlaying ? 'Pause auto-cycle' : 'Play auto-cycle'}
          >
            <span className="font-mono text-xs font-bold px-1">
              {isPlaying ? '⏸' : '▶'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
