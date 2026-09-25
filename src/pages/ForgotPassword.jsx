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
              Password recovery token generated successfully!
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
                Your Reset Token
              </span>
              <p
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: '#F0D89A',
                  wordBreak: 'break-all',
                  margin: '0.4rem 0'
                }}
              >
                {successData.resetToken}
              </p>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Valid for {successData.expiresIn || '1 hour'}
              </span>
            </div>

            <Link
              to={`/reset-password/${successData.resetToken}`}
              style={{ textDecoration: 'none' }}
            >
              <Button variant="gold" style={{ width: '100%' }}>
                Proceed to Reset Password
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
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
