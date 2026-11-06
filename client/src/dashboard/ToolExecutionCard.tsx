import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronRight, CheckCircle2, AlertCircle, Loader2, Clock } from 'lucide-react';

interface ToolExecutionCardProps {
  toolName: string;
  agentName?: string;
  params: Record<string, any>;
  result: Record<string, any>;
  status: 'running' | 'completed' | 'error';
  timestamp?: string;
}

export const ToolExecutionCard: React.FC<ToolExecutionCardProps> = ({
  toolName,
  agentName = '@investigator',
  params,
  result,
  status,
  timestamp = 'Just now',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Realistic mock execution latencies
  const latency = toolName === 'lookup_customer' ? '42ms' : '68ms';

  return (
    <div className="my-2 border border-neutral-800 bg-[#12131b] rounded-[2px] overflow-hidden text-xs font-mono">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#161722] hover:bg-[#1a1b28] transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          )}

          <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>&gt;_ {toolName}()</span>
          </div>

          <span className="text-neutral-500 text-[11px]">invoked by</span>
          <span className="text-neutral-200 text-[11px] font-bold">{agentName}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[10px] text-neutral-400 bg-neutral-800/80 px-1.5 py-0.2 rounded-[2px] border border-neutral-700">
            {latency}
          </span>
          <span className="text-[10px] text-neutral-500">{timestamp}</span>
          {status === 'running' && (
            <span className="flex items-center gap-1 text-amber-400 text-[10px] font-bold">
              <Loader2 className="w-3 h-3 animate-spin" />
              RUNNING
            </span>
          )}
          {status === 'completed' && (
            <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              COMPLETED
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1 text-rose-400 text-[10px] font-bold">
              <AlertCircle className="w-3 h-3" />
              FAILED
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-3.5 border-t border-neutral-800 bg-[#0d0e14] space-y-3">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold mb-1">
              Parameters Injected
            </div>
            <pre className="p-2.5 bg-[#141520] text-neutral-300 rounded-[2px] border border-neutral-800 overflow-x-auto text-[11px] leading-relaxed">
              {JSON.stringify(params, null, 2)}
            </pre>
          </div>

          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold mb-1">
              Deterministic Tool Return
            </div>
            <pre className="p-2.5 bg-[#141520] text-emerald-300 rounded-[2px] border border-neutral-800 overflow-x-auto text-[11px] leading-relaxed max-h-48">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
