import React from 'react';

export interface FacehashAvatarProps {
  name?: string;
  seed?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  status?: 'online' | 'waiting' | 'offline' | 'discrepancy' | null;
  showStatus?: boolean;
  className?: string;
}

// Deterministic simple hash function from string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// 6 Authentic Cossistant Pastel Palette Colors
const PASTEL_PALETTES = [
  { bg: '#F9E2AF', text: '#5D4037', border: '#E7C88C' }, // Warm Yellow (Nico Jeannen)
  { bg: '#E5A48F', text: '#3E2723', border: '#D08873' }, // Terracotta (Pieter Levels)
  { bg: '#B4D2F7', text: '#1A365D', border: '#92BAEC' }, // Crisp Sky Blue (Marc Louvion)
  { bg: '#D0EAA8', text: '#2E4C18', border: '#B4D785' }, // Soft Lime (Lucas Mouilleron)
  { bg: '#A6E3D0', text: '#004D40', border: '#86CCB6' }, // Mint Teal (Sarah Dayan)
  { bg: '#F7C6B4', text: '#4E342E', border: '#E0A893' }, // Peach Coral (Danny Postma)
];

const EYE_PAIRS = [
  { left: '-', right: '-' },
  { left: '+', right: '+' },
  { left: '•', right: '•' },
  { left: '^', right: '^' },
  { left: '×', right: '×' },
];

const MOUTHS = ['_', '.', 'o', 'v', '•'];

export const FacehashAvatar: React.FC<FacehashAvatarProps> = ({
  name,
  seed,
  size = 'md',
  status = null,
  showStatus = false,
  className = '',
}) => {
  const identifier = seed || name || 'default';
  const hash = hashString(identifier);
  const palette = PASTEL_PALETTES[hash % PASTEL_PALETTES.length];
  const eyes = EYE_PAIRS[Math.floor(hash / 7) % EYE_PAIRS.length];
  const mouth = MOUTHS[Math.floor(hash / 13) % MOUTHS.length];
  const initial = identifier.trim().charAt(0).toUpperCase();

  const isNumeric = typeof size === 'number';
  const numericPixel = isNumeric ? size : 36;

  const sizeDimensions = !isNumeric
    ? {
        xs: { box: 'w-5 h-5 text-[9px]', dot: 'w-1.5 h-1.5' },
        sm: { box: 'w-7 h-7 text-xs', dot: 'w-2 h-2' },
        md: { box: 'w-9 h-9 text-xs', dot: 'w-2.5 h-2.5' },
        lg: { box: 'w-11 h-11 text-sm', dot: 'w-3 h-3' },
        xl: { box: 'w-16 h-16 text-base', dot: 'w-3.5 h-3.5' },
      }[size]
    : { box: '', dot: 'w-2 h-2' };

  const effectiveStatus = status || (showStatus ? 'online' : null);

  return (
    <div
      className={`relative inline-flex shrink-0 select-none ${className}`}
      style={isNumeric ? { width: numericPixel, height: numericPixel } : undefined}
    >
      {/* Facehash Container */}
      <div
        className={`rounded-[3px] border flex flex-col items-center justify-between p-1 font-mono font-bold transition-transform hover:scale-105 w-full h-full ${
          !isNumeric ? sizeDimensions.box : ''
        }`}
        style={{
          backgroundColor: palette.bg,
          color: palette.text,
          borderColor: palette.border,
          fontSize: isNumeric ? `${Math.max(9, Math.round(numericPixel * 0.32))}px` : undefined,
        }}
        title={identifier}
      >
        {/* Eye Pair */}
        <div className="flex items-center justify-between w-full px-0.5 leading-none tracking-widest text-center">
          <span>{eyes.left}</span>
          <span>{eyes.right}</span>
        </div>

        {/* Mouth & Initial */}
        <div className="flex items-center justify-between w-full px-0.5 leading-none opacity-80" style={{ fontSize: isNumeric ? `${Math.max(7, Math.round(numericPixel * 0.22))}px` : '8px' }}>
          <span className="font-sans font-black">{initial}</span>
          <span>{mouth}</span>
        </div>
      </div>

      {/* Status Presence Dot */}
      {effectiveStatus && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white dark:border-[#121319] ${
            sizeDimensions.dot
          } ${
            effectiveStatus === 'online'
              ? 'bg-emerald-500'
              : effectiveStatus === 'waiting'
              ? 'bg-amber-500'
              : effectiveStatus === 'discrepancy'
              ? 'bg-rose-500 animate-pulse'
              : 'bg-neutral-400'
          }`}
        />
      )}
    </div>
  );
};
