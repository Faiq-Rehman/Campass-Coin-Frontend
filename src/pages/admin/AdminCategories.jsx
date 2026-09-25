import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Lock
} from 'lucide-react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';

const PALETTE = [
  '#6366F1', '#D6B36A', '#34D399', '#F87171', '#38BDF8',
  '#FBBF24', '#EC4899', '#A855F7', '#84CC16', '#64748B'
];

const AdminCategories = () => {
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'expense' | 'income'
  const [filterScope, setFilterScope] = useState('all'); // 'all' | 'default' | 'custom'

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    type: 'expense',
    color: '#6366F1',
    icon: 'tag'
  });
  const [createLoading, setCreateLoading] = useState(false);

  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [catToEdit, setCatToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', color: '#6366F1' });
  const [editLoading, setEditLoading] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateDefault = async (e) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setCreateLoading(true);
      const res = await adminService.createDefaultCategory({
        name: createForm.name.trim(),
        type: createForm.type,
        color: createForm.color,
        icon: createForm.icon
      });

      if (res.success) {
        toast.success(`Default system category "${createForm.name}" created`);
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
      toast.error('Name cannot be empty');
      return;
    }

    try {
      setEditLoading(true);
      const res = await adminService.updateDefaultCategory(catToEdit._id, {
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
      const res = await adminService.deleteDefaultCategory(catToDelete._id);
      if (res.success) {
        toast.success('Category removed from system defaults');
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
    if (filterType !== 'all' && c.type !== filterType) return false;
    if (filterScope === 'default' && !c.isDefault) return false;
    if (filterScope === 'custom' && c.isDefault) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
            System Categories
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '0.25rem', marginBottom: 0 }}>
            Curate default global spending buckets available to all campus students
          </p>
        </div>

        <Button
          variant="gold"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
        >
          Add Default Category
        </Button>
      </div>

      {/* 2. Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div className="luxury-tabs">
          <button
            className={`luxury-tab ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Types ({categories.length})
          </button>
          <button
            className={`luxury-tab ${filterType === 'expense' ? 'active' : ''}`}
            onClick={() => setFilterType('expense')}
          >
            Expenses
          </button>
          <button
            className={`luxury-tab ${filterType === 'income' ? 'active' : ''}`}
            onClick={() => setFilterType('income')}
          >
            Incomes
          </button>
        </div>

        <div className="luxury-tabs">
          <button
            className={`luxury-tab ${filterScope === 'all' ? 'active' : ''}`}
            onClick={() => setFilterScope('all')}
          >
            All Scopes
          </button>
          <button
            className={`luxury-tab ${filterScope === 'default' ? 'active' : ''}`}
            onClick={() => setFilterScope('default')}
          >
            System Defaults
          </button>
          <button
            className={`luxury-tab ${filterScope === 'custom' ? 'active' : ''}`}
            onClick={() => setFilterScope('custom')}
          >
            Student Custom
          </button>
        </div>
      </div>

      {/* 3. Table */}
      {loading ? (
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
            <SkeletonCard height="45px" />
            <SkeletonCard height="45px" />
            <SkeletonCard height="45px" />
          </div>
        </Card>
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No Categories Found"
          description="No categories match your current type or scope filter."
        />
      ) : (
        <div className="luxury-table-container">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Type</th>
                <th>Scope</th>
                <th>Created By</th>
                <th style={{ textAlign: 'center', width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((c) => (
                <tr key={c._id}>
                  {/* Category Name & Color Tag */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '4px',
                          backgroundColor: c.color || '#6366F1'
                        }}
                      />
                      <span style={{ fontWeight: 600, color: '#F8FAFC' }}>{c.name}</span>
                    </div>
                  </td>

                  {/* Type */}
                  <td>
                    <Badge variant={c.type === 'income' ? 'success' : 'danger'}>
                      {c.type}
                    </Badge>
                  </td>

                  {/* Scope */}
                  <td>
                    {c.isDefault ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#A78BFA', fontSize: '0.8rem', fontWeight: 600 }}>
                        <Lock size={12} /> System Default
                      </span>
                    ) : (
                      <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Personal Custom</span>
                    )}
                  </td>

                  {/* Created By */}
                  <td style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                    {c.isDefault ? 'Campus System' : c.user?.fullName || 'Student'}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add Default System Category"
        subtitle="This category will be universally available to all campus students"
      >
        <form onSubmit={handleCreateDefault} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="input-label">Category Name</label>
            <input
              type="text"
              placeholder="e.g. Health & Wellness, Laboratory Fees"
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
            <label className="input-label">Color Swatch</label>
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
              Save Default Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* 5. Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit System Category"
        subtitle={`Update attributes for "${catToEdit?.name}"`}
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
            <label className="input-label">Color Swatch</label>
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

      {/* 6. Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Category"
        subtitle="This action will remove the category from the platform"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: '#CBD5E1', fontSize: '0.95rem', margin: 0 }}>
            Are you sure you want to remove <strong style={{ color: '#F8FAFC' }}>"{catToDelete?.name}"</strong>?
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleteLoading} onClick={handleConfirmDelete}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCategories;
