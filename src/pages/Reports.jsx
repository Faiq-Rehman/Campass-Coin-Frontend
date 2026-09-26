import React, { useState, useEffect } from 'react';
import {
  PieChart as PieChartIcon,
  Download,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Sparkles,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import reportService from '../services/reportService';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatCard from '../components/common/StatCard';
import { SkeletonCard } from '../components/common/LoadingSkeleton';
import { formatCurrency } from '../utils/currency';

const COLORS = ['#D6B36A', '#34D399', '#A78BFA', '#F87171', '#38BDF8', '#FBBF24', '#EC4899', '#94A3B8'];

const Reports = () => {
  const toast = useToast();
  const currentMonthStr = new Date().toISOString().substring(0, 7);

  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [activeTab, setActiveTab] = useState('monthly'); // 'monthly' | 'trend' | 'categories' | 'forecast'

  // Data states
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [sixMonthsData, setSixMonthsData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [forecastData, setForecastData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [exportingPDF, setExportingPDF] = useState(false);

  // Fetch report data
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [monthlyRes, sixMonthsRes, categoryRes, forecastRes] = await Promise.all([
        reportService.getMonthly(selectedMonth),
        reportService.getSixMonths(),
        reportService.getCategory(null, null, 'expense'),
        reportService.getForecast()
      ]);

      if (monthlyRes.success) setMonthlyReport(monthlyRes.data);
      if (sixMonthsRes.success) setSixMonthsData(sixMonthsRes.data || []);
      if (categoryRes.success) setCategoryData(categoryRes.data || []);
      if (forecastRes.success) setForecastData(forecastRes.data || null);
    } catch (err) {
      toast.error(err.message || 'Failed to load financial reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedMonth]);

  // PDF Export
  const handleExportPDF = async () => {
    try {
      setExportingPDF(true);
      const blob = await reportService.exportPDF(selectedMonth);

      // Create browser blob download link
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CampusCoin_Statement_${selectedMonth}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Statement for ${selectedMonth} downloaded`);
    } catch (err) {
      toast.error(err.message || 'Failed to generate PDF statement');
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. Header with Month Selector & PDF Export */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Financial Reports
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginTop: '0.25rem', marginBottom: 0 }}>
            Analytical breakdowns, 6-month historical trends, and official PDF statements
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.35rem 0.75rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <Calendar size={16} style={{ color: '#D6B36A' }} />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            />
          </div>

          <Button
            variant="gold"
            icon={Download}
            loading={exportingPDF}
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* 2. Monthly Summary Stat Cards */}
      {monthlyReport && (
        <div className="stat-grid">
          <StatCard
            title="Monthly Inflow"
            value={formatCurrency(monthlyReport.totalIncome || 0)}
            icon={ArrowUpRight}
            color="#34D399"
            subtitle={`${monthlyReport.incomeTxCount || 0} deposits`}
          />
          <StatCard
            title="Monthly Outflow"
            value={formatCurrency(monthlyReport.totalExpense || 0)}
            icon={ArrowDownLeft}
            color="#F87171"
            subtitle={`${monthlyReport.expenseTxCount || 0} expenses`}
          />
          <StatCard
            title="Net Savings"
            value={formatCurrency(monthlyReport.netSavings || 0)}
            icon={PiggyBank}
            color="#D6B36A"
            subtitle={`Savings Rate: ${monthlyReport.savingsRate || 0}%`}
          />
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="luxury-tabs">
        <button
          className={`luxury-tab ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => setActiveTab('monthly')}
        >
          <BarChart3 size={15} /> Monthly Overview
        </button>
        <button
          className={`luxury-tab ${activeTab === 'trend' ? 'active' : ''}`}
          onClick={() => setActiveTab('trend')}
        >
          <TrendingUp size={15} /> 6-Month Trend
        </button>
        <button
          className={`luxury-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <PieChartIcon size={15} /> Category Breakdown
        </button>
        <button
          className={`luxury-tab ${activeTab === 'forecast' ? 'active' : ''}`}
          onClick={() => setActiveTab('forecast')}
        >
          <Sparkles size={15} /> Spending Forecast
        </button>
      </div>

      {/* 4. Tab 1: Monthly Overview */}
      {activeTab === 'monthly' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Daily Trend in Current Month */}
          <Card elevated style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Daily Spending Rhythm &bull; {selectedMonth}
            </h3>

            {monthlyReport?.dailyDistribution && monthlyReport.dailyDistribution.length > 0 ? (
              <div style={{ height: '280px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyReport.dailyDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis
                      dataKey="date"
                      stroke="#64748B"
                      fontSize={11}
                      tickFormatter={(val) => val.substring(8)}
                    />
                    <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `Rs ${val}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid rgba(214, 179, 106, 0.3)',
                        borderRadius: '10px'
                      }}
                      formatter={(value) => [formatCurrency(value), 'Spent']}
                    />
                    <Bar dataKey="totalSpent" fill="#D6B36A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
                No expense transactions logged for this month yet.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* 5. Tab 2: 6-Month Trend */}
      {activeTab === 'trend' && (
        <Card elevated style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              6-Month Income vs Expense Trajectory
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem', marginBottom: 0 }}>
              Comparative student cash inflow and outflow performance
            </p>
          </div>

          {sixMonthsData.length > 0 ? (
            <div style={{ height: '320px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sixMonthsData}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F87171" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} tickFormatter={(val) => `Rs ${val}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid rgba(214, 179, 106, 0.3)',
                      borderRadius: '10px'
                    }}
                    formatter={(val) => formatCurrency(val)}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#34D399"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#incomeGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Expense"
                    stroke="#F87171"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#expenseGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
              Historical data will populate as transactions are logged across multiple months.
            </div>
          )}
        </Card>
      )}

      {/* 6. Tab 3: Category Breakdown */}
      {activeTab === 'categories' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Donut Chart */}
          <Card elevated style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', width: '100%' }}>
              Category Distribution
            </h3>

            {categoryData.length > 0 ? (
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="totalSpent"
                      nameKey="categoryName"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid rgba(214, 179, 106, 0.3)',
                        borderRadius: '10px'
                      }}
                      formatter={(val) => formatCurrency(val)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ padding: '3rem 1rem', color: '#94A3B8' }}>No category data found</div>
            )}
          </Card>

          {/* Table Breakdown */}
          <Card elevated style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Category Spending Totals
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {categoryData.map((cat, idx) => (
                <div
                  key={cat.categoryId || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: cat.color || COLORS[idx % COLORS.length]
                      }}
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {cat.categoryName}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatCurrency(cat.totalSpent)}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {cat.percentage}% of total
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 7. Tab 4: Spending Forecast */}
      {activeTab === 'forecast' && (
        <Card elevated goldBorder style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #F0D89A 0%, #D6B36A 100%)',
                color: '#070B14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Next Month Expense Projection
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#D6B36A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Statistical Advisory Forecast
              </span>
            </div>
          </div>

          {forecastData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1.25rem', borderRadius: '12px', background: '#0D1320', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Expected Outflow</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-heading)', marginTop: '0.25rem' }}>
                    {formatCurrency(forecastData.projectedExpense || 0)}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#34D399', marginTop: '0.2rem', display: 'block' }}>
                    Confidence Level: {forecastData.confidence || 'Medium'}
                  </span>
                </div>

                <div style={{ padding: '1.25rem', borderRadius: '12px', background: '#0D1320', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Daily Spending Target</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D6B36A', fontFamily: 'var(--font-heading)', marginTop: '0.25rem' }}>
                    {formatCurrency(forecastData.recommendedDailyCap || Math.round((forecastData.projectedExpense || 0) / 30))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem', display: 'block' }}>
                    Maximum per day to avoid deficit
                  </span>
                </div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(214,179,106,0.06)', border: '1px solid rgba(214,179,106,0.2)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F0D89A', marginBottom: '0.4rem' }}>
                  Smart Recommendation
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#E2E8F0', lineHeight: 1.6, margin: 0 }}>
                  {forecastData.recommendation ||
                    'Maintain your regular allowance allocations and keep discretionary entertainment expenses within 20% of your total budget.'}
                </p>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#64748B', fontStyle: 'italic', margin: 0 }}>
                Disclaimer: Projections are computed from your recent spending history and recurring entries. This advisory is for personal educational budgeting assistance only.
              </p>
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
              Log at least a few days of student transactions to enable the forecasting engine.
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Reports;
