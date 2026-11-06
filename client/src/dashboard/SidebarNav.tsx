import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Users,
  Bot,
  BookOpen,
  Settings,
  Activity,
  ChevronDown,
  LogOut,
  Sparkles,
  Command,
} from 'lucide-react';
import { MaskLogo, FacehashAvatar } from '../components/primitives';
import { useAuth, DEMO_OPERATOR, DEMO_FOUNDER } from '../context/AuthContext';

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
  const { user, loginAs, logout } = useAuth();
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const activeUser = user || DEMO_OPERATOR;

  const navItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: openTicketsCount, shortcut: '⌘1' },
    { id: 'contacts', label: 'Contacts (CRM)', icon: Users, shortcut: '⌘2' },
    { id: 'agents', label: 'Switch Swarm', icon: Bot, isNew: true, shortcut: '⌘3' },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen, shortcut: '⌘4' },
    { id: 'settings', label: 'Settings', icon: Settings, shortcut: '⌘5' },
  ];

  return (
    <aside
      className={`${
        compact ? 'w-16' : 'w-60'
      } shrink-0 h-full bg-[#0d0e12] border-r border-dashed border-neutral-800 flex flex-col justify-between select-none transition-all duration-200 z-20`}
    >
      <div>
        {/* Brand & Workspace Switcher Header */}
        <div className={`border-b border-dashed border-neutral-800 ${compact ? 'p-3 flex justify-center' : 'p-3.5'}`}>
          {!compact ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="w-full flex items-center justify-between p-1.5 rounded-[2px] hover:bg-[#161720] border border-transparent hover:border-neutral-800 transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-[2px] bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0">
                    <MaskLogo size={16} className="text-[#DF3E03]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-neutral-100 truncate flex items-center gap-1.5">
                      <span>{activeUser.workspace}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Switch Node 34079
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 shrink-0" />
              </button>

              {/* Org Switcher Menu */}
              {orgDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-[#14151e] border border-neutral-700 rounded-[2px] shadow-2xl py-1 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-neutral-400 uppercase border-b border-neutral-800">
                    Switch Workspace
                  </div>
                  <button
                    onClick={() => {
                      loginAs(DEMO_OPERATOR);
                      setOrgDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-neutral-800 flex items-center justify-between text-neutral-200 cursor-pointer"
                  >
                    <span className="truncate">SupportFlow · Pro Swarm</span>
                    <span className="text-[9px] font-mono text-[#DF3E03] bg-[#DF3E03]/10 px-1 py-0.5 rounded-[2px]">ACTIVE</span>
                  </button>
                  <button
                    onClick={() => {
                      loginAs(DEMO_FOUNDER);
                      setOrgDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-neutral-800 flex items-center justify-between text-neutral-400 hover:text-neutral-200 cursor-pointer"
                  >
                    <span className="truncate">CloudDesk HQ</span>
                    <span className="text-[9px] font-mono text-neutral-500">ADMIN</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/" title="SupportFlow Home" className="block">
              <div className="w-8 h-8 rounded-[2px] bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <MaskLogo size={18} className="text-[#DF3E03]" />
              </div>
            </Link>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={compact ? `${item.label} (${item.shortcut})` : undefined}
                className={`w-full flex items-center ${
                  compact ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                } rounded-[2px] text-xs font-medium transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-[#181924] text-white border-l-2 border-l-[#DF3E03] border-y border-r border-transparent shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#14151b] border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#DF3E03]' : 'text-neutral-400'}`} />
                  {!compact && <span className="truncate">{item.label}</span>}
                </div>

                {!compact && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.isNew && (
                      <span className="px-1.5 py-0.2 text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 rounded-[2px] flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                        LIVE
                      </span>
                    )}

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-[#DF3E03]/15 text-[#DF3E03] border border-[#DF3E03]/30 rounded-[2px]">
                        {item.badge}
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-500 opacity-60">
                      {item.shortcut}
                    </span>
                  </div>
                )}

                {compact && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DF3E03]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Switch Server Connectivity & Profile Drawer */}
      <div className={`border-t border-dashed border-neutral-800 ${compact ? 'p-2 flex flex-col items-center gap-3' : 'p-3 space-y-3'}`}>
        {!compact ? (
          <>
            {/* Live Telemetry Pill */}
            <div className="p-2.5 bg-[#12131a] border border-neutral-800/80 rounded-[2px]">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  Switch AI Core
                </span>
                <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950/60 px-1 py-0.2 rounded-[2px] border border-emerald-800/40">
                  ONLINE
                </span>
              </div>
              <div className="text-[10px] text-neutral-500 font-mono truncate flex items-center justify-between">
                <span>port 34079 · 11ms</span>
                <span className="text-neutral-400">#cloud-support</span>
              </div>
            </div>

            {/* Operator User Card with Facehash */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-full flex items-center justify-between p-2 rounded-[2px] hover:bg-[#161720] border border-transparent hover:border-neutral-800 transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FacehashAvatar seed={activeUser.avatarSeed} size="sm" showStatus status="online" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-neutral-200 truncate flex items-center gap-1.5">
                      {activeUser.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono truncate">
                      {activeUser.roleTitle}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 shrink-0" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-1 w-full bg-[#14151e] border border-neutral-700 rounded-[2px] shadow-2xl py-1 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-neutral-800">
                    <div className="font-semibold text-neutral-200 truncate">{activeUser.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono truncate">{activeUser.email}</div>
                  </div>
                  <Link
                    to="/"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="w-full px-3 py-2 text-left hover:bg-neutral-800 flex items-center gap-2 text-neutral-300 cursor-pointer"
                  >
                    <span>View Public Landing</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-rose-950/40 text-rose-400 flex items-center gap-2 cursor-pointer border-t border-neutral-800"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div
              className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-950/50"
              title="Switch Server Online (localhost:34079)"
            />
            <div title={`${activeUser.name} (${activeUser.roleTitle})`}>
              <FacehashAvatar seed={activeUser.avatarSeed} size="xs" showStatus status="online" />
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
