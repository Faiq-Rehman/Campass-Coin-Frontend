import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import Insights from './pages/Insights';
import Tips from './pages/Tips';
import Categories from './pages/Categories';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminStatistics from './pages/admin/AdminStatistics';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import Button from './components/common/Button';
import Card from './components/common/Card';

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#F8FAFC' }}>
      <Card style={{ width: '100%', maxWidth: '420px', padding: '2.25rem', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)', border: '1px solid #E2E8F0' }}>
        <h2 style={{ marginBottom: '0.5rem', color: '#0F172A', fontSize: '1.8rem', fontWeight: 700 }}>Admin Login</h2>
        <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Sign in to manage the Campus Coin platform.</p>

        {errorMsg && (
          <div style={{ marginBottom: '1rem', padding: '0.8rem 1rem', borderRadius: '10px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.88rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label className="input-label">Username</label>
            <input className="luxury-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" required />
          </div>
          <div>
            <label className="input-label">Password</label>
            <input type="password" className="luxury-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <Button type="submit" variant="gold" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>Continue to admin portal</Button>
        </form>
      </Card>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Authenticated Student Portal Routes */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Authenticated Admin Portal Routes */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/statistics" element={<AdminStatistics />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
