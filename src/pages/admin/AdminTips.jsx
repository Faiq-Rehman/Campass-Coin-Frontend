import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Tag,
  CheckCircle,
  Lightbulb,
  Search,
  BookOpen
} from 'lucide-react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';

const AdminTips = () => {
  const toast = useToast();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [form, setForm] = useState({
    title: '',
    tipText: '',
    categoryName: 'General',
    triggerRule: 'MANUAL_OR_DEFAULT'
  });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await adminService.getTipTemplates();
      if (res.success && res.data) {
        setTemplates(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch financial tip templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setForm({
      title: '',
      tipText: '',
      categoryName: 'General',
      triggerRule: 'MANUAL_OR_DEFAULT'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTemplate(t);
    setForm({
      title: t.title,
      tipText: t.tipText,
      categoryName: t.categoryName || 'General',
      triggerRule: t.triggerRule || 'MANUAL_OR_DEFAULT'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.tipText) {
      toast.error('Title and tip text are required');
      return;
    }

    try {
      setActionLoading(true);
      if (editingTemplate) {
        const res = await adminService.updateTipTemplate(editingTemplate._id, form);
        if (res.success) {
          toast.success('Tip template updated successfully');
          setModalOpen(false);
          fetchTemplates();
        }
      } else {
        const res = await adminService.createTipTemplate(form);
        if (res.success) {
          toast.success('Tip template created successfully');
          setModalOpen(false);
          fetchTemplates();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save tip template');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tip template?')) return;
    try {
      const res = await adminService.deleteTipTemplate(id);
      if (res.success) {
        toast.success('Tip template removed');
        fetchTemplates();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete template');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Financial Tip Templates
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
            System-wide automated advice templates served to students based on spending patterns
          </p>
        </div>

        <Button variant="gold" icon={Plus} onClick={handleOpenCreate}>
          Create Tip Template
        </Button>
      </div>

      {loading ? (
        <SkeletonCard height="280px" />
      ) : templates.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <Lightbulb size={40} className="mx-auto text-emerald-400 mb-3" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Templates Found</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Create advice templates to help students optimize their spending.
          </p>
          <Button variant="gold" onClick={handleOpenCreate}>Create First Template</Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {templates.map((t) => (
            <Card key={t._id} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#00E699',
                      background: 'rgba(16, 185, 129, 0.15)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px'
                    }}
                  >
                    {t.categoryName}
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleOpenEdit(t)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}
                      title="Edit template"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                      title="Delete template"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                  {t.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {t.tipText}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Trigger Rule: <code style={{ color: '#06B6D4' }}>{t.triggerRule}</code>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTemplate ? 'Edit Tip Template' : 'Create Financial Tip Template'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="input-label">Template Title</label>
            <input
              className="luxury-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Campus Dining Dollars Savings"
              required
            />
          </div>

          <div>
            <label className="input-label">Target Category</label>
            <input
              className="luxury-input"
              value={form.categoryName}
              onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
              placeholder="e.g. Food, Transport, Subscriptions"
            />
          </div>

          <div>
            <label className="input-label">Tip Content (Advice for Students)</label>
            <textarea
              className="luxury-textarea"
              rows={4}
              value={form.tipText}
              onChange={(e) => setForm({ ...form, tipText: e.target.value })}
              placeholder="Provide actionable student guidance..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={actionLoading}>
              {editingTemplate ? 'Save Changes' : 'Create Template'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTips;
