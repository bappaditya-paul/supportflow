import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { MaskLogo } from '../components/primitives';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-[#0d0e12] text-neutral-900 dark:text-neutral-100 flex flex-col justify-center py-16 px-4 sm:px-6 select-none">
      <div className="max-w-md w-full mx-auto border border-dashed border-neutral-300 dark:border-neutral-800 rounded-[2px] bg-white dark:bg-[#111218] p-8 sm:p-10 shadow-sm">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <MaskLogo size={24} className="text-neutral-900 dark:text-white" />
          <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white">
            supportflow
          </span>
        </Link>

        <h1 className="text-2xl font-bold text-neutral-950 dark:text-white tracking-tight mb-2">
          Reset password
        </h1>
        <p className="text-xs text-neutral-500 leading-relaxed mb-6">
          Enter your registered work email to receive a secure recovery magic link.
        </p>

        {sent ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-[2px] text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recovery link dispatched</span>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              We sent a password reset token to <span className="font-mono font-medium">{email}</span>. The link expires in 15 minutes.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSent(false)}
                className="text-[11px] font-mono text-[#DF3E03] dark:text-[#FF6633] hover:underline cursor-pointer"
              >
                Did not receive? Resend email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Dispatching link...</span>
                </>
              ) : (
                <>
                  <span>Send reset instructions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-dashed border-neutral-200 dark:border-neutral-800 text-center">
          <Link
            to="/login"
            className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
