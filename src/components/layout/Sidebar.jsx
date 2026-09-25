import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  PieChart,
  Lightbulb,
  Sparkles,
  Tag,
  Bell,
  User,
  Settings,
  LogOut,
  X,
  Coins,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: Receipt },
  { name: 'Budgets', path: '/budgets', icon: PiggyBank },
  { name: 'Reports', path: '/reports', icon: PieChart },
  { name: 'AI Assistant', path: '/ai-assistant', icon: Bot },
  { name: 'Insights', path: '/insights', icon: Lightbulb },
  { name: 'Saving Tips', path: '/tips', icon: Sparkles },
  { name: 'Categories', path: '/categories', icon: Tag },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings }
];

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const renderSidebarContent = ({ showCloseButton = false }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '1.5rem 1rem',
        backgroundColor: '#0A1128',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          padding: '0 2.5rem 0 0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)'
            }}
          >
            <Coins size={20} />
          </div>
          <div>
            <h2
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#F8FAFC',
                margin: 0,
                letterSpacing: '-0.02em'
              }}
            >
              Campus Coin
            </h2>
            <span
              style={{
                fontSize: '0.7rem',
                color: '#38BDF8',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Smart Spending
            </span>
          </div>
        </div>

        {showCloseButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (setMobileOpen) setMobileOpen(false);
            }}
            aria-label="Close menu"
            title="Close sidebar"
            style={{
              position: 'absolute',
              top: '-0.25rem',
              right: '0',
              width: '34px',
              height: '34px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px'
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, overflowY: 'auto' }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 0.75rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(37, 99, 235, 0.3)',
                color: '#38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem',
                flexShrink: 0
              }}
            >
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#F8FAFC',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                {user?.fullName || 'Student'}
              </p>
              <p
                style={{
                  fontSize: '0.7rem',
                  color: '#94A3B8',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                {user?.email || 'Campus Member'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#EF4444',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="desktop-sidebar">
        {renderSidebarContent({ showCloseButton: false })}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="mobile-sidebar-overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="mobile-sidebar-backdrop"
            />

            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mobile-sidebar-panel"
            >
              {renderSidebarContent({ showCloseButton: true })}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
