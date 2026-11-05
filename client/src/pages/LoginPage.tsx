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
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { MaskLogo, FacehashAvatar, AsciiMatrixBackground } from '../components/primitives';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('operator@clouddesk.dev');
  const [password, setPassword] = useState('••••••••••••');
  const [showEmailForm, setShowEmailForm] = useState(false);
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
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-[#0d0e12] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans select-none overflow-x-hidden">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT COLUMN: AUTH CARD */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-14 lg:p-20 z-10">
          <div>
            {/* Brand Logo Header */}
            <Link to="/" className="inline-flex items-center gap-2 mb-12">
              <MaskLogo size={24} className="text-neutral-900 dark:text-white" />
              <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white">
                supportflow
              </span>
            </Link>

            <div className="max-w-md">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white mb-2">
                Log in
              </h1>
              <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
                Welcome back. Enter your credentials to manage active tickets and review agent dispatches.
              </p>

              {/* Social Login Buttons */}
              <div className="space-y-2.5 mb-6">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 rounded-[2px] transition-colors cursor-pointer shadow-xs"
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
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 rounded-[2px] transition-colors cursor-pointer shadow-xs"
                >
                  <Github className="w-4 h-4 text-neutral-900 dark:text-white" />
                  <span>Continue with GitHub</span>
                </button>
              </div>

              {/* Progressive Disclosure: Use email instead */}
              {!showEmailForm ? (
                <button
                  type="button"
                  onClick={() => setShowEmailForm(true)}
                  className="w-full py-2 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Use email instead</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="my-5 flex items-center gap-3">
                    <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      Email & Password
                    </span>
                    <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
                  </div>

                  {error && (
                    <div className="mb-4 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-[2px] text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
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
                          <span>Log in</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Bottom Switcher */}
              <p className="mt-8 text-xs text-neutral-500">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-neutral-900 dark:text-white underline hover:text-[#DF3E03] transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <div className="pt-8 text-[11px] text-neutral-400 font-mono">
            Protected by deterministic zero-hallucination verification · Switch AI
          </div>
        </div>

        {/* RIGHT COLUMN: VERTICAL DIVIDER & ASCII LIVE WIDGET */}
        <div className="hidden lg:flex w-1/2 relative bg-neutral-100/50 dark:bg-[#111218]/50 border-l border-dashed border-neutral-200 dark:border-neutral-800 flex-col items-center justify-center p-12 overflow-hidden">
          {/* Subtle ASCII Matrix Watermark */}
          <AsciiMatrixBackground opacity={0.12} />

          {/* Floating Cossistant Support Widget */}
          <div className="relative z-10 w-full max-w-[340px] bg-white dark:bg-[#14151e] border border-neutral-300 dark:border-neutral-700/80 rounded-[8px] p-6 shadow-2xl">
            {/* Widget Top Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex -space-x-2">
                <FacehashAvatar seed="sarah" size="sm" showStatus status="online" />
                <FacehashAvatar seed="lucas" size="sm" showStatus status="online" />
                <FacehashAvatar seed="alex" size="sm" showStatus status="online" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
              Evening, how can we help?
            </h2>
            <p className="text-xs text-neutral-500 mb-6">
              We usually reply in a few minutes.
            </p>

            {/* Quick Action Card */}
            <Link
              to="/split"
              className="w-full block p-3.5 bg-neutral-50 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[4px] transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-medium text-neutral-900 dark:text-neutral-100">
                <span>Ask us a question</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Connected to Switch AI & #cloud-support
              </p>
            </Link>

            {/* Bottom Brand Watermark */}
            <div className="mt-8 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800 flex items-center justify-center gap-1.5 text-[11px] font-mono text-neutral-400">
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
