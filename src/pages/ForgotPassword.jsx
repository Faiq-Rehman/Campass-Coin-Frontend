import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, KeyRound, Mail, ShieldQuestion } from 'lucide-react';
import authService from '../services/authService';
import Button from '../components/common/Button';
import { useToast } from '../context/ToastContext';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [questions, setQuestions] = useState({ securityQuestion1: '', securityQuestion2: '' });
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const findQuestions = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      const res = await authService.forgotPassword({ email: email.trim() });
      if (res.success && res.data) {
        setQuestions({
          securityQuestion1: res.data.securityQuestion1,
          securityQuestion2: res.data.securityQuestion2
        });
        setStep('questions');
        toast.success('Answer your security questions to continue.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to start password recovery.');
    } finally {
      setLoading(false);
    }
  };

  const verifyAnswers = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    if (!answer1.trim() || !answer2.trim()) {
      setErrorMsg('Please answer both security questions.');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.verifySecurityAnswers({
        email: email.trim(),
        answer1: answer1.trim(),
        answer2: answer2.trim()
      });
      if (res.success && res.data?.resetToken) {
        sessionStorage.setItem('campuscoin_reset_email', email.trim().toLowerCase());
        sessionStorage.setItem('campuscoin_reset_token', res.data.resetToken);
        navigate('/reset-password');
      }
    } catch (err) {
      setErrorMsg(err.message || 'One or more security answers are incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-recovery-page">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="auth-recovery-card">
        <div className="auth-recovery-brand">
          <div className="auth-recovery-icon"><KeyRound size={23} /></div>
          <div>
            <div className="auth-recovery-eyebrow">CampusCoin Account</div>
            <h1>{step === 'email' ? 'Forgot password?' : 'Verify your identity'}</h1>
          </div>
        </div>

        <p className="auth-recovery-description">
          {step === 'email'
            ? 'Enter your registered email to load your two password-recovery questions.'
            : 'Answer both security questions exactly as you set them when creating your account.'}
        </p>

        {errorMsg && <div className="auth-recovery-error" role="alert">{errorMsg}</div>}

        {step === 'email' ? (
          <form onSubmit={findQuestions} className="auth-recovery-form">
            <div>
              <label className="input-label">Email address</label>
              <div className="auth-recovery-input-wrap">
                <Mail size={17} />
                <input type="email" autoComplete="email" placeholder="you@example.com" className="luxury-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" variant="gold" size="lg" loading={loading} style={{ width: '100%' }}>
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyAnswers} className="auth-recovery-form">
            <div>
              <label className="input-label"><ShieldQuestion size={14} /> {questions.securityQuestion1}</label>
              <input className="luxury-input" type="text" value={answer1} onChange={(e) => setAnswer1(e.target.value)} placeholder="Your answer" autoComplete="off" required />
            </div>
            <div>
              <label className="input-label"><ShieldQuestion size={14} /> {questions.securityQuestion2}</label>
              <input className="luxury-input" type="text" value={answer2} onChange={(e) => setAnswer2(e.target.value)} placeholder="Your answer" autoComplete="off" required />
            </div>
            <Button type="submit" variant="gold" size="lg" loading={loading} style={{ width: '100%' }}>
              Verify answers
            </Button>
            <button type="button" className="auth-change-email" onClick={() => { setStep('email'); setErrorMsg(''); }}>
              Use a different email
            </button>
          </form>
        )}

        <div className="auth-recovery-footer"><Link to="/login"><ArrowLeft size={14} /> Back to Sign In</Link></div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
