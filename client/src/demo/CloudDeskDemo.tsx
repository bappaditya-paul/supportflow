import React from 'react';
import {
  Server,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Terminal,
  Activity,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

interface CloudDeskDemoProps {
  onOpenWidget: () => void;
  onSimulateTicket: (scenario: 'billing' | 'refund' | 'access') => void;
}

export const CloudDeskDemo: React.FC<CloudDeskDemoProps> = ({
  onOpenWidget,
  onSimulateTicket,
}) => {
  return (
    <div className="min-h-full bg-[#0d0e12] text-neutral-100 flex flex-col font-sans select-none overflow-y-auto">
      {/* SaaS App Header */}
      <header className="px-6 py-3.5 border-b border-white/[0.08] bg-[#0d0e12]/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-[#DF3E03] flex items-center justify-center font-bold text-white shadow-sm">
            CD
          </div>
          <span className="font-semibold text-base tracking-tight text-white">
            CloudDesk
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-white/[0.06] text-neutral-300 border border-white/[0.08]">
            DEMO SAAS APP
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs text-neutral-400">
          <a href="#clusters" className="hover:text-white transition-colors">Clusters</a>
          <a href="#metrics" className="hover:text-white transition-colors">Observability</a>
          <a href="#billing" className="hover:text-white transition-colors">Billing & Plans</a>
          <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenWidget}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#DF3E03] hover:bg-[#c93702] rounded-[4px] transition-colors cursor-pointer shadow-sm"
          >
            Contact Support
          </button>
        </div>
      </header>

      {/* Main SaaS Dashboard / Hero Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 bg-[#121319] border border-white/[0.08] rounded-[4px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Production Cluster: us-east-1a</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Welcome back, Alex Rivera (Account: CUST-001)
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl font-sans">
              CloudDesk container orchestration is currently running 18 distributed microservices across 3 Kubernetes nodes.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <div className="text-[11px] font-mono text-neutral-400">
              Current Plan: <span className="text-rose-400 font-medium">Free Tier (Discrepancy)</span>
            </div>
            <button
              type="button"
              onClick={() => onSimulateTicket('billing')}
              className="px-3.5 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-neutral-200 text-xs font-mono rounded-[4px] transition-colors cursor-pointer flex items-center gap-1.5 border border-white/[0.08]"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate: "I Paid for Pro but Still on Free"</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#121319] border border-white/[0.08] rounded-[4px]">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>CPU Utilization</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">34.2%</div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">4 of 16 vCPUs allocated</div>
          </div>

          <div className="p-4 bg-[#121319] border border-white/[0.08] rounded-[4px]">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Memory Footprint</span>
              <Layers className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">12.8 GB</div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">Cluster ceiling: 32 GB</div>
          </div>

          <div className="p-4 bg-[#121319] border border-white/[0.08] rounded-[4px]">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>API Request Rate</span>
              <Zap className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">1,420/s</div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">99.98% 2xx responses</div>
          </div>

          <div className="p-4 bg-[#121319] border border-white/[0.08] rounded-[4px]">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Billing Account</span>
              <Shield className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-sm font-semibold font-mono text-rose-400">Sync Pending</div>
            <div className="text-[10px] text-neutral-400 font-mono mt-1">Stripe Charge: ch_3P7a9…</div>
          </div>
        </div>

        {/* Interactive Scenario Launchpad for Judges */}
        <div className="p-5 bg-[#121319] border border-white/[0.08] rounded-[4px] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Live Interactive Swarm Scenarios</span>
            </h2>
            <span className="text-[11px] font-mono text-neutral-400">
              Click any scenario to inject into SupportFlow
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onSimulateTicket('billing')}
              className="p-3 bg-[#090a0f] hover:bg-white/[0.03] border border-white/[0.08] hover:border-[#DF3E03]/50 rounded-[4px] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-100 group-hover:text-[#DF3E03] mb-1 transition-colors">
                <span>1. Billing Tier Discrepancy</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#DF3E03] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-neutral-400">
                Customer Alex Rivera paid $49 for Pro via Stripe, but app database still shows Free.
              </p>
              <div className="mt-2 text-[10px] font-mono text-amber-400/90">
                Triggers: @triager &gt; @investigator (Stripe vs DB) &gt; Human Review
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSimulateTicket('refund')}
              className="p-3 bg-[#090a0f] hover:bg-white/[0.03] border border-white/[0.08] hover:border-[#DF3E03]/50 rounded-[4px] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-100 group-hover:text-[#DF3E03] mb-1 transition-colors">
                <span>2. Enterprise Quota Request</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#DF3E03] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-neutral-400">
                Customer Sarah Chen requesting 50 additional concurrent nodes for workload spike.
              </p>
              <div className="mt-2 text-[10px] font-mono text-blue-400/90">
                Triggers: Policy check KB-002 &gt; Account SLA validation
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSimulateTicket('access')}
              className="p-3 bg-[#090a0f] hover:bg-white/[0.03] border border-white/[0.08] hover:border-[#DF3E03]/50 rounded-[4px] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-100 group-hover:text-[#DF3E03] mb-1 transition-colors">
                <span>3. SAML SSO Provisioning</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#DF3E03] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-neutral-400">
                Security audit team inquiring about Okta/Entra ID SCIM provisioning setup.
              </p>
              <div className="mt-2 text-[10px] font-mono text-emerald-400/90">
                Triggers: Knowledge Base Retrieval &gt; Enterprise Doc Grounding
              </div>
            </button>
          </div>
        </div>

        {/* Live Kubernetes Pods Table */}
        <div className="p-5 bg-[#121319] border border-white/[0.08] rounded-[4px]">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-3">
            Active Cluster Services
          </h3>
          <div className="overflow-x-auto text-xs font-mono">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.08] text-neutral-400 text-[11px]">
                  <th className="pb-2 font-medium">Service Name</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Replicas</th>
                  <th className="pb-2 font-medium">Latency</th>
                  <th className="pb-2 font-medium">Uptime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-neutral-300">
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 text-white font-medium">api-gateway</td>
                  <td className="py-2.5 text-emerald-400 font-medium">Healthy</td>
                  <td className="py-2.5 tabular-nums">4/4</td>
                  <td className="py-2.5 tabular-nums">12ms</td>
                  <td className="py-2.5 tabular-nums">99.99%</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 text-white font-medium">auth-service</td>
                  <td className="py-2.5 text-emerald-400 font-medium">Healthy</td>
                  <td className="py-2.5 tabular-nums">2/2</td>
                  <td className="py-2.5 tabular-nums">8ms</td>
                  <td className="py-2.5 tabular-nums">99.98%</td>
                </tr>
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 text-white font-medium">billing-worker</td>
                  <td className="py-2.5 text-amber-400 font-medium">Degraded (Webhook Delay)</td>
                  <td className="py-2.5 tabular-nums">1/2</td>
                  <td className="py-2.5 tabular-nums">240ms</td>
                  <td className="py-2.5 tabular-nums">98.40%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-white/[0.08] text-center text-xs text-neutral-500 font-mono">
        SupportFlow · Powered by Switch AI, Mattermost & FastAPI Swarm Engine
      </footer>
    </div>
  );
};
