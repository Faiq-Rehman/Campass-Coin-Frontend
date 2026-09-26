<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import authService from '../services/authService';
import Button from '../components/common/Button';
import { useToast } from '../context/ToastContext';

const RESEND_SECONDS = 60;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = setInterval(() => setResendIn((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const sendCode = async (event, isResend = false) => {
    event?.preventDefault();
    if (!email.trim()) return;
    setErrorMsg('');
    if (isResend && resendIn > 0) return;

    try {
      isResend ? setResending(true) : setLoading(true);
      const res = isResend
        ? await authService.resendResetCode({ email: email.trim() })
        : await authService.forgotPassword({ email: email.trim() });

      if (res.success) {
        setStep('code');
        setCode('');
        setResendIn(RESEND_SECONDS);
        toast.success('A verification code has been sent to your email.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to send the verification code.');
    } finally {
      setLoading(false);
      setResending(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    if (!/^\d{6}$/.test(code)) {
      setErrorMsg('Enter the 6-digit code sent to your email.');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.verifyResetCode({ email: email.trim(), code });
      if (res.success && res.data?.resetToken) {
        sessionStorage.setItem('campuscoin_reset_email', email.trim().toLowerCase());
        sessionStorage.setItem('campuscoin_reset_token', res.data.resetToken);
        navigate('/reset-password');
      }
    } catch (err) {
      setErrorMsg(err.message || 'The code is invalid or expired.');
=======
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coins, Mail, ArrowLeft, KeyRound } from 'lucide-react';
import authService from '../services/authService';
import Button from '../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await authService.forgotPassword({ email });
      if (res.success && res.data) {
        setSuccessData(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to process password reset request.');
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="auth-recovery-page">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="auth-recovery-card"
      >
        <div className="auth-recovery-brand">
          <div className="auth-recovery-icon"><KeyRound size={23} /></div>
          <div>
            <div className="auth-recovery-eyebrow">CampusCoin Account</div>
            <h1>{step === 'email' ? 'Forgot password?' : 'Check your email'}</h1>
          </div>
        </div>

        <p className="auth-recovery-description">
          {step === 'email'
            ? 'Enter the email address linked to your account and we will send you a verification code.'
            : <>We sent a 6-digit verification code to <strong>{email}</strong>.</>}
        </p>

        {errorMsg && <div className="auth-recovery-error" role="alert">{errorMsg}</div>}

        {step === 'email' ? (
          <form onSubmit={sendCode} className="auth-recovery-form">
            <div>
              <label className="input-label">Email address</label>
              <div className="auth-recovery-input-wrap">
                <Mail size={17} />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="luxury-input"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" variant="gold" size="lg" loading={loading} style={{ width: '100%' }}>
              Send verification code
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="auth-recovery-form">
            <div>
              <label className="input-label">6-digit verification code</label>
              <div className="auth-code-wrap">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  className="luxury-input auth-code-input"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  autoFocus
                  required
                />
              </div>
              <div className="auth-recovery-hint">
                <ShieldCheck size={14} /> Never share this code with anyone
              </div>
            </div>

            <Button type="submit" variant="gold" size="lg" loading={loading} style={{ width: '100%' }}>
              Verify code
            </Button>

            <button
              type="button"
              className="auth-resend-button"
              disabled={resending || resendIn > 0}
              onClick={(event) => sendCode(event, true)}
            >
              {resending ? 'Sending...' : resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend it'}
            </button>

            <button type="button" className="auth-change-email" onClick={() => { setStep('email'); setErrorMsg(''); }}>
              Use a different email
            </button>
          </form>
        )}

        <div className="auth-recovery-footer">
          <Link to="/login"><ArrowLeft size={14} /> Back to Sign In</Link>
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
              background: 'rgba(214, 179, 106, 0.15)',
              color: '#D6B36A',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}
          >
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC', margin: '0 0 0.5rem 0' }}>
            Password Recovery
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
            Enter your student email to generate a secure recovery token
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

        {successData ? (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'rgba(52, 211, 153, 0.12)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                borderRadius: '10px',
                color: '#34D399',
                fontSize: '0.9rem',
                lineHeight: 1.5
              }}
            >
              {successData.emailSent
                ? 'Password reset code has been sent to your email.'
                : 'Password reset code generated. SMTP is not configured, so the code is shown below for local testing.'}
            </div>

            <div
              style={{
                background: '#0D1320',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>
                Your Recovery Code
              </span>
              <p
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1.2rem',
                  color: '#F0D89A',
                  letterSpacing: '0.25rem',
                  margin: '0.5rem 0',
                  fontWeight: 700
                }}
              >
                {successData.resetCode}
              </p>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Valid for {successData.expiresIn || '1 hour'}
              </span>
            </div>

            <Link
              to={`/reset-password/${successData.resetToken}?code=${encodeURIComponent(successData.resetCode)}`}
              style={{ textDecoration: 'none' }}
            >
              <Button variant="gold" style={{ width: '100%' }}>
                Enter Code & Reset Password
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

            <Button
              type="submit"
              variant="gold"
              size="lg"
              loading={loading}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              Generate Reset Token
            </Button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <Link
            to="/login"
            style={{
              color: '#94A3B8',
              fontSize: '0.85rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
>>>>>>> af9c7e2b82409c8810abe835d61cc61759555604
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
