import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Zap,
  Bot,
  Terminal,
  ArrowRight,
  Check,
  Copy,
  Layers,
  Sparkles,
  ExternalLink,
  Activity,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Code2,
  Eye,
  MessageSquare,
  Users,
  ChevronRight,
  Lock,
} from 'lucide-react';
import {
  MaskLogo,
  FacehashAvatar,
  MacBrowserFrame,
  FrameworkPills,
} from '../components/primitives';

interface DemoTicket {
  id: string;
  name: string;
  seed: string;
  subject: string;
  preview: string;
  time: string;
  category: string;
  status: 'awaiting_approval' | 'investigating' | 'resolved';
  badgeColor: string;
  customerQuery: string;
  toolCall: {
    fn: string;
    output: string;
    finding: string;
  };
  draftReply: string;
}

const DEMO_TICKETS: DemoTicket[] = [
  {
    id: 'TKT-1001',
    name: 'Pieter Levels',
    seed: 'pieter',
    subject: 'Stripe webhook race condition on Pro plan upgrade',
    preview: "Paid $49 yesterday, dashboard still says Free tier and API rate limit locked...",
    time: '10m ago',
    category: 'Billing Discrepancy',
    status: 'awaiting_approval',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    customerQuery:
      "I paid for Pro yesterday via Stripe ($49), but my account dashboard still says Free tier and my API rate limit is locked at 60 req/min. Can someone fix this ASAP? We have a product launch tomorrow.",
    toolCall: {
      fn: 'lookup_customer("CUST-001") & check_stripe("pieter@levels.io")',
      output: 'Stripe: charge_3P7a9 $49.00 SUCCEEDED · DB: plan="free"',
      finding: 'Discrepancy confirmed: Webhook delivery delayed by 42 mins. Payment is valid.',
    },
    draftReply:
      "Hi Pieter, we verified your $49 payment (ch_3P7a9) in Stripe. Our webhook experienced a sync delay. I've manually restored your Pro entitlement and your 600 req/min API quota is now active immediately.",
  },
  {
    id: 'TKT-1002',
    name: 'Marc Louvion',
    seed: 'marc',
    subject: 'Emergency concurrency limit increase for load test',
    preview: "Conducting load test on staging cluster tonight. Need node limit bumped...",
    time: '24m ago',
    category: 'Quota Increase',
    status: 'investigating',
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    customerQuery:
      "We are conducting a load test on our staging cluster tonight. We need our concurrent node limit bumped from 20 to 50 nodes for the next 48 hours.",
    toolCall: {
      fn: 'check_organization_tier("ORG-MARC") & query_cluster_capacity()',
      output: 'Org Tier: Enterprise (Active) · Cluster Availability: 72% idle headroom',
      finding: 'Eligible for temporary 48h surge grant under Enterprise SLA §4.2.',
    },
    draftReply:
      "Hi Marc, your Enterprise agreement includes 48-hour temporary load-test surges. I've scheduled your cluster quota to 50 concurrent nodes until Nov 8, 00:00 UTC.",
  },
  {
    id: 'TKT-1003',
    name: 'Nico Jeannen',
    seed: 'nico',
    subject: 'Where to configure SP-initiated SAML 2.0 certs?',
    preview: "Setting up Okta SAML 2.0 for our 45 engineers. Where is the ACS URL?",
    time: '1h ago',
    category: 'Authentication / SSO',
    status: 'resolved',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    customerQuery:
      "Setting up enterprise SSO for our team. Does SupportFlow support SP-initiated SAML and where can I find the ACS URL and cert?",
    toolCall: {
      fn: 'search_knowledge_base("SAML 2.0 Okta ACS URL certificate")',
      output: 'Matched Doc: /docs/enterprise/sso (Confidence: 0.98)',
      finding: 'ACS URL: https://api.supportflow.ai/auth/saml/callback · Metadata XML exported.',
    },
    draftReply:
      "Hi Nico, SupportFlow supports SP-initiated SAML 2.0. Your Assertion Consumer Service (ACS) URL is https://api.supportflow.ai/auth/saml/callback and the metadata XML is downloadable in Settings > Security > SAML.",
  },
  {
    id: 'TKT-1004',
    name: 'Lucas Mouilleron',
    seed: 'lucas',
    subject: 'Mattermost bot webhook sync to #cloud-support',
    preview: "Can we route incoming VIP tickets straight to our Mattermost channel?",
    time: '2h ago',
    category: 'Integration',
    status: 'resolved',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    customerQuery:
      "Can we route incoming VIP tickets straight into our private Mattermost channel #cloud-support so our core on-call engineers see real-time updates?",
    toolCall: {
      fn: 'test_mattermost_channel_webhook("#cloud-support")',
      output: 'HTTP 200 OK · Channel ID: ch_mattermost_cloud_support',
      finding: 'Mattermost bot integration verified and active with 2-way thread sync.',
    },
    draftReply:
      "Hi Lucas! Yes, SupportFlow syncs natively with Mattermost. Any ticket flagged as VIP or High Urgency posts into #cloud-support with full tool traces and single-click approval.",
  },
];

const COMMUNITY_USERS = [
  { name: 'Pieter Levels', role: 'Founder, NomadList', seed: 'pieter' },
  { name: 'Marc Louvion', role: 'Founder, ShipFast', seed: 'marc' },
  { name: 'Nico Jeannen', role: 'Founder, MakeLanding', seed: 'nico' },
  { name: 'Guillermo Rauch', role: 'CEO, Vercel', seed: 'rauch' },
  { name: 'Kent C. Dodds', role: 'Educator, EpicWeb', seed: 'kent' },
  { name: 'Lee Robinson', role: 'VP, Developer Experience', seed: 'leerob' },
  { name: 'Lucas Mouilleron', role: 'Creator, Cossistant', seed: 'lucas' },
  { name: 'Alex Rivera', role: 'Lead Architect', seed: 'alex' },
];

export const LandingPage: React.FC = () => {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('TKT-1001');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [pillMode, setPillMode] = useState<'inbox' | 'conversation'>('inbox');
  const [replayStep, setReplayStep] = useState<number>(0);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const selectedTicket = DEMO_TICKETS.find((t) => t.id === selectedTicketId) || DEMO_TICKETS[0];

  const copyInstall = () => {
    navigator.clipboard?.writeText('bunx --bun shadcn@latest add @supportflow/widget');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const replaySteps = [
    {
      agent: 'Customer (Alex Rivera)',
      role: 'Ticket Submitted',
      message: 'I paid for Pro yesterday, but my account dashboard still says Free and my API rate limit is locked.',
      badge: 'TKT-1001 · Urgent',
      badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
      faceSeed: 'alex',
    },
    {
      agent: '@triager',
      role: 'Classification & Priority',
      message: 'Classified: BILLING_DISCREPANCY. Priority: HIGH. Urgency: 94%. Sentiment: Frustrated. Delegating verification to @investigator.',
      badge: 'Classification Complete',
      badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      faceSeed: 'triager-agent',
    },
    {
      agent: '@investigator',
      role: 'Deterministic Verification',
      message: 'Executed: lookup_customer(CUST-001) & check_stripe(alex@example.com). Finding: Stripe reports $49.00 payment SUCCEEDED (ch_3P7a9), but Postgres database has plan="free". Root cause: Webhook sync delay.',
      badge: 'Discrepancy Verified',
      badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      faceSeed: 'investigator-agent',
    },
    {
      agent: '@responder',
      role: 'Policy Grounding',
      message: 'Matched Policy KB-001 (Subscription Discrepancies). Drafted empathetic apology + immediate Pro entitlement restoration. Submitted to Human Review Gate.',
      badge: 'Draft Awaiting Sign-off',
      badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
      faceSeed: 'responder-agent',
    },
    {
      agent: 'Human Support Lead',
      role: 'Governance & Dispatch',
      message: 'Verified findings in Stripe. Approved draft & executed instant DB sync. Customer notified and 600 req/min API quota unlocked in 85 seconds.',
      badge: 'Resolution Dispatched',
      badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
      faceSeed: 'operator-lead',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-[#0d0e12] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans select-none overflow-x-hidden transition-colors">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto w-full text-center">
        {/* Signature Orange Bracket Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium tracking-tight text-[#DF3E03] dark:text-[#FF6633] mb-6 border border-dashed border-[#DF3E03]/30 dark:border-[#FF6633]/30 bg-[#DF3E03]/5 dark:bg-[#DF3E03]/10 rounded-[2px]"
        >
          <span>[AI agent team member that learns from you, not a chatbot]</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 max-w-4xl mx-auto leading-[1.08]"
        >
          AI Agent Customer Support for Your SaaS in Under 10 Lines of Code
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed"
        >
          An autonomous support teammate connected to <strong>Mattermost</strong> & <strong>Switch AI</strong>. Runs deterministic tools to verify databases and Stripe payments, eliminating hallucinations with human-in-the-loop sign-off.
        </motion.p>

        {/* Call to Actions & Code Snippet */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/docs"
            className="w-full sm:w-auto px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-xs font-medium rounded-[2px] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <span>Install SupportFlow now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/split"
            className="w-full sm:w-auto px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-800 text-xs font-mono rounded-[2px] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Live Split Demo</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </Link>

          {/* Copyable Terminal Registry Snippet */}
          <div className="w-full sm:w-auto flex items-center bg-white dark:bg-[#13141b] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px] px-3 py-1.5 text-xs font-mono text-neutral-800 dark:text-neutral-300 shadow-sm">
            <span className="text-neutral-400 mr-2">$</span>
            <span className="text-[#DF3E03] dark:text-[#FF7744]">bunx --bun shadcn@latest add @supportflow/widget</span>
            <button
              onClick={copyInstall}
              className="ml-3 p-1 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer text-neutral-400"
              title="Copy installation command"
            >
              {copiedInstall ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. MAC BROWSER PREVIEW WINDOW (Cossistant Signature) */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto w-full mb-16">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Live Simulation · Connected to Switch AI</span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-neutral-200/60 dark:bg-neutral-900/90 p-0.5 rounded-[2px] border border-neutral-300 dark:border-neutral-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-[2px] transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs font-medium'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-[2px] transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs font-medium'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>
          </div>
        </div>

        <MacBrowserFrame
          url="https://supportflow.ai/shadcn/inbox"
          className="shadow-2xl border-neutral-200 dark:border-neutral-800"
        >
          {activeTab === 'preview' ? (
            <div className="flex flex-col lg:flex-row h-[520px] bg-white dark:bg-[#111218] divide-y lg:divide-y-0 lg:divide-x divide-dashed divide-neutral-200 dark:divide-neutral-800 text-xs">
              {/* Left Sub-Nav Column */}
              <div className="w-full lg:w-44 p-3 bg-neutral-50/50 dark:bg-neutral-950/40 flex flex-col gap-3 font-mono">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    Mailbox
                  </span>
                  <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded-[2px] text-neutral-700 dark:text-neutral-300 font-bold">
                    10
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="px-2 py-1.5 bg-neutral-200/80 dark:bg-neutral-800/80 rounded-[2px] font-medium text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
                    <span>Inbox</span>
                    <span className="text-[10px] text-neutral-500">4</span>
                  </div>
                  <div className="px-2 py-1.5 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 rounded-[2px] flex items-center justify-between">
                    <span>Resolved</span>
                    <span className="text-[10px] text-neutral-400">24</span>
                  </div>
                  <div className="px-2 py-1.5 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 rounded-[2px] flex items-center justify-between">
                    <span>Spam</span>
                    <span className="text-[10px] text-neutral-400">0</span>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-800 text-[10px]">
                  <span className="text-neutral-400 uppercase tracking-wider block mb-1">
                    Autonomous Agents
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>@triager</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>@investigator</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span>@responder</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Ticket List Column */}
              <div className="w-full lg:w-72 divide-y divide-dashed divide-neutral-200 dark:divide-neutral-800 overflow-y-auto">
                {DEMO_TICKETS.map((ticket) => {
                  const isSelected = ticket.id === selectedTicketId;
                  return (
                    <button
                      key={ticket.id}
                      onClick={() => {
                        setSelectedTicketId(ticket.id);
                        setIsApproved(false);
                      }}
                      className={`w-full text-left p-3 transition-colors cursor-pointer flex gap-3 items-start ${
                        isSelected
                          ? 'bg-neutral-100 dark:bg-neutral-800/60 border-l-2 border-[#DF3E03]'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/40'
                      }`}
                    >
                      <FacehashAvatar seed={ticket.seed} size={32} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                            {ticket.name}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                            {ticket.time}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium truncate mb-1">
                          {ticket.subject}
                        </p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                          {ticket.preview}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Active Conversation View */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto bg-neutral-50/20 dark:bg-neutral-950/20">
                <div className="space-y-4">
                  {/* Thread Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-2.5">
                      <FacehashAvatar seed={selectedTicket.seed} size={28} />
                      <div>
                        <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                          {selectedTicket.name}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          {selectedTicket.id} · {selectedTicket.category}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono border rounded-[2px] ${selectedTicket.badgeColor}`}
                    >
                      {selectedTicket.status}
                    </span>
                  </div>

                  {/* Customer Message Bubble */}
                  <div className="flex gap-2.5 items-start">
                    <FacehashAvatar seed={selectedTicket.seed} size={24} />
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2px] p-3 max-w-lg shadow-xs">
                      <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
                        {selectedTicket.customerQuery}
                      </p>
                    </div>
                  </div>

                  {/* Autonomous Tool Execution Trace */}
                  <div className="ml-8 border border-dashed border-amber-300 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/20 rounded-[2px] p-2.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 font-semibold mb-1">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Tool Invocation: @investigator</span>
                      </div>
                      <span className="text-[10px] text-amber-600 dark:text-amber-500">
                        Zero-Hallucination Gate
                      </span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      <code>$ {selectedTicket.toolCall.fn}</code>
                    </p>
                    <p className="text-neutral-500 text-[10px] mt-1">
                      Result: {selectedTicket.toolCall.output}
                    </p>
                    <div className="mt-1.5 pt-1 border-t border-dashed border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 font-medium">
                      Finding: {selectedTicket.toolCall.finding}
                    </div>
                  </div>

                  {/* AI Agent Draft Reply */}
                  <div className="flex gap-2.5 items-start">
                    <div className="size-6 rounded-[2px] bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center shrink-0">
                      <MaskLogo size={14} className="text-white dark:text-neutral-900" />
                    </div>
                    <div className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2px] p-3 shadow-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono text-neutral-400">
                          AI Draft (Grounded via KB-001)
                        </span>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">
                          Awaiting Operator Sign-off
                        </span>
                      </div>
                      <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
                        {selectedTicket.draftReply}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Human Review Gate Dispatch Bar */}
                <div className="mt-4 pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Human-in-the-loop Gate: Requires Lead Signature</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isApproved ? (
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-[2px] text-xs font-mono flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Dispatched to Customer & Stripe Synced</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setIsApproved(true)}
                        className="px-3 py-1 bg-[#DF3E03] hover:bg-[#c93702] text-white text-xs font-medium rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Dispatch</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Syntax Highlighted React Integration Tab */
            <div className="p-6 bg-[#0a0a0c] text-neutral-200 font-mono text-xs leading-relaxed overflow-x-auto min-h-[520px]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800 text-neutral-400">
                <span>components/CustomerSupport.tsx</span>
                <span className="text-[10px] text-neutral-500">React 19 / Next.js 15 App Router</span>
              </div>
              <pre className="text-xs">
                <code>{`// 1. Install via shadcn registry:
// $ bunx --bun shadcn@latest add @supportflow/widget

import { Support } from "@supportflow/react";

export function CustomerSupportWidget() {
  return (
    <Support
      // Connect to your organization and Mattermost bridge
      websiteId="org_7c9f21ab"
      mattermostChannel="#cloud-support"
      
      // Autonomous agent settings
      engine="switch-ai-v2"
      zeroHallucinationPolicy={true}
      humanSignOffGate={true}
      
      // Theme tokens matching Cossistant 2px minimal geometry
      theme={{
        radius: "2px",
        accent: "#DF3E03",
        mode: "auto",
      }}
    />
  );
}`}</code>
              </pre>
            </div>
          )}
        </MacBrowserFrame>

        {/* Framework Compatibility Row & Mode Pills */}
        <div className="mt-6">
          <FrameworkPills mode={pillMode} onModeChange={setPillMode} />
        </div>
      </section>

      {/* 3. COMMUNITY FACEHASHES BANNER */}
      <section className="py-12 border-y border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-6">
            Engineered for founders & support engineering teams worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {COMMUNITY_USERS.map((user) => (
              <div key={user.name} className="flex items-center gap-2.5">
                <FacehashAvatar seed={user.seed} size={36} showStatus status="online" />
                <div className="text-left">
                  <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    {user.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE SWARM WORKFLOW STEPPER */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#DF3E03] dark:text-[#FF6633] mb-3">
            <span>[Autonomous Multi-Agent Architecture]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            How SupportFlow Resolves Tickets in 85 Seconds
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Every customer inquiry flows through an auditable multi-agent swarm connected via Switch AI.
          </p>
        </div>

        {/* Swarm Stepper Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
          {replaySteps.map((step, idx) => {
            const isCurrent = idx === replayStep;
            return (
              <button
                key={step.agent}
                onClick={() => setReplayStep(idx)}
                className={`p-3 text-left border rounded-[2px] transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-[#DF3E03] bg-white dark:bg-neutral-900 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-neutral-500">
                    0{idx + 1}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-[#DF3E03]' : 'bg-neutral-400'}`} />
                </div>
                <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                  {step.agent}
                </div>
                <div className="text-[10px] text-neutral-500 truncate">
                  {step.role}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Visualizer Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={replayStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="p-6 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px] shadow-sm"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-dashed border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <FacehashAvatar seed={replaySteps[replayStep].faceSeed} size={36} />
                <div>
                  <div className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <span>{replaySteps[replayStep].agent}</span>
                    <span className="text-xs font-normal text-neutral-500 font-mono">
                      ({replaySteps[replayStep].role})
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    Step {replayStep + 1} of {replaySteps.length} · Switch AI Swarm Protocol
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 text-xs font-mono border rounded-[2px] ${replaySteps[replayStep].badgeColor}`}
                >
                  {replaySteps[replayStep].badge}
                </span>

                <button
                  onClick={() => setReplayStep((prev) => (prev + 1) % replaySteps.length)}
                  className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-medium rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                {replaySteps[replayStep].message}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 5. BLUEPRINT BENTO FEATURE GRID */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#DF3E03] dark:text-[#FF6633] mb-3">
            <span>[Core System Capabilities]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Engineered to Never Hallucinate Customer Data
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="p-6 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px]">
            <div className="size-8 rounded-[2px] bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Zero Hallucinations Engine
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              LLMs cannot guess account status. SupportFlow requires deterministic Python tools to inspect live Stripe events and Postgres records before any response is generated.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px]">
            <div className="size-8 rounded-[2px] bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Mattermost Channel Sync
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Bridges customer conversations directly into your existing <code className="text-blue-500 font-mono">#cloud-support</code> Mattermost channel with two-way operator message synchronization.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px]">
            <div className="size-8 rounded-[2px] bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Switch AI Engine
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Powered by Switch AI's multi-agent protocol running locally or on cloud infrastructure for sub-second agent routing, sentiment triage, and policy grounding.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px]">
            <div className="size-8 rounded-[2px] bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Human Sign-Off Gate
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Sensitive mutations like refunds, database plan synchronization, and rate quota increases remain gated behind 1-click human operator approval.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px]">
            <div className="size-8 rounded-[2px] bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Under 10 Lines of Code
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Install via shadcn CLI and drop the <code className="text-[#DF3E03] font-mono">&lt;Support /&gt;</code> component into your Next.js, Vite, or Remix application in under 3 minutes.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px]">
            <div className="size-8 rounded-[2px] bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Generative Facehash Avatars
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Deterministic SVG avatars generate unique pastel portraits and expressions for every customer, maintaining a warm, approachable brand aesthetic.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER BANNER */}
      <section className="py-20 px-4 sm:px-6 border-t border-dashed border-neutral-200 dark:border-neutral-800 text-center bg-neutral-50/50 dark:bg-neutral-950/50">
        <div className="max-w-3xl mx-auto">
          <MaskLogo size={36} className="mx-auto mb-4 text-neutral-900 dark:text-white" />
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Ready to Automate Customer Support Without Hallucinations?
          </h2>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Get started today. Free for up to 100 conversations per month, self-hostable with Docker, and 100% open-source.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#DF3E03] hover:bg-[#c93702] text-white text-xs font-semibold rounded-[2px] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium rounded-[2px] transition-colors cursor-pointer"
            >
              <span>View Pricing Matrix</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
