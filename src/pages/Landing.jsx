import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Coins,
  ArrowRight,
  TrendingUp,
  PiggyBank,
  Sparkles,
  PieChart,
  Tag,
  CheckCircle2,
  Wallet,
  BookOpen,
  Coffee,
  Shield,
  Bot,
  Compass,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Layers,
  HelpCircle,
  Award
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ThemeToggle from '../components/common/ThemeToggle';

const FEATURES = [
  {
    title: 'Smart Expense Tracking',
    icon: Wallet,
    color: '#10B981',
    description: 'Effortlessly log daily food, transport, books, and social costs with real-time balance sync.'
  },
  {
    title: 'Budget Management',
    icon: PiggyBank,
    color: '#06B6D4',
    description: 'Set per-category spending targets and receive timely 80% & 100% threshold safety warnings.'
  },
  {
    title: 'Spending Analytics',
    icon: TrendingUp,
    color: '#3B82F6',
    description: 'Visualize your cash outflows through dynamic line charts, monthly breakdowns, and category pie charts.'
  },
  {
    title: 'AI Financial Insights',
    icon: Bot,
    color: '#8B5CF6',
    description: 'Automated narrative spending summaries and smart keyword category recommendations as you type.'
  },
  {
    title: 'Category Management',
    icon: Tag,
    color: '#EC4899',
    description: 'Organize your transactions with comprehensive campus default categories plus custom personal tags.'
  },
  {
    title: 'Student-Friendly Finance Tools',
    icon: BookOpen,
    color: '#F59E0B',
    description: 'Designed exclusively for student lifestyle, baseline monthly allowances, and semester savings goals.'
  }
];

const STEPS = [
  {
    step: '01',
    title: 'Create your account',
    desc: 'Register in seconds with your academic year, baseline monthly allowance, and savings target.'
  },
  {
    step: '02',
    title: 'Add your expenses',
    desc: 'Quickly log coffee, textbooks, rent, and bus fares with instant AI category suggestions.'
  },
  {
    step: '03',
    title: 'Set your budgets',
    desc: 'Define spending limits per category to keep your student lifestyle balanced all term.'
  },
  {
    step: '04',
    title: 'Analyze your spending',
    desc: 'Review live multi-category trends, income vs expense charts, and monthly reports.'
  },
  {
    step: '05',
    title: 'Improve your savings',
    desc: 'Turn insights into action, prevent spending spikes, and achieve your semester financial goals.'
  }
];

const Landing = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      {/* 1. Navbar */}
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
        <div className="luxury-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '75px' }}>
          {/* CampusCoin Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Coins className="w-5 h-5 font-bold" />
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                CampusCoin
              </span>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#00E699', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Smart Spending
              </span>
            </div>
          </div>

          {/* Nav Links: Home, Features, How It Works, About, Sitemap */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="hidden md:flex">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              About
            </button>
            <Link
              to="/sitemap"
              style={{ color: 'var(--text-dim)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              <Compass size={15} /> Sitemap
            </Link>
          </nav>

          {/* Theme Toggle & Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ThemeToggle />
            <Link
              to="/login"
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontWeight: 600,
                padding: '0.5rem 0.85rem'
              }}
            >
              Login
            </Link>
            <Button variant="gold" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section style={{ position: 'relative', padding: '5rem 0 4rem 0', overflow: 'hidden' }}>
        <div className="luxury-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'inline-flex', marginBottom: '1.25rem' }}
          >
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#00E699',
                fontSize: '0.82rem',
                fontWeight: 600,
                padding: '0.35rem 1rem',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)'
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00E699]" />
              CampusCoin &bull; NextGen BudgetBee
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              lineHeight: 1.15,
              fontWeight: 800,
              maxWidth: '880px',
              margin: '0 auto 1.25rem auto',
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em'
            }}
          >
            Smart Money Management for Students
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-dim)',
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6
            }}
          >
            Track your expenses, manage budgets, understand your spending habits, and build better financial habits — all in one place.
          </motion.p>

          {/* Hero Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}
          >
            <Button
              variant="gold"
              size="lg"
              icon={ArrowRight}
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </motion.div>

          {/* CSS-Based Financial Student Dashboard Visual Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              maxWidth: '920px',
              margin: '0 auto',
              position: 'relative'
            }}
          >
            <div
              style={{
                borderRadius: '20px',
                border: '1px solid var(--border-accent)',
                backgroundColor: 'var(--bg-secondary)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
                padding: '1.5rem',
                backdropFilter: 'blur(16px)',
                textAlign: 'left'
              }}
            >
              {/* Dashboard Preview Mock Interface Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginLeft: '0.5rem', fontWeight: 600 }}>CampusCoin Student Suite Demo</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#00E699', fontWeight: 700 }}>
                  Active Semester
                </span>
              </div>

              {/* Mock Stat Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Monthly Balance</span>
                  <p style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10B981', margin: '0.25rem 0 0 0' }}>$485.50</p>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Food & Dining</span>
                  <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0 0 0' }}>$142.20</p>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Savings Progress</span>
                  <p style={{ fontSize: '1.35rem', fontWeight: 800, color: '#06B6D4', margin: '0.25rem 0 0 0' }}>85% Target</p>
                </div>
              </div>

              {/* Mock Visual Progress Bars */}
              <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  <span>Campus Cafe & Meals Budget</span>
                  <span style={{ color: '#10B981' }}>Safe (68% Used)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '68%', height: '100%', background: 'linear-gradient(90deg, #10B981, #00E699)', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Features Section (Informational Cards Only - NO API Calls) */}
      <section id="features" style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="luxury-container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
            <span style={{ color: '#00E699', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Comprehensive Platform Capabilities
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.5rem 0 0.75rem 0', color: 'var(--text-primary)' }}>
              Engineered for Student Financial Success
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', margin: 0 }}>
              Say goodbye to end-of-month budget anxiety with dynamic tools crafted for campus life.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} style={{ padding: '1.75rem', border: '1px solid var(--border)' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: `${feature.color}15`,
                      color: feature.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                      border: `1px solid ${feature.color}30`
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: 1.5, margin: 0 }}>
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" style={{ padding: '5rem 0', position: 'relative' }}>
        <div className="luxury-container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
            <span style={{ color: '#06B6D4', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Simple 5-Step Process
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0.5rem 0 0.75rem 0', color: 'var(--text-primary)' }}>
              How It Works
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', margin: 0 }}>
              From initial registration to disciplined savings, take command of your campus finances in minutes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {STEPS.map((s, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#00E699', opacity: 0.9 }}>
                  {s.step}
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.5, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. About Section */}
      <section id="about" style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="luxury-container" style={{ maxWidth: '850px', textAlign: 'center' }}>
          <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Our Mission
          </span>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, margin: '0.5rem 0 1rem 0', color: 'var(--text-primary)' }}>
            About CampusCoin
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: 1.7, margin: '0 auto 1.5rem auto' }}>
            CampusCoin is an intuitive, full-stack financial wellness platform built especially for university and college students. Born from the need to eliminate budget blindspots during hectic academic terms, CampusCoin empowers students to balance meal plans, books, transport, and leisure with real-time visual tracking and AI-driven behavioral advice.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
              <CheckCircle2 size={18} style={{ color: '#10B981' }} /> 100% Free for Students
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
              <CheckCircle2 size={18} style={{ color: '#10B981' }} /> Privacy & Security First
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
              <CheckCircle2 size={18} style={{ color: '#10B981' }} /> Real-Time Analytics
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section style={{ padding: '5rem 0', position: 'relative' }}>
        <div className="luxury-container">
          <div
            style={{
              background: 'linear-gradient(135deg, #161B22 0%, #0D1117 100%)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '24px',
              padding: '4rem 2rem',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
              color: '#FFFFFF'
            }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem', color: '#FFFFFF' }}>
              Take Control of Your Student Finances
            </h2>
            <p style={{ color: '#8B949E', maxWidth: '580px', margin: '0 auto 2rem auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Join hundreds of students mastering their spending habits. Completely free, dynamic, and built specifically for your academic lifestyle.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Button
                variant="gold"
                size="lg"
                icon={ArrowRight}
                onClick={() => navigate('/register')}
              >
                Create Free Account
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '3rem 0 2rem 0', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
        <div className="luxury-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Coins className="w-4 h-4 font-bold" />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>CampusCoin</span>
            </div>

            {/* Public Links: CampusCoin, About, Features, Sitemap, Login, Register, Privacy, Terms */}
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => scrollToSection('about')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.85rem' }}>About</button>
              <button type="button" onClick={() => scrollToSection('features')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.85rem' }}>Features</button>
              <Link to="/sitemap" style={{ color: '#00E699', textDecoration: 'none', fontWeight: 600 }}>Sitemap</Link>
              <Link to="/login" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Register</Link>
              <span style={{ color: 'var(--text-muted)' }}>Privacy</span>
              <span style={{ color: 'var(--text-muted)' }}>Terms</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>&copy; {new Date().getFullYear()} CampusCoin. Smart Money Management for Students.</span>
            <span>Advisory fintech tools for students. No certified financial advice.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
