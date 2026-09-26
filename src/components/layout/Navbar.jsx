import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Bell, Plus, User, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = ({ isMobileOpen, onMobileMenuToggle, onQuickAddClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  useEffect(() => {
    const fetchNotificationBadge = async () => {
      try {
        const res = await notificationService.getNotifications();
        if (res.success && res.data) {
          setUnreadCount(res.data.unreadCount || 0);
          setRecentNotifs((res.data.notifications || []).slice(0, 4));
        }
      } catch (err) {
        // Silent fail for navbar background poll
      }
    };

    fetchNotificationBadge();
    const interval = setInterval(fetchNotificationBadge, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header
      className="app-navbar"
      style={{
        height: '70px',
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}
    >
      {/* Left: Mobile Toggle & Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={Boolean(isMobileOpen)}
          onClick={(e) => {
            e.stopPropagation();
            if (onMobileMenuToggle) onMobileMenuToggle();
          }}
          className="mobile-menu-button"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '8px',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {getGreeting()}, <span style={{ color: 'var(--blue-primary)' }}>{user?.fullName?.split(' ')[0] || 'Student'}</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0, fontWeight: 500 }}>
            Smart Spending &bull; {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right: Quick Actions & Theme Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {onQuickAddClick && (
          <Button
            variant="gold"
            size="sm"
            icon={Plus}
            onClick={onQuickAddClick}
            className="hidden sm:inline-flex"
          >
            Add Transaction
          </Button>
        )}

        <ThemeToggle />

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: unreadCount > 0 ? 'var(--blue-primary)' : 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s'
            }}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--danger)',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Quick Notification Panel */}
          {showNotifMenu && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '320px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 50
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Notifications ({unreadCount})
                </span>
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifMenu(false)}
                  style={{ fontSize: '0.75rem', color: 'var(--blue-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}
                >
                  View All <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {recentNotifs.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', margin: '1rem 0' }}>
                  No recent notifications
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {recentNotifs.map((n) => (
                    <div
                      key={n._id}
                      style={{
                        padding: '0.5rem 0.65rem',
                        backgroundColor: n.read ? 'var(--bg-secondary)' : 'var(--blue-subtle)',
                        border: '1px solid',
                        borderColor: n.read ? 'var(--border)' : 'var(--border-accent)',
                        borderRadius: '8px'
                      }}
                    >
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                        {n.title}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '2px 0 0 0', lineHeight: 1.3 }}>
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Link */}
        <Link
          to="/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--blue-subtle)',
              border: '1px solid var(--border-accent)',
              color: 'var(--blue-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
