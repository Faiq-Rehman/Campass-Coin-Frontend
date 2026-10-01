import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Shield,
  LogOut,
  Check,
  Coins,
  ShieldQuestion
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import userService from '../services/userService';

const Settings = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [currency, setCurrency] = useState(localStorage.getItem('campus_coin_currency') || 'PKR');
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [announcements, setAnnouncements] = useState(true);
  const questionOptions = [
    'What was the name of your first school?',
    'What is your date of birth?',
    'What was your childhood nickname?',
    'What city were you born in?',
    'What was your favorite school subject?'
  ];
  const [securityForm, setSecurityForm] = useState({
    securityQuestion1: user?.securityQuestion1 || questionOptions[0],
    securityAnswer1: '',
    securityQuestion2: user?.securityQuestion2 || questionOptions[1],
    securityAnswer2: ''
  });
  const [securityLoading, setSecurityLoading] = useState(false);

  const handleCurrencyChange = (newCurr) => {
    setCurrency(newCurr);
    localStorage.setItem('campus_coin_currency', newCurr);
    window.dispatchEvent(new CustomEvent('campuscoin-currency-changed', { detail: newCurr }));
    toast.success(`Currency preference saved: ${newCurr}`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
          Preferences & Settings
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginTop: '0.25rem', marginBottom: 0 }}>
          Configure currency displays, notification rules, and session controls
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* 2. Currency & Region */}
        <Card elevated style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(214, 179, 106, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Coins size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Display Currency
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Symbol and format for all figures across the portal
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {[
              { code: 'PKR', label: 'Pakistani Rupee (₨)' },
              { code: 'USD', label: 'US Dollar ($)' },
              { code: 'EUR', label: 'Euro (€)' },
              { code: 'GBP', label: 'British Pound (£)' }
            ].map((c) => (
              <button
                key={c.code}
                onClick={() => handleCurrencyChange(c.code)}
                style={{
                  padding: '0.85rem',
                  borderRadius: '10px',
                  backgroundColor: currency === c.code ? 'var(--blue-subtle)' : 'var(--bg-secondary)',
                  border: currency === c.code ? '1px solid var(--primary)' : '1px solid var(--border)',
                  color: currency === c.code ? 'var(--primary-accent)' : 'var(--text-dim)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <span>{c.label}</span>
                {currency === c.code && <Check size={16} style={{ color: 'var(--primary)' }} />}
              </button>
            ))}
          </div>
        </Card>

        {/* 3. Notification Preferences */}
        <Card elevated style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                color: 'var(--success-contrast)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                In-App Notifications
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Toggle automated warnings and campus announcements
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Budget Threshold Alerts
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Notify me when spending hits 80%, 90%, and 100% of limits
                </span>
              </div>
              <input
                type="checkbox"
                checked={budgetAlerts}
                onChange={(e) => {
                  setBudgetAlerts(e.target.checked);
                  toast.info(e.target.checked ? 'Budget alerts enabled' : 'Budget alerts muted');
                }}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Campus Announcements
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Receive broadcast notes and student opportunities from university admin
                </span>
              </div>
              <input
                type="checkbox"
                checked={announcements}
                onChange={(e) => {
                  setAnnouncements(e.target.checked);
                  toast.info(e.target.checked ? 'Announcements enabled' : 'Announcements muted');
                }}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </Card>

        {/* 4. Password Recovery Questions */}
        <Card elevated style={{ padding: '1.75rem', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.1rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(16,185,129,0.14)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldQuestion size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Password Recovery Questions</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Used instead of email OTP when you forget your password</span>
            </div>
          </div>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (securityForm.securityQuestion1 === securityForm.securityQuestion2) { toast.error('Choose two different security questions.'); return; }
            if (!securityForm.securityAnswer1.trim() || !securityForm.securityAnswer2.trim()) { toast.error('Both security answers are required.'); return; }
            try {
              setSecurityLoading(true);
              const res = await userService.updateSecurityQuestions(securityForm);
              if (res.success) {
                toast.success('Password recovery questions saved.');
                setSecurityForm((prev) => ({ ...prev, securityAnswer1: '', securityAnswer2: '' }));
              }
            } catch (err) { toast.error(err.message || 'Could not save recovery questions.'); }
            finally { setSecurityLoading(false); }
          }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
            <div>
              <label className="input-label">Question 1</label>
              <select className="luxury-select" value={securityForm.securityQuestion1} onChange={(e) => setSecurityForm({ ...securityForm, securityQuestion1: e.target.value })}>
                {questionOptions.map((q) => <option key={q}>{q}</option>)}
              </select>
              <input className="luxury-input" style={{ marginTop: '0.55rem' }} placeholder="Your answer" value={securityForm.securityAnswer1} onChange={(e) => setSecurityForm({ ...securityForm, securityAnswer1: e.target.value })} />
            </div>
            <div>
              <label className="input-label">Question 2</label>
              <select className="luxury-select" value={securityForm.securityQuestion2} onChange={(e) => setSecurityForm({ ...securityForm, securityQuestion2: e.target.value })}>
                {questionOptions.map((q) => <option key={q}>{q}</option>)}
              </select>
              <input className="luxury-input" style={{ marginTop: '0.55rem' }} placeholder={securityForm.securityQuestion2 === 'What is your date of birth?' ? 'YYYY-MM-DD' : 'Your answer'} value={securityForm.securityAnswer2} onChange={(e) => setSecurityForm({ ...securityForm, securityAnswer2: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="gold" loading={securityLoading}>Save Recovery Questions</Button>
            </div>
          </form>
        </Card>

        {/* 5. Session & Security Info */}
        <Card elevated style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(167, 139, 250, 0.15)',
                color: '#A78BFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Shield size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Active Session
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Secure encrypted JWT session tokens
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Authenticated User</span>
              <strong style={{ color: 'var(--text-primary)' }}>{user?.fullName || 'Student'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Account Type</span>
              <Badge variant="gold">Student Account</Badge>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Security State</span>
              <span style={{ color: 'var(--success-contrast)', fontWeight: 600 }}>Active & Encrypted</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <Button
              variant="danger"
              icon={LogOut}
              onClick={handleLogout}
              style={{ width: '100%' }}
            >
              Sign Out of Campus Coin
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
