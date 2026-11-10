import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  BookOpen,
  Terminal,
  Code2,
  Copy,
  Check,
  ChevronRight,
  Shield,
  Bot,
  ExternalLink,
  Search,
  Sparkles,
  ArrowRight,
  Layers,
  FileText,
  Sliders,
  Cpu,
} from 'lucide-react';
import { MaskLogo } from '../components/primitives';

type DocSection = 'intro' | 'quickstart' | 'component' | 'theme' | 'switch' | 'tools' | 'api';

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSection>('quickstart');
  const [pkgManager, setPkgManager] = useState<'bun' | 'pnpm' | 'npm' | 'yarn'>('bun');
  const [copied, setCopied] = useState(false);
  const [copiedPage, setCopiedPage] = useState(false);

  const installCmds: Record<string, string> = {
    bun: 'bunx --bun shadcn@latest add @supportflow/widget',
    pnpm: 'pnpm dlx shadcn@latest add @supportflow/widget',
    npm: 'npx shadcn@latest add @supportflow/widget',
    yarn: 'npx shadcn@latest add @supportflow/widget',
  };

  const copyText = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyPageUrl = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedPage(true);
    setTimeout(() => setCopiedPage(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-[#0d0e12] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans select-none overflow-x-hidden transition-colors">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="border-b border-white/[0.08] bg-white/[0.02] px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#DF3E03] text-white font-mono text-[10px] font-bold rounded-[3px]">
              v0.3.0 NEW
            </span>
            <span className="text-neutral-300 font-mono">
              Smaller bundles, Switch AI multi-agent swarm & Mattermost bridge →
            </span>
          </div>

          <button
            type="button"
            onClick={copyPageUrl}
            aria-label="Copy page link"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-[3px] text-[11px] font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer shadow-xs"
          >
            {copiedPage ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedPage ? 'Copied link' : 'Copy page'}</span>
          </button>
        </div>
      </div>

      {/* 2. THREE-COLUMN FUMADOCS LAYOUT */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col lg:flex-row gap-8">
        {/* Left Column: Hierarchical Topic Tree */}
        <aside className="w-full lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-6 lg:pb-0 lg:pr-6 text-xs">
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Getting Started
              </div>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveSection('intro')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                      activeSection === 'intro'
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                    }`}
                  >
                    Introduction
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('quickstart')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                      activeSection === 'quickstart'
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                    }`}
                  >
                    Quickstart (React / Next.js)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Customer Component
              </div>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveSection('component')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                      activeSection === 'component'
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                    }`}
                  >
                    &lt;Support /&gt; Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('theme')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                      activeSection === 'theme'
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                    }`}
                  >
                    Theme & OKLCH Styling
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Switch AI & Mattermost
              </div>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveSection('switch')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                      activeSection === 'switch'
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                    }`}
                  >
                    Room Swarm Template
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('tools')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                      activeSection === 'tools'
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                    }`}
                  >
                    Deterministic CLI Tools
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Reference
              </div>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveSection('api')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                      activeSection === 'api'
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                    }`}
                  >
                    FastAPI & WebSockets
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Center Column: Documentation Content */}
        <main className="flex-1 max-w-3xl space-y-8">
          {activeSection === 'intro' && (
            <article className="space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#DF3E03] dark:text-[#FF6633] tracking-wider font-semibold">
                  Overview
                </span>
                <h1 className="text-3xl font-bold text-neutral-950 dark:text-neutral-50 mt-1 tracking-tight">
                  What is SupportFlow?
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                  SupportFlow is an open-source autonomous customer support engineering teammate. Unlike traditional chatbots that hallucinate policies and guess database states, SupportFlow uses deterministic tools to verify facts, integrates natively with Mattermost, and enforces mandatory human sign-off gates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px]">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1">
                    Zero Hallucinations
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Python inspection tools query live Stripe events and Postgres databases before any reply is proposed.
                  </p>
                </div>

                <div className="p-4 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px]">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1">
                    Mattermost Team Sync
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Customer queries broadcast directly into your team's <code className="font-mono text-blue-500">#cloud-support</code> channel with 2-way operator messaging.
                  </p>
                </div>
              </div>
            </article>
          )}

          {activeSection === 'quickstart' && (
            <article className="space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#DF3E03] dark:text-[#FF6633] tracking-wider font-semibold">
                  Quickstart Guide
                </span>
                <h1 className="text-3xl font-bold text-neutral-950 dark:text-neutral-50 mt-1 tracking-tight">
                  Integrate SupportFlow in Under 10 Lines of Code
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                  SupportFlow distributes its drop-in widget through the shadcn CLI registry. Install with a single command and import the component into your React or Next.js app.
                </p>
              </div>

              {/* Package Manager Selector & Install Snippet */}
              <div className="border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#111218] rounded-[2px] overflow-hidden shadow-xs">
                <div className="flex items-center justify-between px-3 py-2 border-b border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono">
                  <div className="flex gap-1">
                    {(['bun', 'pnpm', 'npm', 'yarn'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setPkgManager(m)}
                        className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                          pkgManager === m
                            ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold'
                            : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => copyText(installCmds[pkgManager])}
                    className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-950 dark:hover:text-white cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3.5 text-xs font-mono text-[#DF3E03] dark:text-[#FF7744] overflow-x-auto bg-[#0a0a0c]">
                  <code>{installCmds[pkgManager]}</code>
                </pre>
              </div>

              {/* Code Integration Example */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Embed in Next.js App Router (`app/layout.tsx`)
                </h3>
                <div className="border border-dashed border-neutral-300 dark:border-neutral-800 bg-[#0a0a0c] rounded-[2px] overflow-hidden text-neutral-200">
                  <div className="px-3 py-1.5 border-b border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                    <span>app/layout.tsx</span>
                    <span className="text-neutral-500">React 19 / TypeScript</span>
                  </div>
                  <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto">
{`import { Support } from "@supportflow/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* SupportFlow Floating Widget */}
        <Support
          websiteId="ws_cloud_desk_01"
          mattermostChannel="#cloud-support"
          engine="switch-ai-v2"
          theme={{ radius: "2px", accent: "#DF3E03" }}
        />
      </body>
    </html>
  );
}`}
                  </pre>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-dashed border-emerald-300 dark:border-emerald-800/60 rounded-[2px] text-xs space-y-1">
                <div className="font-bold text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  Live Keystroke Ghost Typing Enabled
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                  The widget automatically broadcasts live customer keystrokes over low-latency WebSockets (<code className="font-mono text-emerald-600">ws://localhost:8000/ws</code>) so your operators can read and prepare context before the customer finishes typing.
                </p>
              </div>
            </article>
          )}

          {activeSection === 'component' && (
            <article className="space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#DF3E03] dark:text-[#FF6633] tracking-wider font-semibold">
                  Component API
                </span>
                <h1 className="text-3xl font-bold text-neutral-950 dark:text-neutral-50 mt-1 tracking-tight">
                  &lt;Support /&gt; Component Reference
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  Comprehensive specification of available props, hooks, and default configurations.
                </p>
              </div>

              <div className="border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px] overflow-hidden bg-white dark:bg-[#111218]">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-500 font-mono">
                      <th className="p-3">Prop</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Default</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed divide-neutral-200 dark:divide-neutral-800 font-mono text-[11px]">
                    <tr>
                      <td className="p-3 text-[#DF3E03] dark:text-[#FF6633] font-bold">websiteId</td>
                      <td className="p-3 text-neutral-500">string</td>
                      <td className="p-3 text-neutral-400">required</td>
                      <td className="p-3 font-sans text-neutral-700 dark:text-neutral-300">Your organization or website identifier.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-[#DF3E03] dark:text-[#FF6633] font-bold">mattermostChannel</td>
                      <td className="p-3 text-neutral-500">string</td>
                      <td className="p-3 text-neutral-400">#cloud-support</td>
                      <td className="p-3 font-sans text-neutral-700 dark:text-neutral-300">Mattermost channel to sync live tickets into.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-[#DF3E03] dark:text-[#FF6633] font-bold">zeroHallucinationPolicy</td>
                      <td className="p-3 text-neutral-500">boolean</td>
                      <td className="p-3 text-neutral-400">true</td>
                      <td className="p-3 font-sans text-neutral-700 dark:text-neutral-300">Enforces tool-grounded facts before replying.</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-[#DF3E03] dark:text-[#FF6633] font-bold">embedded</td>
                      <td className="p-3 text-neutral-500">boolean</td>
                      <td className="p-3 text-neutral-400">false</td>
                      <td className="p-3 font-sans text-neutral-700 dark:text-neutral-300">Renders inline in parent container instead of floating bottom-right.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {activeSection === 'theme' && (
            <article className="space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#DF3E03] dark:text-[#FF6633] tracking-wider font-semibold">
                  Styling & Tokens
                </span>
                <h1 className="text-3xl font-bold text-neutral-950 dark:text-neutral-50 mt-1 tracking-tight">
                  Theme & OKLCH Color Tokens
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  SupportFlow adopts Cossistant's 2px minimal utilitarian border radius and Tailwind CSS v4 OKLCH token model.
                </p>
              </div>

              <div className="border border-dashed border-neutral-300 dark:border-neutral-800 bg-[#0a0a0c] rounded-[2px] p-4 text-neutral-200 font-mono text-xs overflow-x-auto">
{`:root {
  --radius: 2px;
  --background: oklch(99% 0 0);          /* #FCFCFC Crisp Ivory Canvas */
  --foreground: oklch(14.5% 0 0);        /* Deep Obsidian Text */
  --cossistant-orange: hsla(19, 99%, 44%, 1);   /* #DF3E03 */
  --cossistant-green: hsla(156, 86%, 40%, 1);   /* #0EB86D */
}`}
              </div>
            </article>
          )}

          {activeSection === 'switch' && (
            <article className="space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#DF3E03] dark:text-[#FF6633] tracking-wider font-semibold">
                  Multi-Agent Specification
                </span>
                <h1 className="text-3xl font-bold text-neutral-950 dark:text-neutral-50 mt-1 tracking-tight">
                  Switch AI Room Template
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  Configured in <code className="font-mono text-neutral-900 dark:text-white">supportflow-room.template.yaml</code> for local Switch AI instances on port 34079.
                </p>
              </div>

              <div className="border border-dashed border-neutral-300 dark:border-neutral-800 bg-[#0a0a0c] rounded-[2px] p-4 text-neutral-200 font-mono text-xs overflow-x-auto">
{`room:
  name: "cloud-support"
  bridge: "mattermost"
  agents:
    - name: "@triager"
      role: "Urgency and sentiment classifier"
    - name: "@investigator"
      role: "Deterministic Stripe & DB verifier"
    - name: "@responder"
      role: "Policy grounder and draft composer"
  governance:
    human_approval_required: true`}
              </div>
            </article>
          )}

          {activeSection === 'tools' && (
            <article className="space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#DF3E03] dark:text-[#FF6633] tracking-wider font-semibold">
                  Verification Scripts
                </span>
                <h1 className="text-3xl font-bold text-neutral-950 dark:text-neutral-50 mt-1 tracking-tight">
                  Deterministic CLI Tools
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  Located in <code className="font-mono text-neutral-900 dark:text-white">server/scripts/</code> and called by the @investigator agent.
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px]">
                  <span className="text-[#DF3E03] dark:text-[#FF7744] font-bold">
                    $ python scripts/lookup_customer.py --id CUS-501
                  </span>
                  <p className="text-xs text-neutral-500 mt-1 font-sans">
                    Returns verified subscription tier, masking email and PII.
                  </p>
                </div>

                <div className="p-3.5 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    $ python scripts/search_knowledge.py --query "billing discrepancy"
                  </span>
                  <p className="text-xs text-neutral-500 mt-1 font-sans">
                    Matches official company policies from <code className="font-mono">server/data/knowledge_base/</code>.
                  </p>
                </div>
              </div>
            </article>
          )}

          {activeSection === 'api' && (
            <article className="space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#DF3E03] dark:text-[#FF6633] tracking-wider font-semibold">
                  Backend API
                </span>
                <h1 className="text-3xl font-bold text-neutral-950 dark:text-neutral-50 mt-1 tracking-tight">
                  FastAPI REST & WebSocket Endpoints
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  Running on <code className="font-mono text-neutral-900 dark:text-white">http://localhost:8000</code>.
                </p>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px] flex justify-between items-center">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">GET /health</span>
                  <span className="text-neutral-500 text-[11px]">Service health & Switch node</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px] flex justify-between items-center">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">GET /tickets</span>
                  <span className="text-neutral-500 text-[11px]">List active support tickets</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px] flex justify-between items-center">
                  <span className="text-[#DF3E03] dark:text-[#FF6633] font-bold">POST /drafts/&#123;id&#125;/approve</span>
                  <span className="text-neutral-500 text-[11px]">Human operator dispatch</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#111218] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px] flex justify-between items-center">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">WS /ws</span>
                  <span className="text-neutral-500 text-[11px]">Live keystroke ghost typing</span>
                </div>
              </div>
            </article>
          )}
        </main>

        {/* Right Aside: "On This Page" Table of Contents */}
        <aside className="hidden xl:block w-48 shrink-0 text-xs">
          <div className="sticky top-24 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
              On this page
            </span>
            <ul className="space-y-2 text-neutral-500 font-sans">
              <li className="hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors">
                • Overview
              </li>
              <li className="hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors">
                • Installation
              </li>
              <li className="hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors">
                • Drop-in Usage
              </li>
              <li className="hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors">
                • Ghost Typing
              </li>
              <li className="hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors">
                • Human Review Gate
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};
