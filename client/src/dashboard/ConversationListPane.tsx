import React, { useState } from 'react';
import { Search, CheckCircle2, X } from 'lucide-react';
import type { Ticket } from '../types';
import { FacehashAvatar } from '../components/primitives';

interface ConversationListPaneProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticketId: string) => void;
  compact?: boolean;
}

export const ConversationListPane: React.FC<ConversationListPaneProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  compact = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'investigating' | 'awaiting_approval' | 'resolved'>('all');
  const [search, setSearch] = useState('');

  const countByStatus = {
    all: tickets.length,
    awaiting_approval: tickets.filter((t) => t.status === 'awaiting_approval').length,
    investigating: tickets.filter((t) => t.status === 'investigating').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesFilter = filter === 'all' ? true : t.status === filter;
    const customerName = t.customer_name || '';
    const complaintText = t.complaint || t.message || '';
    const matchesSearch =
      t.ticket_id.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      complaintText.toLowerCase().includes(search.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div
      className={`${
        compact ? 'w-64' : 'w-full md:w-80'
      } shrink-0 h-full bg-[#0d0e12] border-r border-white/[0.08] flex flex-col select-none transition-[width] z-10 min-h-0`}
    >
      {/* Header & Search */}
      <div className="p-3.5 border-b border-white/[0.08] space-y-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-100">
              Inbox
            </h2>
            <span className="px-1.5 py-0.2 text-[10px] font-mono bg-white/[0.06] text-neutral-300 rounded-[3px] border border-white/[0.08] tabular-nums">
              {filteredTickets.length}
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none"></span>
            Realtime Sync
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets, customers, tags…"
            aria-label="Search conversations"
            className="w-full pl-8 pr-7 py-1.5 bg-[#121319] border border-white/[0.08] rounded-[4px] text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-[#DF3E03] focus-visible:ring-1 focus-visible:ring-[#DF3E03] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-2 top-2 text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Pills Grid: Clean Monochrome & Quiet Tabs */}
        <div className="grid grid-cols-4 gap-1 p-0.5 bg-white/[0.03] border border-white/[0.08] rounded-[4px] text-[10px] font-mono select-none">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`py-1 text-center rounded-[3px] transition-colors cursor-pointer tabular-nums ${
              filter === 'all'
                ? 'bg-white/10 text-white font-medium shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All ({countByStatus.all})
          </button>

          <button
            type="button"
            onClick={() => setFilter('awaiting_approval')}
            className={`py-1 text-center rounded-[3px] transition-colors cursor-pointer tabular-nums ${
              filter === 'awaiting_approval'
                ? 'bg-white/10 text-white font-medium shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Review ({countByStatus.awaiting_approval})
          </button>

          <button
            type="button"
            onClick={() => setFilter('investigating')}
            className={`py-1 text-center rounded-[3px] transition-colors cursor-pointer tabular-nums ${
              filter === 'investigating'
                ? 'bg-white/10 text-white font-medium shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Swarm ({countByStatus.investigating})
          </button>

          <button
            type="button"
            onClick={() => setFilter('resolved')}
            className={`py-1 text-center rounded-[3px] transition-colors cursor-pointer tabular-nums ${
              filter === 'resolved'
                ? 'bg-white/10 text-white font-medium shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Done ({countByStatus.resolved})
          </button>
        </div>
      </div>

      {/* Ticket List Stream */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04] min-h-0 [scrollbar-width:thin]">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500 font-mono">
            No conversations match your filter.
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const isSelected = ticket.ticket_id === selectedTicketId;

            return (
              <button
                key={ticket.ticket_id}
                onClick={() => onSelectTicket(ticket.ticket_id)}
                className={`w-full text-left p-3.5 transition-all duration-150 active:scale-[0.99] cursor-pointer block relative ${
                  isSelected
                    ? 'bg-[#141520] border-l-2 border-l-white'
                    : 'hover:bg-white/[0.03] border-l-2 border-l-transparent'
                }`}
              >
                {/* Top Row: Avatar + Customer Name + Timestamp */}
                <div className="flex items-start gap-2.5 mb-1.5">
                  <div className="shrink-0 pt-0.5">
                    <FacehashAvatar
                      seed={ticket.customer_name || 'Customer'}
                      size="sm"
                      showStatus
                      status={ticket.discrepancy ? 'discrepancy' : 'online'}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`font-semibold text-xs truncate ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                        {ticket.customer_name || 'Customer'}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono shrink-0 tabular-nums">
                        {ticket.created_at || 'Just now'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
                      <span className="text-neutral-400 font-medium">{ticket.ticket_id}</span>
                      <span>·</span>
                      <span className="uppercase text-neutral-500">{ticket.plan} tier</span>
                    </div>
                  </div>
                </div>

                {/* Subject Preview */}
                <div className={`text-xs font-medium line-clamp-1 mb-2 pl-9 ${isSelected ? 'text-neutral-200' : 'text-neutral-400'}`}>
                  {ticket.subject}
                </div>

                {/* Tags & Minimalist Status */}
                <div className="flex items-center justify-between pl-9 text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    {ticket.status === 'resolved' ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Resolved</span>
                      </span>
                    ) : ticket.status === 'awaiting_approval' ? (
                      <span className="flex items-center gap-1 text-amber-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse motion-reduce:animate-none" />
                        <span>Needs review</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-neutral-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                        <span>Swarm active</span>
                      </span>
                    )}

                    {ticket.discrepancy && (
                      <span className="px-1 py-0.2 uppercase text-[9px] text-rose-300 bg-rose-950/40 border border-rose-800/40 rounded-[2px]">
                        Discrepancy
                      </span>
                    )}
                  </div>

                  {ticket.priority && (
                    <span className="uppercase text-[9px] font-medium text-neutral-500">
                      {ticket.priority}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
