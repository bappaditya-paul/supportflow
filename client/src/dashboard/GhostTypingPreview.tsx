import React from 'react';
import { Eye, Radio } from 'lucide-react';

interface GhostTypingPreviewProps {
  customerName: string;
  typingText: string;
  isTyping: boolean;
}

export const GhostTypingPreview: React.FC<GhostTypingPreviewProps> = ({
  customerName,
  typingText,
  isTyping,
}) => {
  if (!isTyping || !typingText) return null;

  return (
    <div className="mx-4 my-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-[4px] transition-opacity duration-150">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-amber-500 font-mono text-[11px] font-semibold">
          <Radio className="w-3.5 h-3.5 animate-pulse motion-reduce:animate-none" />
          <span>LIVE GHOST TYPING</span>
        </div>
        <span className="text-[10px] text-neutral-400 font-mono">
          Customer hasn't submitted yet
        </span>
      </div>
      <div className="flex items-start gap-2 text-xs">
        <span className="font-semibold text-neutral-300 shrink-0">{customerName}:</span>
        <span className="text-neutral-200 font-mono italic break-all">
          {typingText}
          <span className="inline-block w-1.5 h-3 ml-0.5 bg-amber-400 animate-pulse motion-reduce:animate-none align-middle" />
        </span>
      </div>
    </div>
  );
};
