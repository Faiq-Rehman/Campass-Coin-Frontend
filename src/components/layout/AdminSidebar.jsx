import React from 'react';
<<<<<<< HEAD
import { AnimatePresence, motion } from 'framer-motion';
=======
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Tag,
  Lightbulb,
  FileText,
  Megaphone,
  BarChart3,
  LogOut,
<<<<<<< HEAD
  ArrowLeft,
  X
=======
  ArrowLeft
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ADMIN_NAV = [
  { name: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Students', path: '/admin/students', icon: Users },
  { name: 'System Categories', path: '/admin/categories', icon: Tag },
  { name: 'Tip Templates', path: '/admin/tips', icon: Lightbulb },
  { name: 'Audit Logs', path: '/admin/logs', icon: FileText },
  { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
  { name: 'Platform Stats', path: '/admin/statistics', icon: BarChart3 }
];

<<<<<<< HEAD
const AdminSidebar = ({ mobileOpen = false, setMobileOpen }) => {
=======
const AdminSidebar = () => {
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
  const { admin, logoutAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    toast.success('Admin session ended');
    navigate('/admin/login');
  };

<<<<<<< HEAD
  const renderContent = (mobile = false) => (
    <div className="admin-sidebar-content">
      <div className="admin-brand">
        <div className="admin-brand-icon">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2>Campus Admin</h2>
          <span>Control Center</span>
        </div>
      </div>

      {mobile && (
        <button
          type="button"
          className="admin-sidebar-close"
          onClick={() => setMobileOpen && setMobileOpen(false)}
          aria-label="Close admin menu"
        >
          <X size={18} />
        </button>
      )}

      <nav className="admin-nav">
=======
  return (
    <aside
      style={{
        width: '260px',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        backgroundColor: '#0A1128',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        boxSizing: 'border-box'
      }}
    >
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '0 0.5rem' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)'
          }}
        >
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
            Campus Admin
          </h2>
          <span style={{ fontSize: '0.7rem', color: '#38BDF8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Control Center
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, overflowY: 'auto' }}>
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
<<<<<<< HEAD
              onClick={() => mobile && setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
=======
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.85rem',
                borderRadius: '10px',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                backgroundColor: isActive ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                color: isActive ? '#38BDF8' : '#94A3B8',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: isActive ? '0 0 15px rgba(37, 99, 235, 0.15)' : 'none',
                transition: 'all 0.2s ease'
              })}
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

<<<<<<< HEAD
      <div className="admin-sidebar-footer">
        <button
          onClick={() => {
            navigate('/dashboard');
            if (mobile && setMobileOpen) setMobileOpen(false);
          }}
          className="admin-student-link"
=======
      {/* Footer & Back to Student Portal */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            fontSize: '0.8rem',
            cursor: 'pointer',
            padding: '0.4rem 0.5rem',
            borderRadius: '6px'
          }}
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
        >
          <ArrowLeft size={16} />
          <span>Student Portal</span>
        </button>

<<<<<<< HEAD
        <div className="admin-user-card">
          <div className="admin-user-meta">
            <div className="admin-user-avatar">A</div>
            <div className="admin-user-text">
              <p>{admin?.username || 'Administrator'}</p>
              <span>Master Access</span>
=======
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.3)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
              A
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {admin?.username || 'Administrator'}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: 0 }}>Master Access</p>
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Admin Logout"
<<<<<<< HEAD
            className="admin-logout-btn"
=======
            style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
<<<<<<< HEAD
    </div>
  );

  return (
    <>
      <aside className="admin-sidebar-desktop">
        {renderContent()}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="admin-mobile-sidebar-overlay">
            <motion.div
              className="admin-mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen && setMobileOpen(false)}
            />
            <motion.aside
              className="admin-mobile-sidebar-panel"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {renderContent(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
=======
    </aside>
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
  );
};

export default AdminSidebar;
