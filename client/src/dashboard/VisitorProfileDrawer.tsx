import React from 'react';
import {
  User,
  CreditCard,
  Calendar,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Database,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import type { Customer, Ticket } from '../types';

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
  if (!customer && !ticket) {
    return (
      <div className="w-72 shrink-0 h-full bg-[#111216] border-l border-neutral-800 p-4 text-neutral-500 text-xs">
        No customer selected
      </div>
    );
  }

  const name = customer?.name || ticket?.customer_name || 'Anonymous';
  const email = customer?.email || ticket?.customer_email || 'no-email@customer.com';
  const dbPlan = customer?.plan || ticket?.plan || 'free';
  const paidPlan = customer?.paid_plan || 'pro';
  const hasDiscrepancy = dbPlan !== paidPlan || ticket?.discrepancy;

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="w-72 shrink-0 h-full bg-[#121318] border-l border-neutral-800 flex flex-col select-none overflow-y-auto">
      {/* Profile Header */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
            {name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-100">{name}</div>
            <div className="text-[11px] text-neutral-400 font-mono truncate">{email}</div>
          </div>
        </div>
      </div>

      {/* Discrepancy Alert */}
      {hasDiscrepancy && (
        <div className="m-3 p-3 bg-rose-950/40 border border-rose-800/60 rounded-[2px] text-xs">
          <div className="flex items-center gap-1.5 text-rose-300 font-bold mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            Billing Discrepancy Detected
          </div>
          <p className="text-[11px] text-rose-200/80 leading-relaxed">
            Stripe reports a paid <span className="font-mono font-bold text-white">{paidPlan.toUpperCase()}</span> subscription, but the database shows <span className="font-mono font-bold text-white">{dbPlan.toUpperCase()}</span>.
          </p>

          {onResync && (
            <button
              onClick={onResync}
              className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-rose-900/60 hover:bg-rose-800/80 text-rose-100 text-[11px] font-mono rounded-[2px] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Sync DB to Stripe Paid State
            </button>
          )}
        </div>
      )}

      {/* Subscription Breakdown */}
      <div className="p-4 border-b border-neutral-800 space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-blue-400" />
          Subscription & Entitlements
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 bg-[#171822] rounded-[2px] border border-neutral-800">
            <span className="text-neutral-400">Database Role:</span>
            <span className={`font-mono font-semibold px-1.5 py-0.5 rounded-[2px] uppercase ${
              dbPlan === 'pro' ? 'bg-emerald-950/60 text-emerald-300' : 'bg-neutral-800 text-neutral-300'
            }`}>
              {dbPlan}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 bg-[#171822] rounded-[2px] border border-neutral-800">
            <span className="text-neutral-400">Stripe Billing State:</span>
            <span className="font-mono font-semibold px-1.5 py-0.5 rounded-[2px] uppercase bg-emerald-950/60 text-emerald-300">
              {paidPlan} (Active)
            </span>
          </div>

          {customer?.stripe_charge_id && (
            <div className="p-2 bg-[#171822] rounded-[2px] border border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400 text-[11px] mb-1">
                <span>Charge ID:</span>
                <button
                  onClick={() => copyToClipboard(customer.stripe_charge_id)}
                  className="hover:text-neutral-200 cursor-pointer"
                  title="Copy Charge ID"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="font-mono text-[11px] text-neutral-300 truncate">
                {customer.stripe_charge_id}
              </div>
            </div>
          )}

          {customer?.last_payment_date && (
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
              <span>Last Payment:</span>
              <span className="font-mono text-neutral-300">{customer.last_payment_date}</span>
            </div>
          )}
        </div>
      </div>

      {/* System Metadata */}
      <div className="p-4 space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-neutral-400" />
          Technical Metadata
        </div>

        <div className="space-y-1.5 text-xs font-mono text-[11px]">
          <div className="flex justify-between text-neutral-400">
            <span>Customer ID:</span>
            <span className="text-neutral-200">{customer?.customer_id || ticket?.customer_id || 'CUST-001'}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Account Age:</span>
            <span className="text-neutral-200">142 days</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Verified GeoIP:</span>
            <span className="text-neutral-200">US-West (Oregon)</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Auth Provider:</span>
            <span className="text-neutral-200">Google OAuth</span>
          </div>
        </div>
      </div>
    </div>
  );
};