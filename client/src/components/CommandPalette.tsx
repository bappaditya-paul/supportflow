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
  ArrowRight,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  const commands = [
    { label: 'Overview & Features', path: '/', icon: ArrowRight, category: 'Pages' },
    { label: 'Pricing & Plans', path: '/pricing', icon: CreditCard, category: 'Pages' },
    { label: 'Documentation Hub', path: '/docs', icon: BookOpen, category: 'Pages' },
    { label: 'SaaS Demo Sandbox', path: '/demo', icon: Monitor, category: 'Pages' },
    { label: 'Split View Demonstration', path: '/split', icon: Columns, category: 'Pages' },
    { label: 'Operator Cockpit / Inbox', path: '/dashboard', icon: LayoutDashboard, category: 'Workspace' },
    { label: 'Customer CRM Directory', path: '/dashboard', icon: Users, category: 'Workspace' },
    { label: 'Switch Swarm Telemetry', path: '/dashboard', icon: Bot, category: 'Workspace' },
    { label: 'Switch to Light Theme', action: () => setTheme('light'), icon: Sun, category: 'Theme' },
    { label: 'Switch to Dark Theme', action: () => setTheme('dark'), icon: Moon, category: 'Theme' },
    { label: 'Use System Theme Preference', action: () => setTheme('system'), icon: Monitor, category: 'Theme' },
    { label: 'Sign In to Workspace', path: '/login', icon: ArrowRight, category: 'Auth' },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (cmd: typeof commands[0]) => {
    if (cmd.action) {
      cmd.action();
    } else if (cmd.path) {
      navigate(cmd.path);
    }
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      } else if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filtered[selectedIndex]) {
            handleSelect(filtered[selectedIndex]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filtered, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-xs p-4 motion-reduce:transition-none">
      <div
        className="w-full max-w-lg bg-[#121319] border border-white/[0.12] rounded-[6px] shadow-2xl overflow-hidden text-neutral-200 font-sans"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-3.5 py-3 border-b border-white/[0.08] bg-[#0d0e12]">
          <Search className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, page, or ticket ID…"
            aria-label="Type a command or search"
            autoFocus
            className="w-full bg-transparent text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className="p-1 text-neutral-500 hover:text-white rounded-[3px] transition-colors cursor-pointer"
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
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.label}
                  type="button"
                  onClick={() => handleSelect(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-2 rounded-[4px] text-xs transition-colors text-left cursor-pointer group ${
                    isSelected ? 'bg-white/[0.08] text-white' : 'text-neutral-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 transition-colors ${isSelected ? 'text-[#DF3E03]' : 'text-neutral-400 group-hover:text-[#DF3E03]'}`} />
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
        <div className="px-3.5 py-2.5 bg-[#090a0f] border-t border-white/[0.08] flex items-center justify-between text-[10px] text-neutral-500 font-mono">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-white/[0.06] border border-white/[0.08] rounded-[2px] text-neutral-400">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-white/[0.06] border border-white/[0.08] rounded-[2px] text-neutral-400">↓</kbd>
            <span>Navigate</span>
            <kbd className="px-1.5 py-0.5 bg-white/[0.06] border border-white/[0.08] rounded-[2px] text-neutral-400 ml-2">↵</kbd>
            <span>Select</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white/[0.06] border border-white/[0.08] rounded-[2px] text-neutral-400">ESC</kbd>
            <span>to close</span>
          </span>
        </div>
      </div>
    </div>
  );
};
