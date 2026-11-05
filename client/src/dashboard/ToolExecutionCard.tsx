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

  return (
    <div className="my-2 border border-neutral-800 bg-[#16171d] rounded-[2px] overflow-hidden text-xs font-mono">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-[#1b1c24] hover:bg-[#20222c] transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          )}

          <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>{toolName}()</span>
          </div>

          <span className="text-neutral-500 text-[11px]">invoked by</span>
          <span className="text-neutral-300 text-[11px] font-semibold">{agentName}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-500">{timestamp}</span>
          {status === 'running' && (
            <span className="flex items-center gap-1 text-amber-400 text-[10px]">
              <Loader2 className="w-3 h-3 animate-spin" />
              RUNNING
            </span>
          )}
          {status === 'completed' && (
            <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
              <CheckCircle2 className="w-3 h-3" />
              COMPLETED
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1 text-rose-400 text-[10px]">
              <AlertCircle className="w-3 h-3" />
              FAILED
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 border-t border-neutral-800 bg-[#111216] space-y-2.5">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Arguments</div>
            <pre className="p-2 bg-[#171821] text-neutral-300 rounded-[2px] overflow-x-auto text-[11px] leading-relaxed">
              {JSON.stringify(params, null, 2)}
            </pre>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Execution Output</div>
            <pre className="p-2 bg-[#171821] text-emerald-300/90 rounded-[2px] overflow-x-auto text-[11px] leading-relaxed max-h-48">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
