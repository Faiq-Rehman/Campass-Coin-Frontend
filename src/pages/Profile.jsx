import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  GraduationCap,
  Wallet,
  PiggyBank,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ShieldCheck,
  Save,
  KeyRound
} from 'lucide-react';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { SkeletonCard } from '../components/common/LoadingSkeleton';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    academicYear: '1st Year',
    monthlyAllowance: '',
    savingsGoal: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Change Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await userService.getProfile();
      if (res.success && res.data) {
        setProfileForm({
          fullName: res.data.fullName || '',
          academicYear: res.data.academicYear || '1st Year',
          monthlyAllowance: res.data.monthlyAllowance !== undefined ? res.data.monthlyAllowance : '',
          savingsGoal: res.data.savingsGoal !== undefined ? res.data.savingsGoal : ''
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    try {
      setSavingProfile(true);
      const res = await userService.updateProfile({
        fullName: profileForm.fullName.trim(),
        academicYear: profileForm.academicYear,
        monthlyAllowance: Number(profileForm.monthlyAllowance) || 0,
        savingsGoal: Number(profileForm.savingsGoal) || 0
      });

      if (res.success && res.data) {
        updateUser(res.data);
        toast.success('Profile details updated successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      if (res.success) {
        toast.success('Password changed successfully');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading && !profileForm.fullName) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <SkeletonCard height="320px" />
        <SkeletonCard height="320px" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. Page Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
          Student Profile
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '0.25rem', marginBottom: 0 }}>
          Manage your student identity, baseline monthly allowance, and savings targets
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
        {/* 2. Personal Information Card */}
        <Card elevated style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #F0D89A 0%, #D6B36A 100%)',
                color: '#070B14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <User size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                Academic Details & Baseline
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Used to compute balance baselines and custom spending advice
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Full Name */}
            <div>
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="luxury-input"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                required
              />
            </div>

            {/* Email (Read Only) */}
            <div>
              <label className="input-label">Email Address (Registered)</label>
              <input
                type="email"
                className="luxury-input"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.65, cursor: 'not-allowed' }}
              />
            </div>

            {/* Academic Year */}
            <div>
              <label className="input-label">Academic Standing</label>
              <select
                className="luxury-select"
                value={profileForm.academicYear}
                onChange={(e) => setProfileForm({ ...profileForm, academicYear: e.target.value })}
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Graduate">Graduate / Master's</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Monthly Allowance & Savings Goal */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="input-label">Monthly Allowance (₨)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="luxury-input"
                  value={profileForm.monthlyAllowance}
                  onChange={(e) => setProfileForm({ ...profileForm, monthlyAllowance: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="input-label">Monthly Savings Goal (₨)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="luxury-input"
                  value={profileForm.savingsGoal}
                  onChange={(e) => setProfileForm({ ...profileForm, savingsGoal: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              icon={Save}
              loading={savingProfile}
              style={{ marginTop: '0.5rem' }}
            >
              Update Profile Details
            </Button>
          </form>
        </Card>

        {/* 3. Security & Password Change Card */}
        <Card elevated style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(167, 139, 250, 0.15)',
                color: '#A78BFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <KeyRound size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                Security & Password
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Safeguard your student account with an encrypted password
              </span>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Current Password */}
            <div>
              <label className="input-label">Current Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  className="luxury-input"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="input-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  className="luxury-input"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="input-label">Confirm New Password</label>
              <input
                type="password"
                className="luxury-input"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              icon={ShieldCheck}
              loading={savingPassword}
              style={{ marginTop: '0.5rem' }}
            >
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
