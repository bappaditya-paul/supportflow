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
} from 'lucide-react';
import type { Ticket, TimelineItem, DraftResponse, Customer, SwitchAgentState } from '../types';
import { SwitchRoomBadge } from './SwitchRoomBadge';
import { GhostTypingPreview } from './GhostTypingPreview';
import { ToolExecutionCard } from './ToolExecutionCard';
import { ApprovalDispatchGate } from './ApprovalDispatchGate';
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
  onApproveDraft,
  onRejectDraft,
  onSendOperatorMessage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Smooth scroll to bottom so the dispatch gate is immediately visible
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [timeline, draft, isCustomerTyping]);

  if (!ticket) {
    return (
      <div className="flex-1 h-full bg-[#0d0e12] flex flex-col items-center justify-center text-neutral-500 font-mono min-h-0">
        <Bot className="w-10 h-10 mb-2 opacity-30 text-[#DF3E03]" />
        <p className="text-xs">Select a conversation from the inbox to begin</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-[#0f1016] flex flex-col select-none overflow-hidden font-sans min-h-0">
      {/* Detail Pane Header */}
      <div className="px-5 py-3 border-b border-dashed border-neutral-800 bg-[#12131b] flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <FacehashAvatar seed={ticket.customer_name} size="sm" showStatus status="online" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-neutral-100 bg-neutral-800/80 px-1.5 py-0.2 rounded-[2px] border border-neutral-700 shrink-0">
                {ticket.ticket_id}
              </span>
              <span className="text-xs font-bold text-neutral-100 truncate max-w-md">
                {ticket.subject}
              </span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded-[2px] uppercase font-bold shrink-0 ${
                  ticket.status === 'resolved'
                    ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/40'
                    : ticket.status === 'awaiting_approval'
                    ? 'bg-amber-950/70 text-amber-300 border border-amber-800/40'
                    : 'bg-blue-950/70 text-blue-300 border border-blue-800/40'
                }`}
              >
                {ticket.status.replace('_', ' ')}
              </span>
            </div>

            <div className="text-[11px] text-neutral-400 font-mono flex items-center gap-2 truncate">
              <span>Customer: <strong className="text-neutral-200">{ticket.customer_name}</strong></span>
              <span>·</span>
              <span className="text-neutral-400 truncate">{ticket.customer_email}</span>
            </div>
          </div>
        </div>

        {/* Switch Room Telemetry */}
        <div className="shrink-0">
          <SwitchRoomBadge roomName="cloud-support" agents={agents} isProcessing={isProcessing} />
        </div>
      </div>

      {/* Ghost Typing Indicator */}
      <GhostTypingPreview
        customerName={ticket.customer_name}
        typingText={customerTypingText}
        isTyping={isCustomerTyping}
      />

      {/* Main Conversation Stream with generous bottom clearance so action box is never cut off */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-5 pb-20 space-y-4 min-h-0 [scrollbar-width:thin]">
        {/* Ticket Initial Problem Card */}
        <div className="p-4 bg-[#14151e] border border-neutral-800 rounded-[2px] text-xs shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px] mb-2 pb-2 border-b border-neutral-800/80">
            <div className="flex items-center gap-2">
              <FacehashAvatar seed={ticket.customer_name} size="xs" />
              <span className="font-semibold text-neutral-200">Initial Issue Report</span>
              <span className="text-[10px] text-neutral-500">via In-App Widget</span>
            </div>
            <span className="text-neutral-500">{ticket.created_at}</span>
          </div>
          <div className="text-neutral-200 leading-relaxed font-sans pl-1">
            {ticket.complaint}
          </div>
        </div>

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

          return (
            <div
              key={item.id}
              className={`flex flex-col text-xs ${
                isInternal
                  ? 'border-l-2 border-amber-500/80 bg-[#16151b] p-3.5 rounded-[2px] border border-amber-900/30'
                  : isCustomer
                  ? 'bg-[#14151f] p-3.5 rounded-[2px] border border-neutral-800'
                  : 'bg-[#121824] p-3.5 rounded-[2px] border border-blue-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  {isInternal && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                  {isCustomer && <FacehashAvatar seed={item.sender_name} size="xs" />}
                  {isAgent && <Bot className="w-3.5 h-3.5 text-blue-400" />}
                  {isOperator && <FacehashAvatar seed="alex" size="xs" />}

                  <span
                    className={`font-semibold ${
                      isInternal
                        ? 'text-amber-400'
                        : isAgent
                        ? 'text-blue-300'
                        : isOperator
                        ? 'text-emerald-300'
                        : 'text-neutral-200'
                    }`}
                  >
                    {item.sender_name}
                  </span>

                  {isInternal && (
                    <span className="text-[9px] font-mono text-amber-400/90 uppercase tracking-wide bg-amber-950/60 px-1.5 py-0.2 rounded-[2px] border border-amber-800/40">
                      Internal Note · Switch Room
                    </span>
                  )}
                </div>

                <span className="text-neutral-500 text-[10px]">{item.created_at}</span>
              </div>

              <div className="text-neutral-200 leading-relaxed font-sans whitespace-pre-wrap pl-1">
                {item.text}
              </div>
            </div>
          );
        })}

        {/* Approval Dispatch Gate: Guaranteed Full Visibility */}
        {draft && (
          <div id="approval-dispatch-gate" className="pt-2">
            <ApprovalDispatchGate
              draft={draft}
              onApprove={onApproveDraft}
              onReject={onRejectDraft}
              isDispatching={isProcessing}
            />
          </div>
        )}
      </div>

      {/* Operator Reply & Switch Prompt Composer */}
      <div className="shrink-0">
        <InternalNoteComposer
          onSendNote={onSendOperatorMessage}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};
