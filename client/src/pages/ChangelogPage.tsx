import React from 'react';
import { motion } from 'motion/react';
import { GitCommit, Tag, Sparkles, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';
import { HeatmapCalendar, MaskLogo } from '../components/primitives';

interface ReleaseEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  highlights: string[];
  codeSnippet?: string;
  badge?: string;
}

const RELEASES: ReleaseEntry[] = [
  {
    version: '0.3.0',
    date: 'November 5, 2026',
    title: 'Switch AI Multi-Agent Engine & Mattermost 2-Way Sync',
    description:
      'Major release introducing native multi-agent triage swarms powered by Switch AI, real-time Mattermost channel bridging, and deterministic tool execution to eliminate hallucinated support replies.',
    highlights: [
      'Switch AI integration running on port 34079 for autonomous triaging, investigation, and policy grounding.',
      'Bidirectional Mattermost bridge: customer tickets stream directly into #cloud-support with operator thread sync.',
      'Zero-Hallucination verification gate: deterministic Python tools inspect Stripe charges and database entitlements.',
      'Shadcn CLI registry distribution for 1-command component installation.',
    ],
    codeSnippet: `// Drop-in React 19 widget with Switch AI & Mattermost
import { Support } from "@supportflow/react";

<Support
  websiteId="org_7c9f21ab"
  mattermostChannel="#cloud-support"
  engine="switch-ai-v2"
  zeroHallucinationPolicy={true}
/>`,
    badge: 'LATEST',
  },
  {
    version: '0.2.8',
    date: 'October 24, 2026',
    title: 'Real-time WebSocket Ghost Typing & PII Masking',
    description:
      'SupportFlow now streams customer keystrokes over low-latency WebSockets directly to the operator cockpit before Enter is pressed, reducing average time-to-resolution by 40%.',
    highlights: [
      'Sub-50ms keystroke streaming over /ws endpoint with amber pulsating operator indicator.',
      'Deterministic customer PII masking for credit cards, SSNs, and passwords.',
      'Operator Quick-Draft drawer with policy KB-001 grounding.',
      'Sound notification alerts for incoming urgent tickets.',
    ],
  },
  {
    version: '0.2.1',
    date: 'September 18, 2026',
    title: 'Generative Facehash Avatars & Mac Window Frames',
    description:
      'Added open-source generative Facehash avatars and modern linear macOS browser frames for sleek, developer-friendly marketing and dashboard surfaces.',
    highlights: [
      'Deterministic SVG Facehash generator supporting 6 pastel palettes and dynamic eye/mouth expressions.',
      'Interactive Mac browser preview window with traffic lights and address bar lock pill.',
      'Light and Dark mode synchronisation with Tailwind CSS v4 OKLCH tokens.',
    ],
  },
  {
    version: '0.1.0',
    date: 'August 10, 2026',
    title: 'Initial Alpha Release: SupportFlow Foundation',
    description:
      'The foundation of SupportFlow: an open-source customer support platform designed specifically for developer-founders shipping SaaS products.',
    highlights: [
      'Core <Support /> widget container with Radix UI slots.',
      'FastAPI backend with SQLite and PostgreSQL adapters.',
      'Initial human-in-the-loop review architecture.',
    ],
  },
];

export const ChangelogPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 flex flex-col font-sans select-none overflow-x-hidden transition-colors">
      <div className="pt-16 sm:pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium tracking-tight text-[#DF3E03] mb-4 border border-white/[0.08] rounded-[3px] bg-white/[0.03]"
          >
            <span>[Product Changelog]</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white [text-wrap:balance]">
            Changelog
          </h1>
          <p className="mt-3 text-sm text-neutral-400 font-mono">
            We're shipping a lot: 1,157 commits and 159 PRs in the past year.
          </p>
        </div>

        {/* Commit Heatmap Grid */}
        <div className="mb-16">
          <HeatmapCalendar totalCommits={1157} totalPRs={159} />
        </div>

        {/* Release Timeline Feed */}
        <div className="space-y-8">
          {RELEASES.map((rel, idx) => (
            <motion.article
              key={rel.version}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              className="border border-white/[0.08] bg-[#121319] rounded-[4px] p-6 sm:p-8 shadow-xs"
            >
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 bg-white text-neutral-950 font-mono text-xs font-bold rounded-[3px]">
                    v{rel.version}
                  </span>
                  {rel.badge && (
                    <span className="px-2 py-0.5 bg-[#DF3E03] text-white font-mono text-[10px] font-bold rounded-[3px]">
                      {rel.badge}
                    </span>
                  )}
                  <span className="text-xs text-neutral-400 font-mono">
                    {rel.date}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
                {rel.title}
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6 font-sans">
                {rel.description}
              </p>

              {/* Highlights List */}
              <div className="space-y-2 mb-6">
                {rel.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-300 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Code Snippet if present */}
              {rel.codeSnippet && (
                <div className="p-4 bg-[#090a0f] text-neutral-200 rounded-[4px] font-mono text-xs border border-white/[0.08] overflow-x-auto">
                  <div className="text-[10px] text-neutral-500 mb-2 font-mono">// Quickstart Usage</div>
                  <pre>
                    <code>{rel.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

