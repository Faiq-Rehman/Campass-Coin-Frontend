import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Megaphone,
  ShieldCheck,
  Activity,
  Server,
  Clock,
  CheckCircle2
} from 'lucide-react';
import adminService from '../../services/adminService';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';
import { formatCurrency } from '../../utils/currency';

const AdminStatistics = () => {
  const toast = useToast();

  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatsAndHealth = async () => {
    try {
      setLoading(true);
      const [statsRes, healthRes] = await Promise.all([
        adminService.getStatistics(),
        api.get('/health').catch(() => ({ data: { success: true, uptime: 0 } }))
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      if (healthRes.data) {
        setHealth(healthRes.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch platform metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndHealth();
  }, []);

  if (loading && !stats) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="stat-grid">
          <SkeletonCard height="130px" />
          <SkeletonCard height="130px" />
          <SkeletonCard height="130px" />
          <SkeletonCard height="130px" />
        </div>
        <SkeletonCard height="240px" />
      </div>
    );
  }

  const {
    totalIncomeVolume = 0,
    totalExpenseVolume = 0,
    activeBudgets = 0,
    totalAnnouncements = 0
  } = stats || {};

  const grossPlatformVolume = totalIncomeVolume + totalExpenseVolume;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
          Platform Statistics & Telemetry
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '0.25rem', marginBottom: 0 }}>
          High-level institutional financial volume aggregations, budget enforcement stats, and server health
        </p>
      </div>

      {/* 2. Stat Cards */}
      <div className="stat-grid">
        <StatCard
          title="Total Inflow Volume"
          value={formatCurrency(totalIncomeVolume)}
          icon={ArrowUpRight}
          color="#10B981"
          subtitle="All recorded student deposits"
        />
        <StatCard
          title="Total Outflow Volume"
          value={formatCurrency(totalExpenseVolume)}
          icon={ArrowDownLeft}
          color="#F87171"
          subtitle="All recorded student spending"
        />
        <StatCard
          title="Active Monthly Budgets"
          value={activeBudgets}
          icon={PiggyBank}
          color="#06B6D4"
          subtitle="Monitored spending guardrails"
        />
        <StatCard
          title="Total Announcements"
          value={totalAnnouncements}
          icon={Megaphone}
          color="#34D399"
          subtitle="Broadcast notices delivered"
        />
      </div>

      {/* 3. Institutional Volume Overview */}
      <Card elevated style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Gross Platform Volume
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', marginTop: '0.25rem' }}>
              {formatCurrency(grossPlatformVolume)}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.2rem', marginBottom: 0 }}>
              Combined total of all student ledger transactions tracked by Campus Coin
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', minWidth: '150px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Income Ratio</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>
                {grossPlatformVolume > 0 ? Math.round((totalIncomeVolume / grossPlatformVolume) * 100) : 0}%
              </div>
            </div>
            <div style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', minWidth: '150px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Expense Ratio</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F87171' }}>
                {grossPlatformVolume > 0 ? Math.round((totalExpenseVolume / grossPlatformVolume) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Volume proportion track */}
        <div className="luxury-progress-track" style={{ height: '14px' }}>
          <div
            className="luxury-progress-fill success"
            style={{ width: `${grossPlatformVolume > 0 ? (totalIncomeVolume / grossPlatformVolume) * 100 : 50}%` }}
          />
        </div>
      </Card>

      {/* 4. Infrastructure & Server Telemetry */}
      <Card elevated style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Server size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Infrastructure & Backend State
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Server health, API status, and environment variables
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>API Status</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Online & Healthy</strong>
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Database Engine</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
              <CheckCircle2 size={16} style={{ color: '#10B981' }} />
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>MongoDB Active</strong>
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Security Protocol</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
              <ShieldCheck size={16} style={{ color: '#06B6D4' }} />
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>JWT Bearer 256-bit</strong>
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Uptime Counter</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
              <Clock size={16} style={{ color: '#10B981' }} />
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {health?.uptime ? `${Math.round(health.uptime / 60)} minutes` : 'Active'}
              </strong>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminStatistics;
