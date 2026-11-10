import React, { useState } from 'react';
import {
  CreditCard,
  AlertTriangle,
  RefreshCw,
  Database,
  CheckCircle2,
  Copy,
  Check,
  Globe,
  Monitor,
  Shield,
  X,
} from 'lucide-react';
import type { Customer, Ticket } from '../types';
import { FacehashAvatar } from '../components/primitives';

interface VisitorProfileDrawerProps {
  customer?: Customer | null;
  ticket?: Ticket | null;
  onResync?: () => void;
  onClose?: () => void;
}

export const VisitorProfileDrawer: React.FC<VisitorProfileDrawerProps> = ({
  customer,
  ticket,
  onResync,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!customer && !ticket) {
    return (
      <div className="w-80 shrink-0 h-full bg-[#0d0e12] border-l border-white/[0.08] p-6 text-neutral-500 text-xs font-mono">
        No customer selected
      </div>
    );
  }

  const name = customer?.name || ticket?.customer_name || 'Customer';
  const email = customer?.email || customer?.email_masked || ticket?.customer_email || 'customer@example.com';
  const dbPlan = customer?.plan || ticket?.plan || 'free';
  const paidPlan = customer?.paid_plan || customer?.expected_plan || 'pro';
  const chargeId = customer?.stripe_charge_id || customer?.transaction_id || '';
  const paymentDate = customer?.last_payment_date || customer?.payment_date || '';
  const hasDiscrepancy = customer?.discrepancy_detected ?? (dbPlan !== paidPlan || ticket?.discrepancy);
  const paymentAmount = customer?.payment_amount ? `$${customer.payment_amount.toFixed(2)}` : '$9.99';

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSyncClick = () => {
    if (onResync) {
      setIsSyncing(true);
      setTimeout(() => {
        onResync();
        setIsSyncing(false);
      }, 500);
    }
  };

  return (
    <div className="w-80 shrink-0 h-full bg-[#0d0e12] border-l border-white/[0.08] flex flex-col select-none overflow-y-auto z-10 font-sans">
      {/* Profile Header with Generative Facehash */}
      <div className="p-4 border-b border-white/[0.08] bg-[#0d0e12]">
        <div className="flex items-center gap-3">
          <FacehashAvatar seed={name} size="md" showStatus status="online" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-neutral-100 truncate flex items-center gap-1.5">
              <span>{name}</span>
            </div>
            <div className="text-[11px] text-neutral-400 font-mono truncate mt-0.5">
              {email}
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
              <span className="tabular-nums">ID: {customer?.customer_id || ticket?.customer_id || 'CUS-501'}</span>
              <span>·</span>
              <span className="text-neutral-400 font-medium">Verified Customer</span>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close customer drawer"
              className="p-1.5 text-neutral-400 hover:text-white rounded-[3px] hover:bg-white/[0.08] cursor-pointer transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Discrepancy Notice */}
      {hasDiscrepancy && (
        <div className="m-3 p-3 bg-[#121319] border border-white/[0.08] rounded-[4px] text-xs">
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[11px] text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="font-semibold uppercase tracking-wider">Discrepancy Detected</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed font-sans mb-3">
            Payment provider verified paid <span className="font-mono text-neutral-200 font-medium uppercase">{paidPlan}</span> tier ({paymentAmount}), but app database records <span className="font-mono text-neutral-200 font-medium uppercase">{dbPlan}</span>.
          </p>

          <button
            type="button"
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white text-black hover:bg-neutral-200 text-[11px] font-mono font-medium rounded-[3px] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin motion-reduce:animate-none' : ''}`} />
            <span>{isSyncing ? 'Synchronizing DB…' : 'Sync Database to Stripe Paid State'}</span>
          </button>
        </div>
      )}

      {/* Subscription Breakdown */}
      <div className="p-4 border-b border-white/[0.08] space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-neutral-300" />
          <span>Subscription & Entitlements</span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-2.5 bg-[#121319] rounded-[4px] border border-white/[0.08]">
            <span className="text-neutral-400">Database Role:</span>
            <span
              className={`font-medium px-2 py-0.5 rounded-[3px] uppercase text-[10px] ${
                dbPlan.toLowerCase() === 'pro'
                  ? 'bg-white/[0.1] text-white border border-white/[0.15]'
                  : 'bg-white/[0.04] text-neutral-400 border border-white/[0.06]'
              }`}
            >
              {dbPlan}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#121319] rounded-[4px] border border-white/[0.08]">
            <span className="text-neutral-400">Stripe Billing State:</span>
            <span className="font-medium px-2 py-0.5 rounded-[3px] uppercase text-[10px] bg-white/[0.1] text-white border border-white/[0.15]">
              {paidPlan} (Active)
            </span>
          </div>

          {chargeId && (
            <div className="p-2.5 bg-[#121319] rounded-[4px] border border-white/[0.08]">
              <div className="flex items-center justify-between text-neutral-400 text-[10px] mb-1">
                <span>Transaction / Charge ID:</span>
                <button
                  type="button"
                  onClick={() => handleCopy(chargeId)}
                  className="hover:text-white cursor-pointer flex items-center gap-1 text-neutral-400 transition-colors"
                  title="Copy ID"
                  aria-label="Copy ID"
                >
                  {copied ? <Check className="w-3 h-3 text-neutral-200" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-[11px] text-neutral-200 truncate font-mono select-all">
                {chargeId}
              </div>
            </div>
          )}

          {paymentDate && (
            <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
              <span>Payment Date:</span>
              <span className="text-neutral-300 tabular-nums">{paymentDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Technical Metadata */}
      <div className="p-4 space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-neutral-400" />
          <span>Technical Metadata</span>
        </div>

        <div className="space-y-2 text-xs font-mono text-[11px]">
          <div className="flex justify-between items-center p-2.5 bg-[#121319] rounded-[4px] border border-white/[0.08]">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-neutral-500" />
              GeoIP Origin:
            </span>
            <span className="text-neutral-200">🇺🇸 US-West (Oregon)</span>
          </div>

          <div className="flex justify-between items-center p-2.5 bg-[#121319] rounded-[4px] border border-white/[0.08]">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Monitor className="w-3 h-3 text-neutral-500" />
              Client Platform:
            </span>
            <span className="text-neutral-200">macOS / Chrome 128</span>
          </div>

          <div className="flex justify-between items-center p-2.5 bg-[#121319] rounded-[4px] border border-white/[0.08]">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-neutral-500" />
              Auth Provider:
            </span>
            <span className="text-neutral-200">Google OAuth 2.0</span>
          </div>

          <div className="flex justify-between items-center p-2.5 bg-[#121319] rounded-[4px] border border-white/[0.08]">
            <span className="text-neutral-400">Account Age:</span>
            <span className="text-neutral-200 tabular-nums">142 days</span>
          </div>
        </div>
      </div>
    </div>
  );
};
