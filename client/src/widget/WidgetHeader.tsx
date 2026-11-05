import React from 'react';
import { Minus, ArrowLeft, ShieldCheck } from 'lucide-react';

interface WidgetHeaderProps {
  title?: string;
  subtitle?: string;
  canGoBack?: boolean;
  onBack?: () => void;
  onClose: () => void;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  title = 'CloudDesk Support',
  subtitle = 'AI Specialists + Human Team',
  canGoBack = false,
  onBack,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#131313] text-white rounded-t-[6px] border-b border-neutral-800 select-none">
      <div className="flex items-center gap-2.5">
        {canGoBack && onBack ? (
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
              CD
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#131313]" />
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
            {title}
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          </h2>
          <p className="text-[11px] text-neutral-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onClose}
          className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Minimize"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

