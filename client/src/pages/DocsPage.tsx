import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'quickstart' | 'widget' | 'switch' | 'tools' | 'api'>('quickstart');
  const [pkgManager, setPkgManager] = useState<'npm' | 'pnpm' | 'yarn' | 'bun'>('pnpm');
  const [copied, setCopied] = useState(false);

  const installCmds: Record<string, string> = {
    pnpm: 'pnpm add @supportflow/react',
    npm: 'npm install @supportflow/react',
    yarn: 'yarn add @supportflow/react',
    bun: 'bun add @supportflow/react',
  };

  const copyText = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 flex flex-col font-sans select-none">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col md:flex-row gap-8">
        {/* Left Column: Documentation Navigation Tree */}
        <aside className="w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-neutral-800 pb-6 md:pb-0 md:pr-6">
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Getting Started
              </div>
              <ul className="space-y-1 text-xs">
                <li>
                  <button
                    onClick={() => setActiveSection('quickstart')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                      activeSection === 'quickstart'
                        ? 'bg-blue-600/15 text-blue-400 font-medium'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Quickstart Guide
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('widget')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                      activeSection === 'widget'
                        ? 'bg-blue-600/15 text-blue-400 font-medium'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    &lt;SupportWidget /&gt; React SDK
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Switch AI Swarm
              </div>
              <ul className="space-y-1 text-xs">
                <li>
                  <button
                    onClick={() => setActiveSection('switch')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                      activeSection === 'switch'
                        ? 'bg-blue-600/15 text-blue-400 font-medium'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Room Templates & Setup
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('tools')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                      activeSection === 'tools'
                        ? 'bg-blue-600/15 text-blue-400 font-medium'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Deterministic CLI Tools
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Reference
              </div>
              <ul className="space-y-1 text-xs">
                <li>
                  <button
                    onClick={() => setActiveSection('api')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                      activeSection === 'api'
                        ? 'bg-blue-600/15 text-blue-400 font-medium'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    FastAPI REST & WebSockets
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Center Column: Documentation Content */}
        <main className="flex-1 max-w-3xl space-y-8">
          {activeSection === 'quickstart' && (
            <article className="space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase text-blue-400 tracking-wider font-semibold">
                  Getting Started
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Quickstart: Embed SupportFlow in React
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                  SupportFlow provides a lightweight React widget component styled with Cossistant brutalist design tokens (`--radius: 2px`) that connects directly to your Switch AI multi-agent backend.
                </p>
              </div>

              {/* Package Manager Selector & Install Snippet */}
              <div className="border border-neutral-800 bg-[#121319] rounded-[2px] overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 bg-[#161722] text-xs font-mono">
                  <div className="flex gap-1">
                    {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setPkgManager(m)}
                        className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                          pkgManager === m
                            ? 'bg-neutral-800 text-white font-bold'
                            : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => copyText(installCmds[pkgManager])}
                    className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 text-xs font-mono text-neutral-200 overflow-x-auto">
                  {installCmds[pkgManager]}
                </pre>
              </div>

              {/* Embedding Code Example */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">Add to Next.js App Router or Vite</h3>
                <div className="border border-neutral-800 bg-[#121319] rounded-[2px] overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-neutral-800 bg-[#161722] text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                    <span>app/layout.tsx</span>
                  </div>
                  <pre className="p-3 text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
{`import { SupportWidget } from '@supportflow/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* SupportFlow Floating Widget */}
        <SupportWidget 
          endpoint="http://localhost:8000"
          wsEndpoint="ws://localhost:8000/ws"
          defaultCustomer={{
            id: 'CUST-001',
            name: 'Alex Rivera',
            email: 'alex.rivera@example.com'
          }}
        />
      </body>
    </html>
  );
}`}
                  </pre>
                </div>
              </div>

              <div className="p-4 bg-[#14151e] border border-blue-900/60 rounded-[2px] text-xs space-y-1">
                <div className="font-bold text-blue-400 font-mono flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  Live Keystroke Ghost Typing
                </div>
                <p className="text-neutral-300 leading-relaxed font-sans">
                  The widget automatically broadcasts live keystroke events over WebSocket before the customer submits. Operators in the cockpit view what the customer is typing in real time.
                </p>
              </div>
            </article>
          )}

          {activeSection === 'widget' && (
            <article className="space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase text-blue-400 tracking-wider font-semibold">
                  Component Reference
                </span>
                <h1 className="text-2xl font-bold text-white mt-1">
                  &lt;SupportWidget /&gt; Component API
                </h1>
                <p className="text-xs text-neutral-400 mt-2">
                  Configurable props and event hooks for the customer-facing widget.
                </p>
              </div>

              <div className="border border-neutral-800 rounded-[2px] overflow-hidden bg-[#121319]">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-[#161722] text-neutral-400 font-mono">
                      <th className="p-2.5">Prop</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Default</th>
                      <th className="p-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850 font-mono text-[11px]">
                    <tr>
                      <td className="p-2.5 text-blue-400 font-bold">embedded</td>
                      <td className="p-2.5 text-neutral-300">boolean</td>
                      <td className="p-2.5 text-neutral-500">false</td>
                      <td className="p-2.5 font-sans text-neutral-400">Renders inline in container instead of floating bottom-right.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-blue-400 font-bold">endpoint</td>
                      <td className="p-2.5 text-neutral-300">string</td>
                      <td className="p-2.5 text-neutral-500">localhost:8000</td>
                      <td className="p-2.5 font-sans text-neutral-400">FastAPI backend URL for ticket submission.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-blue-400 font-bold">wsEndpoint</td>
                      <td className="p-2.5 text-neutral-300">string</td>
                      <td className="p-2.5 text-neutral-500">ws://localhost:8000/ws</td>
                      <td className="p-2.5 font-sans text-neutral-400">WebSocket URL for ghost typing and real-time updates.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {activeSection === 'switch' && (
            <article className="space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase text-blue-400 tracking-wider font-semibold">
                  Switch AI Multi-Agent Architecture
                </span>
                <h1 className="text-2xl font-bold text-white mt-1">
                  Team Room Specification: supportflow-room.template.yaml
                </h1>
                <p className="text-xs text-neutral-400 mt-2">
                  How Switch AI launches the 3 autonomous agents in Mattermost:
                </p>
              </div>

              <div className="border border-neutral-800 bg-[#121319] rounded-[2px] overflow-hidden">
                <pre className="p-3 text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
{`room:
  name: "cloud-support"
  bridge: "mattermost"
  agents:
    - name: "@triager"
      provider: "codex"
      role: "Urgency and category classifier"
    - name: "@investigator"
      provider: "codex"
      role: "Deterministic Stripe & DB verifier"
    - name: "@responder"
      provider: "codex"
      role: "Policy grounder and draft composer"
  governance:
    human_approval_required: true`}
                </pre>
              </div>
            </article>
          )}

          {activeSection === 'tools' && (
            <article className="space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase text-blue-400 tracking-wider font-semibold">
                  Zero Hallucinations Engine
                </span>
                <h1 className="text-2xl font-bold text-white mt-1">
                  Deterministic CLI Tools
                </h1>
                <p className="text-xs text-neutral-400 mt-2">
                  Agents do not hallucinate records. They execute read-only Python scripts in `server/scripts/`:
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#13141c] border border-neutral-800 rounded-[2px]">
                  <span className="text-blue-400 font-bold">$ python scripts/lookup_customer.py --id CUST-001</span>
                  <p className="text-[11px] text-neutral-400 mt-1 font-sans">
                    Returns verified account metadata, masking email and sensitive PII.
                  </p>
                </div>

                <div className="p-3 bg-[#13141c] border border-neutral-800 rounded-[2px]">
                  <span className="text-emerald-400 font-bold">$ python scripts/search_knowledge.py --query "billing"</span>
                  <p className="text-[11px] text-neutral-400 mt-1 font-sans">
                    Matches official company policies from `server/data/knowledge_base/`.
                  </p>
                </div>
              </div>
            </article>
          )}

          {activeSection === 'api' && (
            <article className="space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase text-blue-400 tracking-wider font-semibold">
                  API Specification
                </span>
                <h1 className="text-2xl font-bold text-white mt-1">
                  FastAPI REST & WebSocket Endpoints
                </h1>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 bg-[#14151e] border border-neutral-800 rounded-[2px] flex justify-between">
                  <span className="text-emerald-400">GET /health</span>
                  <span className="text-neutral-500">Service health & Switch node status</span>
                </div>
                <div className="p-2.5 bg-[#14151e] border border-neutral-800 rounded-[2px] flex justify-between">
                  <span className="text-emerald-400">GET /tickets</span>
                  <span className="text-neutral-500">List all active support tickets</span>
                </div>
                <div className="p-2.5 bg-[#14151e] border border-neutral-800 rounded-[2px] flex justify-between">
                  <span className="text-blue-400">POST /drafts/&#123;id&#125;/approve</span>
                  <span className="text-neutral-500">Human operator sign-off dispatch</span>
                </div>
                <div className="p-2.5 bg-[#14151e] border border-neutral-800 rounded-[2px] flex justify-between">
                  <span className="text-purple-400">WS /ws</span>
                  <span className="text-neutral-500">Live ghost typing & ticket stream</span>
                </div>
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
};