import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Globe,
  Bell,
  Shield,
  LogOut,
  Moon,
  Smartphone,
  Download,
  Check,
  Coins
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const Settings = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [currency, setCurrency] = useState(localStorage.getItem('campus_coin_currency') || 'PKR');
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [announcements, setAnnouncements] = useState(true);

  const handleCurrencyChange = (newCurr) => {
    setCurrency(newCurr);
    localStorage.setItem('campus_coin_currency', newCurr);
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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
          Preferences & Settings
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '0.25rem', marginBottom: 0 }}>
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
                color: '#D6B36A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Coins size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                Display Currency
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
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
                  backgroundColor: currency === c.code ? 'rgba(214, 179, 106, 0.15)' : '#0D1320',
                  border: currency === c.code ? '1px solid #D6B36A' : '1px solid rgba(255,255,255,0.06)',
                  color: currency === c.code ? '#F0D89A' : '#94A3B8',
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
                {currency === c.code && <Check size={16} style={{ color: '#D6B36A' }} />}
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
                color: '#34D399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                In-App Notifications
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Toggle automated warnings and campus announcements
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#0D1320', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC', margin: 0 }}>
                  Budget Threshold Alerts
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
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
                style={{ width: '18px', height: '18px', accentColor: '#D6B36A', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#0D1320', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC', margin: 0 }}>
                  Campus Announcements
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
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
                style={{ width: '18px', height: '18px', accentColor: '#D6B36A', cursor: 'pointer' }}
              />
            </div>
          </div>
        </Card>

        {/* 4. Session & Security Info */}
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                Active Session
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Secure encrypted JWT session tokens
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#94A3B8' }}>Authenticated User</span>
              <strong style={{ color: '#F8FAFC' }}>{user?.fullName || 'Student'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#94A3B8' }}>Account Type</span>
              <Badge variant="gold">Student Account</Badge>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#94A3B8' }}>Security State</span>
              <span style={{ color: '#34D399', fontWeight: 600 }}>Active & Encrypted</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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
