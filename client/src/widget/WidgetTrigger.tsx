import React from 'react';
import { MessageSquare, X } from 'lucide-react';

interface WidgetTriggerProps {
  isOpen: boolean;
  unreadCount?: number;
  onClick: () => void;
}

export const WidgetTrigger: React.FC<WidgetTriggerProps> = ({
  isOpen,
  unreadCount = 0,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Close support widget' : 'Open support widget'}
      className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#DF3E03] text-white hover:bg-[#c93702] active:scale-95 shadow-xl transition-[transform,background-color] duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DF3E03]/40"
    >
      {isOpen ? (
        <X className="w-6 h-6 transition-transform duration-200 rotate-90" />
      ) : (
        <MessageSquare className="w-6 h-6" />
      )}

      {!isOpen && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-white bg-rose-500 rounded-full border-2 border-[#0d0e12] animate-pulse motion-reduce:animate-none tabular-nums">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

