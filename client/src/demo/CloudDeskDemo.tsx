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
      <header className="px-6 py-4 border-b border-neutral-800 bg-[#121319]/80 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
            CD
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            CloudDesk
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-blue-950/60 text-blue-400 border border-blue-800/40">
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
            onClick={onOpenWidget}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-[2px] transition-colors cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </header>

      {/* Main SaaS Dashboard / Hero Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 bg-gradient-to-r from-[#171a27] to-[#12131a] border border-neutral-800 rounded-[2px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Production Cluster: us-east-1a
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Welcome back, Alex Rivera (Account: CUST-001)
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
              CloudDesk container orchestration is currently running 18 distributed microservices across 3 Kubernetes nodes.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <div className="text-[11px] font-mono text-neutral-400">
              Current Plan: <span className="text-rose-400 font-bold">Free Tier (Discrepancy)</span>
            </div>
            <button
              onClick={() => onSimulateTicket('billing')}
              className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Simulate: "I Paid for Pro but Still on Free"
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#14151c] border border-neutral-800 rounded-[2px]">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>CPU Utilization</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">34.2%</div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">4 of 16 vCPUs allocated</div>
          </div>

          <div className="p-4 bg-[#14151c] border border-neutral-800 rounded-[2px]">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Memory Footprint</span>
              <Layers className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">12.8 GB</div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">Cluster ceiling: 32 GB</div>
          </div>

          <div className="p-4 bg-[#14151c] border border-neutral-800 rounded-[2px]">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>API Request Rate</span>
              <Zap className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">1,420/s</div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">99.98% 2xx responses</div>
          </div>

          <div className="p-4 bg-[#14151c] border border-neutral-800 rounded-[2px]">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Billing Account</span>
              <Shield className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-sm font-bold font-mono text-rose-400">Sync Pending</div>
            <div className="text-[10px] text-neutral-400 font-mono mt-1">Stripe Charge: ch_3P7a9...</div>
          </div>
        </div>

        {/* Interactive Scenario Launchpad for Judges */}
        <div className="p-5 bg-[#141620] border border-neutral-800 rounded-[2px] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Flip the Switch Hackathon Test Scenarios
            </h2>
            <span className="text-[11px] font-mono text-neutral-400">
              Click any scenario to inject into SupportFlow
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => onSimulateTicket('billing')}
              className="p-3 bg-[#181a24] hover:bg-[#1f2130] border border-neutral-700 hover:border-blue-500 rounded-[2px] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-neutral-100 group-hover:text-blue-400 mb-1">
                <span>1. Billing Tier Discrepancy</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-neutral-400">
                Customer Alex Rivera paid $49 for Pro via Stripe, but app database still shows Free.
              </p>
              <div className="mt-2 text-[10px] font-mono text-amber-400/90">
                Triggers: @triager &gt; @investigator (Stripe vs DB) &gt; Human Review
              </div>
            </button>

            <button
              onClick={() => onSimulateTicket('refund')}
              className="p-3 bg-[#181a24] hover:bg-[#1f2130] border border-neutral-700 hover:border-blue-500 rounded-[2px] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-neutral-100 group-hover:text-blue-400 mb-1">
                <span>2. Enterprise Quota Request</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-neutral-400">
                Customer Sarah Chen requesting 50 additional concurrent nodes for workload spike.
              </p>
              <div className="mt-2 text-[10px] font-mono text-blue-400/90">
                Triggers: Policy check KB-002 &gt; Account SLA validation
              </div>
            </button>

            <button
              onClick={() => onSimulateTicket('access')}
              className="p-3 bg-[#181a24] hover:bg-[#1f2130] border border-neutral-700 hover:border-blue-500 rounded-[2px] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-neutral-100 group-hover:text-blue-400 mb-1">
                <span>3. SAML SSO Provisioning</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
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
        <div className="p-5 bg-[#14151c] border border-neutral-800 rounded-[2px]">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-3">
            Active Cluster Services
          </h3>
          <div className="overflow-x-auto text-xs font-mono">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500">
                  <th className="pb-2 font-normal">Service Name</th>
                  <th className="pb-2 font-normal">Status</th>
                  <th className="pb-2 font-normal">Replicas</th>
                  <th className="pb-2 font-normal">Latency</th>
                  <th className="pb-2 font-normal">Uptime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850 text-neutral-300">
                <tr>
                  <td className="py-2 text-white font-medium">api-gateway</td>
                  <td className="py-2 text-emerald-400">Healthy</td>
                  <td className="py-2">4/4</td>
                  <td className="py-2">12ms</td>
                  <td className="py-2">99.99%</td>
                </tr>
                <tr>
                  <td className="py-2 text-white font-medium">auth-service</td>
                  <td className="py-2 text-emerald-400">Healthy</td>
                  <td className="py-2">2/2</td>
                  <td className="py-2">8ms</td>
                  <td className="py-2">99.98%</td>
                </tr>
                <tr>
                  <td className="py-2 text-white font-medium">billing-worker</td>
                  <td className="py-2 text-amber-400">Degraded (Webhook Delay)</td>
                  <td className="py-2">1/2</td>
                  <td className="py-2">240ms</td>
                  <td className="py-2">98.40%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-neutral-850 text-center text-xs text-neutral-500 font-mono">
        Flip the Switch Hackathon · Built with Switch AI, Mattermost, FastAPI & Cossistant Design System
      </footer>
    </div>
  );
};