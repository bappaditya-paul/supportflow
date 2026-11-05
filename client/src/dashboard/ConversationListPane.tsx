import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle2, Clock, Filter, AlertTriangle } from 'lucide-react';
import type { Ticket } from '../types';

interface ConversationListPaneProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticketId: string) => void;
}

export const ConversationListPane: React.FC<ConversationListPaneProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
}) => {
  const [filter, setFilter] = useState<'all' | 'investigating' | 'awaiting_approval' | 'resolved'>('all');
  const [search, setSearch] = useState('');

  const filteredTickets = tickets.filter((t) => {
    const matchesFilter =
      filter === 'all' ? true : t.status === filter;
    const matchesSearch =
      t.ticket_id.toLowerCase().includes(search.toLowerCase()) ||
      t.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.complaint.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-80 shrink-0 h-full bg-[#14151b] border-r border-neutral-800 flex flex-col select-none">
      {/* Header & Search */}
      <div className="p-3 border-b border-neutral-800 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-100">Conversations</h2>
          <span className="text-[11px] font-mono text-neutral-400">
            {filteredTickets.length} tickets
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#1a1b23] border border-neutral-800 rounded-[2px] text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px] font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded-[2px] transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'all'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('investigating')}
            className={`px-2 py-0.5 rounded-[2px] transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'investigating'
                ? 'bg-blue-900/50 text-blue-300 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Investigating
          </button>
          <button
            onClick={() => setFilter('awaiting_approval')}
            className={`px-2 py-0.5 rounded-[2px] transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'awaiting_approval'
                ? 'bg-amber-900/50 text-amber-300 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Awaiting Approval
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-2 py-0.5 rounded-[2px] transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'resolved'
                ? 'bg-emerald-900/50 text-emerald-300 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-850">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            No conversations match your filter.
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const isSelected = ticket.ticket_id === selectedTicketId;

            return (
              <button
                key={ticket.ticket_id}
                onClick={() => onSelectTicket(ticket.ticket_id)}
                className={`w-full text-left p-3 transition-colors cursor-pointer block relative ${
                  isSelected
                    ? 'bg-[#1e202a] border-l-2 border-l-blue-500'
                    : 'hover:bg-[#181921] border-l-2 border-l-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-bold text-neutral-300">
                      {ticket.ticket_id}
                    </span>
                    {ticket.discrepancy && (
                      <span className="flex items-center gap-0.5 px-1 py-0.2 text-[9px] font-mono uppercase bg-rose-950/70 text-rose-300 border border-rose-800/60 rounded-[2px] animate-pulse">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Discrepancy
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {ticket.created_at || 'Just now'}
                  </span>
                </div>

                <div className="font-medium text-xs text-neutral-200 mb-0.5 truncate">
                  {ticket.customer_name}
                  <span className="ml-1.5 text-[10px] text-neutral-400 font-normal">
                    ({ticket.plan})
                  </span>
                </div>

                <div className="text-xs text-neutral-400 truncate mb-2">
                  {ticket.subject}
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span
                    className={`font-mono px-1.5 py-0.5 rounded-[2px] uppercase ${
                      ticket.status === 'resolved'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        : ticket.status === 'awaiting_approval'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        : 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                    }`}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>

                  {ticket.priority && (
                    <span className="text-neutral-500 font-mono uppercase">
                      {ticket.priority} priority
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