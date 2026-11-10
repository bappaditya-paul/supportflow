import React from 'react';
import { Send, Zap, ArrowRight, HelpCircle } from 'lucide-react';
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
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#0d0e12] text-neutral-100 p-4 gap-4 font-sans">
      {/* Welcome Card */}
      <div className="p-4 bg-[#121319] border border-white/[0.08] rounded-[4px] shadow-xs">
        <span className="text-[10px] font-mono tracking-wider uppercase text-[#DF3E03] font-semibold">
          AI Team + Human Swarm
        </span>
        <h3 className="text-base font-semibold mt-1 text-white">
          Hi there! How can we help?
        </h3>
        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
          Ask our AI specialists for instant answers or submit a ticket verified by our team.
        </p>

        <button
          type="button"
          onClick={onStartNewChat}
          className="mt-3.5 w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-[#DF3E03] hover:bg-[#c93702] rounded-[4px] transition-colors cursor-pointer shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Start a new conversation</span>
        </button>
      </div>

      {/* Quick Test Scenarios (Demo Showcase) */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
          <Zap className="w-3 h-3 text-[#DF3E03]" />
          <span>Simulate Real SaaS Issues</span>
        </div>
        <div className="grid grid-cols-1 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => onTriggerScenario('billing')}
            className="flex items-center justify-between p-2.5 bg-[#121319] border border-white/[0.08] hover:border-[#DF3E03]/50 rounded-[4px] text-left transition-colors cursor-pointer group"
          >
            <div>
              <div className="font-medium text-neutral-200 group-hover:text-white transition-colors">
                Billing: Paid Pro, Still Free
              </div>
              <div className="text-[10px] text-neutral-400 font-mono mt-0.5">TKT-1001 · Alex Rivera</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#DF3E03] transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => onTriggerScenario('refund')}
            className="flex items-center justify-between p-2.5 bg-[#121319] border border-white/[0.08] hover:border-[#DF3E03]/50 rounded-[4px] text-left transition-colors cursor-pointer group"
          >
            <div>
              <div className="font-medium text-neutral-200 group-hover:text-white transition-colors">
                Refund: Accidental Renewal
              </div>
              <div className="text-[10px] text-neutral-400 font-mono mt-0.5">TKT-1002 · Marcus Chen</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#DF3E03] transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => onTriggerScenario('access')}
            className="flex items-center justify-between p-2.5 bg-[#121319] border border-white/[0.08] hover:border-[#DF3E03]/50 rounded-[4px] text-left transition-colors cursor-pointer group"
          >
            <div>
              <div className="font-medium text-neutral-200 group-hover:text-white transition-colors">
                Security: 2FA Locked Account
              </div>
              <div className="text-[10px] text-neutral-400 font-mono mt-0.5">TKT-1003 · Sarah Jenkins</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#DF3E03] transition-colors" />
          </button>
        </div>
      </div>

      {/* Recent Tickets Section */}
      {recentTickets.length > 0 && (
        <div className="space-y-1.5 mt-1">
          <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            Your Active Tickets
          </div>
          <div className="space-y-1.5">
            {recentTickets.map((t) => (
              <button
                key={t.ticket_id}
                type="button"
                onClick={() => onSelectTicket(t.ticket_id)}
                className="w-full flex items-center justify-between p-2.5 bg-[#121319] border border-white/[0.08] hover:border-white/[0.16] rounded-[4px] text-left text-xs cursor-pointer transition-colors"
              >
                <div className="truncate pr-2">
                  <div className="font-medium truncate text-neutral-200">{t.subject}</div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{t.ticket_id}</div>
                </div>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[3px] shrink-0 ${
                    t.status === 'resolved'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
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
        <p className="text-[10px] text-neutral-400 flex items-center justify-center gap-1 font-mono">
          <HelpCircle className="w-3 h-3 text-neutral-500" />
          <span>Powered by Switch AI Swarm in Mattermost</span>
        </p>
      </div>
    </div>
  );
};

