import React from 'react';
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative w-14 h-7 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1a1a2e, #16213e)'
          : 'linear-gradient(135deg, #fde68a, #fbbf24)',
        border: '1px solid var(--border)',
        boxShadow: isDark
          ? '0 0 12px rgba(99,102,241,0.3)'
          : '0 0 12px rgba(251,191,36,0.4)',
      }}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none select-none">
        {isDark ? '🌙' : ''}
      </span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none select-none">
        {!isDark ? '☀️' : ''}
      </span>

      {/* Thumb */}
      <span
        className="absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-500 flex items-center justify-center text-xs"
        style={{
          left: isDark ? '2px' : 'calc(100% - 26px)',
          background: isDark
            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
            : 'linear-gradient(135deg, #fff, #fef3c7)',
        }}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}

export default ThemeToggle;
