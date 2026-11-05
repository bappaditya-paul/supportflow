import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 flex flex-col justify-center py-12 px-4 sm:px-6 select-none">
      <div className="max-w-md w-full mx-auto border border-neutral-800 rounded-[4px] bg-[#121319] p-8 shadow-2xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-[3px] bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            SF
          </div>
          <span className="font-bold text-sm tracking-tight text-white uppercase font-mono">
            SupportFlow
          </span>
        </div>

        <h1 className="text-xl font-bold text-white tracking-tight">
          Reset Operator Password
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Enter your registered work email to receive a secure recovery magic link.
        </p>

        {sent ? (
          <div className="mt-6 p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-[2px] text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recovery Link Dispatched</span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              We sent a password reset email to <span className="font-mono text-white">{email}</span>. The link expires in 15 minutes.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSent(false)}
                className="text-[11px] font-mono text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                Did not receive? Resend email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="operator@company.com"
                  className="w-full pl-8 pr-3 py-1.5 bg-[#161722] border border-neutral-800 focus:border-blue-500 rounded-[2px] text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-500 active:scale-98 text-xs font-semibold text-white rounded-[2px] transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending Link...</span>
                </>
              ) : (
                <>
                  <span>Send Recovery Email</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-neutral-800 text-center text-xs text-neutral-500">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};