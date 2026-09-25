import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Lock,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Layers
} from 'lucide-react';
import categoryService from '../services/categoryService';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { SkeletonCard, SkeletonItem } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const PALETTE = [
  '#6366F1', '#D6B36A', '#34D399', '#F87171', '#38BDF8',
  '#FBBF24', '#EC4899', '#A855F7', '#84CC16', '#64748B'
];

const Categories = () => {
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'expense' | 'income'

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    type: 'expense',
    color: '#6366F1',
    icon: 'tag'
  });
  const [createLoading, setCreateLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [catToEdit, setCatToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', color: '#6366F1' });
  const [editLoading, setEditLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      setCreateLoading(true);
      const res = await categoryService.createCategory({
        name: createForm.name.trim(),
        type: createForm.type,
        color: createForm.color,
        icon: createForm.icon
      });
      if (res.success) {
        toast.success(`Category "${createForm.name}" created!`);
        setCreateModalOpen(false);
        setCreateForm({ name: '', type: 'expense', color: '#6366F1', icon: 'tag' });
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create category');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOpenEdit = (c) => {
    setCatToEdit(c);
    setEditForm({ name: c.name, color: c.color || '#6366F1' });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    try {
      setEditLoading(true);
      const res = await categoryService.updateCategory(catToEdit._id, {
        name: editForm.name.trim(),
        color: editForm.color
      });
      if (res.success) {
        toast.success('Category updated');
        setEditModalOpen(false);
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update category');
    } finally {
      setEditLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!catToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await categoryService.deleteCategory(catToDelete._id);
      if (res.success) {
        toast.success('Custom category deleted');
        setDeleteModalOpen(false);
        setCatToDelete(null);
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    return true;
  });

  const defaultCategories = filteredCategories.filter((c) => c.isDefault);
  const customCategories = filteredCategories.filter((c) => !c.isDefault);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. Header with Add Category CTA */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
            Categories
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '0.25rem', marginBottom: 0 }}>
            System standard templates and your personalized student budget categories
          </p>
        </div>

        <Button
          variant="gold"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
        >
          Add Custom Category
        </Button>
      </div>

      {/* 2. Type Filter Tabs */}
      <div className="luxury-tabs">
        <button
          className={`luxury-tab ${typeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setTypeFilter('all')}
        >
          All Categories ({categories.length})
        </button>
        <button
          className={`luxury-tab ${typeFilter === 'expense' ? 'active' : ''}`}
          onClick={() => setTypeFilter('expense')}
        >
          <ArrowDownLeft size={14} /> Expenses
        </button>
        <button
          className={`luxury-tab ${typeFilter === 'income' ? 'active' : ''}`}
          onClick={() => setTypeFilter('income')}
        >
          <ArrowUpRight size={14} /> Incomes
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <SkeletonCard height="100px" />
          <SkeletonCard height="100px" />
          <SkeletonCard height="100px" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* 3. Personal Custom Categories */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles size={18} style={{ color: '#D6B36A' }} />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                My Custom Categories ({customCategories.length})
              </h2>
            </div>

            {customCategories.length === 0 ? (
              <Card style={{ padding: '1.75rem', textAlign: 'center', color: '#94A3B8' }}>
                You haven't created custom categories yet. Click "Add Custom Category" to organize personalized student clubs, hobbies, or unique gigs.
              </Card>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {customCategories.map((c) => (
                  <Card key={c._id} elevated hoverable style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          backgroundColor: `${c.color || '#6366F1'}20`,
                          color: c.color || '#6366F1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Tag size={18} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                          {c.name}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: c.type === 'income' ? '#34D399' : '#F87171', textTransform: 'capitalize' }}>
                          {c.type}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        onClick={() => handleOpenEdit(c)}
                        title="Edit Category"
                        className="icon-action-btn"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setCatToDelete(c);
                          setDeleteModalOpen(true);
                        }}
                        title="Delete Category"
                        className="icon-action-btn delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* 4. System Default Categories */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Layers size={18} style={{ color: '#94A3B8' }} />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                Standard Campus Categories ({defaultCategories.length})
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {defaultCategories.map((c) => (
                <Card key={c._id} elevated style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.9 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: `${c.color || '#6366F1'}18`,
                        color: c.color || '#6366F1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Tag size={16} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F8FAFC', margin: 0 }}>
                        {c.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: c.type === 'income' ? '#34D399' : '#F87171', textTransform: 'capitalize' }}>
                        {c.type}
                      </span>
                    </div>
                  </div>

                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#64748B', fontSize: '0.72rem', background: 'rgba(255,255,255,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    <Lock size={11} /> Default
                  </span>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Create Category Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Custom Category"
        subtitle="Define a personal expense or income bucket"
      >
        <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="input-label">Category Name</label>
            <input
              type="text"
              placeholder="e.g. Robotics Club, Freelance Design"
              className="luxury-input"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="input-label">Type</label>
            <select
              className="luxury-select"
              value={createForm.type}
              onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="input-label">Color Accent</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
              {PALETTE.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setCreateForm({ ...createForm, color: hex })}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: hex,
                    border: createForm.color === hex ? '3px solid #FFFFFF' : 'none',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={createLoading}>
              Save Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* 6. Edit Category Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Category"
        subtitle={`Update "${catToEdit?.name}"`}
      >
        <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="input-label">Category Name</label>
            <input
              type="text"
              className="luxury-input"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="input-label">Color Accent</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
              {PALETTE.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setEditForm({ ...editForm, color: hex })}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: hex,
                    border: editForm.color === hex ? '3px solid #FFFFFF' : 'none',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

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

      {/* 7. Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Custom Category"
        subtitle="This action cannot be undone"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: '#CBD5E1', fontSize: '0.95rem', margin: 0 }}>
            Are you sure you want to delete <strong style={{ color: '#F8FAFC' }}>"{catToDelete?.name}"</strong>?
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleteLoading} onClick={handleConfirmDelete}>
              Delete Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
