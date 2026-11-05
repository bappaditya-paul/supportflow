import React, { useState } from 'react';
import { Lock, Send, MessageSquare, AtSign, Sparkles } from 'lucide-react';

interface InternalNoteComposerProps {
  onSendNote: (text: string, isInternal: boolean) => void;
  onAskAgent?: (agent: string) => void;
  disabled?: boolean;
}

export const InternalNoteComposer: React.FC<InternalNoteComposerProps> = ({
  onSendNote,
  onAskAgent,
  disabled = false,
}) => {
  const [text, setText] = useState('');
  const [isInternal, setIsInternal] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendNote(text, isInternal);
    setText('');
  };

  return (
    <div className="border-t border-neutral-800 bg-[#16171e] p-3">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 bg-[#121318] p-0.5 rounded-[2px] border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => setIsInternal(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer ${
              isInternal
                ? 'bg-amber-500/20 text-amber-300 font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Lock className="w-3 h-3 text-amber-400" />
            Internal Note / Switch AI
          </button>
          <button
            type="button"
            onClick={() => setIsInternal(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer ${
              !isInternal
                ? 'bg-blue-600 text-white font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            Public Reply
          </button>
        </div>

        {/* Quick Agent Mention Badges */}
        {isInternal && onAskAgent && (
          <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400">
            <span className="text-neutral-500">Mention:</span>
            <button
              type="button"
              onClick={() => {
                setText((prev) => (prev ? `${prev} @triager ` : '@triager '));
              }}
              className="px-1.5 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-blue-300 rounded-[2px] cursor-pointer"
            >
              @triager
            </button>
            <button
              type="button"
              onClick={() => {
                setText((prev) => (prev ? `${prev} @investigator ` : '@investigator '));
              }}
              className="px-1.5 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-emerald-300 rounded-[2px] cursor-pointer"
            >
              @investigator
            </button>
            <button
              type="button"
              onClick={() => {
                setText((prev) => (prev ? `${prev} @responder ` : '@responder '));
              }}
              className="px-1.5 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-purple-300 rounded-[2px] cursor-pointer"
            >
              @responder
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isInternal
              ? 'Add an internal note or prompt Switch AI agents (@investigator, @responder)...'
              : 'Type a direct response to the customer...'
          }
          rows={3}
          disabled={disabled}
          className={`w-full p-2.5 text-xs rounded-[2px] border text-neutral-100 placeholder:text-neutral-500 focus:outline-none transition-colors resize-none ${
            isInternal
              ? 'bg-[#121319] border-amber-500/40 focus:border-amber-400'
              : 'bg-[#121319] border-neutral-700 focus:border-blue-500'
          }`}
        />

        <div className="flex items-center justify-between mt-2">
          <div className="text-[11px] text-neutral-500">
            {isInternal ? (
              <span className="flex items-center gap-1 text-amber-400/80">
                <Lock className="w-3 h-3" />
                Visible only to operators & Switch AI room
              </span>
            ) : (
              <span>Customer will receive this message directly</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!text.trim() || disabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[2px] transition-all cursor-pointer ${
              isInternal
                ? 'bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-50'
                : 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            {isInternal ? 'Post Note' : 'Send Reply'}
          </button>
        </div>
      </form>
    </div>
  );
};