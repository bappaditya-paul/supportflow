import React from 'react';
import logoUrl from '../../assets/logo.png';

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
      {/* Official SupportFlow Mascot Logo */}
      <img
        src={logoUrl}
        alt="SupportFlow Logo"
        width={size}
        height={size}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="shrink-0 object-contain drop-shadow-sm transition-transform"
        draggable={false}
      />

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
