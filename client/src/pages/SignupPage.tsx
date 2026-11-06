import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Github,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  Building2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { MaskLogo, FacehashAvatar, AsciiMatrixBackground } from '../components/primitives';
import { useAuth, DEMO_OPERATOR, DEMO_FOUNDER, DEMO_JUDGE } from '../context/AuthContext';

export const SignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  const { signupWithCredentials, loginAs } = useAuth();

  const [fullName, setFullName] = useState('Alex Rivera');
  const [email, setEmail] = useState('operator@supportflow.ai');
  const [workspace, setWorkspace] = useState('CloudDesk Inc');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInstantDemoSignup = (preset: typeof DEMO_OPERATOR) => {
    setError('');
    setLoading(true);
    setSuccessMessage(`Provisioning sandbox workspace for ${preset.name}...`);
    setTimeout(() => {
      loginAs(preset);
      setLoading(false);
      navigate('/dashboard');
    }, 450);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setError('Please fill out all required fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const newUser = await signupWithCredentials(fullName, email, workspace);
      setSuccessMessage(`Workspace created for ${newUser.name}! Routing to dashboard...`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 350);
    } catch {
      setError('Could not create workspace. Please try demo access.');
      setLoading(false);
    }
  };

  const handleOAuthClick = async (provider: 'Google' | 'GitHub') => {
    setLoading(true);
    setSuccessMessage(`Creating workspace via ${provider}...`);
    setTimeout(() => {
      loginAs(DEMO_OPERATOR);
      navigate('/dashboard');
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-[#0d0e12] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans select-none overflow-x-hidden">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT COLUMN: SIGNUP CARD */}
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
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono font-medium text-[#DF3E03] dark:text-[#FF6633] border border-dashed border-[#DF3E03]/30 rounded-[2px] bg-[#DF3E03]/5">
                  SELECTED: {plan.toUpperCase()} TIER
                </span>
                <span className="text-[10px] font-mono text-neutral-400">14-day trial · No CC</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white mb-2">
                Create your workspace
              </h1>
              <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
                Start your team evaluation. Use 1-click demo provisioning or configure custom credentials below.
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

              {/* 1-CLICK INSTANT DEMO PROVISIONING */}
              <div className="mb-6 space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-1.5 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-[#DF3E03]" />
                  <span>Fast Track for Hackathon Judges</span>
                </div>

                <button
                  type="button"
                  data-testid="btn-demo-operator"
                  onClick={() => handleInstantDemoSignup(DEMO_OPERATOR)}
                  disabled={loading}
                  className="w-full text-left p-3 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/90 dark:hover:bg-[#181924] border border-neutral-300 dark:border-neutral-700 hover:border-[#DF3E03] dark:hover:border-[#DF3E03] rounded-[2px] transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FacehashAvatar seed="alex" size="sm" showStatus status="online" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        Instant Operator Sandbox
                        <span className="px-1.5 py-0.2 text-[9px] font-mono bg-[#DF3E03]/10 text-[#DF3E03] rounded-[2px]">
                          1-CLICK
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                        Pre-loaded with 3 live tickets & Mattermost bridge
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#DF3E03] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Launch <ArrowRight className="w-3 h-3" />
                  </span>
                </button>

                <button
                  type="button"
                  data-testid="btn-demo-judge"
                  onClick={() => handleInstantDemoSignup(DEMO_JUDGE)}
                  disabled={loading}
                  className="w-full text-left p-3 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/90 dark:hover:bg-[#181924] border border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-[2px] transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FacehashAvatar seed="judge" size="sm" showStatus status="online" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        Hackathon Judge Sandbox
                        <span className="px-1.5 py-0.2 text-[9px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-[2px]">
                          EVALUATOR
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                        Instant reviewer access for Flip the Switch Track 1
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-500 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Evaluate <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
                <span className="text-[10px] font-mono text-neutral-400 uppercase">
                  Or enter your details
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

              {/* Form */}
              <form onSubmit={handleSignup} className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Alex Rivera"
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:border-[#DF3E03] rounded-[2px] text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      value={workspace}
                      onChange={(e) => setWorkspace(e.target.value)}
                      required
                      placeholder="Acme Corp"
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:border-[#DF3E03] rounded-[2px] text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="operator@clouddesk.dev"
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:border-[#DF3E03] rounded-[2px] text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                    Password
                  </label>
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
                      <span>Creating workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Launch Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Switcher */}
              <p className="mt-6 text-xs text-neutral-500">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-neutral-900 dark:text-white underline hover:text-[#DF3E03] transition-colors"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          <div className="pt-6 text-[11px] text-neutral-400 font-mono">
            By signing up, you agree to our Terms of Service & Privacy Policy.
          </div>
        </div>

        {/* RIGHT COLUMN: VERTICAL DIVIDER & INTERACTIVE PREVIEW WIDGET */}
        <div className="hidden lg:flex w-1/2 relative bg-neutral-100/50 dark:bg-[#111218]/50 border-l border-dashed border-neutral-200 dark:border-neutral-800 flex-col items-center justify-center p-12 overflow-hidden">
          <AsciiMatrixBackground opacity={0.12} />

          <div className="relative z-10 w-full max-w-[360px] bg-white dark:bg-[#14151e] border border-neutral-300 dark:border-neutral-700/80 rounded-[8px] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex -space-x-2">
                <FacehashAvatar seed="alex" size="sm" showStatus status="online" />
                <FacehashAvatar seed="sarah" size="sm" showStatus status="online" />
                <FacehashAvatar seed="marcus" size="sm" showStatus status="online" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                INBOX SIMULATION
              </span>
            </div>

            <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
              Zero Hallucinations Guarantee
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              3 AI Agents running inside your team chat with human sign-off.
            </p>

            <div className="space-y-2 mb-4 text-xs font-mono">
              <div className="p-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2px] flex items-center justify-between">
                <span className="text-neutral-500">@triager</span>
                <span className="text-blue-400">Classifies intent</span>
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2px] flex items-center justify-between">
                <span className="text-neutral-500">@investigator</span>
                <span className="text-emerald-400">Verifies DB & Stripe</span>
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2px] flex items-center justify-between">
                <span className="text-neutral-500">@responder</span>
                <span className="text-purple-400">Human Approval Gate</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleInstantDemoSignup(DEMO_OPERATOR)}
              className="w-full py-2.5 px-4 bg-[#DF3E03] hover:bg-[#c93702] text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 group"
            >
              <span>Explore Interactive Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-6 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800 flex items-center justify-center gap-1.5 text-[11px] font-mono text-neutral-400">
              <span>We run on</span>
              <MaskLogo size={14} className="text-neutral-900 dark:text-white" />
              <span className="font-bold text-neutral-700 dark:text-neutral-300">supportflow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
