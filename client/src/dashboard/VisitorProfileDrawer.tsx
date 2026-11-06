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
} from 'lucide-react';
import type { Customer, Ticket } from '../types';
import { FacehashAvatar } from '../components/primitives';

interface VisitorProfileDrawerProps {
  customer?: Customer | null;
  ticket?: Ticket | null;
  onResync?: () => void;
}

export const VisitorProfileDrawer: React.FC<VisitorProfileDrawerProps> = ({
  customer,
  ticket,
  onResync,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!customer && !ticket) {
    return (
      <div className="w-80 shrink-0 h-full bg-[#0d0e12] border-l border-dashed border-neutral-800 p-6 text-neutral-500 text-xs font-mono">
        No customer selected
      </div>
    );
  }

  const name = customer?.name || ticket?.customer_name || 'Anonymous';
  const email = customer?.email || ticket?.customer_email || 'no-email@customer.com';
  const dbPlan = customer?.plan || ticket?.plan || 'free';
  const paidPlan = customer?.paid_plan || 'pro';
  const hasDiscrepancy = dbPlan !== paidPlan || ticket?.discrepancy;

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
    <div className="w-80 shrink-0 h-full bg-[#111218] border-l border-dashed border-neutral-800 flex flex-col select-none overflow-y-auto z-10 font-sans">
      {/* Profile Header with Generative Facehash */}
      <div className="p-4 border-b border-dashed border-neutral-800 bg-[#14151e]">
        <div className="flex items-center gap-3">
          <FacehashAvatar seed={name} size="md" showStatus status="online" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-neutral-100 truncate flex items-center gap-1.5">
              <span>{name}</span>
            </div>
            <div className="text-[11px] text-neutral-400 font-mono truncate">
              {email}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-neutral-500">
              <span>ID: {customer?.customer_id || ticket?.customer_id || 'CUST-001'}</span>
              <span>·</span>
              <span className="text-emerald-400">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancy Alert Banner */}
      {hasDiscrepancy && (
        <div className="m-3 p-3.5 bg-rose-950/40 border border-rose-800/80 rounded-[2px] text-xs">
          <div className="flex items-center gap-1.5 text-rose-300 font-bold mb-1 font-mono text-[11px] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Billing Discrepancy Detected</span>
          </div>
          <p className="text-[11px] text-rose-200/90 leading-relaxed font-sans mb-3">
            Stripe reports a paid <span className="font-mono font-bold text-white bg-rose-900/60 px-1 py-0.2 rounded-[2px]">{paidPlan.toUpperCase()}</span> subscription ($49), but the application database still records <span className="font-mono font-bold text-white bg-neutral-800 px-1 py-0.2 rounded-[2px]">{dbPlan.toUpperCase()}</span>.
          </p>

          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-900/80 hover:bg-rose-800 text-white text-[11px] font-mono font-bold rounded-[2px] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing DB...' : 'Sync DB to Stripe Paid State'}</span>
          </button>
        </div>
      )}

      {/* Subscription Breakdown */}
      <div className="p-4 border-b border-dashed border-neutral-800 space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-[#DF3E03]" />
          <span>Subscription & Entitlements</span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-2.5 bg-[#171822] rounded-[2px] border border-neutral-800">
            <span className="text-neutral-400">Database Role:</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-[2px] uppercase text-[10px] ${
                dbPlan === 'pro'
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                  : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
              }`}
            >
              {dbPlan}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#171822] rounded-[2px] border border-neutral-800">
            <span className="text-neutral-400">Stripe Billing State:</span>
            <span className="font-semibold px-2 py-0.5 rounded-[2px] uppercase text-[10px] bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
              {paidPlan} (Active)
            </span>
          </div>

          {customer?.stripe_charge_id && (
            <div className="p-2.5 bg-[#171822] rounded-[2px] border border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400 text-[10px] mb-1">
                <span>Stripe Charge ID:</span>
                <button
                  onClick={() => handleCopy(customer.stripe_charge_id)}
                  className="hover:text-white cursor-pointer flex items-center gap-1 text-neutral-400"
                  title="Copy Charge ID"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-[11px] text-neutral-200 truncate font-mono select-all">
                {customer.stripe_charge_id}
              </div>
            </div>
          )}

          {customer?.last_payment_date && (
            <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
              <span>Last Payment:</span>
              <span className="text-neutral-300">{customer.last_payment_date}</span>
            </div>
          )}
        </div>
      </div>

      {/* Technical Metadata */}
      <div className="p-4 space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-neutral-400" />
          <span>Technical Metadata</span>
        </div>

        <div className="space-y-2 text-xs font-mono text-[11px]">
          <div className="flex justify-between items-center p-2 bg-[#171822]/60 rounded-[2px] border border-neutral-800/60">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-neutral-500" />
              GeoIP Origin:
            </span>
            <span className="text-neutral-200">🇺🇸 US-West (Oregon)</span>
          </div>

          <div className="flex justify-between items-center p-2 bg-[#171822]/60 rounded-[2px] border border-neutral-800/60">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Monitor className="w-3 h-3 text-neutral-500" />
              Client Platform:
            </span>
            <span className="text-neutral-200">macOS / Chrome 128</span>
          </div>

          <div className="flex justify-between items-center p-2 bg-[#171822]/60 rounded-[2px] border border-neutral-800/60">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-neutral-500" />
              Auth Provider:
            </span>
            <span className="text-neutral-200">Google OAuth 2.0</span>
          </div>

          <div className="flex justify-between items-center p-2 bg-[#171822]/60 rounded-[2px] border border-neutral-800/60">
            <span className="text-neutral-400">Account Age:</span>
            <span className="text-neutral-200">142 days</span>
          </div>
        </div>
      </div>
    </div>
  );
};
