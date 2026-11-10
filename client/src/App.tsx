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
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
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
import { WelcomePage } from './pages/WelcomePage';
import type { Ticket, Customer, TimelineItem, DraftResponse, SwitchAgentState } from './types';

function AppShell() {
  const location = useLocation();
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  // Tickets & Swarm States (Connected to real FastAPI backend)
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [customers, setCustomers] = useState<Record<string, Customer>>({});
  const [timelines, setTimelines] = useState<Record<string, TimelineItem[]>>({});
  const [drafts, setDrafts] = useState<Record<string, DraftResponse>>({});
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

  // Load real data from FastAPI backend on mount
  useEffect(() => {
    let isMounted = true;

    async function loadBackendData() {
      try {
        const [ticketsRes, customersRes, draftsRes] = await Promise.all([
          fetch('http://localhost:8000/tickets'),
          fetch('http://localhost:8000/customers'),
          fetch('http://localhost:8000/drafts'),
        ]);

        if (!ticketsRes.ok) return;
        const backendTickets: any[] = await ticketsRes.json();
        if (!backendTickets || !backendTickets.length) return;

        const customerMap: Record<string, Customer> = {};
        if (customersRes.ok) {
          const allCust: Customer[] = await customersRes.json();
          for (const c of allCust) {
            customerMap[c.customer_id] = c;
          }
        }

        const draftMap: Record<string, DraftResponse> = {};
        if (draftsRes.ok) {
          const allDrafts: any[] = await draftsRes.json();
          for (const d of allDrafts) {
            draftMap[d.ticket_id] = {
              ticket_id: d.ticket_id,
              customer_name: customerMap[d.ticket_id]?.name || 'Alex Morgan',
              complaint_summary: 'Billing Discrepancy Protocol',
              proposed_response: d.draft_text || d.proposed_response || '',
              draft_text: d.draft_text || d.proposed_response || '',
              evidence_used: d.evidence_used || '',
              policy_references: d.policy_references || '',
              status: d.status === 'APPROVED' ? 'APPROVED' : 'PENDING_APPROVAL',
              approved_by: d.approver,
              approved_at: d.decided_at,
            };
          }
        }

        const timelineMap: Record<string, TimelineItem[]> = {};

        for (const t of backendTickets) {
          const customerObj = customerMap[t.customer_id];
          const isTkt1001 = t.ticket_id === 'TKT-1001';

          timelineMap[t.ticket_id] = [
            {
              id: `msg-${t.ticket_id}-1`,
              ticket_id: t.ticket_id,
              sender_type: 'customer',
              sender_name: customerObj?.name || 'Customer',
              text: t.message || t.complaint || t.subject,
              visibility: 'public',
              created_at: '10 mins ago',
            },
            ...(isTkt1001
              ? [
                  {
                    id: `tool-${t.ticket_id}-1`,
                    ticket_id: t.ticket_id,
                    sender_type: 'agent' as const,
                    sender_name: '@investigator',
                    text: 'Executing database customer lookup...',
                    visibility: 'private' as const,
                    created_at: '9 mins ago',
                    tool_call: {
                      name: 'lookup_customer',
                      params: { customer_id: t.customer_id },
                      result: {
                        customer_id: t.customer_id,
                        name: customerObj?.name || 'Alex Morgan',
                        plan: customerObj?.plan || 'free',
                        status: 'active',
                      },
                      status: 'completed' as const,
                    },
                  },
                  {
                    id: `tool-${t.ticket_id}-2`,
                    ticket_id: t.ticket_id,
                    sender_type: 'agent' as const,
                    sender_name: '@investigator',
                    text: 'Querying Stripe API for latest charges...',
                    visibility: 'private' as const,
                    created_at: '9 mins ago',
                    tool_call: {
                      name: 'check_stripe',
                      params: { email: customerObj?.email_masked || 'al***n@example.com' },
                      result: {
                        status: 'succeeded',
                        amount: customerObj?.payment_amount ? customerObj.payment_amount * 100 : 999,
                        currency: 'usd',
                        plan: customerObj?.expected_plan || 'pro',
                        charge_id: customerObj?.transaction_id || 'TXN-9001',
                        paid_at: customerObj?.payment_date || '2026-11-04',
                      },
                      status: 'completed' as const,
                    },
                  },
                  {
                    id: `msg-${t.ticket_id}-2`,
                    ticket_id: t.ticket_id,
                    sender_type: 'agent' as const,
                    sender_name: '@investigator',
                    text: 'DISCREPANCY DETECTED: Customer has valid active Pro subscription in payment ledger ($9.99), but internal database user record is still set to "free". Root cause: Webhook sync delay.',
                    visibility: 'private' as const,
                    created_at: '8 mins ago',
                  },
                  {
                    id: `msg-${t.ticket_id}-3`,
                    ticket_id: t.ticket_id,
                    sender_type: 'agent' as const,
                    sender_name: '@responder',
                    text: 'Grounding draft in Policy KB-001: Immediate sync required + proactive apology. Prepared resolution draft awaiting human authorization.',
                    visibility: 'private' as const,
                    created_at: '7 mins ago',
                  },
                ]
              : []),
          ];
        }

        const formattedTickets: Ticket[] = backendTickets.map((t) => {
          const c = customerMap[t.customer_id];
          return {
            ticket_id: t.ticket_id,
            customer_id: t.customer_id,
            customer_name: c?.name || (t.ticket_id === 'TKT-1001' ? 'Alex Morgan' : t.ticket_id === 'TKT-1002' ? 'Jamie Smith' : 'Taylor Lee'),
            customer_email: c?.email_masked || (t.ticket_id === 'TKT-1001' ? 'al***n@example.com' : t.ticket_id === 'TKT-1002' ? 'ja***h@example.com' : 'ta***e@example.com'),
            subject: t.subject,
            complaint: t.message || t.complaint || t.subject,
            plan: c?.plan || 'free',
            created_at: '10 mins ago',
            status: draftMap[t.ticket_id]?.status === 'APPROVED' ? 'resolved' : (t.ticket_id === 'TKT-1001' ? 'awaiting_approval' : 'investigating'),
            priority: t.priority || 'normal',
            category: t.category || 'General',
            discrepancy: c?.discrepancy_detected ?? (t.category === 'billing'),
          };
        });

        if (isMounted) {
          setTickets(formattedTickets);
          setCustomers(customerMap);
          setDrafts(draftMap);
          setTimelines(timelineMap);
          if (formattedTickets.length > 0) {
            setSelectedTicketId(formattedTickets[0].ticket_id);
          }
        }
      } catch (err) {
        console.error('Failed to load tickets from backend:', err);
      }
    }

    loadBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleApproveDraft = async (finalText: string) => {
    setIsProcessing(true);

    // Call backend API to record approval
    try {
      await fetch(`http://localhost:8000/drafts/${selectedTicketId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: selectedTicketId,
          decision: 'approve',
          approver: 'Operator Desk',
        }),
      });
    } catch (e) {
      console.warn('Backend approval dispatch sync warning:', e);
    }

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
            discrepancy_detected: false,
          },
        }));
      }

      const dispatchedItem: TimelineItem = {
        id: `msg-dispatched-${Date.now()}`,
        ticket_id: selectedTicketId,
        sender_type: 'operator',
        sender_name: 'SupportFlow Support (Human Verified)',
        text: finalText,
        visibility: 'public',
        created_at: 'Just now',
      };

      setTimelines((prev) => ({
        ...prev,
        [selectedTicketId]: [...(prev[selectedTicketId] || []), dispatchedItem],
      }));

      setIsProcessing(false);
    }, 400);
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
          discrepancy_detected: false,
          discrepancy_note: undefined,
        },
      }));
      setTickets((prev) =>
        prev.map((t) =>
          t.ticket_id === activeTicket.ticket_id ? { ...t, discrepancy: false } : t
        )
      );
    }
  };

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isFullscreenView =
    location.pathname.startsWith('/dashboard') ||
    location.pathname === '/split' ||
    location.pathname === '/welcome';

  return (
    <div className={`${isFullscreenView ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-[#0d0e12] text-neutral-100 flex flex-col font-sans select-none`}>
      <CommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
      />

      {/* Global Navbar - only rendered on public marketing/content pages; hidden in Cockpit */}
      {!isFullscreenView && (
        <Navbar
          onOpenCommandPalette={() => setCmdPaletteOpen(true)}
          wsConnected={wsConnected}
        />
      )}

      {/* Main View Router */}
      <div className={`flex-1 flex flex-col ${isFullscreenView ? 'h-screen overflow-hidden' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/welcome" element={<WelcomePage />} />

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
              <div className="flex-1 flex h-full overflow-hidden divide-x divide-white/[0.08]">
                <div className="w-[42%] h-full flex flex-col bg-[#0d0e12] relative overflow-hidden">
                  <div className="px-4 py-2.5 bg-[#0d0e12] border-b border-white/[0.08] flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#DF3E03] font-semibold">
                      Client View (CloudDesk)
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Ghost-typing WebSocket enabled
                    </span>
                  </div>
                  <div className="flex-1 p-4 flex flex-col items-center justify-center bg-[#090a0f]">
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
              <div className="flex-1 h-full w-full overflow-hidden">
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
      <ThemeProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}