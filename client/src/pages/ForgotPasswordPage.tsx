import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 flex flex-col justify-center py-16 px-4 sm:px-6 select-none">
      <div className="max-w-md w-full mx-auto border border-white/[0.08] rounded-[4px] bg-[#121319] p-8 sm:p-10 shadow-sm">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <MaskLogo size={24} className="text-white" />
          <span className="font-bold text-base tracking-tight text-white">
            supportflow
          </span>
        </Link>

        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
          Reset password
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-mono">
          Enter your registered work email to receive a secure recovery magic link.
        </p>

        {sent ? (
          <div className="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-[4px] text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recovery link dispatched</span>
            </div>
            <p className="text-neutral-300 leading-relaxed font-sans">
              We sent a password reset token to <span className="font-mono font-medium text-white">{email}</span>. The link expires in 15 minutes.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-[11px] font-mono text-[#DF3E03] hover:underline cursor-pointer transition-colors"
              >
                Did not receive? Resend email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                Work Email
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="operator@clouddesk.dev"
                className="w-full px-3 py-2 bg-[#090a0f] border border-white/[0.08] focus:border-[#DF3E03] focus-visible:ring-1 focus-visible:ring-[#DF3E03] rounded-[4px] text-xs text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#DF3E03] hover:bg-[#c93702] text-white text-xs font-semibold rounded-[4px] transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin motion-reduce:animate-none" />
                  <span>Dispatching link…</span>
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

        <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
          <Link
            to="/login"
            className="text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
