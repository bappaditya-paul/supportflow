import React, { useState, useEffect, useRef } from 'react';
import { Lock, Send, MessageSquare, Sparkles, Check, X, ShieldAlert } from 'lucide-react';
import type { DraftResponse } from '../types';

interface InternalNoteComposerProps {
  onSendNote: (text: string, isInternal: boolean) => void;
  onAskAgent?: (agent: string) => void;
  disabled?: boolean;
  draft?: DraftResponse | null;
  onApproveDraft?: (finalText: string) => void;
  onRejectDraft?: () => void;
  customerName?: string;
  ticketId?: string;
}

export const InternalNoteComposer: React.FC<InternalNoteComposerProps> = ({
  onSendNote,
  onAskAgent,
  disabled = false,
  draft,
  onApproveDraft,
  onRejectDraft,
  customerName = 'Customer',
  ticketId,
}) => {
  const [text, setText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasPendingDraft = draft && draft.status === 'PENDING_APPROVAL';

  // When a draft is ready, pre-populate the textarea so the operator can review or edit; otherwise reset when ticket changes
  useEffect(() => {
    if (hasPendingDraft && draft?.proposed_response) {
      setText(draft.proposed_response);
      setIsInternal(false);
    } else {
      setText('');
      setIsInternal(false);
    }
  }, [ticketId, hasPendingDraft, draft?.proposed_response]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || disabled) return;

    if (hasPendingDraft && onApproveDraft) {
      onApproveDraft(text);
      setText('');
    } else {
      onSendNote(text, isInternal);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleReject = () => {
    if (onRejectDraft) {
      onRejectDraft();
      setText('');
    }
  };

  return (
    <div className="border-t border-white/[0.08] bg-[#0b0c10] p-3 sm:p-4 transition-colors select-none">
      {/* 1. Pending AI Draft Proposal Header */}
      {hasPendingDraft && (
        <div className="mb-2.5 p-2.5 bg-white/[0.03] border border-white/[0.08] rounded-[4px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-[3px] bg-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-3 h-3 text-neutral-200" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate flex items-center gap-2">
                <span>Switch AI Draft Proposal</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-white/[0.06] text-neutral-300 border border-white/[0.08]">
                  Policy KB-001
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 font-mono truncate">
                Verified payment TXN-9001 ($9.99). Edit below and click Approve &amp; Dispatch.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReject}
              disabled={disabled}
              className="px-2.5 py-1 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Reject Draft
            </button>
          </div>
        </div>
      )}

      {/* 2. Mode Switcher (When no pending draft) */}
      {!hasPendingDraft && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 bg-white/[0.03] p-0.5 rounded-[4px] border border-white/[0.08] text-xs font-sans">
            <button
              type="button"
              onClick={() => setIsInternal(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] transition-colors cursor-pointer ${
                !isInternal
                  ? 'bg-white/10 text-white font-medium shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              Public Reply
            </button>
            <button
              type="button"
              onClick={() => setIsInternal(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] transition-colors cursor-pointer ${
                isInternal
                  ? 'bg-white/10 text-white font-medium shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Lock className="w-3 h-3" />
              Internal Note
            </button>
          </div>

          {/* Quick Agent Mention Badges in monochrome style */}
          {isInternal && onAskAgent && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
              <span className="text-neutral-500">Mention:</span>
              {['@triager', '@investigator', '@responder'].map((agent) => (
                <button
                  key={agent}
                  type="button"
                  onClick={() => setText((prev) => (prev ? `${prev} ${agent} ` : `${agent} `))}
                  className="px-1.5 py-0.5 bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 rounded-[3px] cursor-pointer transition-colors"
                >
                  {agent}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Textarea Form */}
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            hasPendingDraft
              ? 'Review and edit proposed customer response…'
              : isInternal
              ? 'Add an internal note or mention Switch AI agents (@investigator, @responder)…'
              : `Reply to ${customerName} (Press ⌘Enter to send)…`
          }
          rows={hasPendingDraft ? 4 : 3}
          disabled={disabled}
          aria-label={isInternal ? 'Internal note or prompt' : 'Direct customer reply'}
          className="w-full p-3 text-xs bg-[#111218] border border-white/[0.08] focus:border-white/30 focus-visible:ring-1 focus-visible:ring-white/20 rounded-[4px] text-neutral-100 placeholder:text-neutral-500 focus:outline-none transition-colors resize-none leading-relaxed font-sans"
        />

        <div className="flex items-center justify-between mt-2 font-mono text-[11px]">
          <div className="text-neutral-500 flex items-center gap-1.5">
            {hasPendingDraft ? (
              <span className="text-neutral-400">Editing Switch AI proposal</span>
            ) : isInternal ? (
              <span className="flex items-center gap-1 text-neutral-400">
                <Lock className="w-3 h-3" />
                Team & Switch Swarm only
              </span>
            ) : (
              <span className="text-neutral-500">Delivered directly to customer widget</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[10px] text-neutral-500 tabular-nums">
              ⌘↵ to send
            </span>
            <button
              type="submit"
              disabled={!text.trim() || disabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[3px] transition-all active:scale-[0.98] cursor-pointer ${
                hasPendingDraft
                  ? 'bg-white hover:bg-neutral-200 text-black font-semibold'
                  : !isInternal
                  ? 'bg-[#DF3E03] hover:bg-[#c93702] text-white disabled:opacity-40'
                  : 'bg-white/10 hover:bg-white/20 text-white disabled:opacity-40'
              }`}
            >
              {hasPendingDraft ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              <span>{hasPendingDraft ? 'Approve & Dispatch' : isInternal ? 'Post Note' : 'Send'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
