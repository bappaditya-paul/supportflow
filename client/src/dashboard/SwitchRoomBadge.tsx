import React from 'react';
import { Network, Bot, Cpu, CheckCircle2, Clock } from 'lucide-react';
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
    <div className="flex items-center gap-3 px-3 py-1.5 bg-[#18191f] border border-neutral-800 rounded-[2px] text-xs">
      <div className="flex items-center gap-2 border-r border-neutral-800 pr-3">
        <div className="relative">
          <Network className="w-4 h-4 text-blue-400" />
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
              isProcessing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
            }`}
          />
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider">Switch Room</span>
          <div className="font-mono font-medium text-neutral-200">#{roomName}</div>
        </div>
      </div>

      {/* Agents Active */}
      <div className="flex items-center gap-2">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] font-mono text-[11px] border transition-colors ${
              agent.status !== 'idle'
                ? 'bg-blue-950/40 border-blue-600/50 text-blue-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400'
            }`}
          >
            <Bot className="w-3 h-3 text-neutral-400" />
            <span>{agent.name}</span>
            {agent.status !== 'idle' && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
