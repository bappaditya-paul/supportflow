import React from 'react';

interface GlassKeycapProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassKeycap: React.FC<GlassKeycapProps> = ({ children, className = '' }) => {
  return (
    <kbd
      className={`inline-flex items-center justify-center px-1.5 py-0.5 min-w-[20px] text-[10px] font-mono font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800/90 border border-neutral-300 dark:border-neutral-700 border-b-2 border-b-neutral-400 dark:border-b-neutral-950 rounded-[2px] shadow-xs active:translate-y-0.5 active:border-b transition-all select-none ${className}`}
    >
      {children}
    </kbd>
  );
};

