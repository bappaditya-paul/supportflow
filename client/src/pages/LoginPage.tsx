import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Github,
  Mail,
  Lock,
  ArrowRight,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('operator@clouddesk.dev');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your work email and password.');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 flex flex-col justify-center py-12 px-4 sm:px-6 select-none">
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 border border-neutral-800 rounded-[4px] bg-[#121319] overflow-hidden shadow-2xl">
        {/* Left Column: Sign In Form */}
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
              Sign In to Operator Desk
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Access real-time tickets, Switch agent telemetry, and the Human Review Gate.
            </p>

            {/* Social OAuth Buttons */}
            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#181922] hover:bg-[#202230] border border-neutral-800 text-xs font-medium text-neutral-200 rounded-[2px] transition-colors cursor-pointer"
              >
                <Github className="w-4 h-4" />
                <span>Continue with GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#181922] hover:bg-[#202230] border border-neutral-800 text-xs font-medium text-neutral-200 rounded-[2px] transition-colors cursor-pointer"
              >
                <span className="font-bold text-xs font-mono text-red-400">G</span>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-neutral-800" />
              <span className="text-[10px] font-mono text-neutral-500 uppercase">
                Or email credentials
              </span>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-[2px] text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5">
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
                    placeholder="operator@company.com"
                    className="w-full pl-8 pr-3 py-1.5 bg-[#161722] border border-neutral-800 focus:border-blue-500 rounded-[2px] text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-8 pr-3 py-1.5 bg-[#161722] border border-neutral-800 focus:border-blue-500 rounded-[2px] text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-500 active:scale-98 text-xs font-semibold text-white rounded-[2px] transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Operator Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-neutral-800 text-center text-xs text-neutral-500">
            Don't have a workspace?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">
              Create an account
            </Link>
          </div>
        </div>

        {/* Right Column: Live Terminal Session Preview */}
        <div className="p-8 bg-[#0b0c10] border-t md:border-t-0 md:border-l border-neutral-800 flex flex-col justify-between font-mono text-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-neutral-500 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>switch-core daemon</span>
              </span>
              <span className="text-emerald-400">ONLINE :34079</span>
            </div>

            <div className="mt-4 space-y-2 text-[11px] leading-relaxed">
              <div className="text-neutral-500">$ switch daemon start --bridge mattermost</div>
              <div className="text-emerald-400">✓ Connected to Mattermost container #cloud-support</div>
              <div className="text-blue-400">✓ Initialized agent persona: @triager</div>
              <div className="text-blue-400">✓ Initialized agent persona: @investigator</div>
              <div className="text-blue-400">✓ Initialized agent persona: @responder</div>
              <div className="text-purple-400">✓ Loaded Policy KB-001 (Billing Discrepancies)</div>
              <div className="text-amber-400/90">⚡ Human Review Gate: MANDATORY_DISPATCH_APPROVAL</div>
              <div className="text-neutral-400 mt-4 pt-3 border-t border-neutral-850">
                Awaiting operator authentication...
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-850 text-[10px] text-neutral-500 flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              Zero PII Exposed
            </span>
            <span>Switch Protocol v1.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};