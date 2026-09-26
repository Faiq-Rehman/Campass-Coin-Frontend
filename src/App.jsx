import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Sitemap from './pages/Sitemap';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import AIAssistant from './pages/AIAssistant';
import Insights from './pages/Insights';
import Tips from './pages/Tips';
import Categories from './pages/Categories';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminTips from './pages/admin/AdminTips';
import AdminLogs from './pages/admin/AdminLogs';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminStatistics from './pages/admin/AdminStatistics';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import Button from './components/common/Button';
import Card from './components/common/Card';
import ThemeToggle from './components/common/ThemeToggle';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const toast = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please enter admin username and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await loginAdmin(username, password);
      if (res.success) {
        toast.success('Admin portal access granted.');
        navigate('/admin/dashboard', { replace: true });
      } else {
        setErrorMsg(res.message || 'Admin login failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to sign in as admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--color-bg, #0D1117)',
        position: 'relative'
      }}
    >
      {/* Top Bar with Theme Toggle and Back Link */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#94A3B8',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Back to Public Home
        </Link>
        <ThemeToggle />
      </div>

      <Card
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 style={{ margin: 0, color: 'var(--color-text)', fontSize: '1.6rem', fontWeight: 800 }}>
              Admin Portal
            </h2>
          </div>
        </div>
        <p style={{ color: '#94A3B8', marginBottom: '1.5rem', fontSize: '0.88rem', lineHeight: 1.5 }}>
          Restricted administrative clearance for CampusCoin platform controllers.
        </p>

        {errorMsg && (
          <div
            style={{
              marginBottom: '1.25rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '0.85rem'
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }}>
              Admin Username / Email
            </label>
            <input
              type="text"
              className="luxury-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin or admin@campuscoin.edu"
              required
              autoFocus
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              type="password"
              className="luxury-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </div>

          <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            <Lock size={15} /> Authenticate Admin
          </Button>
        </form>
      </Card>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Routes (Always accessible without auth, mongo, or backend) */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/sitemap" element={<Sitemap />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* 2. Authenticated Student Portal Routes */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 3. Authenticated Admin Portal Routes (Isolated) */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminUsers />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/tips" element={<AdminTips />} />
        <Route path="/admin/logs" element={<AdminLogs />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/statistics" element={<AdminStatistics />} />
      </Route>

      {/* 4. Fallback 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
