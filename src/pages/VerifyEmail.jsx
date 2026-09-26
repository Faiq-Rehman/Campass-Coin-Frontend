import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import authService from '../services/authService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

export default function VerifyEmail() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        setSuccess(false);
        setMessage('No verification token provided.');
        return;
      }

      try {
        setLoading(true);
        const res = await authService.verifyEmail(token);
        if (res.success) {
          setSuccess(true);
          setMessage(res.message || 'Your email address has been successfully verified!');
        } else {
          setSuccess(false);
          setMessage(res.message || 'Email verification link is invalid or expired.');
        }
      } catch (err) {
        setSuccess(false);
        setMessage(err.response?.data?.message || err.message || 'Verification failed or link expired.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'var(--color-bg, #0D1117)'
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Loader2 size={44} className="animate-spin" style={{ color: '#10B981' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
              Verifying Your Email
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0 }}>
              Confirming your security token with CampusCoin...
            </p>
          </div>
        ) : success ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
              Email Confirmed!
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
              {message}
            </p>
            <Link to="/login" style={{ textDecoration: 'none', width: '100%', marginTop: '0.75rem' }}>
              <Button variant="primary" style={{ width: '100%' }}>
                Proceed to Login <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <XCircle size={36} />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
              Verification Failed
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
              {message}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.75rem' }}>
              <Link to="/login" style={{ textDecoration: 'none', flex: 1 }}>
                <Button variant="outline" style={{ width: '100%' }}>
                  Back to Login
                </Button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none', flex: 1 }}>
                <Button variant="primary" style={{ width: '100%' }}>
                  Register Again
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
