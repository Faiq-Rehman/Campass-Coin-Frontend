import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  Receipt,
  Tag,
  Megaphone,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  UserCheck,
  UserX,
  Plus
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';
import { formatCurrency } from '../../utils/currency';

const AdminDashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboard();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch admin metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  if (loading && !dashboardData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="stat-grid">
          <SkeletonCard height="130px" />
          <SkeletonCard height="130px" />
          <SkeletonCard height="130px" />
          <SkeletonCard height="130px" />
        </div>
        <SkeletonCard height="300px" />
      </div>
    );
  }

  const { users, transactions, topCategories = [], monthlyActivity = [] } = dashboardData || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. Header with Quick Admin Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', padding: '0.3rem 0.75rem', borderRadius: '999px', background: 'rgba(167, 139, 250, 0.12)', border: '1px solid rgba(167, 139, 250, 0.4)', color: '#A78BFA', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            System Administration
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
            Platform Control Center
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '0.25rem', marginBottom: 0 }}>
            Real-time telemetry, student adoption figures, and category volume activity
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="outline"
            icon={Users}
            onClick={() => navigate('/admin/users')}
          >
            Manage Students
          </Button>
          <Button
            variant="gold"
            icon={Megaphone}
            onClick={() => navigate('/admin/announcements')}
          >
            Publish Announcement
          </Button>
        </div>
      </div>

      {/* 2. Platform Telemetry Stat Cards */}
      <div className="stat-grid">
        <StatCard
          title="Total Students"
          value={users?.total || 0}
          icon={Users}
          color="#A78BFA"
          subtitle={`${users?.active || 0} active &bull; ${users?.disabled || 0} disabled`}
        />
        <StatCard
          title="Total Transactions"
          value={transactions?.total || 0}
          icon={Receipt}
          color="#D6B36A"
          subtitle={`${transactions?.income || 0} income &bull; ${transactions?.expense || 0} expense`}
        />
        <StatCard
          title="Active Students"
          value={users?.active || 0}
          icon={UserCheck}
          color="#34D399"
          subtitle="Full access granted"
        />
        <StatCard
          title="Deactivated Accounts"
          value={users?.disabled || 0}
          icon={UserX}
          color="#F87171"
          subtitle="Access suspended"
        />
      </div>

      {/* 3. Monthly Activity Chart */}
      <Card elevated style={{ padding: '1.75rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
            Platform Transaction Volume History
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem', marginBottom: 0 }}>
            Monthly gross cash flow recorded across all campus students
          </p>
        </div>

        {monthlyActivity.length > 0 ? (
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="_id" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(val) => `Rs ${val}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid rgba(167, 139, 250, 0.3)',
                    borderRadius: '10px'
                  }}
                  formatter={(val) => [formatCurrency(val), 'Volume']}
                />
                <Bar dataKey="totalVolume" fill="#A78BFA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
            No platform activity recorded yet.
          </div>
        )}
      </Card>

      {/* 4. Most Used Categories Leaderboard */}
      <Card elevated style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
              Top Used Categories
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem', marginBottom: 0 }}>
              Highest frequency spending categories among active students
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            icon={Tag}
            onClick={() => navigate('/admin/categories')}
          >
            All Categories
          </Button>
        </div>

        {topCategories.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8' }}>
            No category transaction data available yet.
          </div>
        ) : (
          <div className="luxury-table-container">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'center' }}>Transactions Logged</th>
                  <th style={{ textAlign: 'right' }}>Total Volume</th>
                </tr>
              </thead>
              <tbody>
                {topCategories.map((c) => (
                  <tr key={c.categoryId}>
                    <td style={{ fontWeight: 600, color: '#F8FAFC' }}>
                      {c.name}
                    </td>
                    <td>
                      <Badge variant={c.type === 'income' ? 'success' : 'danger'}>
                        {c.type}
                      </Badge>
                    </td>
                    <td style={{ textAlign: 'center', color: '#CBD5E1' }}>
                      {c.usageCount} entries
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#F8FAFC' }}>
                      {formatCurrency(c.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
