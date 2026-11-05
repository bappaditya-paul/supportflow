import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Zap,
  Bot,
  Terminal,
  ArrowRight,
  Check,
  Copy,
  Eye,
  Lock,
  Layers,
  Sparkles,
  ExternalLink,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [replayStep, setReplayStep] = useState(0);

  const copyInstall = () => {
    navigator.clipboard?.writeText('npm i @supportflow/react');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const replaySteps = [
    {
      agent: 'Customer (CloudDesk)',
      role: 'Ticket Submitted',
      message: 'I paid for Pro yesterday, but my account dashboard still says Free and my API rate limit is locked.',
      badge: 'TKT-1001 · Urgent',
      badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800',
    },
    {
      agent: '@triager',
      role: 'Classification & Priority',
      message: 'Classified: BILLING_DISCREPANCY. Priority: HIGH. Urgency: 94%. Sentiment: Frustrated. Delegating verification to @investigator.',
      badge: 'Classification Complete',
      badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800',
    },
    {
      agent: '@investigator',
      role: 'Deterministic Verification',
      message: 'Executed: lookup_customer(CUST-001) & check_stripe(alex@example.com). Finding: Stripe reports $49.00 payment SUCCEEDED (ch_3P7a9), but Postgres database has plan="free". Root cause: Webhook sync delay.',
      badge: 'Discrepancy Verified',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800',
    },
    {
      agent: '@responder',
      role: 'Policy Grounding',
      message: 'Matched Policy KB-001 (Subscription Discrepancies). Drafted empathetic apology + immediate Pro entitlement restoration. Submitted to Human Review Gate.',
      badge: 'Draft Awaiting Sign-off',
      badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-800',
    },
    {
      agent: 'Human Support Lead',
      role: 'Governance & Dispatch',
      message: 'Verified findings in Stripe. Approved draft & executed instant DB sync. Customer notified and 600 req/min API quota unlocked in 85 seconds.',
      badge: 'Resolution Dispatched',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 max-w-6xl mx-auto w-full text-center">
        {/* Hackathon Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#161722] border border-blue-900/60 rounded-[2px] text-xs font-mono text-blue-400 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Flip the Switch Hackathon · Track 1: Best Business Workflow</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          AI Customer Support in Your Team Chat.
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-neutral-400 mt-2">
            Zero Hallucinations. Human Sign-Off.
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          SupportFlow turns your **Mattermost**, Slack, or Discord channels into an evidence-backed support room using **Switch AI**. Autonomous agents audit payments, verify databases with deterministic tools, and present grounded drafts for one-click human approval.
        </p>

        {/* Action Buttons & Terminal Snippet */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/demo"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-semibold rounded-[2px] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <span>Launch Live Sandbox</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/split"
            className="w-full sm:w-auto px-4 py-2.5 bg-[#171822] hover:bg-[#202230] text-neutral-200 border border-neutral-700 hover:border-neutral-600 text-xs font-mono rounded-[2px] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Split Demo View</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </Link>

          {/* Copyable NPM Snippet */}
          <div className="w-full sm:w-auto flex items-center bg-[#13141b] border border-neutral-800 rounded-[2px] px-3 py-1.5 text-xs font-mono text-neutral-300">
            <span className="text-neutral-500 mr-2">$</span>
            <span className="text-blue-300">npm i @supportflow/react</span>
            <button
              onClick={copyInstall}
              className="ml-3 p-1 hover:text-white transition-colors cursor-pointer text-neutral-500"
              title="Copy installation command"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Live Swarm Interactive Replay Showcase */}
        <div className="mt-14 p-5 bg-[#121319] border border-dashed border-neutral-800 rounded-[4px] text-left max-w-4xl mx-auto shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-800 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-neutral-200">
                Switch AI Swarm Replay: TKT-1001 (Billing Desync)
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[11px] text-neutral-400">
              <span>Step {replayStep + 1} of {replaySteps.length}</span>
              <div className="flex gap-1 ml-2">
                {replaySteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setReplayStep(idx)}
                    className={`w-5 h-5 rounded-[2px] font-mono text-[10px] flex items-center justify-center cursor-pointer transition-colors ${
                      replayStep === idx
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Step Card */}
          <div className="mt-4 p-4 bg-[#161722] border border-neutral-800 rounded-[2px] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-400">
                  {replaySteps[replayStep].agent}
                </span>
                <span className="text-neutral-500 text-xs">·</span>
                <span className="text-xs text-neutral-400 font-mono">
                  {replaySteps[replayStep].role}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-[2px] border ${replaySteps[replayStep].badgeColor}`}
              >
                {replaySteps[replayStep].badge}
              </span>
            </div>

            <p className="text-xs text-neutral-200 font-mono leading-relaxed bg-[#101116] p-3 rounded-[2px] border border-neutral-850">
              {replaySteps[replayStep].message}
            </p>

            <div className="mt-3 flex justify-between items-center text-[11px] font-mono text-neutral-500">
              <span>Zero PII exposed to external models</span>
              <button
                onClick={() => setReplayStep((prev) => (prev + 1) % replaySteps.length)}
                className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex items-center gap-1"
              >
                Next Step <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid: 4 Core Pillars */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full border-t border-dashed border-neutral-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
            Architectural Guarantees
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Engineered for High-Stakes Support Workflows
          </h3>
          <p className="text-xs text-neutral-400 mt-2">
            Why traditional chatbots fail in production, and how SupportFlow enforces rigor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-[#121319] border border-neutral-800 rounded-[2px] space-y-2.5">
            <div className="w-8 h-8 rounded-[2px] bg-blue-950/60 text-blue-400 border border-blue-800/60 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Zero Hallucinations</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Agents never invent facts or modify databases directly. They invoke deterministic, read-only Python scripts that audit Stripe and Postgres.
            </p>
          </div>

          <div className="p-5 bg-[#121319] border border-neutral-800 rounded-[2px] space-y-2.5">
            <div className="w-8 h-8 rounded-[2px] bg-amber-950/60 text-amber-400 border border-amber-800/60 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Live Ghost Typing</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Operators and triagers observe incoming customer keystrokes in real time over WebSockets before Enter is pressed, accelerating triage by 60%.
            </p>
          </div>

          <div className="p-5 bg-[#121319] border border-neutral-800 rounded-[2px] space-y-2.5">
            <div className="w-8 h-8 rounded-[2px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Human Review Gate</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No refund, tier upgrade, or response leaves the building without human sign-off. One click approves, edits, or rejects the prepared draft.
            </p>
          </div>

          <div className="p-5 bg-[#121319] border border-neutral-800 rounded-[2px] space-y-2.5">
            <div className="w-8 h-8 rounded-[2px] bg-purple-950/60 text-purple-400 border border-purple-800/60 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Native Team Chat</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Powered by Switch AI. Agents collaborate in Mattermost/Slack channels alongside your human engineers, sharing context seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Live SLA Metrics Banner */}
      <section className="py-12 bg-[#101116] border-y border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold font-mono text-white">&lt; 15s</div>
              <div className="text-xs text-neutral-400 mt-1 font-mono uppercase">Initial Swarm Triage</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono text-emerald-400">100%</div>
              <div className="text-xs text-neutral-400 mt-1 font-mono uppercase">Human Sign-off Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono text-blue-400">0</div>
              <div className="text-xs text-neutral-400 mt-1 font-mono uppercase">Hallucinated Refunds</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-mono text-white">2px</div>
              <div className="text-xs text-neutral-400 mt-1 font-mono uppercase">Cossistant Brutalism</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-4xl font-bold text-white">
          Deploy Your Autonomous Support Swarm Today.
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
          Built for the Flip the Switch Hackathon 2026. Free and open source to run locally in Docker with Switch AI.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-[2px] transition-all cursor-pointer shadow-md"
          >
            Open Operator Desk
          </Link>
          <Link
            to="/docs"
            className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded-[2px] transition-colors cursor-pointer"
          >
            Explore Integration Docs
          </Link>
        </div>
      </section>
    </div>
  );
};