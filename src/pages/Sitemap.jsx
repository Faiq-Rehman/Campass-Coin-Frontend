import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Home,
  LogIn,
  UserPlus,
  KeyRound,
  ShieldAlert,
  LayoutDashboard,
  Receipt,
  PiggyBank,
  PieChart,
  Bot,
  User,
  Shield,
  Users,
  Tags,
  Lightbulb,
  FileText,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import Card from '../components/common/Card';
import ThemeToggle from '../components/common/ThemeToggle';

export default function Sitemap() {
  const sections = [
    {
      title: 'Public & Guest Routes',
      badge: 'Public',
      badgeClass: 'badge-blue',
      description: 'Freely accessible without authentication or database dependency.',
      links: [
        { name: 'Home Landing Page', path: '/', icon: Home, desc: 'Student budgeting overview, features, and how it works' },
        { name: 'Student Login', path: '/login', icon: LogIn, desc: 'Sign in to access your personal student budget dashboard' },
        { name: 'Student Register', path: '/register', icon: UserPlus, desc: 'Create a free student account with allowance & goals' },
        { name: 'Forgot Password', path: '/forgot-password', icon: KeyRound, desc: 'Request email recovery token to restore access' },
        { name: 'Admin Login', path: '/admin/login', icon: ShieldAlert, desc: 'Dedicated administrator portal access (isolated)' },
        { name: 'Sitemap', path: '/sitemap', icon: Compass, desc: 'Interactive visual directory of all portal destinations' }
      ]
    },
    {
      title: 'Protected Student Portal',
      badge: 'Student Auth Required',
      badgeClass: 'badge-emerald',
      description: 'Requires student account authentication (JWT). Live MongoDB financial data.',
      links: [
        { name: 'Student Dashboard', path: '/dashboard', icon: LayoutDashboard, desc: 'Real-time balance, spending trends & budget progress' },
        { name: 'Transactions Ledger', path: '/transactions', icon: Receipt, desc: 'Search, filter, paginate, and export/import CSV records' },
        { name: 'Monthly Budgets', path: '/budgets', icon: PiggyBank, desc: 'Category-level limits with 80% & 100% threshold alerts' },
        { name: 'Financial Reports', path: '/reports', icon: PieChart, desc: 'In-depth analytics, highest expense categories & trends' },
        { name: 'AI Financial Assistant', path: '/ai-assistant', icon: Bot, desc: 'Smart categorization advisor & automated saving tips' },
        { name: 'Student Profile', path: '/profile', icon: User, desc: 'Academic year, baseline allowance, and monthly goals' }
      ]
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backdropFilter: 'blur(16px)',
          background: 'var(--color-card-blur, rgba(13, 17, 23, 0.8))',
          borderBottom: '1px solid var(--color-border)',
          padding: '0.875rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <Compass size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
              Campus<span style={{ color: '#10B981' }}>Coin</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>Interactive Sitemap</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle />
          <Link
            to="/"
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--color-text)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Home size={15} /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '2.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#10B981',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}
          >
            <Layers size={14} /> Full Application Topology
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.03em', margin: '0 0 0.75rem 0' }}>
            CampusCoin Interactive Sitemap
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Browse through the entire architecture of CampusCoin across public guest entrypoints, authenticated student financial management, and isolated administrative tooling.
          </p>
        </div>

        {/* Section Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {sections.map((section, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
                  {section.title}
                </h2>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '6px',
                    background:
                      section.badgeClass === 'badge-blue'
                        ? 'rgba(6, 182, 212, 0.15)'
                        : section.badgeClass === 'badge-emerald'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(245, 158, 11, 0.15)',
                    color:
                      section.badgeClass === 'badge-blue'
                        ? '#06B6D4'
                        : section.badgeClass === 'badge-emerald'
                        ? '#10B981'
                        : '#F59E0B',
                    border: `1px solid ${
                      section.badgeClass === 'badge-blue'
                        ? 'rgba(6, 182, 212, 0.3)'
                        : section.badgeClass === 'badge-emerald'
                        ? 'rgba(16, 185, 129, 0.3)'
                        : 'rgba(245, 158, 11, 0.3)'
                    }`
                  }}
                >
                  {section.badge}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#94A3B8' }}>{section.description}</p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.25rem',
                  marginTop: '0.5rem'
                }}
              >
                {section.links.map((link, lIdx) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={lIdx}
                      to={link.path}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Card
                        style={{
                          height: '100%',
                          padding: '1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.85rem',
                          transition: 'transform 0.2s ease, border-color 0.2s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = 'var(--color-border)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '9px',
                              background: 'rgba(16, 185, 129, 0.1)',
                              color: '#10B981',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Icon size={18} />
                          </div>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.78rem',
                              color: '#64748B',
                              background: 'var(--color-input-bg, rgba(255,255,255,0.04))',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px'
                            }}
                          >
                            {link.path}
                          </span>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                            {link.name}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5 }}>
                            {link.desc}
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            color: '#10B981',
                            fontSize: '0.82rem',
                            fontWeight: 600
                          }}
                        >
                          Visit route <ArrowRight size={14} />
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          color: '#64748B',
          fontSize: '0.85rem'
        }}
      >
        © {new Date().getFullYear()} CampusCoin • NextGen Student Financial Intelligence • Clean Architecture
      </footer>
    </div>
  );
}
