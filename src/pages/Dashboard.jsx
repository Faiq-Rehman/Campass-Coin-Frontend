import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Tag,
  Bot,
  CheckCircle2,
  Calendar,
  Layers,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import dashboardService from '../services/dashboardService';
import transactionService from '../services/transactionService';
import categoryService from '../services/categoryService';
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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Spending Trends filter state
  const [trendTimeframe, setTrendTimeframe] = useState('daily');
  const [spendingTrendsData, setSpendingTrendsData] = useState([]);
  const [loadingTrends, setLoadingTrends] = useState(false);

  // Quick Expense Entry Form state
  const [quickAmount, setQuickAmount] = useState('');
  const [quickDesc, setQuickDesc] = useState('');
  const [quickCategory, setQuickCategory] = useState('');
  const [aiSuggestedCat, setAiSuggestedCat] = useState(null);
  const [aiConfidence, setAiConfidence] = useState(0);
  const [loggingExpense, setLoggingExpense] = useState(false);

  // Fetch complete dashboard payload
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const [res, catRes] = await Promise.all([
        dashboardService.getDashboardData(),
        categoryService.getCategories('expense')
      ]);

      if (res.success && res.data) {
        setDashboardData(res.data);
        if (res.data.spendingTrends) {
          setSpendingTrendsData(res.data.spendingTrends);
        }
      }
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const handleTxUpdate = () => fetchDashboard();
    window.addEventListener('transaction-updated', handleTxUpdate);
    return () => window.removeEventListener('transaction-updated', handleTxUpdate);
  }, []);

  // Fetch updated spending trends whenever the timeframe filter changes
  const handleTimeframeChange = async (tf) => {
    setTrendTimeframe(tf);
    try {
      setLoadingTrends(true);
      const res = await dashboardService.getSpendingTrends(tf);
      if (res.success && res.data) {
        setSpendingTrendsData(res.data);
      }
    } catch (err) {
      console.error('Error fetching spending trends:', err);
    } finally {
      setLoadingTrends(false);
    }
  };

  // AI Auto-Categorization on Description Typing
  useEffect(() => {
    if (!quickDesc.trim()) {
      setAiSuggestedCat(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await transactionService.suggestCategory(quickDesc, 'expense');
        if (res.success && res.data && res.data.suggestedCategoryName) {
          const matchedDoc = categories.find((c) =>
            c.name.toLowerCase() === res.data.suggestedCategoryName.toLowerCase()
          );

          if (matchedDoc) {
            setAiSuggestedCat(matchedDoc);
            setAiConfidence(res.data.confidence || 0.85);
            // Pre-select if student hasn't manually selected yet
            if (!quickCategory) {
              setQuickCategory(matchedDoc._id);
            }
          }
        } else {
          setAiSuggestedCat(null);
        }
      } catch (e) {
        // Silent advisory fail
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [quickDesc, categories]);

  // Handle Quick Expense Submission
  const handleLogQuickExpense = async (e) => {
    e.preventDefault();
    if (!quickAmount || Number(quickAmount) <= 0) {
      toast.error('Please enter a valid expense amount');
      return;
    }

    const selectedCatId = quickCategory || (aiSuggestedCat ? aiSuggestedCat._id : (categories[0]?._id));
    if (!selectedCatId) {
      toast.error('Please select an expense category');
      return;
    }

    try {
      setLoggingExpense(true);
      const res = await transactionService.createTransaction({
        amount: Number(quickAmount),
        category: selectedCatId,
        type: 'expense',
        description: quickDesc.trim() || 'Quick Expense',
        date: new Date().toISOString()
      });

      if (res.success) {
        toast.success(`Logged ${formatCurrency(quickAmount)} expense successfully!`);
        setQuickAmount('');
        setQuickDesc('');
        setQuickCategory('');
        setAiSuggestedCat(null);
        fetchDashboard();
        window.dispatchEvent(new Event('transaction-updated'));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to log expense');
    } finally {
      setLoggingExpense(false);
    }
  };

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
    incomeVsExpense = [],
    savingTips = []
  } = dashboardData || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
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
          <span
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#00E699',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginBottom: '0.35rem'
            }}
          >
            <Calendar size={13} /> {currentMonthName} Term
          </span>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Financial Overview
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            size="sm"
            icon={Bot}
            onClick={() => navigate('/ai-assistant')}
          >
            AI Assistant
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={PiggyBank}
            onClick={() => navigate('/budgets')}
          >
            Manage Budgets
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
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />
          <div style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            <strong>Budget Alert:</strong> You have reached over 80% limit on{' '}
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>
              {budgetWarnings.map((b) => `${b.category} (${b.percentageUsed}%)`).join(', ')}
            </span>.
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/budgets')}>
            Review Budgets
          </Button>
        </motion.div>
      )}

      {/* 3. Stat Cards Grid (Live MongoDB Balance, Income, Expenses, Savings) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
        <StatCard
          title="Current Balance"
          value={formatCurrency(summary.currentBalance || 0)}
          icon={Wallet}
          color="#10B981"
          subtitle={`Allowance baseline: ${formatCurrency(summary.monthlyAllowance || 0)}`}
        />

        <StatCard
          title="Income This Month"
          value={formatCurrency(summary.incomeThisMonth || 0)}
          icon={ArrowUpRight}
          color="#00E699"
          trend={{ direction: 'up', value: 'Recorded' }}
          subtitle="Allowances & earnings"
        />

        <StatCard
          title="Expenses This Month"
          value={formatCurrency(summary.expenseThisMonth || 0)}
          icon={ArrowDownLeft}
          color="#EF4444"
          subtitle={topSpendingCategory ? `Top: ${topSpendingCategory.name}` : 'No expenses logged'}
        />

        <StatCard
          title="Net Savings"
          value={formatCurrency(summary.netSavingsThisMonth || 0)}
          icon={PiggyBank}
          color="#06B6D4"
          subtitle={
            summary.savingsGoal > 0
              ? `${summary.savingsGoalProgress || 0}% of target ${formatCurrency(summary.savingsGoal)}`
              : 'Set a goal in Profile'
          }
        />
      </div>

      {/* 4. Quick Expense Entry & AI Auto-Categorization Card */}
      <Card style={{ padding: '1.5rem', border: '1px solid var(--border-accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Plus size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Quick Expense Entry & AI Auto-Categorization
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Real-time AI matching as you type description (e.g. "Campus Cafe", "Textbook")
              </span>
            </div>
          </div>

          {aiSuggestedCat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(0, 230, 153, 0.12)',
                border: '1px solid rgba(0, 230, 153, 0.35)',
                color: '#00E699',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 600
              }}
            >
              <Sparkles size={14} /> AI Suggested: <strong>{aiSuggestedCat.name}</strong> ({Math.round(aiConfidence * 100)}%)
            </motion.div>
          )}
        </div>

        <form onSubmit={handleLogQuickExpense} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 140px', gap: '0.85rem', alignItems: 'flex-end' }}>
          <div>
            <label className="input-label">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="luxury-input"
              value={quickAmount}
              onChange={(e) => setQuickAmount(e.target.value)}
              placeholder="e.g. 14.50"
              required
            />
          </div>

          <div>
            <label className="input-label">Description (Smart AI Match)</label>
            <input
              type="text"
              className="luxury-input"
              value={quickDesc}
              onChange={(e) => setQuickDesc(e.target.value)}
              placeholder="e.g. Campus Cafe, Bus Pass..."
              required
            />
          </div>

          <div>
            <label className="input-label">Category (Manual Override)</label>
            <select
              className="luxury-select"
              value={quickCategory}
              onChange={(e) => setQuickCategory(e.target.value)}
            >
              <option value="">{aiSuggestedCat ? `AI: ${aiSuggestedCat.name}` : 'Select Category'}</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" variant="gold" loading={loggingExpense} style={{ height: '42px', width: '100%' }}>
            Log Expense
          </Button>
        </form>
      </Card>

      {/* 5. Spending Trends Widget (Multi-category Line Chart with Daily, Weekly, Monthly, 6-Month Filters) */}
      <Card style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp className="w-5 h-5 text-[#00E699]" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Spending Trends Widget
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '3px 0 0 0' }}>
              Live transaction data categorized by Food, Social, Academics, Subscriptions
            </p>
          </div>

          {/* Timeframe Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-secondary)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            {[
              { id: 'daily', label: 'Daily (7D)' },
              { id: 'weekly', label: 'Weekly (4W)' },
              { id: 'monthly', label: 'Monthly' },
              { id: 'sixMonths', label: '6-Month' }
            ].map((tf) => (
              <button
                key={tf.id}
                type="button"
                onClick={() => handleTimeframeChange(tf.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '7px',
                  border: 'none',
                  background: trendTimeframe === tf.id ? 'var(--bg-primary)' : 'transparent',
                  color: trendTimeframe === tf.id ? '#00E699' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: trendTimeframe === tf.id ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Line Recharts Chart */}
        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spendingTrendsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="label" stroke="var(--text-dim)" fontSize={11} />
              <YAxis stroke="var(--text-dim)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                  fontSize: '12px'
                }}
                formatter={(val, name) => [formatCurrency(val), name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="Food" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Social" stroke="#A855F7" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Academics" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Subscriptions" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 6. Income vs Expense Widget (Dynamic Live Bar Chart) & Top Category Highlight */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Income vs Expense Bar Chart */}
        <Card style={{ flex: 1.5, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 className="w-5 h-5 text-[#00E699]" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Income vs Expense Widget
                </h2>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                Dynamic inflow vs outflow calculated live from MongoDB
              </p>
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#00E699',
                background: 'rgba(0, 230, 153, 0.12)',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontWeight: 600
              }}
            >
              6 Months Live
            </span>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpense} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="label" stroke="var(--text-dim)" fontSize={11} />
                <YAxis stroke="var(--text-dim)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    fontSize: '12px'
                  }}
                  formatter={(val, name) => [formatCurrency(val), name === 'income' ? 'Income' : 'Expense']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Dynamic Highlight: This Month Top Category */}
        <Card style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                This Month Top Category
              </h2>
              <Tag className="w-4 h-4 text-[#00E699]" />
            </div>

            {topSpendingCategory ? (
              <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {topSpendingCategory.name}
                  </span>
                  <span
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#EF4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    {topSpendingCategory.percentage}% of Spend
                  </span>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#EF4444' }}>
                  {formatCurrency(topSpendingCategory.amount)}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem', margin: 0 }}>
                  Largest cost center for {currentMonthName}.
                </p>
              </div>
            ) : (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No expenses recorded this month.</p>
            )}
          </div>

          {/* Savings Target Progress Meter */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Monthly Savings Progress</span>
              <span style={{ color: '#00E699', fontWeight: 700 }}>{summary.savingsGoalProgress || 0}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, summary.savingsGoalProgress || 0)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)',
                  borderRadius: '4px',
                  transition: 'width 0.5s ease-out'
                }}
              />
            </div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Goal: {formatCurrency(summary.savingsGoal || 0)} &bull; Saved: {formatCurrency(Math.max(0, summary.netSavingsThisMonth || 0))}
            </span>
          </div>
        </Card>
      </div>

      {/* 7. Dynamic Highlight: Budget vs Actual with Real-Time Budget Progress Bars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Real-Time Budget Progress Bars */}
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PiggyBank className="w-5 h-5 text-[#00E699]" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Budget vs Actual
                </h2>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                Real-time progress bars: green (safe), orange (80%), red (maxed out)
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/budgets')}>
              Manage <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {budgetVsActual.length === 0 ? (
            <EmptyState
              icon={PiggyBank}
              title="No Active Budgets"
              description="Establish monthly spending limits for Food, Transport, or Entertainment."
              actionText="Create Budget"
              onAction={() => navigate('/budgets')}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {budgetVsActual.map((b) => {
                // Status color calculation: green for safe (<80%), orange for 80% limit, red for maxed out (>=100%)
                const statusColor = b.isOverBudget || b.percentageUsed >= 100
                  ? '#EF4444' // Maxed out
                  : b.percentageUsed >= 80
                  ? '#F59E0B' // 80% warning
                  : '#10B981'; // Safe

                const statusLabel = b.percentageUsed >= 100
                  ? 'Maxed Out'
                  : b.percentageUsed >= 80
                  ? '80% Threshold'
                  : 'Safe Balance';

                return (
                  <div
                    key={b.budgetId}
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '0.9rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {b.category}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            backgroundColor: `${statusColor}20`,
                            color: statusColor,
                            border: `1px solid ${statusColor}40`
                          }}
                        >
                          {statusLabel}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: statusColor }}>
                          {b.percentageUsed}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, b.percentageUsed)}%`,
                          height: '100%',
                          backgroundColor: statusColor,
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.45rem' }}>
                      <span>Spent: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(b.spentAmount)}</strong></span>
                      <span>Remaining: <strong style={{ color: statusColor }}>{formatCurrency(b.remainingAmount)}</strong></span>
                      <span>Limit: {formatCurrency(b.limitAmount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent Transactions Widget */}
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Receipt className="w-5 h-5 text-[#00E699]" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Recent Transactions
                </h2>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
                Live database transaction activity
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/transactions')}>
              All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {recentTransactions.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No Transactions"
              description="Record your food, transport, or allowances using the form above."
              actionText="Record Entry"
              onAction={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
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
                    background: 'var(--bg-secondary)',
                    borderRadius: '10px',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        backgroundColor: tx.type === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: tx.type === 'income' ? '#00E699' : '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shrink: 0
                      }}
                    >
                      {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }} className="truncate">
                        {tx.description}
                      </p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
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
    </div>
  );
};

export default Dashboard;
