import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PiggyBank,
  Plus,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Tag,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import budgetService from '../services/budgetService';
import categoryService from '../services/categoryService';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import StatCard from '../components/common/StatCard';
import CurrencyText from '../components/common/CurrencyText';
import EmptyState from '../components/common/EmptyState';
import { SkeletonCard, SkeletonItem } from '../components/common/LoadingSkeleton';
import { formatCurrency } from '../utils/currency';

const Budgets = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const currentMonthStr = new Date().toISOString().substring(0, 7);

  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newBudgetForm, setNewBudgetForm] = useState({
    category: '',
    limitAmount: '',
    month: currentMonthStr
  });
  const [createLoading, setCreateLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [editLimit, setEditLimit] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch expense categories
  const fetchExpenseCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError(false);
    try {
      const res = await categoryService.getCategories('expense');
      if (res.success && res.data) {
        setCategories(res.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
      setCategoriesError(true);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch live budget status
  const fetchBudgetStatus = async (month = selectedMonth) => {
    try {
      setLoading(true);
      const res = await budgetService.getBudgetStatus(month);
      if (res.success && res.data) {
        setBudgets(res.data.budgets || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load budget status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseCategories();
  }, []);

  useEffect(() => {
    fetchBudgetStatus(selectedMonth);
  }, [selectedMonth]);

  // Handle global update event
  useEffect(() => {
    const handleGlobalUpdate = () => fetchBudgetStatus(selectedMonth);
    window.addEventListener('transaction-updated', handleGlobalUpdate);
    return () => window.removeEventListener('transaction-updated', handleGlobalUpdate);
  }, [selectedMonth]);

  // Calculations
  const totalLimit = budgets.reduce((acc, b) => acc + (b.limitAmount || 0), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + (b.spentAmount || 0), 0);
  const totalRemaining = Math.max(0, totalLimit - totalSpent);
  const overallPercentage = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;
  const warnings = budgets.filter((b) => b.percentageUsed >= 80);

  // Create Budget
  const handleCreateBudget = async (e) => {
    e.preventDefault();
    if (!newBudgetForm.category) {
      toast.error('Please select an expense category');
      return;
    }
    if (!newBudgetForm.limitAmount || Number(newBudgetForm.limitAmount) <= 0) {
      toast.error('Limit must be greater than 0');
      return;
    }

    try {
      setCreateLoading(true);
      const res = await budgetService.createBudget({
        category: newBudgetForm.category,
        month: newBudgetForm.month,
        limitAmount: Number(newBudgetForm.limitAmount)
      });
      if (res.success) {
        toast.success('Budget created successfully');
        setCreateModalOpen(false);
        setNewBudgetForm({ category: '', limitAmount: '', month: selectedMonth });
        fetchBudgetStatus(selectedMonth);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create budget');
    } finally {
      setCreateLoading(false);
    }
  };

  // Open Edit
  const handleOpenEdit = (b) => {
    setBudgetToEdit(b);
    setEditLimit(b.limitAmount.toString());
    setEditModalOpen(true);
  };

  // Submit Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editLimit || Number(editLimit) <= 0) {
      toast.error('Limit must be greater than 0');
      return;
    }

    try {
      setEditLoading(true);
      const res = await budgetService.updateBudget(budgetToEdit.budgetId, {
        limitAmount: Number(editLimit)
      });
      if (res.success) {
        toast.success('Budget limit updated');
        setEditModalOpen(false);
        fetchBudgetStatus(selectedMonth);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update budget');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Budget
  const handleConfirmDelete = async () => {
    if (!budgetToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await budgetService.deleteBudget(budgetToDelete.budgetId);
      if (res.success) {
        toast.success('Budget deleted');
        setDeleteModalOpen(false);
        setBudgetToDelete(null);
        fetchBudgetStatus(selectedMonth);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete budget');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. Header with Month Selector & Set Budget CTA */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
            Monthly Budgets
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '0.25rem', marginBottom: 0 }}>
            Set spending guardrails to protect your savings and avoid student overspending
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#111827', padding: '0.35rem 0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Calendar size={16} style={{ color: '#D6B36A' }} />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#F8FAFC',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            />
          </div>

          <Button
            variant="gold"
            icon={Plus}
            onClick={() => {
              setNewBudgetForm({ category: '', limitAmount: '', month: selectedMonth });
              setCreateModalOpen(true);
            }}
          >
            Create Budget
          </Button>
        </div>
      </div>

      {/* 2. Overview Progress Card */}
      <Card elevated goldBorder style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Monthly Overview &bull; {selectedMonth}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-heading)' }}>
                {formatCurrency(totalSpent)}
              </span>
              <span style={{ color: '#94A3B8', fontSize: '1.1rem' }}>
                of {formatCurrency(totalLimit)} allocated
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Remaining Budget</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: totalRemaining > 0 ? '#34D399' : '#F87171' }}>
                {formatCurrency(totalRemaining)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Consumption</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: overallPercentage >= 100 ? '#F87171' : overallPercentage >= 80 ? '#FBBF24' : '#D6B36A' }}>
                {overallPercentage}%
              </div>
            </div>
          </div>
        </div>

        {/* High-level progress track */}
        <div className="luxury-progress-track" style={{ height: '12px' }}>
          <div
            className={`luxury-progress-fill ${
              overallPercentage >= 100 ? 'danger' : overallPercentage >= 80 ? 'warning' : 'gold'
            }`}
            style={{ width: `${Math.min(100, overallPercentage)}%` }}
          />
        </div>
      </Card>

      {/* 3. Threshold Warning Alert Banner */}
      {warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}
        >
          <AlertTriangle size={22} style={{ color: '#FBBF24', flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: '0.88rem' }}>
            <strong style={{ color: '#FBBF24' }}>Budget Attention Required: </strong>
            <span style={{ color: '#F8FAFC' }}>
              {warnings.map((w) => `${w.category?.name} (${w.percentageUsed}%)`).join(', ')}{' '}
              have approached or exceeded your set spending limits.
            </span>
          </div>
        </motion.div>
      )}

      {/* 4. Category Budget Cards Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <SkeletonCard height="180px" />
          <SkeletonCard height="180px" />
          <SkeletonCard height="180px" />
        </div>
      ) : budgets.length === 0 ? (
        <EmptyState
          icon={PiggyBank}
          title="No Budgets Set For This Month"
          description={`You haven't defined any category spending limits for ${selectedMonth} yet. Establish limits to keep your expenses in check.`}
          actionText="Create First Budget"
          onAction={() => {
            setNewBudgetForm({ category: '', limitAmount: '', month: selectedMonth });
            setCreateModalOpen(true);
          }}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {budgets.map((b) => {
            const isDanger = b.percentageUsed >= 100;
            const isWarning = b.percentageUsed >= 80 && !isDanger;

            return (
              <Card
                key={b.budgetId}
                elevated
                hoverable
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderColor: isDanger
                    ? 'rgba(248, 113, 113, 0.4)'
                    : isWarning
                    ? 'rgba(251, 191, 36, 0.4)'
                    : undefined
                }}
              >
                {/* Card Header: Category & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: b.category?.color ? `${b.category.color}20` : 'rgba(214,179,106,0.15)',
                        color: b.category?.color || '#D6B36A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Tag size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                        {b.category?.name || 'Category'}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                        Limit: {formatCurrency(b.limitAmount)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleOpenEdit(b)}
                      title="Edit Limit"
                      className="icon-action-btn"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setBudgetToDelete(b);
                        setDeleteModalOpen(true);
                      }}
                      title="Delete Budget"
                      className="icon-action-btn delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Numbers */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Spent so far</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: isDanger ? '#F87171' : '#F8FAFC' }}>
                      {formatCurrency(b.spentAmount)}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      {isDanger ? 'Over by' : 'Remaining'}
                    </span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: isDanger ? '#F87171' : '#34D399' }}>
                      {isDanger
                        ? formatCurrency(b.spentAmount - b.limitAmount)
                        : formatCurrency(b.remainingAmount)}
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Status */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#94A3B8' }}>{b.percentageUsed}% consumed</span>
                    <Badge variant={isDanger ? 'danger' : isWarning ? 'warning' : 'gold'}>
                      {isDanger ? 'Limit Exceeded' : isWarning ? 'Warning 80%+' : 'On Track'}
                    </Badge>
                  </div>
                  <div className="luxury-progress-track">
                    <div
                      className={`luxury-progress-fill ${isDanger ? 'danger' : isWarning ? 'warning' : 'gold'}`}
                      style={{ width: `${Math.min(100, b.percentageUsed)}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 5. Create Budget Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Set Category Budget"
        subtitle={`Establish spending limits for ${selectedMonth}`}
      >
        <form onSubmit={handleCreateBudget} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="input-label">Expense Category</label>
            <select
              className="luxury-select"
              value={newBudgetForm.category}
              onChange={(e) => setNewBudgetForm({ ...newBudgetForm, category: e.target.value })}
              disabled={categoriesLoading || categoriesError || categories.length === 0}
              required
            >
              <option value="">
                {categoriesLoading
                  ? 'Loading expense categories...'
                  : categoriesError
                  ? 'Could not load expense categories'
                  : categories.length === 0
                  ? 'No expense categories available'
                  : 'Select Expense Category'}
              </option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {categoriesError ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.65rem' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Check your connection and try again.</span>
                <Button size="sm" variant="outline" onClick={fetchExpenseCategories}>Retry</Button>
              </div>
            ) : !categoriesLoading && categories.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.65rem' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Add an expense category before setting a budget.</span>
                <Button size="sm" variant="outline" icon={Plus} onClick={() => navigate('/categories')}>Add Category</Button>
              </div>
            ) : null}
          </div>

          <div>
            <label className="input-label">Budget Month</label>
            <input
              type="month"
              className="luxury-input"
              value={newBudgetForm.month}
              onChange={(e) => setNewBudgetForm({ ...newBudgetForm, month: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="input-label">Monthly Limit Amount</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g. 5000"
              className="luxury-input"
              value={newBudgetForm.limitAmount}
              onChange={(e) => setNewBudgetForm({ ...newBudgetForm, limitAmount: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={createLoading}>
              Save Budget
            </Button>
          </div>
        </form>
      </Modal>

      {/* 6. Edit Budget Limit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Adjust Budget Limit"
        subtitle={`Update spending ceiling for ${budgetToEdit?.category?.name}`}
      >
        <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="input-label">New Monthly Limit</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="luxury-input"
              value={editLimit}
              onChange={(e) => setEditLimit(e.target.value)}
              required
              autoFocus
            />
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.35rem', display: 'block' }}>
              Current spent amount: {formatCurrency(budgetToEdit?.spentAmount || 0)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={editLoading}>
              Update Limit
            </Button>
          </div>
        </form>
      </Modal>

      {/* 7. Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Budget"
        subtitle="Remove category spending limit"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: '#CBD5E1', fontSize: '0.95rem', margin: 0 }}>
            Are you sure you want to remove the budget for{' '}
            <strong style={{ color: '#F8FAFC' }}>{budgetToDelete?.category?.name}</strong>? Your transactions will remain safe.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleteLoading} onClick={handleConfirmDelete}>
              Delete Budget
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Budgets;
