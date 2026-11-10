import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Columns,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { MaskLogo, GlassKeycap, FacehashAvatar } from './primitives';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
  wsConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  wsConnected = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0d0e12]/95 backdrop-blur-md select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo & Switch AI Badge */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 group cursor-pointer text-white focus-visible:ring-1 focus-visible:ring-[#DF3E03] rounded-[2px]"
            aria-label="SupportFlow home"
          >
            <MaskLogo size={22} withText textClassName="text-sm font-bold text-white tracking-tight" />
          </Link>

          <span className="text-white/10" aria-hidden="true">|</span>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-neutral-400">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                wsConnected ? 'bg-emerald-400 animate-pulse motion-reduce:animate-none' : 'bg-emerald-500'
              }`}
              aria-hidden="true"
            />
            <span>Switch AI: 34079</span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-sans" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors cursor-pointer font-medium py-1 px-1.5 rounded-[2px] ${
                  active
                    ? 'text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Elements */}
        <div className="flex items-center gap-2.5">
          {/* Search Trigger conforming to 8px height (h-8) */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Search documentation and commands"
            className="hidden lg:flex items-center justify-between w-40 h-8 px-2.5 bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.16] rounded-[4px] text-xs text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer group"
          >
            <span className="text-[11px] font-sans">Search…</span>
            <GlassKeycap>⌘K</GlassKeycap>
          </button>

          {/* User Session or Login Links */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 h-8 px-2 bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.16] rounded-[4px] transition-colors cursor-pointer"
              >
                <FacehashAvatar seed={user.avatarSeed} size="xs" showStatus status="online" />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-medium text-white leading-tight">
                    {user.name}
                  </div>
                </div>
              </button>

              {userDropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 bg-[#121319] border border-white/10 rounded-[4px] shadow-2xl py-1 z-50 text-xs font-sans"
                >
                  <div className="px-3 py-2 border-b border-white/[0.08]">
                    <div className="font-semibold text-white truncate">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono truncate">
                      {user.email}
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    role="menuitem"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-neutral-200 hover:bg-white/[0.06] cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
                    <span>Operator Cockpit</span>
                  </Link>
                  <Link
                    to="/split"
                    role="menuitem"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-neutral-200 hover:bg-white/[0.06] cursor-pointer"
                  >
                    <Columns className="w-3.5 h-3.5 text-purple-400" />
                    <span>Split Demo View</span>
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-950/30 text-left border-t border-white/[0.08] cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
              <Link
                to="/login"
                className="h-8 px-3 inline-flex items-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="h-8 px-3 inline-flex items-center bg-white hover:bg-neutral-200 text-neutral-950 font-semibold rounded-[4px] transition-colors cursor-pointer shadow-xs"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Theme Toggle Button */}
          <ThemeToggle variant="button" className="h-8 w-8" />

          {/* Quick Split / Cockpit Launchers conforming to h-8 */}
          <Link
            to="/split"
            title="Split Demo Mode"
            aria-label="Split Demo Mode"
            className="h-8 w-8 inline-flex items-center justify-center rounded-[4px] border border-white/[0.08] hover:border-white/[0.16] bg-white/[0.02] hover:bg-white/[0.06] text-neutral-400 hover:text-white transition-colors"
          >
            <Columns className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/dashboard"
            title="Operator Cockpit"
            aria-label="Operator Cockpit"
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-[4px] bg-[#DF3E03] hover:bg-[#f0490c] text-white font-medium text-xs transition-colors shadow-xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cockpit</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-8 w-8 inline-flex items-center justify-center text-neutral-400 hover:text-white rounded-[4px] border border-white/[0.08]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#121319] p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.04] rounded-[4px]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/[0.08] flex gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs font-medium border border-white/[0.08] text-white rounded-[4px]"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs font-medium bg-white text-neutral-900 rounded-[4px]"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
