import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SidebarNav } from './SidebarNav';
import { ConversationListPane } from './ConversationListPane';
import { ConversationDetailPane } from './ConversationDetailPane';
import { VisitorProfileDrawer } from './VisitorProfileDrawer';
import type { Ticket, TimelineItem, DraftResponse, Customer, SwitchAgentState } from '../types';
import { FacehashAvatar } from '../components/primitives';
import { Bot, CheckCircle2, Shield, Activity, Sparkles, Terminal, BookOpen, Settings, RefreshCw, ArrowUpRight } from 'lucide-react';
import { TopAnalyticsBar } from './TopAnalyticsBar';
import { AgentStudio } from './AgentStudio';
import { KnowledgeHub } from './KnowledgeHub';
import { DeveloperSettings } from './DeveloperSettings';

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
  const [showProfileDrawer, setShowProfileDrawer] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1280 && !compact : false
  );
  const [mobilePane, setMobilePane] = useState<'list' | 'detail'>('list');

  // Live CRM Customers state from backend
  const [crmCustomers, setCrmCustomers] = useState<Customer[]>([]);
  const [loadingCrm, setLoadingCrm] = useState(false);

  const fetchCrmCustomers = async () => {
    try {
      setLoadingCrm(true);
      const res = await fetch('http://localhost:8000/customers');
      if (res.ok) {
        const data = await res.json();
        setCrmCustomers(data);
      }
    } catch (err) {
      console.error('Failed to fetch CRM customers:', err);
    } finally {
      setLoadingCrm(false);
    }
  };

  useEffect(() => {
    if (currentTab === 'contacts') {
      fetchCrmCustomers();
    }
  }, [currentTab]);

  const handleSelectTicket = (ticketId: string) => {
    onSelectTicket(ticketId);
    setMobilePane('detail');
  };

  return (
    <div className="flex h-full w-full bg-surface-canvas text-neutral-900 dark:text-neutral-200 overflow-hidden font-sans min-h-0">
      {/* 1. Global Navigation Sidebar */}
      <SidebarNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        openTicketsCount={tickets.filter((t) => t.status !== 'resolved').length}
        compact={compact}
      />

      {/* 2. Main Content Area */}
      {currentTab === 'inbox' && (
        <div className="flex flex-col flex-1 h-full overflow-hidden min-h-0">
          {!compact && (
            <div className="hidden md:block">
              <TopAnalyticsBar />
            </div>
          )}
          <div className="flex flex-1 h-full overflow-hidden min-h-0 relative">
            {/* Conversation List Pane */}
            <div
              className={`h-full ${
                mobilePane === 'list' ? 'flex w-full md:w-auto' : 'hidden md:flex'
              } shrink-0`}
            >
              <ConversationListPane
                tickets={tickets}
                selectedTicketId={selectedTicketId}
                onSelectTicket={handleSelectTicket}
                compact={compact}
              />
            </div>

            {/* Central Conversation Thread */}
            <div
              className={`h-full flex-1 min-w-0 ${
                mobilePane === 'detail' ? 'flex' : 'hidden md:flex'
              }`}
            >
              <ConversationDetailPane
                ticket={activeTicket}
                customer={customer}
                timeline={timeline}
                draft={draft}
                agents={agents}
                isProcessing={isProcessing}
                customerTypingText={customerTypingText}
                isCustomerTyping={isCustomerTyping}
                showProfileDrawer={showProfileDrawer}
                onToggleProfileDrawer={() => setShowProfileDrawer(!showProfileDrawer)}
                onBackToInbox={() => setMobilePane('list')}
                onApproveDraft={onApproveDraft}
                onRejectDraft={onRejectDraft}
                onSendOperatorMessage={onSendOperatorMessage}
              />
            </div>

            {/* Customer Metadata Drawer: Overlay on <xl, static column on xl+ */}
            {showProfileDrawer && (
              <>
                <div
                  className="fixed inset-0 bg-black/60 z-30 xl:hidden backdrop-blur-xs"
                  onClick={() => setShowProfileDrawer(false)}
                />
                <div className="fixed inset-y-0 right-0 z-40 shadow-2xl xl:shadow-none xl:static xl:z-auto xl:flex h-full">
                  <VisitorProfileDrawer
                    customer={customer}
                    ticket={activeTicket}
                    onResync={onResyncCustomer}
                    onClose={() => setShowProfileDrawer(false)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {currentTab === 'agents' && <AgentStudio />}

      {currentTab === 'knowledge' && <KnowledgeHub />}

      {currentTab === 'contacts' && (
        <div className="flex-1 p-8 overflow-y-auto bg-surface-canvas text-neutral-900 dark:text-neutral-200 font-sans">
          <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-1 tracking-tight flex items-center gap-2">
                  <span>Customer CRM Directory</span>
                  <span className="px-2 py-0.5 rounded-[3px] bg-neutral-100 dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 border border-border-default text-[10px] font-mono">
                    STRIPE RECONCILED
                  </span>
                </h2>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                  Live synchronized database records linked to Stripe Customer objects
                </p>
              </div>

              <button
                type="button"
                onClick={fetchCrmCustomers}
                className="px-3.5 py-1.5 bg-surface-base hover:bg-neutral-100 dark:hover:bg-white/[0.06] text-neutral-800 dark:text-neutral-200 border border-border-default rounded-[4px] text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingCrm ? 'animate-spin' : ''}`} />
                <span>Sync Directory</span>
              </button>
            </div>

            <div className="bg-surface-base border border-border-default rounded-[4px] overflow-hidden text-xs">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="border-b border-border-default bg-neutral-50 dark:bg-[#090a0f] text-neutral-500 dark:text-neutral-400 text-[11px]">
                    <th className="p-3.5 font-medium">Customer</th>
                    <th className="p-3.5 font-medium">Email</th>
                    <th className="p-3.5 font-medium">Database Role</th>
                    <th className="p-3.5 font-medium">Stripe Billing</th>
                    <th className="p-3.5 font-medium">Status</th>
                    <th className="p-3.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {loadingCrm ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-neutral-500 font-mono">
                        <RefreshCw className="w-4 h-4 animate-spin inline-block mr-2" />
                        Fetching customer directory from live database...
                      </td>
                    </tr>
                  ) : crmCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-neutral-500 font-mono">
                        No customer records returned from database.
                      </td>
                    </tr>
                  ) : (
                    crmCustomers.map((cust) => {
                      const matchedTicket = tickets.find((t) => t.customer_id === cust.customer_id);
                      return (
                        <tr key={cust.customer_id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02] text-neutral-800 dark:text-neutral-200 transition-colors">
                          <td className="p-3.5 flex items-center gap-2.5 font-sans">
                            <FacehashAvatar seed={cust.name} size="xs" />
                            <div>
                              <div className="font-medium text-neutral-900 dark:text-white">{cust.name}</div>
                              <div className="text-[10px] text-neutral-500 font-mono">{cust.customer_id}</div>
                            </div>
                          </td>
                          <td className="p-3.5 text-neutral-600 dark:text-neutral-400">
                            {cust.email_masked || cust.email || 'N/A'}
                          </td>
                          <td className="p-3.5">
                            {cust.discrepancy_detected ? (
                              <span className="px-2 py-0.5 rounded-[3px] bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40 text-[10px]">
                                {cust.plan} (Desynced)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-[3px] bg-neutral-100 dark:bg-white/[0.05] text-neutral-700 dark:text-neutral-300 border border-border-default text-[10px]">
                                {cust.plan}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-[3px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-[10px]">
                              {cust.expected_plan || cust.plan} (Paid ${cust.payment_amount !== undefined ? cust.payment_amount.toFixed(2) : '0.00'})
                            </span>
                          </td>
                          <td className="p-3.5">
                            {cust.discrepancy_detected ? (
                              <span className="text-[#DF3E03] font-medium flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#DF3E03] animate-pulse"></span>
                                Needs Sync
                              </span>
                            ) : (
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Verified</span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            {matchedTicket ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentTab('inbox');
                                  handleSelectTicket(matchedTicket.ticket_id);
                                }}
                                className="px-2.5 py-1 text-[11px] bg-[#DF3E03]/10 hover:bg-[#DF3E03] text-[#DF3E03] hover:text-white rounded-[3px] border border-[#DF3E03]/30 cursor-pointer transition-colors inline-flex items-center gap-1"
                              >
                                <span>Ticket {matchedTicket.ticket_id}</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </button>
                            ) : (
                              <span className="text-neutral-400 text-[11px]">No open ticket</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'settings' && <DeveloperSettings />}
    </div>
  );
};
