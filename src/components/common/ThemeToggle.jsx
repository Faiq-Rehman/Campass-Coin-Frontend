import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '', style = {} }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
        color: isDark ? '#00E699' : '#0284C7',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...style
      }}
      className={`theme-toggle-btn ${className}`}
    >
      {isDark ? (
        <Sun size={18} style={{ color: '#00E699', filter: 'drop-shadow(0 0 4px rgba(0, 230, 153, 0.4))' }} />
      ) : (
        <Moon size={18} style={{ color: '#0F172A' }} />
      )}
    </button>
  );
};

export default ThemeToggle;
