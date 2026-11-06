import React from 'react';

interface BorderBeamButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  beamColor?: string;
  disabled?: boolean;
}

export const BorderBeamButton: React.FC<BorderBeamButtonProps> = ({
  onClick,
  children,
  className = '',
  beamColor = '#DF3E03',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex overflow-hidden rounded-[2px] p-[1px] transition-transform active:scale-95 cursor-pointer shadow-md group ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      } ${className}`}
    >
      {/* 360-degree rotating gradient laser beam */}
      {!disabled && (
        <span
          className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite]"
          style={{
            background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, ${beamColor} 50%, #FFAA77 75%, transparent 100%)`,
          }}
        />
      )}

      {/* Button Interior */}
      <span className="relative flex items-center gap-2 px-3.5 py-1.5 bg-neutral-950 dark:bg-[#12131a] hover:bg-[#181924] text-white text-xs font-mono font-medium rounded-[2px] transition-colors">
        {children}
      </span>
    </button>
  );
};

