import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Plus,
  Receipt,
  FileSpreadsheet,
  AlertTriangle,
  Sparkles,
  Pin,
  X,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import dashboardService from '../services/dashboardService';
import tipService from '../services/tipService';
import StatCard from '../components/common/StatCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import CurrencyText from '../components/common/CurrencyText';
import { SkeletonCard, SkeletonItem } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

const Dashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const outletContext = useOutletContext();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getDashboardData();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    // Listen for global transaction update events (from quick modal)
    const handleTxUpdate = () => fetchDashboard();
    window.addEventListener('transaction-updated', handleTxUpdate);
    return () => window.removeEventListener('transaction-updated', handleTxUpdate);
  }, []);

  const handlePinTip = async (tipId) => {
    try {
      await tipService.pinTip(tipId);
      fetchDashboard();
      toast.success('Tip pin status updated');
    } catch (err) {
      toast.error('Failed to pin tip');
    }
  };

  const handleDismissTip = async (tipId) => {
    try {
      await tipService.dismissTip(tipId);
      fetchDashboard();
      toast.info('Tip dismissed');
    } catch (err) {
      toast.error('Failed to dismiss tip');
    }
  };

  const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  if (loading && !dashboardData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard height="300px" />
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <Card style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <AlertTriangle className="w-12 h-12 text-[#FBBF24] mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">Dashboard Offline</h3>
        <p className="text-sm text-[#94A3B8] max-w-md mx-auto mb-5">{error}</p>
        <Button variant="gold" onClick={fetchDashboard}>
          Retry Connection
        </Button>
      </Card>
    );
  }

  const {
    summary = {},
    topSpendingCategory,
    budgetVsActual = [],
    budgetWarnings = [],
    recentTransactions = [],
    spendingTrend = [],
    savingTips = []
  } = dashboardData || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Header Banner & Quick Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <span className="badge-gold" style={{ marginBottom: '0.4rem' }}>
            {currentMonthName} Academic Term
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#F8FAFC' }}>
            Financial Overview
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button
            variant="gold"
            size="sm"
            icon={Plus}
            onClick={() => outletContext?.openQuickAdd ? outletContext.openQuickAdd() : navigate('/transactions')}
          >
            Record Entry
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={PiggyBank}
            onClick={() => navigate('/budgets')}
          >
            Set Budget
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={FileSpreadsheet}
            onClick={() => navigate('/transactions')}
          >
            Import CSV
          </Button>
        </div>
      </div>

      {/* 2. Budget Alert Warnings if any */}
      {budgetWarnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <AlertTriangle className="w-5 h-5 text-[#FBBF24] shrink-0" />
          <div style={{ flex: 1, fontSize: '0.85rem', color: '#F8FAFC' }}>
            <strong>Budget Alert:</strong> You have consumed over 80% of your budget for{' '}
            <span style={{ color: '#FBBF24', fontWeight: 600 }}>
              {budgetWarnings.map((b) => `${b.category} (${b.percentageUsed}%)`).join(', ')}
            </span>.
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/budgets')}>
            Review Budgets
          </Button>
        </motion.div>
      )}

      {/* 3. Stat Cards Grid (Balance, Income, Expenses, Savings) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
        <StatCard
          title="Current Balance"
          value={formatCurrency(summary.currentBalance || 0)}
          icon={Wallet}
          color="#D6B36A"
          subtitle={`Allowance baseline: ${formatCurrency(summary.monthlyAllowance || 0)}`}
        />

        <StatCard
          title="Income This Month"
          value={formatCurrency(summary.incomeThisMonth || 0)}
          icon={ArrowUpRight}
          color="#34D399"
          trend={{ direction: 'up', value: 'Recorded' }}
          subtitle="Allowances & earnings"
        />

        <StatCard
          title="Expenses This Month"
          value={formatCurrency(summary.expenseThisMonth || 0)}
          icon={ArrowDownLeft}
          color="#F87171"
          subtitle={topSpendingCategory ? `Top: ${topSpendingCategory.name}` : 'No expenses logged'}
        />

        <StatCard
          title="Net Savings"
          value={formatCurrency(summary.netSavingsThisMonth || 0)}
          icon={PiggyBank}
          color="#A78BFA"
          subtitle={
            summary.savingsGoal > 0
              ? `${summary.savingsGoalProgress || 0}% of target ${formatCurrency(summary.savingsGoal)}`
              : 'Set a goal in Profile'
          }
        />
      </div>

      {/* 4. Spending Trend Chart & Top Category Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* 7-Day Spending Trend AreaChart */}
        <Card style={{ flex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>7-Day Spending Activity</h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '2px 0 0 0' }}>Daily expense distribution</p>
            </div>
            <span className="badge-gold">Daily Realtime</span>
          </div>

          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D6B36A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D6B36A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickFormatter={(d) => d.slice(5)} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid rgba(214, 179, 106, 0.4)',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [formatCurrency(value), 'Spent']}
                />
                <Area type="monotone" dataKey="amount" stroke="#D6B36A" strokeWidth={2.5} fillOpacity={1} fill="url(#spendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Category & Goal Progress */}
        <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Major Cost Center</h3>
              <Tag className="w-4 h-4 text-[#D6B36A]" />
            </div>

            {topSpendingCategory ? (
              <div style={{ background: '#0D1320', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>
                    {topSpendingCategory.name}
                  </span>
                  <Badge variant="warning">{topSpendingCategory.percentage}% of Spend</Badge>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F87171' }}>
                  {formatCurrency(topSpendingCategory.amount)}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.4rem', margin: 0 }}>
                  Highest outflow in {currentMonthName}
                </p>
              </div>
            ) : (
              <p style={{ color: '#64748B', fontSize: '0.85rem' }}>No expenses recorded this month.</p>
            )}
          </div>

          {/* Savings Goal Progress Meter */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#94A3B8' }}>Semester Savings Goal</span>
              <span style={{ color: '#34D399', fontWeight: 700 }}>{summary.savingsGoalProgress || 0}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#0D1320', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, summary.savingsGoalProgress || 0)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #D6B36A 0%, #34D399 100%)',
                  borderRadius: '4px',
                  transition: 'width 0.5s ease-out'
                }}
              />
            </div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginTop: '0.4rem' }}>
              Target: {formatCurrency(summary.savingsGoal || 0)}
            </span>
          </div>
        </Card>
      </div>

      {/* 5. Budget vs Actual & Recent Transactions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Budget vs Actual Widget */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Active Budgets</h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '2px 0 0 0' }}>Live consumption monitoring</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/budgets')}>
              Manage <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {budgetVsActual.length === 0 ? (
            <EmptyState
              icon={PiggyBank}
              title="No Budgets Active"
              description="Keep your spending under control by setting monthly limits."
              actionText="Create Budget"
              onAction={() => navigate('/budgets')}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {budgetVsActual.map((b) => (
                <div key={b.budgetId} style={{ background: '#0D1320', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F8FAFC' }}>{b.category}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: b.isOverBudget ? '#F87171' : b.percentageUsed >= 80 ? '#FBBF24' : '#34D399' }}>
                      {b.percentageUsed}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#111827', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, b.percentageUsed)}%`,
                        height: '100%',
                        backgroundColor: b.isOverBudget ? '#F87171' : b.percentageUsed >= 80 ? '#FBBF24' : '#34D399',
                        borderRadius: '3px'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '0.35rem' }}>
                    <span>Spent: {formatCurrency(b.spentAmount)}</span>
                    <span>Limit: {formatCurrency(b.limitAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Transactions Widget */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Recent Activity</h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '2px 0 0 0' }}>Latest student records</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/transactions')}>
              All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {recentTransactions.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No Transactions"
              description="Start recording your daily food, transport, or allowances."
              actionText="Add Entry"
              onAction={() => outletContext?.openQuickAdd ? outletContext.openQuickAdd() : navigate('/transactions')}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {recentTransactions.slice(0, 5).map((tx) => (
                <div
                  key={tx._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: '#0D1320',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        backgroundColor: tx.type === 'income' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                        color: tx.type === 'income' ? '#34D399' : '#F87171',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shrink: 0
                      }}
                    >
                      {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC', margin: 0 }} className="truncate">
                        {tx.description}
                      </p>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                        {tx.category?.name || 'Category'} &bull; {formatDate(tx.date)}
                      </span>
                    </div>
                  </div>

                  <CurrencyText
                    amount={tx.amount}
                    type={tx.type}
                    showSign={true}
                    style={{ fontSize: '0.9rem', shrink: 0 }}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* 6. Personalized Saving Tips Carousel / Cards */}
      {savingTips.length > 0 && (
        <Card style={{ border: '1px solid rgba(214, 179, 106, 0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles className="w-5 h-5 text-[#D6B36A]" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Personalized Saving Tips</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tips')}>
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {savingTips.slice(0, 3).map((tip) => (
              <div
                key={tip._id}
                style={{
                  background: '#0D1320',
                  border: tip.isPinned ? '1px solid #D6B36A' : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className={tip.isPinned ? 'badge-gold' : 'badge-soft'}>
                    {tip.isPinned ? 'Pinned Advice' : 'Advisory Tip'}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handlePinTip(tip._id)}
                      title={tip.isPinned ? 'Unpin' : 'Pin to top'}
                      style={{ background: 'transparent', border: 'none', color: tip.isPinned ? '#D6B36A' : '#64748B', cursor: 'pointer', padding: '2px' }}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDismissTip(tip._id)}
                      title="Dismiss"
                      style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', padding: '2px' }}
                    >
                      <X className="w-3.5 h-3.5 hover:text-white" />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#F8FAFC', lineHeight: 1.4, margin: '0.5rem 0' }}>
                  {tip.tipText}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
