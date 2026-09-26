import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Coins,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  GraduationCap,
  Wallet,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ThemeToggle from '../components/common/ThemeToggle';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    academicYear: '1st Year',
    monthlyAllowance: '',
    savingsGoal: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const yearDropdownRef = useRef(null);

  const academicYearOptions = [
    '1st Year (Freshman)',
    '2nd Year (Sophomore)',
    '3rd Year (Junior)',
    '4th Year (Senior)',
    'Graduate / Masters',
    'Other'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
        setYearDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        academicYear: formData.academicYear,
        monthlyAllowance: formData.monthlyAllowance ? Number(formData.monthlyAllowance) : 0,
        savingsGoal: formData.savingsGoal ? Number(formData.savingsGoal) : 0
      };

      const res = await register(payload);
      if (res.success) {
        toast.success(`Account created! Welcome to CampusCoin, ${formData.fullName}!`);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register account. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.25rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Header Bar for Guest Navigation */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-dim)',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
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
          <ArrowLeft size={16} /> Home
        </Link>
        <ThemeToggle />
      </div>

      {/* Ambient Glow */}
      <div
        className="bg-ambient"
        style={{
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.09) 0%, rgba(6, 182, 212, 0.04) 50%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          width: '100%',
          maxWidth: '560px',
          margin: 'auto 0',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Card
          elevated
          style={{
            padding: '2.5rem 2.25rem',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
            border: '1px solid var(--border)'
          }}
        >
          {/* Brand & Heading */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1rem'
              }}
            >
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
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)'
                }}
              >
                <Coins size={22} />
              </div>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Campus<span style={{ color: '#10B981' }}>Coin</span>
              </span>
            </Link>

            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
              Create Student Account
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: 0 }}>
              Master your student expenses and build long-term financial independence
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#EF4444',
                fontSize: '0.88rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Full Name */}
            <div>
              <label className="input-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Alex Morgan"
                  className="luxury-input"
                  style={{ paddingLeft: '2.5rem', backgroundColor: 'var(--color-input-bg)', color: 'var(--text-primary)' }}
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <User size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="input-label">Student Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  placeholder="alex@university.edu"
                  className="luxury-input"
                  style={{ paddingLeft: '2.5rem', backgroundColor: 'var(--color-input-bg)', color: 'var(--text-primary)' }}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Mail size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              </div>
            </div>

            {/* Passwords in 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label className="input-label">Password (min 6 chars)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    className="luxury-input"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.2rem' }}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <Lock size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="input-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="luxury-input"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.2rem' }}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <Lock size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Academic Year */}
            <div>
              <label className="input-label">Academic Year</label>
              <div ref={yearDropdownRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setYearDropdownOpen((prev) => !prev)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                    textAlign: 'left',
                    position: 'relative',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{formData.academicYear}</span>
                  <ChevronDown size={16} style={{ color: 'var(--text-dim)' }} />
                </button>
                <GraduationCap
                  size={17}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }}
                />

                {yearDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: 0,
                      right: 0,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      boxShadow: 'var(--shadow-lg)',
                      overflow: 'hidden',
                      zIndex: 30
                    }}
                  >
                    {academicYearOptions.map((option) => {
                      const value = option.split(' ')[0] + ' Year';
                      const normalizedValue = option.includes('Graduate') ? 'Graduate' : option.includes('Other') ? 'Other' : value;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, academicYear: normalizedValue }));
                            setYearDropdownOpen(false);
                          }}
                          style={{
                            width: '100%',
                            border: 'none',
                            background: normalizedValue === formData.academicYear ? 'var(--blue-subtle)' : 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            padding: '0.8rem 1rem',
                            textAlign: 'left',
                            fontSize: '0.92rem',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease'
                          }}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Allowance & Savings Goal */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label className="input-label">Baseline Allowance ($)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.01"
                    name="monthlyAllowance"
                    placeholder="e.g. 800"
                    className="luxury-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.monthlyAllowance}
                    onChange={handleChange}
                  />
                  <Wallet size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.2rem', display: 'block' }}>
                  Expected monthly income/funds
                </span>
              </div>

              <div>
                <label className="input-label">Monthly Savings Goal ($)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.01"
                    name="savingsGoal"
                    placeholder="e.g. 150"
                    className="luxury-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.savingsGoal}
                    onChange={handleChange}
                  />
                  <Target size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.2rem', display: 'block' }}>
                  Target amount to set aside
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              Create Free Student Account
            </Button>
          </form>

          {/* Feature Highlights beneath form */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border)',
              fontSize: '0.78rem',
              color: 'var(--text-dim)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} style={{ color: '#10B981' }} /> 100% Student Free
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} style={{ color: '#10B981' }} /> AI Categorization
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} style={{ color: '#10B981' }} /> Real-time Analytics
            </div>
          </div>

          {/* Footer Link */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: 'var(--text-dim)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#10B981', fontWeight: 700, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
