import React, { useRef, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  User,
  Shield,
  Bot,
  Terminal,
  Lock,
  Sparkles,
  ExternalLink,
  Copy,
  ArrowLeft,
  Check,
} from 'lucide-react';
import type { Ticket, TimelineItem, DraftResponse, Customer, SwitchAgentState } from '../types';
import { SwitchRoomBadge } from './SwitchRoomBadge';
import { GhostTypingPreview } from './GhostTypingPreview';
import { ToolExecutionCard } from './ToolExecutionCard';
import { InternalNoteComposer } from './InternalNoteComposer';
import { FacehashAvatar } from '../components/primitives';

interface ConversationDetailPaneProps {
  ticket: Ticket | null;
  customer?: Customer | null;
  timeline: TimelineItem[];
  draft?: DraftResponse | null;
  agents?: SwitchAgentState[];
  isProcessing?: boolean;
  customerTypingText?: string;
  isCustomerTyping?: boolean;
  showProfileDrawer?: boolean;
  onToggleProfileDrawer?: () => void;
  onBackToInbox?: () => void;
  onApproveDraft: (text: string) => void;
  onRejectDraft: () => void;
  onSendOperatorMessage: (text: string, isInternal: boolean) => void;
}

export const ConversationDetailPane: React.FC<ConversationDetailPaneProps> = ({
  ticket,
  customer,
  timeline,
  draft,
  agents,
  isProcessing = false,
  customerTypingText = '',
  isCustomerTyping = false,
  showProfileDrawer,
  onToggleProfileDrawer,
  onBackToInbox,
  onApproveDraft,
  onRejectDraft,
  onSendOperatorMessage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [timeline, draft, isCustomerTyping]);

  if (!ticket) {
    return (
      <div className="flex-1 h-full bg-[#0d0e12] flex flex-col items-center justify-center text-neutral-500 font-mono min-h-0">
        <Bot className="w-10 h-10 mb-2 opacity-30 text-white" />
        <p className="text-xs">Select a conversation from the inbox to begin</p>
      </div>
    );
  }

  const customerName = ticket.customer_name || 'Customer';
  const customerEmail = ticket.customer_email || '';
  const complaintText = ticket.complaint || ticket.message || ticket.subject || '';

  return (
    <div className="flex-1 h-full bg-[#0d0e12] flex flex-col select-none overflow-hidden font-sans min-h-0">
      {/* 1. Detail Pane Header: Minimal, High-Contrast & Elegant */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-white/[0.08] bg-[#0b0c10] flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {onBackToInbox && (
            <button
              type="button"
              onClick={onBackToInbox}
              aria-label="Back to ticket list"
              className="md:hidden p-1.5 -ml-1 text-neutral-400 hover:text-white rounded-[3px] bg-white/[0.04] border border-white/[0.08] cursor-pointer shrink-0 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <FacehashAvatar seed={customerName} size="sm" showStatus status="online" />

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-[11px] font-medium text-neutral-300 bg-white/[0.06] px-1.5 py-0.2 rounded-[3px] border border-white/[0.08] shrink-0">
                {ticket.ticket_id}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white truncate">
                {ticket.subject}
              </span>
            </div>

            <div className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5 truncate">
              <span className="text-neutral-300 font-sans">{customerName}</span>
              {customerEmail && (
                <>
                  <span>·</span>
                  <span className="text-neutral-500 truncate">{customerEmail}</span>
                </>
              )}
              <span>·</span>
              {ticket.status === 'resolved' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                  <Check className="w-3 h-3" />
                  Resolved
                </span>
              ) : ticket.status === 'awaiting_approval' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse motion-reduce:animate-none" />
                  Needs Review
                </span>
              ) : (
                <span className="text-neutral-500 text-[10px]">In Progress</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Header Actions: Compact Switch Status + Customer Profile Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>#cloud-support</span>
          </div>

          {onToggleProfileDrawer && (
            <button
              type="button"
              onClick={onToggleProfileDrawer}
              aria-label={showProfileDrawer ? 'Hide customer metadata' : 'Show customer metadata'}
              title="Customer Metadata"
              className={`p-1.5 rounded-[3px] border transition-colors cursor-pointer ${
                showProfileDrawer
                  ? 'bg-white/10 text-white border-white/20'
                  : 'text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08]'
              }`}
            >
              <User className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Ghost Typing Indicator */}
      <GhostTypingPreview
        customerName={customerName}
        typingText={customerTypingText}
        isTyping={isCustomerTyping}
      />

      {/* 3. Main Conversation Timeline Stream */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 min-h-0 [scrollbar-width:thin]">
        {/* Timeline Items */}
        {timeline.map((item) => {
          if (item.tool_call) {
            return (
              <ToolExecutionCard
                key={item.id}
                toolName={item.tool_call.name}
                agentName={item.sender_name}
                params={item.tool_call.params}
                result={item.tool_call.result}
                status={item.tool_call.status}
                timestamp={item.created_at}
              />
            );
          }

          const isInternal = item.visibility === 'private';
          const isCustomer = item.sender_type === 'customer';
          const isOperator = item.sender_type === 'operator';
          const isAgent = item.sender_type === 'agent';

          // A. Internal Note (Private team memo or agent report)
          if (isInternal) {
            return (
              <div
                key={item.id}
                className="my-2 p-3.5 bg-white/[0.02] border border-dashed border-white/[0.12] rounded-[4px] text-xs font-sans"
              >
                <div className="flex items-center justify-between mb-1.5 font-mono text-[11px] text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-semibold text-neutral-200">{item.sender_name}</span>
                    <span className="text-neutral-500">· Internal Note</span>
                  </div>
                  <span className="text-neutral-500 text-[10px] tabular-nums">{item.created_at}</span>
                </div>
                <div className="text-neutral-300 leading-relaxed pl-1 whitespace-pre-wrap">
                  {item.text}
                </div>
              </div>
            );
          }

          // B. Customer Message
          if (isCustomer) {
            return (
              <div key={item.id} className="flex justify-start my-2">
                <div className="max-w-[85%] bg-[#111218] border border-white/[0.08] rounded-[6px] p-4 text-xs">
                  <div className="flex items-center justify-between gap-3 mb-2 font-mono text-[11px] text-neutral-400">
                    <div className="flex items-center gap-2">
                      <FacehashAvatar seed={item.sender_name} size="xs" />
                      <span className="font-semibold text-white">{item.sender_name}</span>
                    </div>
                    <span className="text-neutral-500 text-[10px] tabular-nums">{item.created_at}</span>
                  </div>
                  <div className="text-neutral-100 text-xs sm:text-[13px] leading-relaxed font-sans whitespace-pre-wrap">
                    {item.text}
                  </div>
                </div>
              </div>
            );
          }

          // C. Operator or Verified Agent Public Reply
          return (
            <div key={item.id} className="flex justify-end my-2">
              <div className="max-w-[85%] bg-white/[0.06] border border-white/10 rounded-[6px] p-4 text-xs shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-2 font-mono text-[11px] text-neutral-400">
                  <div className="flex items-center gap-2">
                    <FacehashAvatar seed="alex" size="xs" />
                    <span className="font-semibold text-white">{item.sender_name}</span>
                    <span className="text-[9px] font-mono bg-white/10 text-neutral-300 px-1.5 py-0.2 rounded-[2px]">
                      Verified
                    </span>
                  </div>
                  <span className="text-neutral-500 text-[10px] tabular-nums">{item.created_at}</span>
                </div>
                <div className="text-neutral-100 text-xs sm:text-[13px] leading-relaxed font-sans whitespace-pre-wrap">
                  {item.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Operator Reply & Switch AI Draft Composer (Unified at Bottom) */}
      <div className="shrink-0">
        <InternalNoteComposer
          onSendNote={onSendOperatorMessage}
          disabled={isProcessing}
          draft={draft}
          onApproveDraft={onApproveDraft}
          onRejectDraft={onRejectDraft}
          customerName={customerName}
          ticketId={ticket.ticket_id}
        />
      </div>
    </div>
  );
};
