import React from 'react';
import {
  Inbox,
  Users,
  Bot,
  BookOpen,
  Settings,
  Activity,
} from 'lucide-react';

interface SidebarNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  openTicketsCount?: number;
  compact?: boolean;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentTab,
  onSelectTab,
  openTicketsCount = 0,
  compact = false,
}) => {
  const navItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: openTicketsCount },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'agents', label: 'Switch Swarm', icon: Bot, isNew: true },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`${
        compact ? 'w-14' : 'w-56'
      } shrink-0 h-full bg-[#111216] border-r border-neutral-800 flex flex-col justify-between select-none transition-all duration-200`}
    >
      <div>
        {/* Brand Header */}
        <div className={`border-b border-neutral-800 ${compact ? 'p-3 flex justify-center' : 'p-4'}`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[3px] bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              SF
            </div>
            {!compact && (
              <div>
                <div className="text-sm font-bold text-neutral-100 tracking-tight flex items-center gap-1.5">
                  SupportFlow
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-blue-900/50 text-blue-300 border border-blue-700/60 rounded-[2px]">
                    PRO
                  </span>
                </div>
                <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Switch AI Bridge Active
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-1.5 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={compact ? item.label : undefined}
                className={`w-full flex items-center ${
                  compact ? 'justify-center p-2' : 'justify-between px-3 py-2'
                } rounded-[2px] text-xs font-medium transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#181921] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-neutral-400'}`} />
                  {!compact && <span>{item.label}</span>}
                </div>

                {!compact && item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-neutral-800 text-neutral-200 rounded-[2px]">
                    {item.badge}
                  </span>
                )}

                {compact && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
                )}

                {!compact && item.isNew && (
                  <span className="px-1 py-0.2 text-[9px] font-mono uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 rounded-[2px]">
                    Swarm
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Switch AI Connectivity */}
      <div className={`border-t border-neutral-800 ${compact ? 'p-2 flex justify-center' : 'p-3 space-y-3'}`}>
        {!compact ? (
          <>
            <div className="p-2.5 bg-[#171822] border border-neutral-800 rounded-[2px]">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  Switch Server
                </span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
              <div className="text-[10px] text-neutral-500 font-mono truncate">
                localhost:34079 · Mattermost
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-300 border border-neutral-700">
                OP
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-medium text-neutral-200 truncate">Operator Desk</div>
                <div className="text-[10px] text-neutral-500 truncate">admin@supportflow.ai</div>
              </div>
            </div>
          </>
        ) : (
          <div
            className="w-2.5 h-2.5 rounded-full bg-emerald-400"
            title="Switch Server Online (localhost:34079)"
          />
        )}
      </div>
    </aside>
  );
};