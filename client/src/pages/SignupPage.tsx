import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Mail,
  Lock,
  User,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [fullName, setFullName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex@clouddesk.dev');
  const [subdomain, setSubdomain] = useState('clouddesk');
  const [chatBridge, setChatBridge] = useState<'mattermost' | 'slack' | 'discord'>('mattermost');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 flex flex-col justify-center py-12 px-4 sm:px-6 select-none">
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 border border-neutral-800 rounded-[4px] bg-[#121319] overflow-hidden shadow-2xl">
        {/* Left Column: Registration Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-7 h-7 rounded-[3px] bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                SF
              </div>
              <span className="font-bold text-sm tracking-tight text-white uppercase font-mono">
                SupportFlow
              </span>
            </div>

            <h1 className="text-xl font-bold text-white tracking-tight">
              Create Your Support Workspace
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Connect your team chat and launch your autonomous support swarm in minutes.
            </p>

            <form onSubmit={handleSignup} className="mt-6 space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Alex Rivera"
                    className="w-full pl-8 pr-3 py-1.5 bg-[#161722] border border-neutral-800 focus:border-blue-500 rounded-[2px] text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="alex@company.com"
                    className="w-full pl-8 pr-3 py-1.5 bg-[#161722] border border-neutral-800 focus:border-blue-500 rounded-[2px] text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Workspace Subdomain
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    required
                    placeholder="acme"
                    className="flex-1 px-3 py-1.5 bg-[#161722] border border-neutral-800 focus:border-blue-500 rounded-l-[2px] text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none font-mono"
                  />
                  <span className="px-2.5 py-1.5 bg-[#1a1b26] border border-l-0 border-neutral-800 rounded-r-[2px] text-[11px] text-neutral-400 font-mono">
                    .supportflow.ai
                  </span>
                </div>
              </div>

              {/* Chat Bridge Selection */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Target Team Chat Bridge
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {(['mattermost', 'slack', 'discord'] as const).map((bridge) => (
                    <button
                      key={bridge}
                      type="button"
                      onClick={() => setChatBridge(bridge)}
                      className={`p-2 rounded-[2px] border text-center capitalize transition-colors cursor-pointer ${
                        chatBridge === bridge
                          ? 'bg-blue-950/60 border-blue-500 text-blue-300 font-semibold'
                          : 'bg-[#161722] border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {bridge}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-8 pr-3 py-1.5 bg-[#161722] border border-neutral-800 focus:border-blue-500 rounded-[2px] text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-500 active:scale-98 text-xs font-semibold text-white rounded-[2px] transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Provisioning Swarm...</span>
                  </>
                ) : (
                  <>
                    <span>Create Workspace & Start Free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-neutral-800 text-center text-xs text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign In
            </Link>
          </div>
        </div>

        {/* Right Column: Architectural Highlights */}
        <div className="p-8 bg-[#0b0c10] border-t md:border-t-0 md:border-l border-neutral-800 flex flex-col justify-between text-xs">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Autonomous Support Architecture
            </h2>
            <p className="text-neutral-400 text-xs leading-relaxed">
              When you connect SupportFlow, Switch AI launches an isolated room in your team chat. Every support turn is collaborative:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-[#13141c] border border-neutral-800 rounded-[2px] space-y-1">
                <div className="font-mono text-[11px] font-bold text-blue-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-blue-400" />
                  Deterministic Tool Inspection
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  Agents audit databases and Stripe via strictly typed Python tools. Zero hallucinated records.
                </p>
              </div>

              <div className="p-3 bg-[#13141c] border border-neutral-800 rounded-[2px] space-y-1">
                <div className="font-mono text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  100% Human Governance Gate
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  No automated resolution leaves without explicit sign-off from your team operators.
                </p>
              </div>

              <div className="p-3 bg-[#13141c] border border-neutral-800 rounded-[2px] space-y-1">
                <div className="font-mono text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  Live Keystroke Ghost Typing
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  Broadcast visitor keystrokes in real time to accelerate first-response times by 60%.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-850 text-[10px] text-neutral-500 font-mono flex items-center justify-between">
            <span>Flip the Switch Hackathon</span>
            <span className="text-blue-400">Track 1: Business Workflow</span>
          </div>
        </div>
      </div>
    </div>
  );
};