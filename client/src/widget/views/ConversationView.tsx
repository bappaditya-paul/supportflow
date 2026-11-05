import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle2, ShieldAlert, Bot, User, CornerDownLeft, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
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
          <div className="max-w-[85%] bg-[#131313] text-white p-3 rounded-2xl rounded-tr-xs shadow-xs">
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
                  className={`max-w-[85%] p-3 rounded-2xl shadow-xs leading-relaxed ${
                    isCustomer
                      ? 'bg-[#131313] text-white rounded-tr-xs'
                      : 'bg-white dark:bg-[#20232c] text-[#131313] dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{item.text}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-1 ml-1">
                  {!isCustomer && <Bot className="w-3 h-3 text-blue-500" />}
                  <span>{item.sender_name}</span>
                </div>
              </div>
            );
          })}

        {/* Verified Resolution Draft Card (When ready/approved) */}
        {draft && (
          <div className="p-3 bg-white dark:bg-[#1a1c24] border border-blue-500/40 rounded-[2px] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Resolution
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] ${
                  draft.status === 'APPROVED'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {draft.status === 'APPROVED' ? 'HUMAN APPROVED' : 'PENDING REVIEW'}
              </span>
            </div>

            <p className="text-xs text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap bg-neutral-50 dark:bg-[#15161c] p-2.5 rounded-[2px] border border-neutral-200 dark:border-neutral-800">
              {draft.proposed_response}
            </p>

            {draft.status === 'APPROVED' && (
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-[10px] text-neutral-400">
                  Approved by {draft.approved_by || 'Human Lead'}
                </span>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-neutral-500 mr-1">Helpful?</span>
                  <button
                    onClick={() => setRated('up')}
                    className={`p-1 rounded cursor-pointer ${
                      rated === 'up' ? 'text-emerald-500 bg-emerald-50' : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setRated('down')}
                    className={`p-1 rounded cursor-pointer ${
                      rated === 'down' ? 'text-rose-500 bg-rose-50' : 'text-neutral-400 hover:text-neutral-700'
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
          <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-100 dark:bg-[#1a1c24] px-3 py-2 rounded-full w-fit animate-pulse">
            <Bot className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[11px]">AI Specialists investigating records...</span>
            <span className="flex gap-1 ml-1">
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <form
        onSubmit={handleSend}
        className="p-2.5 bg-white dark:bg-[#181a20] border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Ask a question or provide details..."
          className="flex-1 px-3 py-2 text-xs bg-neutral-100 dark:bg-[#21242d] border border-neutral-300 dark:border-neutral-700 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 bg-[#131313] hover:bg-[#252525] dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-40 text-white rounded-[2px] transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

