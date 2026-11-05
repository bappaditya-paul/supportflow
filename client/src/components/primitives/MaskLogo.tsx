import React from 'react';

interface MaskLogoProps {
  size?: number;
  className?: string;
  withText?: boolean;
  textClassName?: string;
}

export const MaskLogo: React.FC<MaskLogoProps> = ({
  size = 24,
  className = '',
  withText = false,
  textClassName = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Signature Dual-Eye Mask Shape */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Mask Base Rounded Contour */}
        <rect width="32" height="32" rx="7" fill="currentColor" />
        {/* Left Eye Cutout Arch */}
        <path
          d="M8.5 15C8.5 12.5 10.5 10.5 13 10.5C15.5 10.5 17.5 12.5 17.5 15"
          stroke="#FCFCFC"
          strokeWidth="2.75"
          strokeLinecap="round"
        />
        {/* Right Eye Cutout Arch */}
        <path
          d="M14.5 15C14.5 12.5 16.5 10.5 19 10.5C21.5 10.5 23.5 12.5 23.5 15"
          stroke="#FCFCFC"
          strokeWidth="2.75"
          strokeLinecap="round"
        />
      </svg>

      {withText && (
        <span
          className={`font-bold tracking-tight lowercase text-neutral-900 dark:text-neutral-100 font-sans ${textClassName}`}
          style={{ letterSpacing: '-0.03em' }}
        >
          supportflow
        </span>
      )}
    </div>
  );
};
