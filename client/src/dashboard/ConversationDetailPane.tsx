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
} from 'lucide-react';
import type { Ticket, TimelineItem, DraftResponse, Customer, SwitchAgentState } from '../types';
import { SwitchRoomBadge } from './SwitchRoomBadge';
import { GhostTypingPreview } from './GhostTypingPreview';
import { ToolExecutionCard } from './ToolExecutionCard';
import { ApprovalDispatchGate } from './ApprovalDispatchGate';
import { InternalNoteComposer } from './InternalNoteComposer';

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [timeline, draft, isCustomerTyping]);

  if (!ticket) {
    return (
      <div className="flex-1 h-full bg-[#15161d] flex flex-col items-center justify-center text-neutral-500">
        <Bot className="w-10 h-10 mb-2 opacity-30 text-blue-400" />
        <p className="text-sm">Select a conversation from the inbox</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-[#15161d] flex flex-col select-none overflow-hidden">
      {/* Detail Pane Header */}
      <div className="px-5 py-3 border-b border-neutral-800 bg-[#161720] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-bold text-neutral-200">
              {ticket.ticket_id}
            </span>
            <span className="text-neutral-500">·</span>
            <span className="text-sm font-semibold text-neutral-100">
              {ticket.subject}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-[2px] uppercase ${
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

          <div className="text-xs text-neutral-400 font-mono">
            Customer: <span className="text-neutral-200">{ticket.customer_name}</span> ({ticket.customer_email})
          </div>
        </div>

        {/* Switch Room Telemetry */}
        <SwitchRoomBadge roomName="cloud-support" agents={agents} isProcessing={isProcessing} />
      </div>

      {/* Ghost Typing Indicator */}
      <GhostTypingPreview
        customerName={ticket.customer_name}
        typingText={customerTypingText}
        isTyping={isCustomerTyping}
      />

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Ticket Initial Problem Card */}
        <div className="p-3.5 bg-[#191a24] border border-neutral-800 rounded-[2px] text-xs">
          <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px] mb-2">
            <span className="font-semibold text-neutral-300">Initial Issue Report</span>
            <span>{ticket.created_at}</span>
          </div>
          <div className="text-neutral-200 leading-relaxed font-sans">
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
                  ? 'border-l-2 border-amber-500/60 bg-[#191816] p-3 rounded-[2px]'
                  : isCustomer
                  ? 'bg-[#181a24] p-3 rounded-[2px] border border-neutral-800'
                  : 'bg-[#151c27] p-3 rounded-[2px] border border-blue-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  {isInternal && <Lock className="w-3 h-3 text-amber-400" />}
                  {isCustomer && <User className="w-3 h-3 text-neutral-400" />}
                  {isAgent && <Bot className="w-3 h-3 text-blue-400" />}
                  {isOperator && <Shield className="w-3 h-3 text-emerald-400" />}

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
                    <span className="text-[10px] text-amber-500/80 uppercase tracking-wide">
                      (Internal Note · Switch Room)
                    </span>
                  )}
                </div>

                <span className="text-neutral-500 text-[10px]">{item.created_at}</span>
              </div>

              <div className="text-neutral-200 leading-relaxed font-sans whitespace-pre-wrap">
                {item.text}
              </div>
            </div>
          );
        })}

        {/* Approval Dispatch Gate */}
        {draft && (
          <ApprovalDispatchGate
            draft={draft}
            onApprove={onApproveDraft}
            onReject={onRejectDraft}
            isDispatching={isProcessing}
          />
        )}

        <div ref={scrollRef} />
      </div>

      {/* Operator Reply & Switch Prompt Composer */}
      <InternalNoteComposer
        onSendNote={onSendOperatorMessage}
        disabled={isProcessing}
      />
    </div>
  );
};