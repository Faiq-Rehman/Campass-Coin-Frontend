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
    } finally {
      setLoading(false);
    }
  };

  return (
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
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
