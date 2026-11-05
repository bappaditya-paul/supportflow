import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Navbar,
} from './components/Navbar';
import {
  Footer,
} from './components/Footer';
import {
  CommandPalette,
} from './components/CommandPalette';
import { LandingPage } from './pages/LandingPage';
import { PricingPage } from './pages/PricingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DocsPage } from './pages/DocsPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { BlogPage } from './pages/BlogPage';
import { CloudDeskDemo } from './demo/CloudDeskDemo';
import { SupportWidget } from './widget/SupportWidget';
import { DashboardLayout } from './dashboard/DashboardLayout';
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
    proposed_response: `Hi Alex,\n\nThank you for reaching out and alerting us to this!\n\nWe investigated our payment gateway records and verified that your $49 Pro payment was processed successfully. Due to a momentary webhook delivery delay, your database record was not immediately updated.\n\nWe have now manually synchronized your account to Pro and unlocked your API quota to 600 req/min. You have full access to all Pro features right now.\n\nWe apologize for the friction and wish you great success with your product launch tomorrow! Please let us know if there is anything else we can do to support your launch.`,
    status: 'PENDING_APPROVAL',
  },
};

function AppShell() {
  const location = useLocation();
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  // Tickets & Swarm States
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('TKT-1001');
  const [customers, setCustomers] = useState<Record<string, Customer>>(INITIAL_CUSTOMERS);
  const [timelines, setTimelines] = useState<Record<string, TimelineItem[]>>(INITIAL_TIMELINES);
  const [drafts, setDrafts] = useState<Record<string, DraftResponse>>(INITIAL_DRAFTS);
  const [isProcessing, setIsProcessing] = useState(false);

  // Widget States
  const [isWidgetOpen, setIsWidgetOpen] = useState(true);
  const [customerTypingText, setCustomerTypingText] = useState('');
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // WebSocket Connection
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const [agents, setAgents] = useState<SwitchAgentState[]>([
    { name: '@triager', role: 'Classifier', status: 'idle' },
    { name: '@investigator', role: 'Deterministic Tools', status: 'idle' },
    { name: '@responder', role: 'Draft Composer', status: 'idle' },
  ]);

  const activeTicket = tickets.find((t) => t.ticket_id === selectedTicketId) || null;
  const activeCustomer = activeTicket ? customers[activeTicket.customer_id] || null : null;
  const activeTimeline = timelines[selectedTicketId] || [];
  const activeDraft = drafts[selectedTicketId] || null;

  // Initialize WebSocket
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket('ws://localhost:8000/ws');
      ws.onopen = () => setWsConnected(true);
      ws.onclose = () => setWsConnected(false);
      ws.onerror = () => setWsConnected(false);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'GHOST_TYPING') {
            setCustomerTypingText(data.text);
            setIsCustomerTyping(data.is_typing);
          }
        } catch (e) {
          console.error(e);
        }
      };
      wsRef.current = ws;
    } catch {
      setWsConnected(false);
    }

    return () => {
      if (ws) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        } else if (ws.readyState === WebSocket.CONNECTING) {
          ws.onopen = () => {
            ws?.close();
          };
        }
      }
    };
  }, []);

  const handleTyping = (text: string, isTyping: boolean) => {
    setCustomerTypingText(text);
    setIsCustomerTyping(isTyping);

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
  };

  const handleApproveDraft = (finalText: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const approvedAt = new Date().toLocaleTimeString();

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

      setTickets((prev) =>
        prev.map((t) =>
          t.ticket_id === selectedTicketId
            ? { ...t, status: 'resolved', discrepancy: false }
            : t
        )
      );

      if (activeTicket) {
        setCustomers((prev) => ({
          ...prev,
          [activeTicket.customer_id]: {
            ...prev[activeTicket.customer_id],
            plan: 'pro',
          },
        }));
      }

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
    }, 500);
  };

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

  const handleTriggerScenario = (scenario: 'billing' | 'refund' | 'access') => {
    if (scenario === 'billing') setSelectedTicketId('TKT-1001');
    if (scenario === 'refund') setSelectedTicketId('TKT-1002');
    if (scenario === 'access') setSelectedTicketId('TKT-1003');
    setIsWidgetOpen(true);
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

  const isFullscreenView = location.pathname.startsWith('/dashboard') || location.pathname === '/split';

  return (
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 flex flex-col font-sans select-none">
      <CommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
      />

      {/* Global Navbar */}
      <Navbar
        onOpenCommandPalette={() => setCmdPaletteOpen(true)}
        wsConnected={wsConnected}
      />

      {/* Main View Router */}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/blog" element={<BlogPage />} />

          {/* Sandbox Demo Page with Floating Support Widget */}
          <Route
            path="/demo"
            element={
              <div className="flex-1 relative overflow-y-auto">
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
            }
          />

          {/* Split Demo View (Client on Left, Operator Desk on Right) */}
          <Route
            path="/split"
            element={
              <div className="flex-1 flex h-[calc(100vh-48px)] overflow-hidden divide-x divide-neutral-800">
                <div className="w-[42%] h-full flex flex-col bg-[#0d0e12] relative overflow-hidden">
                  <div className="px-4 py-2 bg-[#15161f] border-b border-neutral-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">
                      Client View (CloudDesk)
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Ghost-typing WebSocket enabled
                    </span>
                  </div>
                  <div className="flex-1 p-4 flex flex-col items-center justify-center bg-neutral-950/40">
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

                <div className="w-[58%] h-full flex flex-col overflow-hidden">
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
                    compact={true}
                  />
                </div>
              </div>
            }
          />

          {/* Operator Cockpit Fullscreen */}
          <Route
            path="/dashboard/*"
            element={
              <div className="flex-1 h-[calc(100vh-48px)] overflow-hidden">
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
            }
          />
        </Routes>
      </div>

      {/* Footer on non-fullscreen views */}
      {!isFullscreenView && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}