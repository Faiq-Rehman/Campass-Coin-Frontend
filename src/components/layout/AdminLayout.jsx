import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, LogOut, ArrowLeft, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const { admin, logoutAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) setMobileSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    toast.success('Admin session ended');
    navigate('/admin/login');
  };

  // Compute breadcrumb/title from path
  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes('/admin/students') || p.includes('/admin/users')) return 'Student Directory';
    if (p.includes('/admin/categories')) return 'System Categories';
    if (p.includes('/admin/tips')) return 'Financial Tip Templates';
    if (p.includes('/admin/logs')) return 'Administrator Audit Trail';
    if (p.includes('/admin/announcements')) return 'Campus Broadcasts';
    if (p.includes('/admin/statistics')) return 'Platform Telemetry & Stats';
    return 'Administrator Overview';
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', overflow: 'hidden' }}>
      {/* Admin Sidebar */}
      <AdminSidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Admin Content */}
      <div className="admin-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', overflow: 'hidden' }}>
        {/* Subtle emerald/cyan ambient admin glow */}
        <div
          className="bg-ambient"
          style={{
            top: '0%',
            right: '10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Top Header Bar */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            backdropFilter: 'blur(16px)',
            backgroundColor: 'var(--header-bg)',
            borderBottom: '1px solid var(--border)',
            padding: '0.875rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div className="admin-header-left">
            <button
              type="button"
              className="admin-mobile-menu-button"
              aria-label={mobileSidebarOpen ? 'Close admin menu' : 'Open admin menu'}
              onClick={() => setMobileSidebarOpen((prev) => !prev)}
            >
              {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              CampusCoin Admin Portal
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {getPageTitle()}
            </div>
            </div>
          </div>

          <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Back to Student Portal Link */}
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-dim)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#10B981';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-dim)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <ArrowLeft size={14} /> Student View
            </button>

            {/* Admin Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '10px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}
              >
                A
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {admin?.username || 'admin'}
              </div>
              <button
                onClick={handleLogout}
                title="End Admin Session"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#EF4444',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </header>

        <main className="admin-content" style={{ flex: 1, padding: '2rem 1.75rem', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
          <div className="luxury-container" style={{ padding: 0 }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
