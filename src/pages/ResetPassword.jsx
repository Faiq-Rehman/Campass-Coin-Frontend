import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, CheckCircle2 } from 'lucide-react';
import authService from '../services/authService';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';

const ResetPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
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
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

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
    } finally {
      setLoading(false);
    }
  };

  return (
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
              </button>
            </div>
          </div>

          <div>
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
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
