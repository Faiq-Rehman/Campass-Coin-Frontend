import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Coins,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  PiggyBank,
  Sparkles,
  PieChart,
  Bell,
  CheckCircle2,
  Wallet,
  BookOpen,
  Coffee,
  Bus,
  Compass
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ThemeToggle from '../components/common/ThemeToggle';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      {/* 1. Header / Navbar */}
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
          {/* Logo */}
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
                Campus Coin
              </span>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#00E699', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Smart Spending
              </span>
            </div>
          </div>

          {/* Nav Links & CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Link
              to="/sitemap"
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-dim)',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.4rem 0.75rem'
              }}
            >
              <Compass size={15} /> Sitemap
            </Link>
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
              Sign In
            </Link>
            <Button variant="gold" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section style={{ position: 'relative', padding: '5.5rem 0 4rem 0', overflow: 'hidden' }}>
        {/* Glow ambient background effects */}
        <div
          className="bg-ambient"
          style={{
            top: '0%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '650px',
            height: '420px',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(14, 165, 233, 0.05) 50%, transparent 70%)'
          }}
        />

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
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                color: '#1D4ED8',
                fontSize: '0.82rem',
                fontWeight: 600,
                padding: '0.35rem 1rem',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.08)'
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              Smart Spending &bull; Student Style
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              lineHeight: 1.15,
              fontWeight: 800,
              maxWidth: '860px',
              margin: '0 auto 1.5rem auto',
              color: '#0F172A',
              letterSpacing: '-0.03em'
            }}
          >
            Know Where Your Money Goes.{' '}
            <span className="gold-gradient-text">Build Better Habits.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: '1.15rem',
              color: '#475569',
              maxWidth: '640px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6
            }}
          >
            Track your allowance, control campus expenses, eliminate budget surprises, and gain personalized financial insights—crafted specifically for student life.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}
          >
            <Button
              variant="gold"
              size="lg"
              icon={ArrowRight}
              onClick={() => navigate('/register')}
            >
              Start Free Today
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Access Dashboard
            </Button>
          </motion.div>

          {/* Interactive Floating Financial Dashboard Preview */}
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
            {/* Main Mockup Card */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 25px 60px rgba(15, 23, 42, 0.08), 0 4px 20px rgba(37, 99, 235, 0.06)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Header simulation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  <span style={{ fontSize: '0.8rem', color: '#64748B', marginLeft: '0.5rem', fontWeight: 500 }}>campuscoin.app/dashboard</span>
                </div>
                <span className="badge-gold">Live Session</span>
              </div>

              {/* Grid representation */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Current Balance</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981', margin: '4px 0' }}>₨ 28,450</div>
                  <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>+14% vs last month</span>
                </div>
                <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Monthly Expenses</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '4px 0' }}>₨ 14,200</div>
                  <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 600 }}>Budget 71% utilized</span>
                </div>
                <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Savings Goal</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563EB', margin: '4px 0' }}>₨ 10,000</div>
                  <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>On track (Sem 2 Laptop)</span>
                </div>
              </div>

              {/* Sample Floating Notification Card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(37, 99, 235, 0.25)',
                  borderRadius: '12px',
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  maxWidth: '540px',
                  margin: '0 auto',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)'
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', display: 'block' }}>
                    Personalized Saving Tip
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Food was 42% of your expenses this week. Pre-planning lunches can save ₨ 3,500.
                  </span>
                </div>
                <span className="badge-soft">AI Advisory</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section style={{ padding: '5rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="luxury-container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge-gold" style={{ marginBottom: '0.75rem' }}>Engineered for Students</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0.5rem 0 1rem 0', color: '#0F172A' }}>
              Everything You Need to Master Your Money
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem' }}>
              Built specifically for academic life, allowances, hostel expenses, part-time jobs, and semester goals.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <Card hoverable>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Wallet className="w-6 h-6" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0F172A' }}>Income & Expense Tracking</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Log allowances, salaries, gifts, and scholarships. Categorize everyday food, transport, hostel rent, and academics instantly.
              </p>
            </Card>

            <Card hoverable>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <PiggyBank className="w-6 h-6" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0F172A' }}>Smart Budgeting & Alerts</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Set monthly limits per category. Automated alerts warn you when you consume 80%, 90%, and 100% of your allocated budget.
              </p>
            </Card>

            <Card hoverable>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F0F9FF', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0F172A' }}>Advisory Financial Intelligence</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Real-time keyword category suggestions, duplicate transaction warnings, and anomaly alerts for unusually large expenses.
              </p>
            </Card>

            <Card hoverable>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <PieChart className="w-6 h-6" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0F172A' }}>Visual Reports & Forecasts</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Interactive Recharts graphics, 6-month historical trends, and rule-based statistical forecasts for next month's savings.
              </p>
            </Card>

            <Card hoverable>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Bell className="w-6 h-6" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0F172A' }}>Saving Tips Engine</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Actionable tips customized to your actual spending. Pin impactful tips to your dashboard or dismiss ones you have resolved.
              </p>
            </Card>

            <Card hoverable>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0F172A' }}>Clean PDF Statements</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Download high-resolution official PDF financial statements with categorized totals, ready for parent reviews or personal records.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section style={{ padding: '5rem 0', backgroundColor: '#F8FAFC' }}>
        <div className="luxury-container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem auto' }}>
            <span className="badge-soft" style={{ marginBottom: '0.75rem' }}>Simplicity First</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A' }}>How Campus Coin Works</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {[
              { step: '01', title: 'Sign Up Fast', desc: 'Register with your student email, academic year, and monthly allowance.' },
              { step: '02', title: 'Log Daily Spend', desc: 'Add expenses as they happen with automated category suggestions.' },
              { step: '03', title: 'Set Safe Limits', desc: 'Define monthly category budgets and receive warnings before you overspend.' },
              { step: '04', title: 'Grow Savings', desc: 'Gain personalized tips, monthly insights, and hit your target goals.' }
            ].map((s) => (
              <div key={s.step} style={{ textAlign: 'left', position: 'relative' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'rgba(37, 99, 235, 0.2)', display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                  {s.step}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call To Action Banner */}
      <section style={{ padding: '5rem 0', backgroundColor: '#FFFFFF', position: 'relative' }}>
        <div className="luxury-container">
          <div
            style={{
              background: 'linear-gradient(135deg, #0A1128 0%, #1E293B 100%)',
              border: '1px solid rgba(37, 99, 235, 0.35)',
              borderRadius: '24px',
              padding: '4rem 2rem',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
              position: 'relative',
              overflow: 'hidden',
              color: '#FFFFFF'
            }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem', color: '#FFFFFF' }}>
              Take Control of Your Campus Finances Today
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '550px', margin: '0 auto 2rem auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Join hundreds of students mastering their spending habits. Completely free and built for student life.
            </p>
            <Button
              variant="gold"
              size="lg"
              icon={ArrowRight}
              onClick={() => navigate('/register')}
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer style={{ borderTop: '1px solid #E2E8F0', padding: '3rem 0 2rem 0', backgroundColor: '#0A1128', color: '#F8FAFC' }}>
        <div className="luxury-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Coins className="w-4 h-4 font-bold" />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>Campus Coin</span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
              <Link to="/sitemap" style={{ color: '#00E699', textDecoration: 'none', fontWeight: 600 }}>Interactive Sitemap</Link>
              <Link to="/login" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Register</Link>
              <Link to="/admin/login" style={{ color: '#94A3B8', textDecoration: 'none' }}>Admin Portal</Link>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: '#94A3B8' }}>
            <span>&copy; {new Date().getFullYear()} Campus Coin. Smart Spending — Student Style.</span>
            <span>Advisory fintech tools for students. No certified financial advice.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
