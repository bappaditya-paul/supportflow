import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  Shield,
  Copy,
  Check,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Cpu,
  GitBranch,
  Layers,
  Activity,
  Zap,
} from 'lucide-react';
import { MaskLogo, GlassKeycap } from './primitives';

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard?.writeText('bunx --bun shadcn@latest add @supportflow/widget');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full relative border-t border-dashed border-neutral-300 dark:border-neutral-800 bg-[#FCFCFC] dark:bg-[#090a0e] text-neutral-600 dark:text-neutral-400 text-xs select-none transition-colors overflow-hidden">
      {/* Subtle Ambient Radial Highlight */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[160px] pointer-events-none opacity-40 dark:opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(223,62,3,0.25) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        {/* Top Hackathon Banner Callout */}
        <div className="mb-12 p-4 sm:p-5 rounded-[2px] border border-dashed border-[#DF3E03]/30 dark:border-[#DF3E03]/30 bg-neutral-50/80 dark:bg-[#12131b]/90 backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[2px] bg-[#DF3E03]/10 dark:bg-[#DF3E03]/15 border border-[#DF3E03]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#DF3E03]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900 dark:text-white text-xs">
                  Flip the Switch Hackathon 2026
                </span>
                <span className="px-1.5 py-0.2 bg-[#DF3E03]/10 text-[#DF3E03] text-[9px] font-mono rounded-[2px] border border-[#DF3E03]/20">
                  Track 1: Business Workflow
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Evaluator Cockpit with 1-click personas pre-loaded for instant review.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:self-auto self-stretch">
            <Link
              to="/dashboard"
              className="px-3.5 py-1.5 bg-[#DF3E03] hover:bg-[#b53202] text-white rounded-[2px] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Launch Cockpit Demo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/split"
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-[2px] text-xs font-mono transition-colors"
            >
              Split View
            </Link>
          </div>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-14">
          {/* Brand & Mission Column (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group cursor-pointer text-neutral-950 dark:text-white">
              <MaskLogo size={24} className="text-neutral-900 dark:text-white group-hover:scale-105 transition-transform" />
              <span className="font-bold text-base tracking-tight text-neutral-950 dark:text-white">
                supportflow
              </span>
            </Link>

            <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
              Autonomous, evidence-backed customer support engineering teammate. Embedded in <strong>Mattermost</strong> and orchestrated by <strong>Switch AI</strong>, enforcing deterministic tool verification and mandatory human authorization.
            </p>

            {/* Quick Copy Registry Box (OriginKit Pattern) */}
            <div className="pt-2 max-w-xs">
              <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-100 dark:bg-[#12131a] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px] font-mono text-[11px] text-neutral-700 dark:text-neutral-300 shadow-xs">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[#DF3E03] dark:text-[#FF7744]">$</span>
                  <span className="truncate">bunx --bun shadcn add @supportflow</span>
                </div>
                <button
                  onClick={copyCommand}
                  className="ml-2 p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Copy shadcn install command"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Live Infrastructure Node Indicators */}
            <div className="space-y-1.5 pt-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-[2px] text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Switch AI Local Node: 34079 · Mattermost #cloud-support</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500 pl-1">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-500" />
                  FastAPI Bridge: 12ms
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-400" />
                  Human Gate: Active
                </span>
              </div>
            </div>
          </div>

          {/* Nav Columns (7 Cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Product */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-950 dark:text-neutral-200 font-bold">
                Product
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/dashboard" className="hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-1 group">
                    <span>Operator Cockpit</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#DF3E03]" />
                  </Link>
                </li>
                <li>
                  <Link to="/split" className="hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-1 group">
                    <span>Split Demo View</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#DF3E03]" />
                  </Link>
                </li>
                <li>
                  <Link to="/demo" className="hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-1 group">
                    <span>Live Sandbox</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#DF3E03]" />
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span>Pricing & Matrix</span>
                    <span className="px-1.5 py-0.2 bg-[#DF3E03]/10 text-[#DF3E03] text-[9px] font-mono rounded-[2px]">56% OFF</span>
                  </Link>
                </li>
                <li>
                  <Link to="/changelog" className="hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span>Changelog</span>
                    <span className="px-1.5 py-0.2 bg-neutral-200 dark:bg-neutral-800 text-[9px] font-mono rounded-[2px]">v0.3.0</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Developers */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-950 dark:text-neutral-200 font-bold">
                Developers
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/docs" className="hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-1 group">
                    <span>Documentation Hub</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#DF3E03]" />
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/sandbox-quantum/switch"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span>Switch AI Core</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                  </a>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-1 group">
                    <span>Engineering Blog</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#DF3E03]" />
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                    React 19 & Next.js SDK
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                    FastAPI WebSocket API
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Hackathon & Demo Access */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-950 dark:text-neutral-200 font-bold">
                Quick Access
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/login" className="hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-1 font-semibold text-[#DF3E03]">
                    <Zap className="w-3 h-3" />
                    <span>1-Click Demo Login</span>
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                    Create Demo Workspace
                  </Link>
                </li>
                <li>
                  <span className="text-neutral-500 font-mono text-[11px]">
                    Track 1: Business Workflow
                  </span>
                </li>
                <li>
                  <a
                    href="https://cossistant.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors text-[11px] font-mono flex items-center gap-1"
                  >
                    <span>Cossistant Design Standard</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>
                  <span className="text-[10px] font-mono text-neutral-500">
                    Judge Ready · Zero Setup
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: System Telemetry & Architecture Badges */}
        <div className="pt-8 border-t border-dashed border-neutral-300 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              SupportFlow
            </span>
            <span>·</span>
            <span>Built with Switch AI, Mattermost & FastAPI</span>
            <span>·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              All Systems Operational
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-neutral-400">
            <span className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2px] text-neutral-700 dark:text-neutral-300">
              --radius: 2px
            </span>
            <span>·</span>
            <span className="text-neutral-600 dark:text-neutral-400">
              Zero Hallucinations Guarantee
            </span>
            <span>·</span>
            <span className="text-neutral-600 dark:text-neutral-400">
              100% Human Governance Gate
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
