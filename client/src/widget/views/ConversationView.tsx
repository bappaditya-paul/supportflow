import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { Ticket, TimelineItem, DraftResponse } from '../../types';

interface ConversationViewProps {
  ticket: Ticket;
  timeline: TimelineItem[];
  draft?: DraftResponse | null;
  onSendMessage: (text: string) => void;
  onTyping: (text: string, isTyping: boolean) => void;
  isAgentTyping?: boolean;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  ticket,
  timeline,
  draft,
  onSendMessage,
  onTyping,
  isAgentTyping = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [rated, setRated] = useState<'up' | 'down' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [timeline, isAgentTyping, draft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    onTyping(val, val.length > 0);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
    onTyping('', false);
  };

  return (
    <div className="flex flex-col h-full bg-[#FCFCFB] dark:bg-[#15161b] text-[#131313] dark:text-neutral-100">
      {/* Ticket Context Header */}
      <div className="px-3.5 py-2 bg-neutral-100 dark:bg-[#1c1e26] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
            {ticket.ticket_id}
          </span>
          <span className="text-neutral-400">·</span>
          <span className="truncate max-w-[170px] text-neutral-500 dark:text-neutral-400">
            {ticket.subject}
          </span>
        </div>
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[2px] ${
            ticket.status === 'resolved' || draft?.status === 'APPROVED'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}
        >
          {draft?.status === 'APPROVED' ? 'RESOLVED' : ticket.status.toUpperCase()}
        </span>
      </div>

      {/* Message Timeline */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
        {/* Initial Customer Complaint */}
        <div className="flex flex-col items-end">
          <div className="max-w-[85%] bg-[#121319] text-white p-3 rounded-[4px] border border-white/[0.08] shadow-xs">
            <p className="whitespace-pre-wrap leading-relaxed">{ticket.complaint}</p>
          </div>
          <span className="text-[10px] text-neutral-400 mt-1 mr-1">
            {ticket.customer_name} · Initial ticket
          </span>
        </div>

        {/* Dynamic Timeline Items */}
        {timeline
          .filter((item) => item.visibility === 'public')
          .map((item) => {
            const isCustomer = item.sender_type === 'customer';
            return (
              <div
                key={item.id}
                className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-[4px] shadow-xs leading-relaxed ${
                    isCustomer
                      ? 'bg-[#121319] text-white border border-white/[0.08]'
                      : 'bg-[#161722] text-neutral-100 border border-white/[0.08]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{item.text}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-1 ml-1">
                  {!isCustomer && <Bot className="w-3 h-3 text-[#DF3E03]" />}
                  <span>{item.sender_name}</span>
                </div>
              </div>
            );
          })}

        {/* Verified Resolution Draft Card (When ready/approved) */}
        {draft && (
          <div className="p-3 bg-[#121319] border border-[#DF3E03]/50 rounded-[4px] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#DF3E03]">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Resolution
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[3px] ${
                  draft.status === 'APPROVED'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {draft.status === 'APPROVED' ? 'HUMAN APPROVED' : 'PENDING REVIEW'}
              </span>
            </div>

            <p className="text-xs text-neutral-200 whitespace-pre-wrap bg-[#090a0f] p-2.5 rounded-[4px] border border-white/[0.06]">
              {draft.proposed_response}
            </p>

            {draft.status === 'APPROVED' && (
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-[10px] text-neutral-400">
                  Approved by {draft.approved_by || 'Human Lead'}
                </span>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-neutral-500 mr-1">Helpful?</span>
                  <button
                    type="button"
                    onClick={() => setRated('up')}
                    aria-label="Helpful"
                    className={`p-1 rounded-[3px] cursor-pointer transition-colors ${
                      rated === 'up' ? 'text-emerald-400 bg-emerald-950/60' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRated('down')}
                    aria-label="Not helpful"
                    className={`p-1 rounded-[3px] cursor-pointer transition-colors ${
                      rated === 'down' ? 'text-rose-400 bg-rose-950/60' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Agent Typing Indicator */}
        {isAgentTyping && (
          <div className="flex items-center gap-2 text-xs text-neutral-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-[4px] w-fit animate-pulse motion-reduce:animate-none">
            <Bot className="w-3.5 h-3.5 text-[#DF3E03]" />
            <span className="text-[11px]">AI Specialists investigating records…</span>
            <span className="flex gap-1 ml-1">
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce motion-reduce:animate-none" />
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s] motion-reduce:animate-none" />
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s] motion-reduce:animate-none" />
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <form
        onSubmit={handleSend}
        className="p-2.5 bg-[#0d0e12] border-t border-white/[0.08] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Ask a question or provide details…"
          aria-label="Ask a question or provide details"
          className="flex-1 px-3 py-2 text-xs bg-[#121319] border border-white/[0.08] rounded-[4px] text-white placeholder-neutral-500 focus:outline-none focus:border-[#DF3E03] focus-visible:ring-1 focus-visible:ring-[#DF3E03] transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          aria-label="Send message"
          className="p-2 bg-[#DF3E03] hover:bg-[#c93702] disabled:opacity-40 text-white rounded-[4px] transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

