import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coins, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success(`Welcome back, ${res.data?.user?.fullName || 'Student'}!`);
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
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
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Glow */}
      <div
        className="bg-ambient"
        style={{
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(214, 179, 106, 0.12) 0%, transparent 70%)'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          maxWidth: '440px',
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
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #F0D89A 0%, #D6B36A 100%)',
                color: '#070B14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(214, 179, 106, 0.35)'
              }}
            >
              <Coins className="w-6 h-6 font-bold" />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
              Campus Coin
            </span>
          </Link>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC', margin: '0 0 0.5rem 0' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
            Sign in to continue managing your student finances
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
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email */}
          <div>
            <label className="input-label">Student Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="student@campus.edu"
                className="luxury-input"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="w-4 h-4 text-[#64748B]" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="input-label" style={{ margin: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: '#D6B36A', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="luxury-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="w-4 h-4 text-[#64748B]" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="gold"
            size="lg"
            loading={loading}
            icon={ArrowRight}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Sign In to Dashboard
          </Button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: '#94A3B8' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#D6B36A', fontWeight: 600, textDecoration: 'none' }}>
            Create one free
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
