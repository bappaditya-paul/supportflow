import React, { useState, useEffect, useRef } from 'react';
import {
  Monitor,
  Columns,
  LayoutDashboard,
  Sparkles,
  Wifi,
  WifiOff,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { SupportWidget } from './widget/SupportWidget';
import { DashboardLayout } from './dashboard/DashboardLayout';
import { CloudDeskDemo } from './demo/CloudDeskDemo';
import type { Ticket, Customer, TimelineItem, DraftResponse, SwitchAgentState } from './types';

// Initial Mock Fixtures
const INITIAL_TICKETS: Ticket[] = [
  {
    ticket_id: 'TKT-1001',
    customer_id: 'CUST-001',
    customer_name: 'Alex Rivera',
    customer_email: 'alex.rivera@example.com',
    subject: 'Paid for Pro yesterday, but still showing Free tier',
    complaint:
      'I paid for Pro yesterday with my credit card ($49), but my account dashboard still says Free tier and my API rate limit is locked at 60 req/min. Can someone fix this ASAP? We have a product launch tomorrow.',
    plan: 'free',
    created_at: '10 mins ago',
    status: 'awaiting_approval',
    priority: 'high',
    category: 'Billing / Discrepancy',
    discrepancy: true,
  },
  {
    ticket_id: 'TKT-1002',
    customer_id: 'CUST-002',
    customer_name: 'Sarah Chen',
    customer_email: 'sarah.chen@techcorp.io',
    subject: 'Emergency concurrency limit increase for workload test',
    complaint:
      'We are conducting a load test on our staging cluster tonight. We need our concurrent node limit bumped from 20 to 50 nodes for the next 48 hours.',
    plan: 'enterprise',
    created_at: '45 mins ago',
    status: 'investigating',
    priority: 'high',
    category: 'Quota Increase',
    discrepancy: false,
  },
  {
    ticket_id: 'TKT-1003',
    customer_id: 'CUST-003',
    customer_name: 'Marcus Vance',
    customer_email: 'm.vance@startup.co',
    subject: 'Where to find Okta SAML 2.0 metadata certificate?',
    complaint:
      'Setting up enterprise SSO for our team. Does CloudDesk support SP-initiated SAML and where can I find the ACS URL and cert?',
    plan: 'free',
    created_at: '2 hours ago',
    status: 'resolved',
    priority: 'normal',
    category: 'Authentication / SSO',
    discrepancy: false,
  },
];

const INITIAL_CUSTOMERS: Record<string, Customer> = {
  'CUST-001': {
    customer_id: 'CUST-001',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    plan: 'free',
    paid_plan: 'pro',
    payment_status: 'paid',
    last_payment_date: '2026-11-04 18:22:10 UTC',
    stripe_charge_id: 'ch_3P7a9xK201LMN7',
    account_created: '2026-06-12',
  },
  'CUST-002': {
    customer_id: 'CUST-002',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.io',
    plan: 'enterprise',
    paid_plan: 'enterprise',
    payment_status: 'paid',
    last_payment_date: '2026-10-01 09:00:00 UTC',
    stripe_charge_id: 'ch_99KaaL781200PQ',
    account_created: '2025-02-14',
  },
  'CUST-003': {
    customer_id: 'CUST-003',
    name: 'Marcus Vance',
    email: 'm.vance@startup.co',
    plan: 'free',
    paid_plan: 'free',
    payment_status: 'none',
    last_payment_date: 'N/A',
    stripe_charge_id: 'N/A',
    account_created: '2026-09-20',
  },
};

const INITIAL_TIMELINES: Record<string, TimelineItem[]> = {
  'TKT-1001': [
    {
      id: 'msg-1',
      ticket_id: 'TKT-1001',
      sender_type: 'customer',
      sender_name: 'Alex Rivera',
      text: 'I paid for Pro yesterday with my credit card ($49), but my account dashboard still says Free tier and my API rate limit is locked at 60 req/min. Can someone fix this ASAP? We have a product launch tomorrow.',
      visibility: 'public',
      created_at: '10 mins ago',
    },
    {
      id: 'tool-1',
      ticket_id: 'TKT-1001',
      sender_type: 'agent',
      sender_name: '@investigator',
      text: 'Executing database customer lookup...',
      visibility: 'private',
      created_at: '9 mins ago',
      tool_call: {
        name: 'lookup_customer',
        params: { customer_id: 'CUST-001' },
        result: {
          customer_id: 'CUST-001',
          name: 'Alex Rivera',
          plan: 'free',
          status: 'active',
        },
        status: 'completed',
      },
    },
    {
      id: 'tool-2',
      ticket_id: 'TKT-1001',
      sender_type: 'agent',
      sender_name: '@investigator',
      text: 'Querying Stripe API for latest charges...',
      visibility: 'private',
      created_at: '9 mins ago',
      tool_call: {
        name: 'check_stripe',
        params: { email: 'alex.rivera@example.com' },
        result: {
          status: 'succeeded',
          amount: 4900,
          currency: 'usd',
          plan: 'pro',
          charge_id: 'ch_3P7a9xK201LMN7',
          paid_at: '2026-11-04 18:22:10 UTC',
        },
        status: 'completed',
      },
    },
    {
      id: 'msg-2',
      ticket_id: 'TKT-1001',
      sender_type: 'agent',
      sender_name: '@investigator',
      text: 'DISCREPANCY DETECTED: Customer has valid active Pro subscription in Stripe ($49), but database user record is still set to "free". Root cause: Webhook sync delay or dropped event.',
      visibility: 'private',
      created_at: '8 mins ago',
    },
    {
      id: 'msg-3',
      ticket_id: 'TKT-1001',
      sender_type: 'agent',
      sender_name: '@responder',
      text: 'Grounding draft in Policy KB-001: Immediate sync required + proactive apology. Prepared resolution draft awaiting human authorization.',
      visibility: 'private',
      created_at: '7 mins ago',
    },
  ],
  'TKT-1002': [
    {
      id: 'msg-t2-1',
      ticket_id: 'TKT-1002',
      sender_type: 'customer',
      sender_name: 'Sarah Chen',
      text: 'We are conducting a load test on our staging cluster tonight. We need our concurrent node limit bumped from 20 to 50 nodes for the next 48 hours.',
      visibility: 'public',
      created_at: '45 mins ago',
    },
    {
      id: 'tool-t2-1',
      ticket_id: 'TKT-1002',
      sender_type: 'agent',
      sender_name: '@investigator',
      text: 'Checking SLA tier and enterprise contracts...',
      visibility: 'private',
      created_at: '44 mins ago',
      tool_call: {
        name: 'lookup_customer',
        params: { customer_id: 'CUST-002' },
        result: {
          customer_id: 'CUST-002',
          name: 'Sarah Chen',
          plan: 'enterprise',
          contract: 'Enterprise-Tier-A',
        },
        status: 'completed',
      },
    },
  ],
  'TKT-1003': [
    {
      id: 'msg-t3-1',
      ticket_id: 'TKT-1003',
      sender_type: 'customer',
      sender_name: 'Marcus Vance',
      text: 'Where can I find the Okta SAML 2.0 metadata certificate?',
      visibility: 'public',
      created_at: '2 hours ago',
    },
    {
      id: 'msg-t3-2',
      ticket_id: 'TKT-1003',
      sender_type: 'operator',
      sender_name: 'Operator Desk',
      text: 'Hi Marcus! You can download our latest SAML metadata XML and signing cert directly from your Settings > Security > SSO tab, or at https://clouddesk.dev/saml/metadata.xml.',
      visibility: 'public',
      created_at: '1 hour ago',
    },
  ],
};

const INITIAL_DRAFTS: Record<string, DraftResponse> = {
  'TKT-1001': {
    ticket_id: 'TKT-1001',
    customer_name: 'Alex Rivera',
    complaint_summary: 'Customer paid for Pro tier via Stripe, but app database reflects Free tier.',
    investigation_findings: [
      'Stripe charge ch_3P7a9xK201LMN7 for $49 verified as SUCCEEDED.',
      'Internal users table records plan="free" due to webhook synchronization failure.',
      'API rate limit restricted to 60 req/min instead of Pro entitlement (600 req/min).',
    ],
    applicable_policies: ['Policy KB-001: Billing Discrepancy Protocol', 'Policy KB-002: <15m Pro SLA'],
    proposed_response: `Hi Alex,

Thank you for reaching out and alerting us to this!

We investigated our payment gateway records and verified that your $49 Pro payment was processed successfully. Due to a momentary webhook delivery delay, your database record was not immediately updated.

We have now manually synchronized your account to Pro and unlocked your API quota to 600 req/min. You have full access to all Pro features right now.

We apologize for the friction and wish you great success with your product launch tomorrow! Please let us know if there is anything else we can do to support your launch.`,
    status: 'PENDING_APPROVAL',
  },
};

export default function App() {
  const [viewMode, setViewMode] = useState<'split' | 'saas' | 'operator'>('split');
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('TKT-1001');
  const [customers, setCustomers] = useState<Record<string, Customer>>(INITIAL_CUSTOMERS);
  const [timelines, setTimelines] = useState<Record<string, TimelineItem[]>>(INITIAL_TIMELINES);
  const [drafts, setDrafts] = useState<Record<string, DraftResponse>>(INITIAL_DRAFTS);
  const [isProcessing, setIsProcessing] = useState(false);

  // Widget state
  const [isWidgetOpen, setIsWidgetOpen] = useState(true);
  const [customerTypingText, setCustomerTypingText] = useState('');
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // WebSocket Connection State
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Switch AI Agents Live Status
  const [agents, setAgents] = useState<SwitchAgentState[]>([
    { name: '@triager', role: 'Classifier', status: 'idle' },
    { name: '@investigator', role: 'Deterministic Tools', status: 'idle' },
    { name: '@responder', role: 'Draft Composer', status: 'idle' },
  ]);

  const activeTicket = tickets.find((t) => t.ticket_id === selectedTicketId) || null;
  const activeCustomer = activeTicket ? customers[activeTicket.customer_id] || null : null;
  const activeTimeline = timelines[selectedTicketId] || [];
  const activeDraft = drafts[selectedTicketId] || null;

  // Try connecting to FastAPI WebSocket server
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket('ws://localhost:8000/ws');
      ws.onopen = () => {
        setWsConnected(true);
      };
      ws.onclose = () => {
        setWsConnected(false);
      };
      ws.onerror = () => {
        setWsConnected(false);
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'GHOST_TYPING') {
            setCustomerTypingText(data.text);
            setIsCustomerTyping(data.is_typing);
          } else if (data.type === 'NEW_TIMELINE_ITEM') {
            setTimelines((prev) => ({
              ...prev,
              [data.ticket_id]: [...(prev[data.ticket_id] || []), data.item],
            }));
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message', e);
        }
      };
      wsRef.current = ws;
    } catch {
      setWsConnected(false);
    }

    return () => {
      ws?.close();
    };
  }, []);

  // Handle Customer Typing in Widget (Ghost-typing broadcast)
  const handleTyping = (text: string, isTyping: boolean) => {
    setCustomerTypingText(text);
    setIsCustomerTyping(isTyping);

    // Send through WebSocket if connected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'GHOST_TYPING',
          ticket_id: selectedTicketId,
          text,
          is_typing: isTyping,
        })
      );
    }
  };

  // Handle Customer Sending Message
  const handleSendMessage = (text: string) => {
    const newItem: TimelineItem = {
      id: `msg-${Date.now()}`,
      ticket_id: selectedTicketId,
      sender_type: 'customer',
      sender_name: activeTicket?.customer_name || 'Customer',
      text,
      visibility: 'public',
      created_at: 'Just now',
    };

    setTimelines((prev) => ({
      ...prev,
      [selectedTicketId]: [...(prev[selectedTicketId] || []), newItem],
    }));

    // Trigger Swarm Response Simulation
    setIsAgentTyping(true);
    setAgents([
      { name: '@triager', role: 'Classifier', status: 'analyzing' },
      { name: '@investigator', role: 'Deterministic Tools', status: 'idle' },
      { name: '@responder', role: 'Draft Composer', status: 'idle' },
    ]);

    setTimeout(() => {
      setAgents([
        { name: '@triager', role: 'Classifier', status: 'idle' },
        { name: '@investigator', role: 'Deterministic Tools', status: 'querying_db' },
        { name: '@responder', role: 'Draft Composer', status: 'idle' },
      ]);
    }, 1000);

    setTimeout(() => {
      setAgents([
        { name: '@triager', role: 'Classifier', status: 'idle' },
        { name: '@investigator', role: 'Deterministic Tools', status: 'idle' },
        { name: '@responder', role: 'Draft Composer', status: 'drafting' },
      ]);
      setIsAgentTyping(false);
    }, 2000);

    setTimeout(() => {
      setAgents([
        { name: '@triager', role: 'Classifier', status: 'idle' },
        { name: '@investigator', role: 'Deterministic Tools', status: 'idle' },
        { name: '@responder', role: 'Draft Composer', status: 'ready' },
      ]);
    }, 2500);
  };

  // Handle Operator Approving Draft
  const handleApproveDraft = (finalText: string) => {
    setIsProcessing(true);

    setTimeout(() => {
      const approvedAt = new Date().toLocaleTimeString();

      // Update Draft
      setDrafts((prev) => ({
        ...prev,
        [selectedTicketId]: {
          ...prev[selectedTicketId],
          status: 'APPROVED',
          proposed_response: finalText,
          approved_by: 'Operator Desk',
          approved_at: approvedAt,
        },
      }));

      // Update Ticket
      setTickets((prev) =>
        prev.map((t) =>
          t.ticket_id === selectedTicketId
            ? { ...t, status: 'resolved', discrepancy: false }
            : t
        )
      );

      // Resync customer DB plan to pro
      if (activeTicket) {
        setCustomers((prev) => ({
          ...prev,
          [activeTicket.customer_id]: {
            ...prev[activeTicket.customer_id],
            plan: 'pro',
          },
        }));
      }

      // Add dispatched message to timeline
      const dispatchedItem: TimelineItem = {
        id: `msg-dispatched-${Date.now()}`,
        ticket_id: selectedTicketId,
        sender_type: 'operator',
        sender_name: 'CloudDesk Support (Human Verified)',
        text: finalText,
        visibility: 'public',
        created_at: 'Just now',
      };

      setTimelines((prev) => ({
        ...prev,
        [selectedTicketId]: [...(prev[selectedTicketId] || []), dispatchedItem],
      }));

      setIsProcessing(false);
    }, 600);
  };

  // Handle Operator Rejecting Draft
  const handleRejectDraft = () => {
    setDrafts((prev) => {
      const copy = { ...prev };
      delete copy[selectedTicketId];
      return copy;
    });

    setTickets((prev) =>
      prev.map((t) =>
        t.ticket_id === selectedTicketId ? { ...t, status: 'investigating' } : t
      )
    );
  };

  // Handle Operator Sending Note / Public Reply
  const handleSendOperatorMessage = (text: string, isInternal: boolean) => {
    const newItem: TimelineItem = {
      id: `msg-op-${Date.now()}`,
      ticket_id: selectedTicketId,
      sender_type: 'operator',
      sender_name: 'Operator Desk',
      text,
      visibility: isInternal ? 'private' : 'public',
      created_at: 'Just now',
    };

    setTimelines((prev) => ({
      ...prev,
      [selectedTicketId]: [...(prev[selectedTicketId] || []), newItem],
    }));
  };

  // Handle Scenario Injection
  const handleTriggerScenario = (scenario: 'billing' | 'refund' | 'access') => {
    if (scenario === 'billing') {
      setSelectedTicketId('TKT-1001');
      setIsWidgetOpen(true);
    } else if (scenario === 'refund') {
      setSelectedTicketId('TKT-1002');
      setIsWidgetOpen(true);
    } else if (scenario === 'access') {
      setSelectedTicketId('TKT-1003');
      setIsWidgetOpen(true);
    }
  };

  const handleResyncCustomer = () => {
    if (activeTicket) {
      setCustomers((prev) => ({
        ...prev,
        [activeTicket.customer_id]: {
          ...prev[activeTicket.customer_id],
          plan: 'pro',
        },
      }));
      setTickets((prev) =>
        prev.map((t) =>
          t.ticket_id === activeTicket.ticket_id ? { ...t, discrepancy: false } : t
        )
      );
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d0e12] overflow-hidden select-none">
      {/* Top Navigation & Hackathon Control Bar */}
      <header className="h-12 bg-[#12131a] border-b border-neutral-800 px-4 flex items-center justify-between z-40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-blue-500 shadow-sm" />
            <span className="font-bold text-xs tracking-tight text-white uppercase font-mono">
              SupportFlow
            </span>
          </div>
          <span className="text-neutral-600">|</span>
          <span className="text-[11px] text-neutral-300 font-medium hidden sm:inline">
            Flip the Switch Hackathon · Track 1: Best Business Workflow
          </span>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center bg-[#181a24] p-0.5 rounded-[2px] border border-neutral-800 text-xs">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-[2px] transition-colors cursor-pointer ${
              viewMode === 'split'
                ? 'bg-blue-600 text-white font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split Demo View</span>
          </button>

          <button
            onClick={() => setViewMode('saas')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-[2px] transition-colors cursor-pointer ${
              viewMode === 'saas'
                ? 'bg-blue-600 text-white font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Customer SaaS App</span>
          </button>

          <button
            onClick={() => setViewMode('operator')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-[2px] transition-colors cursor-pointer ${
              viewMode === 'operator'
                ? 'bg-blue-600 text-white font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Operator Cockpit</span>
          </button>
        </div>

        {/* Connection & Telemetry Indicators */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Switch AI: 34079</span>
          </div>

          <div className="flex items-center gap-1.5 text-neutral-400">
            {wsConnected ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                <span>WS Live</span>
              </span>
            ) : (
              <span className="text-neutral-400 flex items-center gap-1">
                <Wifi className="w-3 h-3 text-blue-400" />
                <span>Standby</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Viewport Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Split View: Left side is Customer SaaS + Widget; Right side is Operator Cockpit */}
        {viewMode === 'split' && (
          <div className="flex h-full w-full divide-x divide-neutral-800">
            {/* Left Column: Customer Experience */}
            <div className="w-[42%] h-full flex flex-col bg-[#0d0e12] relative overflow-hidden">
              <div className="px-4 py-2 bg-[#15161f] border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                    Client View
                  </span>
                  <span className="text-xs text-neutral-300 font-medium">
                    CloudDesk & Embedded Widget
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Ghost-typing & instant customer feedback
                </span>
              </div>

              <div className="flex-1 overflow-y-auto relative p-4 flex flex-col items-center justify-center bg-neutral-950/40">
                <SupportWidget
                  embedded
                  tickets={tickets}
                  activeTicket={activeTicket}
                  timeline={activeTimeline}
                  draft={activeDraft}
                  isAgentTyping={isAgentTyping}
                  onSelectTicket={setSelectedTicketId}
                  onStartNewChat={() => setSelectedTicketId('TKT-1001')}
                  onSendMessage={handleSendMessage}
                  onTyping={handleTyping}
                  onTriggerScenario={handleTriggerScenario}
                />
              </div>
            </div>

            {/* Right Column: Operator Cockpit */}
            <div className="w-[58%] h-full flex flex-col overflow-hidden">
              <div className="px-4 py-2 bg-[#15161f] border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Operator Desk
                  </span>
                  <span className="text-xs text-neutral-300 font-medium">
                    Multi-Agent Room + Human Review Gate
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Mattermost #cloud-support
                </span>
              </div>

              <div className="flex-1 overflow-hidden">
                <DashboardLayout
                  tickets={tickets}
                  selectedTicketId={selectedTicketId}
                  activeTicket={activeTicket}
                  customer={activeCustomer}
                  timeline={activeTimeline}
                  draft={activeDraft}
                  agents={agents}
                  isProcessing={isProcessing}
                  customerTypingText={customerTypingText}
                  isCustomerTyping={isCustomerTyping}
                  onSelectTicket={setSelectedTicketId}
                  onApproveDraft={handleApproveDraft}
                  onRejectDraft={handleRejectDraft}
                  onSendOperatorMessage={handleSendOperatorMessage}
                  onResyncCustomer={handleResyncCustomer}
                />
              </div>
            </div>
          </div>
        )}

        {/* Full SaaS App with Floating Widget */}
        {viewMode === 'saas' && (
          <div className="h-full w-full relative overflow-y-auto">
            <CloudDeskDemo
              onOpenWidget={() => setIsWidgetOpen(true)}
              onSimulateTicket={handleTriggerScenario}
            />

            <SupportWidget
              isOpen={isWidgetOpen}
              onToggleOpen={() => setIsWidgetOpen(!isWidgetOpen)}
              tickets={tickets}
              activeTicket={activeTicket}
              timeline={activeTimeline}
              draft={activeDraft}
              isAgentTyping={isAgentTyping}
              onSelectTicket={setSelectedTicketId}
              onStartNewChat={() => setSelectedTicketId('TKT-1001')}
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              onTriggerScenario={handleTriggerScenario}
            />
          </div>
        )}

        {/* Full Operator Cockpit */}
        {viewMode === 'operator' && (
          <div className="h-full w-full">
            <DashboardLayout
              tickets={tickets}
              selectedTicketId={selectedTicketId}
              activeTicket={activeTicket}
              customer={activeCustomer}
              timeline={activeTimeline}
              draft={activeDraft}
              agents={agents}
              isProcessing={isProcessing}
              customerTypingText={customerTypingText}
              isCustomerTyping={isCustomerTyping}
              onSelectTicket={setSelectedTicketId}
              onApproveDraft={handleApproveDraft}
              onRejectDraft={handleRejectDraft}
              onSendOperatorMessage={handleSendOperatorMessage}
              onResyncCustomer={handleResyncCustomer}
            />
          </div>
        )}
      </div>
    </div>
  );
}