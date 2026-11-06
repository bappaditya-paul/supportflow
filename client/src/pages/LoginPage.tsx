import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Github,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  Sparkles,
  Zap,
  Check,
} from 'lucide-react';
import { MaskLogo, FacehashAvatar, AsciiMatrixBackground } from '../components/primitives';
import { useAuth, DEMO_OPERATOR, DEMO_FOUNDER, DEMO_JUDGE } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { loginAs, loginWithCredentials } = useAuth();
  const [email, setEmail] = useState('operator@supportflow.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleQuickLogin = (preset: typeof DEMO_OPERATOR) => {
    setError('');
    setLoading(true);
    setSuccessMessage(`Logging in as ${preset.name} (${preset.roleTitle})...`);
    
    setTimeout(() => {
      loginAs(preset);
      setLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your work email.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const authenticatedUser = await loginWithCredentials(email, password);
      setSuccessMessage(`Authenticated as ${authenticatedUser.name}!`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 300);
    } catch {
      setError('Authentication failed. Please try a demo account.');
      setLoading(false);
    }
  };

  const handleOAuthClick = async (provider: 'Google' | 'GitHub') => {
    setLoading(true);
    setSuccessMessage(`Connecting via ${provider} OAuth...`);
    setTimeout(() => {
      loginAs(DEMO_OPERATOR);
      navigate('/dashboard');
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-[#0d0e12] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans select-none overflow-x-hidden">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT COLUMN: AUTH CARD */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 z-10">
          <div>
            {/* Brand Logo Header */}
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <MaskLogo size={24} className="text-neutral-900 dark:text-white" />
              <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white">
                supportflow
              </span>
            </Link>

            <div className="max-w-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#DF3E03] dark:text-[#FF6633] mb-3 border border-dashed border-[#DF3E03]/30 rounded-[2px] bg-[#DF3E03]/5">
                <Sparkles className="w-3 h-3 text-[#DF3E03]" />
                <span>Flip the Switch Hackathon 2026 · Demo Auth</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white mb-2">
                Log in to Cockpit
              </h1>
              <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
                Choose a pre-configured judge or operator persona below for instant 1-click access without backend wait.
              </p>

              {/* Success Notification */}
              {successMessage && (
                <div className="mb-4 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 rounded-[2px] text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span className="font-mono">{successMessage}</span>
                </div>
              )}

              {/* Error Notification */}
              {error && (
                <div className="mb-4 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-[2px] text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1-CLICK DEMO PERSONA SELECTOR */}
              <div className="mb-6 space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-1.5 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-[#DF3E03]" />
                  <span>1-Click Quick Demo Sign In</span>
                </div>

                {/* Operator Persona (Recommended) */}
                <button
                  type="button"
                  data-testid="btn-demo-operator"
                  onClick={() => handleQuickLogin(DEMO_OPERATOR)}
                  disabled={loading}
                  className="w-full text-left p-3 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/90 dark:hover:bg-[#181924] border border-neutral-300 dark:border-neutral-700 hover:border-[#DF3E03] dark:hover:border-[#DF3E03] rounded-[2px] transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FacehashAvatar seed="alex" size="sm" showStatus status="online" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        Alex Rivera
                        <span className="px-1.5 py-0.2 text-[9px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-[2px]">
                          RECOMMENDED
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                        operator@supportflow.ai · Lead Tier-2
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#DF3E03] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Sign In <ArrowRight className="w-3 h-3" />
                  </span>
                </button>

                {/* Founder Persona */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin(DEMO_FOUNDER)}
                  disabled={loading}
                  className="w-full text-left p-3 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/90 dark:hover:bg-[#181924] border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-[2px] transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FacehashAvatar seed="sarah" size="sm" showStatus status="online" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        Sarah Chen
                        <span className="px-1.5 py-0.2 text-[9px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-[2px]">
                          ADMIN
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                        founder@startup.io · CEO & Admin
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all flex items-center gap-1">
                    Sign In <ArrowRight className="w-3 h-3" />
                  </span>
                </button>

                {/* Hackathon Judge Persona */}
                <button
                  type="button"
                  data-testid="btn-demo-judge"
                  onClick={() => handleQuickLogin(DEMO_JUDGE)}
                  disabled={loading}
                  className="w-full text-left p-3 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/90 dark:hover:bg-[#181924] border border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-[2px] transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FacehashAvatar seed="judge" size="sm" showStatus status="online" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        Hackathon Judge
                        <span className="px-1.5 py-0.2 text-[9px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-[2px]">
                          EVALUATOR
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                        judge@fliptheswitch.dev · Track 1 Reviewer
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-500 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Sign In <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
                <span className="text-[10px] font-mono text-neutral-400 uppercase">
                  Or use standard credentials
                </span>
                <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleOAuthClick('Google')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 py-2 px-4 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 rounded-[2px] transition-colors cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthClick('GitHub')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 py-2 px-4 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 rounded-[2px] transition-colors cursor-pointer shadow-xs"
                >
                  <Github className="w-4 h-4 text-neutral-900 dark:text-white" />
                  <span>Continue with GitHub</span>
                </button>
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleLogin} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="operator@supportflow.ai"
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:border-[#DF3E03] rounded-[2px] text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 font-mono transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:border-[#DF3E03] rounded-[2px] text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-colors font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Log in to Cockpit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Switcher */}
              <p className="mt-6 text-xs text-neutral-500">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-neutral-900 dark:text-white underline hover:text-[#DF3E03] transition-colors"
                >
                  Sign up (Free Demo)
                </Link>
              </p>
            </div>
          </div>

          <div className="pt-6 text-[11px] text-neutral-400 font-mono">
            Protected by deterministic zero-hallucination verification · Switch AI Node 34079
          </div>
        </div>

        {/* RIGHT COLUMN: VERTICAL DIVIDER & INTERACTIVE PREVIEW WIDGET */}
        <div className="hidden lg:flex w-1/2 relative bg-neutral-100/50 dark:bg-[#111218]/50 border-l border-dashed border-neutral-200 dark:border-neutral-800 flex-col items-center justify-center p-12 overflow-hidden">
          {/* Subtle ASCII Matrix Watermark */}
          <AsciiMatrixBackground opacity={0.12} />

          {/* Floating Cossistant Support Widget */}
          <div className="relative z-10 w-full max-w-[360px] bg-white dark:bg-[#14151e] border border-neutral-300 dark:border-neutral-700/80 rounded-[8px] p-6 shadow-2xl">
            {/* Widget Top Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex -space-x-2">
                <FacehashAvatar seed="alex" size="sm" showStatus status="online" />
                <FacehashAvatar seed="sarah" size="sm" showStatus status="online" />
                <FacehashAvatar seed="marcus" size="sm" showStatus status="online" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                LIVE DEMO TICKET
              </span>
            </div>

            <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
              Active Incident: TKT-1001
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Customer: Alex Rivera (alex.rivera@example.com)
            </p>

            {/* Simulated Live Complaint Box */}
            <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[4px] mb-3 text-xs text-neutral-700 dark:text-neutral-300">
              <div className="text-[10px] font-mono text-[#DF3E03] uppercase font-bold mb-1">
                Customer Message
              </div>
              "I paid for Pro yesterday ($49), but my account dashboard still says Free tier..."
            </div>

            {/* AI Swarm Triage Badge */}
            <div className="p-2.5 bg-amber-950/30 border border-amber-800/40 rounded-[4px] mb-4 text-[11px] font-mono text-amber-300">
              <div className="font-bold flex items-center gap-1.5 mb-0.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                @investigator verified Stripe charge #ch_3P7a9x
              </div>
              Discrepancy detected · Ready for operator dispatch
            </div>

            {/* Interactive Action Button (Does not dead-end) */}
            <button
              type="button"
              onClick={() => handleQuickLogin(DEMO_OPERATOR)}
              className="w-full py-2.5 px-4 bg-[#DF3E03] hover:bg-[#c93702] text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 group"
            >
              <span>Review in Operator Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Bottom Brand Watermark */}
            <div className="mt-6 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800 flex items-center justify-center gap-1.5 text-[11px] font-mono text-neutral-400">
              <span>Powered by</span>
              <MaskLogo size={14} className="text-neutral-900 dark:text-white" />
              <span className="font-bold text-neutral-700 dark:text-neutral-300">supportflow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
