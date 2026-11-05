import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Columns,
  LayoutDashboard,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { MaskLogo } from './primitives/MaskLogo';

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
    { label: 'Docs', path: '/docs' },
    { label: 'Blog', path: '/blog' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Changelog', path: '/changelog' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dashed border-neutral-300 dark:border-neutral-800 bg-white/95 dark:bg-[#0d0e12]/95 backdrop-blur-md select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo & Switch AI Badge */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer text-neutral-900 dark:text-white">
            <MaskLogo size={22} withText textClassName="text-sm font-bold text-neutral-900 dark:text-white" />
          </Link>

          <span className="text-neutral-300 dark:text-neutral-700">|</span>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span>Switch AI: 34079</span>
          </div>
        </div>

        {/* Center Nav Links (Cossistant style: Docs, Blog, Pricing, Changelog) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-sans">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors cursor-pointer font-medium ${
                  active
                    ? 'text-neutral-900 dark:text-white font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Elements */}
        <div className="flex items-center gap-3">
          {/* Dashed Search Box (matching Cossistant screenshot) */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden lg:flex items-center justify-between w-36 h-7 px-2.5 bg-neutral-50 dark:bg-[#14151e] border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 rounded-[2px] text-xs text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          >
            <span className="text-[11px] font-sans">Search...</span>
            <kbd className="text-[10px] font-mono opacity-60">⌘K</kbd>
          </button>

          {/* Login / Sign up Links */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-medium">
            <Link
              to="/login"
              className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3 py-1.5 bg-[#121212] hover:bg-[#252525] dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold rounded-[2px] transition-all cursor-pointer shadow-xs"
            >
              Sign up
            </Link>
          </div>

          {/* Quick Split / Cockpit Launchers */}
          <Link
            to="/split"
            title="Split Demo Mode"
            className="p-1.5 rounded-[2px] border border-dashed border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <Columns className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/dashboard"
            title="Operator Cockpit"
            className="p-1.5 rounded-[2px] bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-white rounded-[2px] border border-neutral-300 dark:border-neutral-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#121319] p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-medium text-neutral-800 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-[2px]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-white rounded-[2px]"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs font-medium bg-[#121212] dark:bg-white text-white dark:text-neutral-900 rounded-[2px]"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};