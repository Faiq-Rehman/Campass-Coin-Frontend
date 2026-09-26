<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, CheckCircle2 } from 'lucide-react';
=======
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
import authService from '../services/authService';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';

const ResetPassword = () => {
<<<<<<< HEAD
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
=======
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const [recoveryCode, setRecoveryCode] = useState(searchParams.get('code') || '');
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
<<<<<<< HEAD
    const savedEmail = sessionStorage.getItem('campuscoin_reset_email') || '';
    const savedToken = sessionStorage.getItem('campuscoin_reset_token') || '';
    setEmail(savedEmail);
    setToken(savedToken);
    if (!savedToken) setErrorMsg('Your password reset session is missing or expired. Please request a new code.');
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');

    if (!token || !email) {
      setErrorMsg('Your password reset session has expired. Please request a new code.');
      return;
    }
=======
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setRecoveryCode(codeFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!recoveryCode || recoveryCode.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit recovery code from your email.');
      return;
    }

>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
<<<<<<< HEAD
=======

>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

<<<<<<< HEAD
    try {
      setLoading(true);
      const res = await authService.resetPassword(token, { password });
      if (res.success) {
        sessionStorage.removeItem('campuscoin_reset_email');
        sessionStorage.removeItem('campuscoin_reset_token');
        toast.success('Password changed successfully. You can now sign in.');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to change your password. Please request a new code.');
=======
    setLoading(true);

    try {
      const res = await authService.resetPassword(token, { password, code: recoveryCode.trim() });
      if (res.success) {
        toast.success('Password reset successfully! You can now log in.');
        navigate('/login');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password. Token may have expired.');
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="auth-recovery-page">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="auth-recovery-card">
        <div className="auth-recovery-brand">
          <div className="auth-recovery-icon success"><CheckCircle2 size={23} /></div>
          <div>
            <div className="auth-recovery-eyebrow">CampusCoin Account</div>
            <h1>Change password</h1>
          </div>
        </div>

        <p className="auth-recovery-description">Create a new password for <strong>{email || 'your account'}</strong>.</p>

        {errorMsg && <div className="auth-recovery-error" role="alert">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-recovery-form">
          <div>
            <label className="input-label">New password</label>
            <div className="auth-recovery-input-wrap">
              <Lock size={17} />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="luxury-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
              />
              <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
=======
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070B14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative'
      }}
    >
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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(52, 211, 153, 0.15)',
              color: '#34D399',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}
          >
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC', margin: '0 0 0.5rem 0' }}>
            Set New Password
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
            Choose a strong password with at least 6 characters
          </p>
        </div>

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="input-label">Recovery Code</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                className="luxury-input"
                style={{ paddingLeft: '2.5rem' }}
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
              <KeyRound className="w-4 h-4 text-[#64748B]" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label className="input-label">New Password</label>
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
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
              </button>
            </div>
          </div>

          <div>
<<<<<<< HEAD
            <label className="input-label">Confirm password</label>
            <div className="auth-recovery-input-wrap">
              <KeyRound size={17} />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="luxury-input"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <Button type="submit" variant="gold" size="lg" loading={loading} style={{ width: '100%' }}>
            Change password
          </Button>
        </form>

        <div className="auth-recovery-footer">
          <Link to="/login"><ArrowLeft size={14} /> Back to Sign In</Link>
=======
            <label className="input-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="luxury-input"
                style={{ paddingLeft: '2.5rem' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Lock className="w-4 h-4 text-[#64748B]" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            loading={loading}
            icon={ArrowRight}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Update Password
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <Link to="/login" style={{ color: '#94A3B8', fontSize: '0.85rem', textDecoration: 'none' }}>
            Back to Sign In
          </Link>
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
