import React, { useState } from 'react';
import { SidebarNav } from './SidebarNav';
import { ConversationListPane } from './ConversationListPane';
import { ConversationDetailPane } from './ConversationDetailPane';
import { VisitorProfileDrawer } from './VisitorProfileDrawer';
import type { Ticket, TimelineItem, DraftResponse, Customer, SwitchAgentState } from '../types';

interface DashboardLayoutProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  activeTicket: Ticket | null;
  customer?: Customer | null;
  timeline: TimelineItem[];
  draft?: DraftResponse | null;
  agents?: SwitchAgentState[];
  isProcessing?: boolean;
  customerTypingText?: string;
  isCustomerTyping?: boolean;
  onSelectTicket: (ticketId: string) => void;
  onApproveDraft: (text: string) => void;
  onRejectDraft: () => void;
  onSendOperatorMessage: (text: string, isInternal: boolean) => void;
  onResyncCustomer?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  tickets,
  selectedTicketId,
  activeTicket,
  customer,
  timeline,
  draft,
  agents,
  isProcessing = false,
  customerTypingText = '',
  isCustomerTyping = false,
  onSelectTicket,
  onApproveDraft,
  onRejectDraft,
  onSendOperatorMessage,
  onResyncCustomer,
}) => {
  const [currentTab, setCurrentTab] = useState('inbox');

  return (
    <div className="flex h-screen w-full bg-[#0d0e12] text-neutral-200 overflow-hidden font-sans">
      {/* 1. Global Navigation Sidebar */}
      <SidebarNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        openTicketsCount={tickets.filter((t) => t.status !== 'resolved').length}
      />

      {/* 2. Main Content Area */}
      {currentTab === 'inbox' && (
        <div className="flex flex-1 h-full overflow-hidden">
          {/* Conversation List Pane */}
          <ConversationListPane
            tickets={tickets}
            selectedTicketId={selectedTicketId}
            onSelectTicket={onSelectTicket}
          />

          {/* Central Conversation Thread */}
          <ConversationDetailPane
            ticket={activeTicket}
            customer={customer}
            timeline={timeline}
            draft={draft}
            agents={agents}
            isProcessing={isProcessing}
            customerTypingText={customerTypingText}
            isCustomerTyping={isCustomerTyping}
            onApproveDraft={onApproveDraft}
            onRejectDraft={onRejectDraft}
            onSendOperatorMessage={onSendOperatorMessage}
          />

          {/* Customer Metadata Drawer */}
          <VisitorProfileDrawer
            customer={customer}
            ticket={activeTicket}
            onResync={onResyncCustomer}
          />
        </div>
      )}

      {currentTab === 'agents' && (
        <div className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-2">Switch AI Swarm Configuration</h2>
          <p className="text-sm text-neutral-400 mb-6 font-mono">
            Directly connected to Switch AI server (localhost:34079) and Mattermost room #cloud-support
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#161720] border border-neutral-800 rounded-[2px]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-blue-400">@triager</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded-[2px] font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-3">
                Classifies incoming customer complaints, assigns urgency level, and checks sentiment.
              </p>
              <div className="text-[11px] font-mono text-neutral-500">
                Provider: Switch Orchestrator
              </div>
            </div>

            <div className="p-4 bg-[#161720] border border-neutral-800 rounded-[2px]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-emerald-400">@investigator</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded-[2px] font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-3">
                Deterministic agent running read-only tools against Postgres and Stripe to verify payment and plan state.
              </p>
              <div className="text-[11px] font-mono text-neutral-500">
                Tools: lookup_customer, check_stripe
              </div>
            </div>

            <div className="p-4 bg-[#161720] border border-neutral-800 rounded-[2px]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-purple-400">@responder</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded-[2px] font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-3">
                Grounds resolution drafts in official policies (billing discrepancies, SLA guarantees). Submits drafts to human gate.
              </p>
              <div className="text-[11px] font-mono text-neutral-500">
                Gate: Requires Human Operator Approval
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'knowledge' && (
        <div className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-2">Knowledge Base & Policy Grounding</h2>
          <p className="text-sm text-neutral-400 mb-6 font-mono">
            Grounding rules enforced across all Switch AI agent drafted responses
          </p>

          <div className="space-y-3 max-w-3xl">
            <div className="p-4 bg-[#161720] border border-neutral-800 rounded-[2px]">
              <div className="text-sm font-bold text-neutral-200 mb-1">
                Policy KB-001: Subscription Billing Discrepancies
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                When Stripe records an active successful charge for a paid tier (e.g. Pro), but the internal application database reflects a free tier due to webhook delivery latency or synchronization failure:
                The account must be immediately synchronized, any missing features restored, and the customer must receive a transparent confirmation email without placing blame on their payment provider.
              </p>
            </div>

            <div className="p-4 bg-[#161720] border border-neutral-800 rounded-[2px]">
              <div className="text-sm font-bold text-neutral-200 mb-1">
                Policy KB-002: SLA Response Time Guarantee
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Pro tier subscribers are entitled to a guaranteed &lt; 15-minute initial triage and resolution response. High-priority billing blockers bypass standard queues.
              </p>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'contacts' && (
        <div className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-4">Customer Directory</h2>
          <div className="p-4 bg-[#161720] border border-neutral-800 rounded-[2px] text-xs font-mono">
            <div className="flex justify-between py-2 border-b border-neutral-800 font-bold text-neutral-400">
              <span>Customer ID</span>
              <span>Name</span>
              <span>Email</span>
              <span>DB Plan</span>
              <span>Stripe Plan</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-850 text-neutral-200">
              <span>CUST-001</span>
              <span>Alex Rivera</span>
              <span>alex.rivera@example.com</span>
              <span className="text-rose-400">free (Error)</span>
              <span className="text-emerald-400">pro (Paid)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-850 text-neutral-200">
              <span>CUST-002</span>
              <span>Sarah Chen</span>
              <span>sarah.chen@techcorp.io</span>
              <span className="text-emerald-400">enterprise</span>
              <span className="text-emerald-400">enterprise</span>
            </div>
            <div className="flex justify-between py-2 text-neutral-200">
              <span>CUST-003</span>
              <span>Marcus Vance</span>
              <span>m.vance@startup.co</span>
              <span className="text-neutral-400">free</span>
              <span className="text-neutral-400">free</span>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'settings' && (
        <div className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-2">Integration & Protocol Settings</h2>
          <div className="p-4 bg-[#161720] border border-neutral-800 rounded-[2px] max-w-xl space-y-4 text-xs font-mono">
            <div>
              <label className="text-neutral-400 block mb-1">Switch AI Bridge URL</label>
              <input
                type="text"
                readOnly
                value="http://localhost:34079/api/v1/bridge"
                className="w-full p-2 bg-[#101116] border border-neutral-800 rounded-[2px] text-neutral-300"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">FastAPI Backend URL</label>
              <input
                type="text"
                readOnly
                value="http://localhost:8000"
                className="w-full p-2 bg-[#101116] border border-neutral-800 rounded-[2px] text-neutral-300"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Mattermost Target Channel</label>
              <input
                type="text"
                readOnly
                value="#cloud-support (ID: ch-supportflow-99)"
                className="w-full p-2 bg-[#101116] border border-neutral-800 rounded-[2px] text-neutral-300"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};