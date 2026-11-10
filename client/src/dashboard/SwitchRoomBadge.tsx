import React from 'react';
import { Network, Bot } from 'lucide-react';
import type { SwitchAgentState } from '../types';

interface SwitchRoomBadgeProps {
  roomName?: string;
  agents?: SwitchAgentState[];
  isProcessing?: boolean;
}

export const SwitchRoomBadge: React.FC<SwitchRoomBadgeProps> = ({
  roomName = 'cloud-support',
  agents = [
    { name: '@triager', role: 'Classification & Priority', status: 'idle' },
    { name: '@investigator', role: 'Deterministic Data Verification', status: 'idle' },
    { name: '@responder', role: 'Fact-Grounded Draft Composer', status: 'idle' },
  ],
  isProcessing = false,
}) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 bg-[#121319] border border-white/[0.08] rounded-[4px] text-xs shrink-0">
      <div className="flex items-center gap-1.5 sm:gap-2 sm:border-r sm:border-white/[0.08] sm:pr-3">
        <div className="relative">
          <Network className="w-3.5 h-3.5 text-blue-400" />
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
              isProcessing ? 'bg-amber-400 animate-ping motion-reduce:animate-none' : 'bg-emerald-400'
            }`}
          />
        </div>
        <div>
          <span className="hidden sm:block text-[10px] uppercase font-mono text-neutral-400 tracking-wider">Switch Room</span>
          <div className="font-mono text-[11px] sm:text-xs font-medium text-neutral-200">#{roomName}</div>
        </div>
      </div>

      {/* Agents Active */}
      <div className="hidden lg:flex items-center gap-2">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] font-mono text-[11px] border transition-colors ${
              agent.status !== 'idle'
                ? 'bg-blue-950/40 border-blue-600/50 text-blue-300'
                : 'bg-white/[0.04] border-white/[0.08] text-neutral-400'
            }`}
          >
            <Bot className="w-3 h-3 text-neutral-400" />
            <span>{agent.name}</span>
            {agent.status !== 'idle' && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse motion-reduce:animate-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
