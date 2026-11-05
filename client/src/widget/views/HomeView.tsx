import React, { useState } from 'react';
import { Send, Search, HelpCircle, ArrowRight, Zap } from 'lucide-react';
import type { Ticket } from '../../types';

interface HomeViewProps {
  onStartNewChat: () => void;
  onSelectTicket: (ticketId: string) => void;
  recentTickets: Ticket[];
  onTriggerScenario: (scenario: 'billing' | 'refund' | 'access') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartNewChat,
  onSelectTicket,
  recentTickets,
  onTriggerScenario,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#FCFCFB] dark:bg-[#15161b] text-[#131313] dark:text-neutral-100 p-4 gap-4">
      {/* Welcome Card */}
      <div className="p-4 bg-white dark:bg-[#1a1c23] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px] shadow-xs">
        <span className="text-[10px] font-mono tracking-wider uppercase text-blue-600 dark:text-blue-400 font-semibold">
          AI Team + Human Swarm
        </span>
        <h3 className="text-base font-bold mt-1 text-[#131313] dark:text-white">
          Hi there! How can we help?
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
          Ask our AI specialists for instant answers or submit a ticket verified by our team.
        </p>

        <button
          onClick={onStartNewChat}
          className="mt-3.5 w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-[#131313] hover:bg-[#252525] dark:bg-blue-600 dark:hover:bg-blue-700 rounded-[2px] transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          Start a new conversation
        </button>
      </div>

      {/* Quick Test Scenarios (Cossistant/Hackathon Demo Showcase) */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
          <Zap className="w-3 h-3 text-amber-500" />
          Simulate Real SaaS Issues
        </div>
        <div className="grid grid-cols-1 gap-1.5 text-xs">
          <button
            onClick={() => onTriggerScenario('billing')}
            className="flex items-center justify-between p-2.5 bg-white dark:bg-[#1a1c23] border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 rounded-[2px] text-left transition-all cursor-pointer group"
          >
            <div>
              <div className="font-medium text-[#131313] dark:text-neutral-200">
                Billing: Paid Pro, Still Free
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">TKT-1001 · Alex Rivera</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => onTriggerScenario('refund')}
            className="flex items-center justify-between p-2.5 bg-white dark:bg-[#1a1c23] border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 rounded-[2px] text-left transition-all cursor-pointer group"
          >
            <div>
              <div className="font-medium text-[#131313] dark:text-neutral-200">
                Refund: Accidental Renewal
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">TKT-1002 · Marcus Chen</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => onTriggerScenario('access')}
            className="flex items-center justify-between p-2.5 bg-white dark:bg-[#1a1c23] border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 rounded-[2px] text-left transition-all cursor-pointer group"
          >
            <div>
              <div className="font-medium text-[#131313] dark:text-neutral-200">
                Security: 2FA Locked Account
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">TKT-1003 · Sarah Jenkins</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Recent Tickets Section */}
      {recentTickets.length > 0 && (
        <div className="space-y-1.5 mt-1">
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
            Your Active Tickets
          </div>
          <div className="space-y-1.5">
            {recentTickets.map((t) => (
              <button
                key={t.ticket_id}
                onClick={() => onSelectTicket(t.ticket_id)}
                className="w-full flex items-center justify-between p-2 bg-white dark:bg-[#1a1c23] border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 rounded-[2px] text-left text-xs cursor-pointer"
              >
                <div className="truncate pr-2">
                  <div className="font-medium truncate">{t.subject}</div>
                  <div className="text-[10px] text-neutral-400 font-mono">{t.ticket_id}</div>
                </div>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[2px] ${
                    t.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}
                >
                  {t.status.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-auto pt-4 text-center">
        <p className="text-[10px] text-neutral-400 flex items-center justify-center gap-1">
          <HelpCircle className="w-3 h-3" />
          Powered by Switch AI Swarm in Mattermost
        </p>
      </div>
    </div>
  );
};

