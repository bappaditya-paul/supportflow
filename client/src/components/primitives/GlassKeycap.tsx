import React from 'react';

interface GlassKeycapProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassKeycap: React.FC<GlassKeycapProps> = ({ children, className = '' }) => {
  return (
    <kbd
      className={`inline-flex items-center justify-center px-1.5 py-0.5 min-w-[20px] text-[10px] font-mono font-medium text-neutral-400 bg-neutral-900 border border-white/10 rounded-[3px] shadow-xs select-none ${className}`}
    >
      {children}
    </kbd>
  );
};
