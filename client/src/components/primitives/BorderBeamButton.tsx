import React from 'react';

interface BorderBeamButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  beamColor?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export const BorderBeamButton: React.FC<BorderBeamButtonProps> = ({
  onClick,
  children,
  className = '',
  beamColor = '#DF3E03',
  disabled = false,
  type = 'button',
  ariaLabel,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-[4px] p-[1px] transition-transform active:scale-[0.98] cursor-pointer shadow-xs group focus-visible:ring-1 focus-visible:ring-[#DF3E03] ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      } ${className}`}
    >
      {/* Crisp subtle perimeter glow with reduced-motion safety */}
      {!disabled && (
        <span
          aria-hidden="true"
          className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] motion-reduce:hidden opacity-75 group-hover:opacity-100 transition-opacity"
          style={{
            background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, ${beamColor} 45%, #FFAA77 65%, transparent 100%)`,
          }}
        />
      )}

      {/* Button Interior */}
      <span className="relative flex items-center gap-2 px-3.5 py-1.5 bg-[#12131a] hover:bg-[#181924] text-white text-xs font-mono font-medium rounded-[3px] border border-white/10 group-hover:border-white/20 transition-colors">
        {children}
      </span>
    </button>
  );
};
