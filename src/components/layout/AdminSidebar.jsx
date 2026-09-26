import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  ArrowLeft,
  X
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

const AdminSidebar = ({ mobileOpen = false, setMobileOpen }) => {
  const { admin, logoutAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    toast.success('Admin session ended');
    navigate('/admin/login');
  };

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
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => mobile && setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <button
          onClick={() => {
            navigate('/dashboard');
            if (mobile && setMobileOpen) setMobileOpen(false);
          }}
          className="admin-student-link"
        >
          <ArrowLeft size={16} />
          <span>Student Portal</span>
        </button>

        <div className="admin-user-card">
          <div className="admin-user-meta">
            <div className="admin-user-avatar">A</div>
            <div className="admin-user-text">
              <p>{admin?.username || 'Administrator'}</p>
              <span>Master Access</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Admin Logout"
            className="admin-logout-btn"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
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
  );
};

export default AdminSidebar;
