import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Shield, Network, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-dashed border-neutral-800 bg-[#0d0e12] text-neutral-400 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-[3px] bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                SF
              </div>
              <span className="font-bold text-sm tracking-tight text-white uppercase font-mono">
                SupportFlow
              </span>
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed max-w-sm">
              Autonomous, evidence-backed AI customer support desk running inside your team chat via Switch AI. Enforcing strict deterministic tool verification and mandatory human sign-off.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Switch AI Local Node: 34079</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-semibold">
              Product
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li><Link to="/demo" className="hover:text-white transition-colors">Live Sandbox</Link></li>
              <li><Link to="/split" className="hover:text-white transition-colors">Split Demo View</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing & Tiers</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Operator Cockpit</Link></li>
            </ul>
          </div>

          {/* Developers & Docs */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-semibold">
              Developers
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><a href="https://github.com/sandbox-quantum/switch" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Switch AI Core</a></li>
              <li><Link to="/docs" className="hover:text-white transition-colors">React Widget SDK</Link></li>
              <li><Link to="/docs" className="hover:text-white transition-colors">Mattermost Bridge</Link></li>
            </ul>
          </div>

          {/* Hackathon & Legal */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-semibold">
              Hackathon
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li><span className="text-blue-400 font-medium">Flip the Switch 2026</span></li>
              <li><span className="text-neutral-500">Track 1: Business Workflow</span></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neutral-850 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500 font-mono">
          <div>
            Built with Switch AI, Mattermost, FastAPI & Cossistant Brutalist Design Tokens.
          </div>
          <div className="flex items-center gap-4">
            <span>--radius: 2px</span>
            <span>•</span>
            <span>Zero Hallucinations</span>
            <span>•</span>
            <span>100% Human Governance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
