import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt,
  Plus,
  FileSpreadsheet,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  Edit2,
  Calendar,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Tag
} from 'lucide-react';
import transactionService from '../services/transactionService';
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
import { formatDate } from '../utils/date';
import { formatCurrency } from '../utils/currency';

const Transactions = () => {
  const toast = useToast();
  const outletContext = useOutletContext();

  // Data states
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalCount: 0 });

  // Filter states
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    date: '',
    isRecurring: false,
    recurringFrequency: 'monthly'
  });
  const [editLoading, setEditLoading] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // CSV Import Modal state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);

  // Fetch summary
  const fetchSummary = async () => {
    try {
      const res = await transactionService.getSummary();
      if (res.success && res.data) {
        const payload = res.data.data ?? res.data;
        const summaryData = payload.summary ?? payload;
        setSummary(summaryData);
      }
    } catch (err) {
      console.error('Summary fetch error:', err);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
    }
  };

  // Fetch transactions list
  const fetchTransactions = async (page = pagination.page) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit
      };

      if (search.trim()) params.search = search.trim();
      if (typeFilter !== 'all') params.type = typeFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await transactionService.getTransactions(params);
      if (res.success && res.data) {
        const transactionData = Array.isArray(res.data) ? { transactions: res.data } : res.data;
        setTransactions(Array.isArray(transactionData.transactions) ? transactionData.transactions : []);
        if (transactionData.pagination) {
          setPagination(transactionData.pagination);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchTransactions(1);
  }, [typeFilter, categoryFilter, startDate, endDate]);

  // Handle live global update (e.g. from quick modal in navbar)
  useEffect(() => {
    const handleGlobalUpdate = () => {
      fetchTransactions(pagination.page);
      fetchSummary();
    };
    window.addEventListener('transaction-updated', handleGlobalUpdate);
    return () => window.removeEventListener('transaction-updated', handleGlobalUpdate);
  }, [pagination.page]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Open Edit Modal
  const handleOpenEdit = (tx) => {
    setSelectedTx(tx);
    setEditForm({
      amount: tx.amount,
      type: tx.type,
      category: tx.category?._id || tx.category || '',
      description: tx.description,
      date: tx.date ? new Date(tx.date).toISOString().substring(0, 10) : '',
      isRecurring: Boolean(tx.isRecurring),
      recurringFrequency: tx.recurringFrequency || 'monthly'
    });
    setEditModalOpen(true);
  };

  // Submit Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.amount || Number(editForm.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!editForm.category) {
      toast.error('Please choose a category');
      return;
    }

    try {
      setEditLoading(true);
      const res = await transactionService.updateTransaction(selectedTx._id, {
        ...editForm,
        amount: Number(editForm.amount)
      });
      if (res.success) {
        toast.success('Transaction updated successfully');
        setEditModalOpen(false);
        fetchTransactions(pagination.page);
        fetchSummary();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update transaction');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete transaction
  const handleConfirmDelete = async () => {
    if (!txToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await transactionService.deleteTransaction(txToDelete._id);
      if (res.success) {
        toast.success('Transaction deleted');
        setDeleteModalOpen(false);
        setTxToDelete(null);
        fetchTransactions(pagination.page);
        fetchSummary();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete transaction');
    } finally {
      setDeleteLoading(false);
    }
  };

  // CSV Import handler
  const handleImportCSV = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      toast.error('Please select a .csv file to import');
      return;
    }

    try {
      setImportLoading(true);
      setImportResult(null);
      const res = await transactionService.importCSV(csvFile);
      if (res.success) {
        setImportResult(res.data);
        toast.success(res.message || 'CSV imported successfully!');
        fetchTransactions(1);
        fetchSummary();
      }
    } catch (err) {
      toast.error(err.message || 'CSV import failed');
    } finally {
      setImportLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = search || typeFilter !== 'all' || categoryFilter !== 'all' || startDate || endDate;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. Header with CTA Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Transactions
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginTop: '0.25rem', marginBottom: 0 }}>
            Audit and manage your daily campus expenses and income
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="outline"
            icon={FileSpreadsheet}
            onClick={() => {
              setImportResult(null);
              setCsvFile(null);
              setImportModalOpen(true);
            }}
          >
            Import CSV
          </Button>
          <Button
            variant="gold"
            icon={Plus}
            onClick={() => {
              if (outletContext?.openQuickAdd) {
                outletContext.openQuickAdd();
              }
            }}
          >
            Record Entry
          </Button>
        </div>
      </div>

      {/* 2. Top Summary Stat Cards */}
      {summary && (
        <div className="stat-grid">
          <StatCard
            title="Total Inflow"
            value={summary.totalIncome == null ? '—' : formatCurrency(summary.totalIncome)}
            icon={ArrowUpRight}
            color="#34D399"
            subtitle={`${summary.incomeCount ?? '—'} deposits`}
          />
          <StatCard
            title="Total Outflow"
            value={summary.totalExpense == null ? '—' : formatCurrency(summary.totalExpense)}
            icon={ArrowDownLeft}
            color="#F87171"
            subtitle={`${summary.expenseCount ?? '—'} expenses`}
          />
          <StatCard
            title="Net Balance"
            value={summary.balance == null ? '—' : formatCurrency(summary.balance)}
            icon={Receipt}
            color="var(--chart-accent)"
            subtitle="Overall cash standing"
          />
        </div>
      )}

      {/* 3. Filter and Search Bar */}
      <Card elevated style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.85rem' }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
            />
            <input
              type="text"
              placeholder="Search description..."
              className="luxury-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Type Filter */}
          <div style={{ minWidth: '130px' }}>
            <select
              className="luxury-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses</option>
              <option value="income">Incomes</option>
            </select>
          </div>

          {/* Category Filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              className="luxury-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>

          {/* Date range pickers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="date"
              className="luxury-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Start Date"
              style={{ width: '135px', padding: '0.65rem 0.6rem', fontSize: '0.8rem' }}
            />
            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>to</span>
            <input
              type="date"
              className="luxury-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="End Date"
              style={{ width: '135px', padding: '0.65rem 0.6rem', fontSize: '0.8rem' }}
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                padding: '0.65rem 0.9rem',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <X size={15} /> Clear
            </button>
          )}
        </div>
      </Card>

      {/* 4. Transactions Table List */}
      {loading ? (
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            <SkeletonItem height="40px" />
            <SkeletonItem height="40px" />
            <SkeletonItem height="40px" />
            <SkeletonItem height="40px" />
          </div>
        </Card>
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title={hasActiveFilters ? 'No matching transactions' : 'No transactions recorded yet'}
          description={
            hasActiveFilters
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'Start tracking your student cash flow by recording your first income or expense.'
          }
          actionText={hasActiveFilters ? 'Reset Filters' : 'Record Transaction'}
          onAction={hasActiveFilters ? handleClearFilters : () => outletContext?.openQuickAdd && outletContext.openQuickAdd()}
        />
      ) : (
        <div className="luxury-table-container">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center', width: '90px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  {/* Date */}
                  <td style={{ color: 'var(--text-dim)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    {formatDate(tx.date)}
                  </td>

                  {/* Description */}
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {tx.description}
                    </div>
                    {tx.isRecurring && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--chart-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '2px' }}>
                        &bull; Recurring ({tx.recurringFrequency})
                      </span>
                    )}
                  </td>

                  {/* Category */}
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        backgroundColor: tx.category?.color ? `${tx.category.color}15` : 'var(--bg-secondary)',
                        color: tx.category?.color || 'var(--text-secondary)'
                      }}
                    >
                      <Tag size={12} />
                      {tx.category?.name || 'General'}
                    </span>
                  </td>

                  {/* Type Badge */}
                  <td>
                    <Badge variant={tx.type === 'income' ? 'success' : 'danger'}>
                      {tx.type === 'income' ? 'Income' : 'Expense'}
                    </Badge>
                  </td>

                  {/* Amount */}
                  <td style={{ textAlign: 'right' }}>
                    <CurrencyText
                      amount={tx.amount}
                      type={tx.type}
                      showSign
                      style={{ fontSize: '0.95rem' }}
                    />
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        onClick={() => handleOpenEdit(tx)}
                        title="Edit Entry"
                        className="icon-action-btn"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setTxToDelete(tx);
                          setDeleteModalOpen(true);
                        }}
                        title="Delete Entry"
                        className="icon-action-btn delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                Showing {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of{' '}
                {pagination.totalCount} entries
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchTransactions(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', padding: '0 0.5rem' }}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchTransactions(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Edit Transaction Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Transaction"
        subtitle="Update transaction details and category assignments"
      >
        <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Amount & Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="input-label">Type</label>
              <select
                className="luxury-select"
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="input-label">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="luxury-input"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="input-label">Category</label>
            <select
              className="luxury-select"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories
                .filter((c) => c.type === editForm.type)
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="input-label">Description</label>
            <input
              type="text"
              className="luxury-input"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="input-label">Date</label>
            <input
              type="date"
              className="luxury-input"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              required
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={editLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* 6. Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Transaction"
        subtitle="This action cannot be undone"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Are you sure you want to delete{' '}
            <strong style={{ color: 'var(--text-primary)' }}>&quot;{txToDelete?.description}&quot;</strong> for{' '}
            <span style={{ color: 'var(--danger)' }}>{formatCurrency(txToDelete?.amount || 0)}</span>?
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleteLoading} onClick={handleConfirmDelete}>
              Delete Record
            </Button>
          </div>
        </div>
      </Modal>

      {/* 7. CSV Import Modal */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import Transactions via CSV"
        subtitle="Bulk upload student bank or wallet transaction statements"
      >
        <form onSubmit={handleImportCSV} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              padding: '1.5rem',
              border: '2px dashed var(--border-accent)',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-secondary)',
              textAlign: 'center'
            }}
          >
            <Upload size={32} style={{ color: 'var(--chart-accent)', marginBottom: '0.75rem' }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem', fontWeight: 600 }}>
              Select CSV File
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
              Columns required: <code>amount</code>, <code>type</code> (income/expense), <code>category</code>, <code>description</code>, and optional <code>date</code>
            </p>

            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files[0] || null)}
              style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}
            />
          </div>

          {importResult && (
            <div
              style={{
                padding: '1rem',
                borderRadius: '10px',
                backgroundColor: 'var(--success-subtle)',
                border: '1px solid var(--border-accent)',
                color: 'var(--primary)',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Import Finished:</div>
              <div>&bull; {importResult.importedCount} transaction(s) recorded successfully.</div>
              {importResult.skippedCount > 0 && (
                <div style={{ color: 'var(--warning-contrast)', marginTop: '0.25rem' }}>
                  &bull; {importResult.skippedCount} row(s) skipped due to formatting errors.
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setImportModalOpen(false)}>
              Close
            </Button>
            <Button type="submit" variant="gold" loading={importLoading} disabled={!csvFile}>
              Start Import
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;
