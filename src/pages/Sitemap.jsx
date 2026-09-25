import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  Shield,
  User,
  LayoutDashboard,
  Receipt,
  PiggyBank,
  PieChart,
  Bot,
  Sparkles,
  Lock,
  Globe,
  Home,
  Tag,
  Bell,
  Sliders,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SITEMAP_NODES = [
  // 1. Public & Guest Routes
  {
    category: 'Public & Guest Access',
    badge: 'Guest Accessible',
    color: '#0EA5E9',
    description: 'Accessible to all visitors without authentication. Defaults to guest mode.',
    routes: [
      {
        title: 'Platform Landing',
        path: '/',
        icon: Home,
        description: 'Public showcase, financial feature highlights, student testimonial, and call to action.',
        access: 'Public / Guest'
      },
      {
        title: 'Student Login',
        path: '/login',
        icon: User,
        description: 'Student portal authentication with email and password credentials.',
        access: 'Public'
      },
      {
        title: 'Student Register',
        path: '/register',
        icon: Sparkles,
        description: 'Student registration with academic year, baseline allowance, and savings goal setup.',
        access: 'Public'
      },
      {
        title: 'Forgot Password',
        path: '/forgot-password',
        icon: Lock,
        description: 'Token-based password recovery and email verification link generation.',
        access: 'Public'
      },
      {
        title: 'Interactive Sitemap',
        path: '/sitemap',
        icon: Compass,
        description: 'Visual system map with complete route topology and role boundaries.',
        access: 'Public'
      },
      {
        title: 'Dedicated Admin Login',
        path: '/admin/login',
        icon: Shield,
        description: 'Isolated administrator authentication gateway with separate security credentials.',
        access: 'Public (Staff)'
      }
    ]
  },

  // 2. Authenticated Student Portal Routes
  {
    category: 'Authenticated Student Portal',
    badge: 'Student Auth Required',
    color: '#10B981',
    description: 'Secured student financial suite requiring active JWT token session.',
    routes: [
      {
        title: 'Student Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        description: 'Live spending trends by category, dynamic income vs expense bar chart, budget meters, and AI quick expense logging.',
        access: 'Student Only'
      },
      {
        title: 'Transactions & CSV Import',
        path: '/transactions',
        icon: Receipt,
        description: 'Searchable paginated transaction ledger, date/category filters, CSV bulk upload, and full CRUD modals.',
        access: 'Student Only'
      },
      {
        title: 'Budgets & Spending Limits',
        path: '/budgets',
        icon: PiggyBank,
        description: 'Per-category spending targets, threshold alerts at 80% & 100%, and dynamic real-time progress bars.',
        access: 'Student Only'
      },
      {
        title: 'Reports & Statements',
        path: '/reports',
        icon: PieChart,
        description: 'Dynamic breakdown pie charts, monthly financial statements, and downloadable PDF report exports.',
        access: 'Student Only'
      },
      {
        title: 'AI Financial Assistant',
        path: '/ai-assistant',
        icon: Bot,
        description: 'Smart spending spike analysis, conversational student budget advice, and personalized saving recommendations.',
        access: 'Student Only'
      },
      {
        title: 'Personalized Saving Tips',
        path: '/tips',
        icon: Sparkles,
        description: 'Actionable student financial tips, pinning to dashboard, and smart rule recommendations.',
        access: 'Student Only'
      },
      {
        title: 'Category Manager',
        path: '/categories',
        icon: Tag,
        description: 'Global system default categories and personal student custom expense/income tags.',
        access: 'Student Only'
      },
      {
        title: 'Student Profile & Goals',
        path: '/profile',
        icon: User,
        description: 'Manage academic year, baseline monthly allowance, semester savings goal, and credentials.',
        access: 'Student Only'
      },
      {
        title: 'In-App Notifications',
        path: '/notifications',
        icon: Bell,
        description: 'Real-time alerts for budget thresholds (80%/100%), large spending notices, and campus announcements.',
        access: 'Student Only'
      }
    ]
  },

  // 3. Isolated Admin Portal Routes
  {
    category: 'Isolated Admin Control Panel',
    badge: 'Admin Role Required',
    color: '#F59E0B',
    description: 'Completely segregated administrative portal strictly locked behind admin privileges.',
    routes: [
      {
        title: 'Admin Oversight Dashboard',
        path: '/admin/dashboard',
        icon: ShieldCheck,
        description: 'Aggregated platform metrics: registered students, system transaction volume, and top categories.',
        access: 'Admin Only'
      },
      {
        title: 'Student Management & Password Reset',
        path: '/admin/users',
        icon: User,
        description: 'Student directory with account deactivation, password reset overrides, and record cleanup.',
        access: 'Admin Only'
      },
      {
        title: 'System Templates (Categories & Tips)',
        path: '/admin/categories',
        icon: Tag,
        description: 'Manage default global expense categories and financial tip templates for all students.',
        access: 'Admin Only'
      },
      {
        title: 'Campus Announcements',
        path: '/admin/announcements',
        icon: Bell,
        description: 'Publish platform-wide financial advisories and student notices.',
        access: 'Admin Only'
      },
      {
        title: 'Platform Statistics & Audit Logs',
        path: '/admin/statistics',
        icon: Sliders,
        description: 'Comprehensive financial volume statistics and tamper-proof admin audit activity logs.',
        access: 'Admin Only'
      }
    ]
  }
];

const Sitemap = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdminAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredGroups = selectedFilter === 'all'
    ? SITEMAP_NODES
    : SITEMAP_NODES.filter((g) => {
        if (selectedFilter === 'public') return g.category.includes('Public');
        if (selectedFilter === 'student') return g.category.includes('Student');
        if (selectedFilter === 'admin') return g.category.includes('Admin');
        return true;
      });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingBottom: '4rem' }}>
      {/* Navigation Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--header-bg)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}
      >
        <div className="luxury-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Compass size={20} />
            </div>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Campus Coin</span>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#00E699', fontWeight: 700, textTransform: 'uppercase' }}>Interactive Sitemap</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ThemeToggle />
            {isAuthenticated ? (
              <Button variant="gold" size="sm" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <Button variant="gold" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="luxury-container" style={{ marginTop: '2.5rem' }}>
        {/* Banner */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#00E699',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.35rem 0.9rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '1rem'
              }}
            >
              <Compass size={14} /> Platform Navigation Hierarchy
            </span>
          </motion.div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem 0', letterSpacing: '-0.02em' }}>
            Campus Coin Architecture Sitemap
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Explore all public, authenticated student, and segregated administrator routes with live session status, direct links, and security access tiers.
          </p>

          {/* Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Routes (19)' },
              { id: 'public', label: 'Public & Guest' },
              { id: 'student', label: 'Student Suite' },
              { id: 'admin', label: 'Admin Portal' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFilter(f.id)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  border: selectedFilter === f.id ? '1px solid #10B981' : '1px solid var(--border)',
                  background: selectedFilter === f.id ? 'rgba(16, 185, 129, 0.18)' : 'var(--bg-card)',
                  color: selectedFilter === f.id ? '#00E699' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  transition: 'all 0.2s'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section Groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {filteredGroups.map((group, groupIdx) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIdx * 0.1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: group.color }} />
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    {group.category}
                  </h2>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: `${group.color}20`,
                    color: group.color,
                    border: `1px solid ${group.color}40`
                  }}
                >
                  {group.badge}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
                {group.description}
              </p>

              {/* Grid of Route Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {group.routes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <Card
                      key={route.path}
                      style={{
                        padding: '1.35rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: '1px solid var(--border)'
                      }}
                      onClick={() => navigate(route.path)}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              backgroundColor: `${group.color}15`,
                              color: group.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Icon size={18} />
                          </div>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: 'var(--text-muted)',
                              background: 'var(--bg-secondary)',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '6px'
                            }}
                          >
                            {route.access}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
                          {route.title}
                        </h3>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#06B6D4', display: 'block', marginBottom: '0.5rem' }}>
                          {route.path}
                        </span>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.45, margin: 0 }}>
                          {route.description}
                        </p>
                      </div>

                      <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>Live Endpoint</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          Explore <ChevronRight size={14} />
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
