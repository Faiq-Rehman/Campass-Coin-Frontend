import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import categoryService from '../../services/categoryService';
import transactionService from '../../services/transactionService';
import { useToast } from '../../context/ToastContext';
import { Sparkles, AlertCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const QuickTransactionModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);

  // Fetch categories when modal opens or type changes
  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      try {
        const res = await categoryService.getCategories(type);
        if (res.success && res.data) {
          setCategories(res.data);
          if (res.data.length > 0 && !category) {
            setCategory(res.data[0]._id);
          }
        }
      } catch (err) {
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, [isOpen, type]);

  // AI / Keyword Category Suggestion
  useEffect(() => {
    if (!description || description.trim().length < 3) {
      setSuggestedCategory(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await transactionService.suggestCategory(description, type);
        if (res.success && res.data?.suggestedCategory) {
          setSuggestedCategory(res.data);
        } else {
          setSuggestedCategory(null);
        }
      } catch (e) {
        // Silent
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [description, type]);

  const handleApplySuggestion = () => {
    if (suggestedCategory?.suggestedCategory) {
      setCategory(suggestedCategory.suggestedCategory);
      toast.info(`Applied suggestion: "${suggestedCategory.suggestedCategoryName}"`);
      setSuggestedCategory(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);
    setWarningMessage(null);

    try {
      const payload = {
        type,
        amount: Number(amount),
        category,
        description: description.trim(),
        date: new Date(date).toISOString(),
        isRecurring,
        recurringFrequency: isRecurring ? recurringFrequency : null
      };

      const res = await transactionService.createTransaction(payload);
      if (res.success) {
        toast.success(`${type === 'income' ? 'Income' : 'Expense'} recorded successfully!`);

        // If backend returned duplicate or anomaly warnings
        if (res.warnings && res.warnings.length > 0) {
          toast.warning(res.warnings[0], 6000);
        }

        // Reset
        setAmount('');
        setDescription('');
        setIsRecurring(false);
        onClose();
        if (onSuccess) onSuccess(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to record transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Transaction"
      subtitle="Log your campus income or expense with smart category intelligence"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Type Toggle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: '#0D1320', padding: '4px', borderRadius: '10px' }}>
          <button
            type="button"
            onClick={() => setType('expense')}
            style={{
              padding: '0.6rem',
              borderRadius: '8px',
              border: 'none',
              background: type === 'expense' ? 'rgba(248, 113, 113, 0.2)' : 'transparent',
              color: type === 'expense' ? '#F87171' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s'
            }}
          >
            <ArrowDownLeft className="w-4 h-4" /> Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            style={{
              padding: '0.6rem',
              borderRadius: '8px',
              border: 'none',
              background: type === 'income' ? 'rgba(52, 211, 153, 0.2)' : 'transparent',
              color: type === 'income' ? '#34D399' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s'
            }}
          >
            <ArrowUpRight className="w-4 h-4" /> Income
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="input-label">Amount (₨ / $)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            className="luxury-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="input-label">Description</label>
          <input
            type="text"
            placeholder="e.g. Bought campus cafeteria burger"
            className="luxury-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/* AI Category Suggestion Pill */}
          {suggestedCategory && (
            <div
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(214, 179, 106, 0.12)',
                border: '1px solid rgba(214, 179, 106, 0.3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#F0D89A' }}>
                <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
                <span>Suggested: <strong>{suggestedCategory.suggestedCategoryName}</strong></span>
              </div>
              <button
                type="button"
                onClick={handleApplySuggestion}
                style={{
                  background: '#D6B36A',
                  color: '#070B14',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* Category & Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label className="input-label">Category</label>
            <select
              className="luxury-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} {c.isDefault ? '(Default)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">Date</label>
            <input
              type="date"
              className="luxury-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Recurring Switch */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#F8FAFC', fontWeight: 500 }}>Recurring Transaction</span>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Repeats automatically</p>
          </div>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#D6B36A', cursor: 'pointer' }}
          />
        </div>

        {isRecurring && (
          <div>
            <label className="input-label">Frequency</label>
            <select
              className="luxury-select"
              value={recurringFrequency}
              onChange={(e) => setRecurringFrequency(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="gold" type="submit" loading={loading}>
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default QuickTransactionModal;
