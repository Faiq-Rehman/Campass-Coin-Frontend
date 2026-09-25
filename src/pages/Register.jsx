import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coins, Eye, EyeOff, Lock, Mail, User, GraduationCap, Wallet, Target, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';

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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
      setErrorMsg('Passwords do not match.');
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
        toast.success(`Account created! Welcome to Campus Coin, ${formData.fullName}!`);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070B14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Glow */}
      <div
        className="bg-ambient"
        style={{
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(214, 179, 106, 0.12) 0%, transparent 70%)'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#111827',
          border: '1px solid rgba(214, 179, 106, 0.25)',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #F0D89A 0%, #D6B36A 100%)',
                color: '#070B14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(214, 179, 106, 0.35)'
              }}
            >
              <Coins className="w-5 h-5 font-bold" />
            </div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
              Campus Coin
            </span>
          </Link>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC', margin: '0 0 0.4rem 0' }}>
            Create Student Account
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
            Master your student expenses and build financial independence
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(248, 113, 113, 0.15)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: '10px',
              color: '#F87171',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Full Name */}
          <div>
            <label className="input-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="fullName"
                placeholder="Alex Student"
                className="luxury-input"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <User className="w-4 h-4 text-[#64748B]" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="input-label">Student Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                placeholder="alex@campus.edu"
                className="luxury-input"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Mail className="w-4 h-4 text-[#64748B]" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Passwords */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
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
                />
                <Lock className="w-4 h-4 text-[#64748B]" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="input-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  className="luxury-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <Lock className="w-4 h-4 text-[#64748B]" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          {/* Academic Year */}
          <div>
            <label className="input-label">Academic Year</label>
            <div style={{ position: 'relative' }}>
              <select
                name="academicYear"
                className="luxury-select"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.academicYear}
                onChange={handleChange}
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Graduate">Graduate / Masters</option>
                <option value="Other">Other</option>
              </select>
              <GraduationCap className="w-4 h-4 text-[#64748B]" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Allowance & Savings Goal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="input-label">Monthly Allowance (₨)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  name="monthlyAllowance"
                  placeholder="e.g. 25000"
                  className="luxury-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.monthlyAllowance}
                  onChange={handleChange}
                />
                <Wallet className="w-4 h-4 text-[#64748B]" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div>
              <label className="input-label">Savings Target (₨)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  name="savingsGoal"
                  placeholder="e.g. 5000"
                  className="luxury-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.savingsGoal}
                  onChange={handleChange}
                />
                <Target className="w-4 h-4 text-[#64748B]" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="gold"
            size="lg"
            loading={loading}
            icon={ArrowRight}
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            Create My Account
          </Button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#D6B36A', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
