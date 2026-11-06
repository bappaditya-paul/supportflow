import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle2, Clock, Filter, X } from 'lucide-react';
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
    const matchesSearch =
      t.ticket_id.toLowerCase().includes(search.toLowerCase()) ||
      t.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.complaint.toLowerCase().includes(search.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div
      className={`${
        compact ? 'w-64' : 'w-80'
      } shrink-0 h-full bg-[#111218] border-r border-dashed border-neutral-800 flex flex-col select-none transition-all z-10 min-h-0`}
    >
      {/* Header & Search */}
      <div className="p-3.5 border-b border-dashed border-neutral-800 space-y-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-100">
              Inbox
            </h2>
            <span className="px-1.5 py-0.2 text-[10px] font-mono bg-neutral-800 text-neutral-300 rounded-[2px] border border-neutral-700/60">
              {filteredTickets.length}
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
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
            placeholder="Search tickets, customers, tags..."
            className="w-full pl-8 pr-7 py-1.5 bg-[#171822] border border-neutral-700/80 rounded-[2px] text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-[#DF3E03] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-2 text-neutral-500 hover:text-neutral-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Pills Grid: Exactly 4 Columns, Zero Scrollbar */}
        <div className="grid grid-cols-4 gap-1 p-0.5 bg-neutral-900/90 border border-neutral-800 rounded-[2px] text-[10px] font-mono select-none">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`py-1 text-center rounded-[2px] transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-neutral-800 text-white font-bold shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All ({countByStatus.all})
          </button>

          <button
            type="button"
            onClick={() => setFilter('awaiting_approval')}
            className={`py-1 text-center rounded-[2px] transition-colors cursor-pointer ${
              filter === 'awaiting_approval'
                ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-800/80 shadow-xs'
                : 'text-neutral-400 hover:text-amber-300'
            }`}
          >
            Review ({countByStatus.awaiting_approval})
          </button>

          <button
            type="button"
            onClick={() => setFilter('investigating')}
            className={`py-1 text-center rounded-[2px] transition-colors cursor-pointer ${
              filter === 'investigating'
                ? 'bg-blue-950/80 text-blue-300 font-bold border border-blue-800/80 shadow-xs'
                : 'text-neutral-400 hover:text-blue-300'
            }`}
          >
            Swarm ({countByStatus.investigating})
          </button>

          <button
            type="button"
            onClick={() => setFilter('resolved')}
            className={`py-1 text-center rounded-[2px] transition-colors cursor-pointer ${
              filter === 'resolved'
                ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800/80 shadow-xs'
                : 'text-neutral-400 hover:text-emerald-300'
            }`}
          >
            Done ({countByStatus.resolved})
          </button>
        </div>
      </div>

      {/* Ticket List Stream */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/60 min-h-0 [scrollbar-width:thin]">
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
                className={`w-full text-left p-3.5 transition-all cursor-pointer block relative ${
                  isSelected
                    ? 'bg-[#181924] border-l-2 border-l-[#DF3E03] shadow-xs'
                    : 'hover:bg-[#14151e] border-l-2 border-l-transparent'
                }`}
              >
                {/* Top Row: Avatar + Customer Name + Timestamp */}
                <div className="flex items-start gap-2.5 mb-1.5">
                  <div className="shrink-0 pt-0.5">
                    <FacehashAvatar
                      seed={ticket.customer_name}
                      size="sm"
                      showStatus
                      status={ticket.discrepancy ? 'discrepancy' : 'online'}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-xs text-neutral-100 truncate">
                        {ticket.customer_name}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                        {ticket.created_at || 'Just now'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                      <span className="text-neutral-300 font-bold">{ticket.ticket_id}</span>
                      <span>·</span>
                      <span className="uppercase text-neutral-400">{ticket.plan} tier</span>
                    </div>
                  </div>
                </div>

                {/* Subject Preview */}
                <div className="text-xs text-neutral-300 font-medium line-clamp-1 mb-1.5 pl-9">
                  {ticket.subject}
                </div>

                {/* Tags & Status Pill */}
                <div className="flex items-center justify-between pl-9 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span
                      className={`px-1.5 py-0.2 rounded-[2px] uppercase font-bold tracking-wider ${
                        ticket.status === 'resolved'
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                          : ticket.status === 'awaiting_approval'
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-700/80 animate-pulse'
                          : 'bg-blue-950/70 text-blue-300 border border-blue-800/60'
                      }`}
                    >
                      {ticket.status.replace('_', ' ')}
                    </span>

                    {ticket.discrepancy && (
                      <span className="flex items-center gap-1 px-1.5 py-0.2 uppercase bg-rose-950/80 text-rose-300 border border-rose-700/80 rounded-[2px]">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Discrepancy
                      </span>
                    )}
                  </div>

                  {ticket.priority && (
                    <span
                      className={`uppercase text-[9px] ${
                        ticket.priority === 'high'
                          ? 'text-[#DF3E03] font-bold'
                          : 'text-neutral-500'
                      }`}
                    >
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
