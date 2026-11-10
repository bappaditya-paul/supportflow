import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

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
    <div className="my-1.5 border border-white/[0.06] bg-[#0f1016] rounded-[4px] overflow-hidden text-xs font-mono">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 px-3 py-2 bg-[#0f1016] hover:bg-white/[0.02] transition-colors text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          )}

          <div className="flex items-center gap-1.5 text-neutral-200 font-medium truncate">
            <Terminal className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{toolName}()</span>
          </div>

          <span className="hidden sm:inline text-neutral-500 text-[11px]">invoked by</span>
          <span className="text-neutral-400 text-[11px] font-mono shrink-0">{agentName}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-neutral-400 bg-white/[0.04] px-1.5 py-0.2 rounded-[3px] border border-white/[0.06] tabular-nums">
            {latency}
          </span>
          <span className="hidden sm:inline text-[10px] text-neutral-500 tabular-nums">{timestamp}</span>
          {status === 'running' && (
            <span className="flex items-center gap-1 text-amber-300 text-[10px] font-medium">
              <Loader2 className="w-3 h-3 animate-spin motion-reduce:animate-none" />
              RUNNING
            </span>
          )}
          {status === 'completed' && (
            <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-medium">
              <CheckCircle2 className="w-3 h-3" />
              VERIFIED
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1 text-rose-400 text-[10px] font-medium">
              <AlertCircle className="w-3 h-3" />
              FAILED
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-3.5 border-t border-white/[0.06] bg-[#090a0f] space-y-3">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-medium mb-1.5">
              Parameters Injected
            </div>
            <pre className="p-2.5 bg-[#121319] text-neutral-300 rounded-[3px] border border-white/[0.06] overflow-x-auto text-[11px] leading-relaxed">
              {JSON.stringify(params, null, 2)}
            </pre>
          </div>

          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-medium mb-1.5">
              Deterministic Tool Return
            </div>
            <pre className="p-2.5 bg-[#121319] text-emerald-300 rounded-[3px] border border-white/[0.06] overflow-x-auto text-[11px] leading-relaxed max-h-48">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
