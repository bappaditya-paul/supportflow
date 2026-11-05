import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  Columns,
  LayoutDashboard,
  ExternalLink,
  Github,
  Menu,
  X,
  Sparkles,
  Command,
} from 'lucide-react';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
  wsConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  wsConnected = false,
}) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Documentation', path: '/docs' },
    { label: 'Live Sandbox', path: '/demo' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-[#0d0e12]/90 backdrop-blur-md select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        {/* Brand Logo & Switch AI Badge */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-6 h-6 rounded-[3px] bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
              SF
            </div>
            <span className="font-bold text-xs tracking-tight text-white uppercase font-mono">
              SupportFlow
            </span>
          </Link>

          <span className="text-neutral-700">|</span>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span>Switch AI: 34079</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer font-medium ${
                  active
                    ? 'text-white bg-neutral-800/80'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Search Shortcut */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="hidden lg:flex items-center gap-1.5 px-2 py-1 text-xs text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-[2px] transition-colors cursor-pointer"
              title="Quick Search"
            >
              <Command className="w-3 h-3" />
              <span className="text-[11px] font-mono">Search</span>
              <kbd className="px-1 py-0.2 bg-neutral-800 text-[10px] font-mono text-neutral-400 rounded-[2px]">
                ⌘K
              </kbd>
            </button>
          )}

          {/* GitHub Star Link */}
          <a
            href="https://github.com/sandbox-quantum/switch"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-[2px] transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">Star</span>
          </a>

          {/* Split Demo View Shortcut */}
          <Link
            to="/split"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-[2px] border transition-colors cursor-pointer ${
              isActive('/split')
                ? 'bg-blue-600 text-white border-blue-500'
                : 'text-neutral-300 hover:text-white bg-[#161722] border-blue-900/60 hover:border-blue-700'
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-blue-400" />
            <span>Split Demo</span>
          </Link>

          {/* Operator Cockpit Link */}
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-[2px] transition-colors cursor-pointer shadow-xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Operator Desk</span>
            <span className="sm:hidden">Cockpit</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-neutral-400 hover:text-white rounded-[2px] border border-neutral-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-[#121319] p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-[2px]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-neutral-800 flex gap-2">
            <Link
              to="/split"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs font-mono bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-[2px]"
            >
              Split View
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs font-medium bg-neutral-800 text-white rounded-[2px]"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};