import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Copy,
  Check,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';
import { MaskLogo } from './primitives';
import { ThemeToggle } from './ThemeToggle';

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard?.writeText('bunx --bun shadcn@latest add @supportflow/widget');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full relative border-t border-white/[0.08] bg-[#090a0f] text-neutral-400 text-xs select-none transition-colors overflow-hidden">
      {/* Subtle Ambient Radial Highlight */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[160px] pointer-events-none opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(223,62,3,0.3) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-12">
        {/* Top Product Banner Callout with clean hairline border */}
        <div className="mb-12 p-4 sm:p-5 rounded-[4px] border border-white/[0.08] bg-[#121319]/80 backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[4px] bg-[#DF3E03]/10 border border-[#DF3E03]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#DF3E03]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-xs">
                  SupportFlow Enterprise Swarm
                </span>
                <span className="px-1.5 py-0.5 bg-[#DF3E03]/10 text-[#DF3E03] text-[10px] font-mono rounded-[3px] border border-[#DF3E03]/25">
                  Powered by Switch AI
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Autonomous tri-agent swarm connected to Switch AI node 34079 with Human Review Gate.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:self-auto self-stretch">
            <Link
              to="/dashboard"
              className="px-3.5 py-1.5 bg-[#DF3E03] hover:bg-[#f0490c] text-white rounded-[4px] text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Launch Cockpit</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/split"
              className="px-3.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 border border-white/[0.08] rounded-[4px] text-xs font-mono transition-colors"
            >
              Split View
            </Link>
          </div>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-12">
          {/* Brand & Mission Column (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group cursor-pointer text-white">
              <MaskLogo size={22} className="text-white group-hover:scale-105 transition-transform" />
              <span className="font-bold text-sm tracking-tight text-white">
                supportflow
              </span>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Autonomous, evidence-backed customer support engineering teammate. Embedded in <strong>Mattermost</strong> and orchestrated by <strong>Switch AI</strong>, enforcing deterministic tool verification and mandatory human authorization.
            </p>

            {/* Quick Copy Registry Box */}
            <div className="pt-1 max-w-xs">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#121319] border border-white/[0.08] rounded-[4px] font-mono text-[11px] text-neutral-300 shadow-xs">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[#DF3E03]">$</span>
                  <span className="truncate">bunx --bun shadcn add @supportflow</span>
                </div>
                <button
                  type="button"
                  onClick={copyCommand}
                  className="ml-2 p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
                  aria-label="Copy shadcn installation command"
                  title="Copy command"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Live Infrastructure Node Indicators */}
            <div className="space-y-1.5 pt-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-950/20 border border-emerald-500/20 rounded-[3px] text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
                <span>Switch AI Local Node: 34079 · #cloud-support</span>
              </div>
            </div>
          </div>

          {/* Nav Columns (7 Cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Product */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-200 font-semibold">
                Product
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/dashboard" className="hover:text-white transition-colors flex items-center gap-1 group">
                    <span>Operator Cockpit</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#DF3E03]" />
                  </Link>
                </li>
                <li>
                  <Link to="/split" className="hover:text-white transition-colors flex items-center gap-1 group">
                    <span>Split Demo View</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#DF3E03]" />
                  </Link>
                </li>
                <li>
                  <Link to="/demo" className="hover:text-white transition-colors flex items-center gap-1 group">
                    <span>Live Sandbox</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#DF3E03]" />
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span>Pricing & Plans</span>
                  </Link>
                </li>
                <li>
                  <Link to="/changelog" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span>Changelog</span>
                    <span className="px-1.5 py-0.2 bg-white/[0.06] text-neutral-300 text-[10px] font-mono rounded-[2px]">v0.3.0</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Developers */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-200 font-semibold">
                Developers
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/docs" className="hover:text-white transition-colors flex items-center gap-1 group">
                    <span>Documentation</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#DF3E03]" />
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/sandbox-quantum/switch"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span>Switch AI Core</span>
                    <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" />
                  </a>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-white transition-colors flex items-center gap-1 group">
                    <span>Engineering Blog</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#DF3E03]" />
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="hover:text-white transition-colors">
                    React 19 & Next.js SDK
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Access */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-200 font-semibold">
                Quick Access
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/login" className="hover:text-white transition-colors flex items-center gap-1 font-medium text-[#DF3E03]">
                    <Zap className="w-3 h-3" />
                    <span>Demo Login</span>
                  </Link>
                </li>
                <li>
                  <Link to="/welcome" className="hover:text-white transition-colors">
                    Onboard Website
                  </Link>
                </li>
                <li>
                  <span className="text-[11px] font-mono text-neutral-500">
                    Track 1: Business Workflow
                  </span>
                </li>
                <li>
                  <span className="text-[11px] font-mono text-neutral-500">
                    Judge Ready · Zero Setup
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-neutral-300">SupportFlow</span>
            <span>·</span>
            <span>Built with Switch AI, Mattermost & FastAPI</span>
            <span>·</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              All Systems Operational
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-neutral-400">
            <span>Zero Hallucinations Guarantee</span>
            <span>·</span>
            <span>100% Human Governance Gate</span>
            <span>·</span>
            <ThemeToggle variant="segmented" />
          </div>
        </div>
      </div>
    </footer>
  );
};
