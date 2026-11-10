import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'button' | 'segmented';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'button',
  className = '',
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (variant === 'segmented') {
    return (
      <div
        role="group"
        aria-label="Theme selector"
        className={`inline-flex items-center rounded-[4px] p-0.5 bg-neutral-200 dark:bg-white/[0.06] border border-border-default text-xs font-mono ${className}`}
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          aria-pressed={theme === 'light'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] transition-colors cursor-pointer ${
            theme === 'light'
              ? 'bg-white text-neutral-900 shadow-xs font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
          title="Light mode"
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          aria-pressed={theme === 'dark'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] transition-colors cursor-pointer ${
            theme === 'dark'
              ? 'bg-neutral-900 dark:bg-white/10 text-white shadow-xs font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
          title="Dark mode"
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Dark</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('system')}
          aria-pressed={theme === 'system'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] transition-colors cursor-pointer ${
            theme === 'system'
              ? 'bg-white text-neutral-900 dark:bg-white/10 dark:text-white shadow-xs font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
          title="Sync with system preference"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>System</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Current: ${theme} (${resolvedTheme}). Click to switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'}.`}
      className={`p-2 rounded-[4px] border border-border-default hover:bg-neutral-100 dark:hover:bg-white/[0.06] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer flex items-center justify-center ${className}`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-neutral-700" />
      )}
    </button>
  );
};

