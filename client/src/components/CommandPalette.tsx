import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  CreditCard,
  BookOpen,
  Monitor,
  Columns,
  Users,
  Bot,
  Settings,
  ArrowRight,
  X,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { label: 'Overview & Features', path: '/', icon: ArrowRight, category: 'Pages' },
    { label: 'Pricing & Plans', path: '/pricing', icon: CreditCard, category: 'Pages' },
    { label: 'Documentation Hub', path: '/docs', icon: BookOpen, category: 'Pages' },
    { label: 'SaaS Demo Sandbox', path: '/demo', icon: Monitor, category: 'Pages' },
    { label: 'Split View Demonstration', path: '/split', icon: Columns, category: 'Pages' },
    { label: 'Operator Cockpit / Inbox', path: '/dashboard', icon: LayoutDashboard, category: 'Workspace' },
    { label: 'Customer CRM Directory', path: '/dashboard', icon: Users, category: 'Workspace' },
    { label: 'Switch Swarm Telemetry', path: '/dashboard', icon: Bot, category: 'Workspace' },
    { label: 'Sign In to Workspace', path: '/login', icon: ArrowRight, category: 'Auth' },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-[#14151d] border border-neutral-700 rounded-[4px] shadow-2xl overflow-hidden text-neutral-200 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-3.5 py-3 border-b border-neutral-800 bg-[#161722]">
          <Search className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, page, or ticket ID..."
            autoFocus
            className="w-full bg-transparent text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-white rounded-[2px]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-neutral-500 font-mono">
              No results found for "{query}"
            </div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.label}
                  onClick={() => handleSelect(cmd.path)}
                  className="w-full flex items-center justify-between p-2 rounded-[2px] text-xs text-neutral-300 hover:text-white hover:bg-neutral-800/70 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-400" />
                    <span>{cmd.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-3 py-2 bg-[#101117] border-t border-neutral-850 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
          <span>Navigate with arrow keys</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
