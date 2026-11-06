import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarNav } from './SidebarNav';
import { ConversationListPane } from './ConversationListPane';
import { ConversationDetailPane } from './ConversationDetailPane';
import { VisitorProfileDrawer } from './VisitorProfileDrawer';
import type { Ticket, TimelineItem, DraftResponse, Customer, SwitchAgentState } from '../types';
import { FacehashAvatar } from '../components/primitives';
import { Bot, CheckCircle2, Shield, Activity, Sparkles, Terminal, BookOpen, Settings } from 'lucide-react';

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
  compact?: boolean;
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
  compact = false,
}) => {
  const [currentTab, setCurrentTab] = useState('inbox');
  const [showProfileDrawer, setShowProfileDrawer] = useState(!compact);

  return (
    <div className="flex h-full w-full bg-[#0d0e12] text-neutral-200 overflow-hidden font-sans min-h-0">
      {/* 1. Global Navigation Sidebar */}
      <SidebarNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        openTicketsCount={tickets.filter((t) => t.status !== 'resolved').length}
        compact={compact}
      />

      {/* 2. Main Content Area */}
      {currentTab === 'inbox' && (
        <div className="flex flex-1 h-full overflow-hidden min-h-0">
          {/* Conversation List Pane */}
          <ConversationListPane
            tickets={tickets}
            selectedTicketId={selectedTicketId}
            onSelectTicket={onSelectTicket}
            compact={compact}
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
          {showProfileDrawer && (
            <VisitorProfileDrawer
              customer={customer}
              ticket={activeTicket}
              onResync={onResyncCustomer}
            />
          )}
        </div>
      )}

      {currentTab === 'agents' && (
        <div className="flex-1 p-8 overflow-y-auto bg-[#0d0e12]">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 mb-2 border border-dashed border-emerald-700/60 rounded-[2px] bg-emerald-950/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Switch AI Local Node: 34079 · 3 Active Agents</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Switch AI Swarm Configuration
            </h2>
            <p className="text-xs text-neutral-400 mb-8 font-mono">
              Directly connected to Switch AI server (localhost:34079) and Mattermost room #cloud-support
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* @triager */}
              <div className="p-5 bg-[#14151e] border border-dashed border-neutral-700/80 rounded-[2px]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[2px] bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-blue-400 font-mono text-xs">
                      @T
                    </div>
                    <div>
                      <span className="font-mono text-sm font-bold text-blue-400">@triager</span>
                      <div className="text-[10px] text-neutral-500 font-mono">Classifier & Urgency</div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.2 rounded-[2px] font-mono">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
                  Classifies incoming customer complaints, assigns urgency level, and checks sentiment. Pre-routes tickets to investigation room.
                </p>
                <div className="pt-3 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Engine:</span>
                    <span className="text-neutral-200">Switch Orchestrator</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Latency:</span>
                    <span className="text-neutral-200">28ms</span>
                  </div>
                </div>
              </div>

              {/* @investigator */}
              <div className="p-5 bg-[#14151e] border border-dashed border-neutral-700/80 rounded-[2px]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[2px] bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 font-mono text-xs">
                      @I
                    </div>
                    <div>
                      <span className="font-mono text-sm font-bold text-emerald-400">@investigator</span>
                      <div className="text-[10px] text-neutral-500 font-mono">Deterministic Auditor</div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.2 rounded-[2px] font-mono">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
                  Deterministic agent executing read-only Python tools against Postgres and Stripe to verify payment and plan state.
                </p>
                <div className="pt-3 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Tools:</span>
                    <span className="text-neutral-200">lookup_customer, check_stripe</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zero Hallucinations:</span>
                    <span className="text-emerald-400 font-bold">100% Enforced</span>
                  </div>
                </div>
              </div>

              {/* @responder */}
              <div className="p-5 bg-[#14151e] border border-dashed border-neutral-700/80 rounded-[2px]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[2px] bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400 font-mono text-xs">
                      @R
                    </div>
                    <div>
                      <span className="font-mono text-sm font-bold text-purple-400">@responder</span>
                      <div className="text-[10px] text-neutral-500 font-mono">Resolution Composer</div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.2 rounded-[2px] font-mono">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
                  Grounds resolution drafts in official policies (billing discrepancies, SLA guarantees). Submits drafts to human gate.
                </p>
                <div className="pt-3 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Gate:</span>
                    <span className="text-[#DF3E03] font-bold">Human Sign-Off Required</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Channel:</span>
                    <span className="text-neutral-200">Mattermost #cloud-support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'knowledge' && (
        <div className="flex-1 p-8 overflow-y-auto bg-[#0d0e12]">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Knowledge Base & Policy Grounding
            </h2>
            <p className="text-xs text-neutral-400 mb-6 font-mono">
              Grounding rules enforced across all Switch AI agent drafted responses
            </p>

            <div className="space-y-4">
              <div className="p-5 bg-[#14151e] border border-neutral-800 rounded-[2px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">
                    Policy KB-001: Subscription Billing Discrepancies
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-blue-950 text-blue-300 border border-blue-800">
                    MANDATORY
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans mb-3">
                  When Stripe records an active successful charge for a paid tier (e.g. Pro), but the internal application database reflects a free tier due to webhook delivery latency or synchronization failure:
                  The account must be immediately synchronized, any missing features restored, and the customer must receive a transparent confirmation email without placing blame on their payment provider.
                </p>
                <div className="text-[11px] font-mono text-neutral-400 bg-neutral-900 p-2.5 rounded-[2px] border border-neutral-800">
                  Trigger condition: <code>stripe_status == 'succeeded' && db_plan != stripe_plan</code>
                </div>
              </div>

              <div className="p-5 bg-[#14151e] border border-neutral-800 rounded-[2px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">
                    Policy KB-002: SLA Response Time Guarantee
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-amber-950 text-amber-300 border border-amber-800">
                    SLA ENFORCED
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans mb-3">
                  Pro tier subscribers are entitled to a guaranteed &lt; 15-minute initial triage and resolution response. High-priority billing blockers bypass standard queues.
                </p>
                <div className="text-[11px] font-mono text-neutral-400 bg-neutral-900 p-2.5 rounded-[2px] border border-neutral-800">
                  Target response: <code>&lt; 15 minutes</code> · Automatic escalation to Lead Tier-2
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'contacts' && (
        <div className="flex-1 p-8 overflow-y-auto bg-[#0d0e12]">
          <div className="max-w-5xl">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Customer CRM Directory</h2>
            <p className="text-xs text-neutral-400 mb-6 font-mono">
              Live synchronized database records linked to Stripe Customer objects
            </p>

            <div className="bg-[#14151e] border border-neutral-800 rounded-[2px] overflow-hidden text-xs">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 bg-[#161722] text-neutral-400 text-[11px]">
                    <th className="p-3">Customer</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Database Role</th>
                    <th className="p-3">Stripe Billing</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  <tr className="hover:bg-neutral-900/60 text-neutral-200">
                    <td className="p-3 flex items-center gap-2.5 font-sans">
                      <FacehashAvatar seed="Alex Rivera" size="xs" />
                      <span className="font-semibold text-white">Alex Rivera</span>
                    </td>
                    <td className="p-3 text-neutral-400">alex.rivera@example.com</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-rose-950/80 text-rose-300 border border-rose-800">
                        free (Desynced)
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                        pro (Paid $49)
                      </span>
                    </td>
                    <td className="p-3 text-[#DF3E03] font-bold">Needs Sync</td>
                  </tr>

                  <tr className="hover:bg-neutral-900/60 text-neutral-200">
                    <td className="p-3 flex items-center gap-2.5 font-sans">
                      <FacehashAvatar seed="Sarah Chen" size="xs" />
                      <span className="font-semibold text-white">Sarah Chen</span>
                    </td>
                    <td className="p-3 text-neutral-400">sarah.chen@techcorp.io</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                        enterprise
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                        enterprise (Active)
                      </span>
                    </td>
                    <td className="p-3 text-emerald-400">Verified</td>
                  </tr>

                  <tr className="hover:bg-neutral-900/60 text-neutral-200">
                    <td className="p-3 flex items-center gap-2.5 font-sans">
                      <FacehashAvatar seed="Marcus Vance" size="xs" />
                      <span className="font-semibold text-white">Marcus Vance</span>
                    </td>
                    <td className="p-3 text-neutral-400">m.vance@startup.co</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-neutral-800 text-neutral-300 border border-neutral-700">
                        free
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-neutral-800 text-neutral-300 border border-neutral-700">
                        free
                      </span>
                    </td>
                    <td className="p-3 text-neutral-400">Normal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'settings' && (
        <div className="flex-1 p-8 overflow-y-auto bg-[#0d0e12]">
          <div className="max-w-4xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#DF3E03] mb-2 border border-dashed border-[#DF3E03]/30 rounded-[2px] bg-[#DF3E03]/5">
                <span>COMPANY AUTOMATION & ONBOARDING HUB</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                Connect Your Company & Automate Customer Support
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Deploy the customer widget, link your database and Stripe billing, and connect Mattermost #cloud-support in under 60 seconds.
              </p>
            </div>

            {/* 3-CARD GUIDED INTEGRATION GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* CARD 1: 1-COMMAND WIDGET INSTALLATION */}
              <div className="p-5 bg-[#14151e] border border-neutral-800 rounded-[2px] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                    <span className="text-[#DF3E03]">01</span> Widget Embed SDK
                  </h3>
                  <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-mono rounded-[2px]">
                    REACT 19 READY
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Add the customer support widget to your React, Next.js, or HTML web application with one CLI command:
                </p>

                <div className="p-2.5 bg-[#0f1016] border border-neutral-700 rounded-[2px] font-mono text-[11px] text-neutral-300 flex items-center justify-between">
                  <span className="truncate text-emerald-400">$ bunx --bun shadcn add @supportflow</span>
                  <button
                    onClick={() => navigator.clipboard?.writeText('bunx --bun shadcn@latest add @supportflow/widget')}
                    className="p-1 hover:text-white text-neutral-400 cursor-pointer shrink-0"
                    title="Copy Command"
                  >
                    Copy
                  </button>
                </div>

                <div className="pt-2 text-[11px] font-mono text-neutral-400">
                  <label className="block mb-1 text-[10px] uppercase text-neutral-500">Publishable API Key (Client-Safe):</label>
                  <input
                    type="text"
                    readOnly
                    value="sf_live_pk_clouddesk_34079"
                    className="w-full p-2 bg-[#0f1016] border border-neutral-700 rounded-[2px] text-neutral-200"
                  />
                </div>
              </div>

              {/* CARD 2: SWITCH AI & MATTERMOST BRIDGE */}
              <div className="p-5 bg-[#14151e] border border-neutral-800 rounded-[2px] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                    <span className="text-blue-400">02</span> AI Swarm & ChatOps
                  </h3>
                  <span className="px-1.5 py-0.2 bg-blue-950 text-blue-300 border border-blue-800 text-[9px] font-mono rounded-[2px]">
                    NODE 34079
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Binds the 3 autonomous agents (@triager, @investigator, @responder) to your team's live Mattermost channel:
                </p>

                <div className="space-y-2 text-[11px] font-mono">
                  <div>
                    <label className="text-[10px] text-neutral-500 block mb-0.5">Switch AI Daemon Endpoint:</label>
                    <input
                      type="text"
                      readOnly
                      value="http://localhost:34079/api/v1/bridge"
                      className="w-full p-2 bg-[#0f1016] border border-neutral-700 rounded-[2px] text-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 block mb-0.5">Mattermost Target Room:</label>
                    <input
                      type="text"
                      readOnly
                      value="#cloud-support (Channel ID: ch-supportflow-99)"
                      className="w-full p-2 bg-[#0f1016] border border-neutral-700 rounded-[2px] text-neutral-200"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 3: DETERMINISTIC BACKEND CONNECTORS */}
              <div className="p-5 bg-[#14151e] border border-neutral-800 rounded-[2px] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                    <span className="text-emerald-400">03</span> Database & Stripe
                  </h3>
                  <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-mono rounded-[2px]">
                    ZERO HALLUCINATIONS
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Empowers @investigator to execute deterministic Python tool checks against customer accounts:
                </p>

                <div className="space-y-2 text-[11px] font-mono">
                  <div>
                    <label className="text-[10px] text-neutral-500 block mb-0.5">PostgreSQL Read-Only Replica:</label>
                    <input
                      type="text"
                      readOnly
                      value="postgresql://clouddesk_ro:***@db.internal:5432/users"
                      className="w-full p-2 bg-[#0f1016] border border-neutral-700 rounded-[2px] text-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 block mb-0.5">Stripe Gateway Restricted Key:</label>
                    <input
                      type="text"
                      readOnly
                      value="rk_live_51LMN... (Charges & Subscriptions Read)"
                      className="w-full p-2 bg-[#0f1016] border border-neutral-700 rounded-[2px] text-neutral-200"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 4: LIVE SIMULATION & TESTING PLAYGROUND */}
              <div className="p-5 bg-[#14151e] border border-[#DF3E03]/40 rounded-[2px] space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                      <span className="text-[#DF3E03]">04</span> Split Testing Sandbox
                    </h3>
                    <span className="px-1.5 py-0.2 bg-[#DF3E03]/10 text-[#DF3E03] text-[9px] font-mono rounded-[2px]">
                      LIVE TESTBED
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                    Experience both sides simultaneously: test the customer chat widget with ghost-typing on the left, and watch the operator cockpit triage on the right.
                  </p>
                </div>

                <Link
                  to="/split"
                  className="w-full py-2.5 px-3 bg-[#DF3E03] hover:bg-[#c93702] text-white text-xs font-bold font-mono rounded-[2px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Launch Split-Screen Sandbox ↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
