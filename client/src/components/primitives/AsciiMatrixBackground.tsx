import React from 'react';

interface AsciiMatrixBackgroundProps {
  className?: string;
  opacity?: number;
}

export const AsciiMatrixBackground: React.FC<AsciiMatrixBackgroundProps> = ({
  className = '',
  opacity = 0.25,
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      style={{ opacity }}
    >
      {/* Vercel-style clean geometric hairline grid */}
      <svg
        className="w-full h-full stroke-white/[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern
            id="sf-grid-pattern"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 32V0h32" fill="none" strokeWidth="1" />
            <circle cx="32" cy="0" r="1" fill="rgba(255,255,255,0.08)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sf-grid-pattern)" />
      </svg>

      {/* Gentle center radial mask so edges fade softly */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#0d0e12]/60 to-[#0d0e12]" />
    </div>
  );
};
