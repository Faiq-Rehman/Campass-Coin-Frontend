import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  Bell,
  Users,
  Calendar,
  AlertTriangle,
  Sparkles,
  Info
} from 'lucide-react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/date';

const AdminAnnouncements = () => {
  const toast = useToast();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    content: '',
    type: 'announcement',
    targetAudience: 'all'
  });
  const [createLoading, setCreateLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    type: 'announcement',
    targetAudience: 'all'
  });
  const [editLoading, setEditLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAnnouncements();
      if (res.success && res.data) {
        setAnnouncements(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.title.trim() || !createForm.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      setCreateLoading(true);
      const res = await adminService.createAnnouncement(createForm);
      if (res.success) {
        toast.success('Announcement broadcast to all active students!');
        setCreateModalOpen(false);
        setCreateForm({ title: '', content: '', type: 'announcement', targetAudience: 'all' });
        fetchAnnouncements();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to broadcast announcement');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOpenEdit = (item) => {
    setItemToEdit(item);
    setEditForm({
      title: item.title,
      content: item.content,
      type: item.type || 'announcement',
      targetAudience: item.targetAudience || 'all'
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim() || !editForm.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      setEditLoading(true);
      const res = await adminService.updateAnnouncement(itemToEdit._id, editForm);
      if (res.success) {
        toast.success('Announcement updated');
        setEditModalOpen(false);
        fetchAnnouncements();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update announcement');
    } finally {
      setEditLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await adminService.deleteAnnouncement(itemToDelete._id);
      if (res.success) {
        toast.success('Announcement deleted');
        setDeleteModalOpen(false);
        setItemToDelete(null);
        fetchAnnouncements();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete announcement');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Campus Announcements
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '0.25rem', marginBottom: 0 }}>
            Broadcast platform updates, financial literacy tips, and notices directly to students
          </p>
        </div>

        <Button
          variant="gold"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
        >
          Publish Announcement
        </Button>
      </div>

      {/* 2. List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SkeletonCard height="110px" />
          <SkeletonCard height="110px" />
        </div>
      ) : announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No Published Announcements"
          description="Send your first notice or budgeting advice broadcast to keep students informed."
          actionText="Publish First Notice"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {announcements.map((item) => (
            <Card
              key={item._id}
              elevated
              hoverable
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    backgroundColor: item.type === 'warning' ? 'rgba(248,113,113,0.15)' : 'rgba(167,139,250,0.15)',
                    color: item.type === 'warning' ? '#F87171' : '#A78BFA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px'
                  }}
                >
                  <Megaphone size={20} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {item.title}
                    </h3>
                    <Badge variant={item.type === 'warning' ? 'danger' : item.type === 'tip_template' ? 'gold' : 'soft'}>
                      {item.type?.replace(/_/g, ' ')}
                    </Badge>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      Audience: {item.targetAudience}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: '#CBD5E1', lineHeight: 1.6, margin: 0, marginBottom: '0.65rem' }}>
                    {item.content}
                  </p>

                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Published on {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  onClick={() => handleOpenEdit(item)}
                  title="Edit Announcement"
                  className="icon-action-btn"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => {
                    setItemToDelete(item);
                    setDeleteModalOpen(true);
                  }}
                  title="Delete Announcement"
                  className="icon-action-btn delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 3. Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Broadcast Announcement"
        subtitle="This notice will automatically deliver in-app notifications to target students"
      >
        <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="input-label">Title</label>
            <input
              type="text"
              placeholder="e.g. Midterm Financial Aid Workshops Now Open"
              className="luxury-input"
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="input-label">Type</label>
              <select
                className="luxury-select"
                value={createForm.type}
                onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
              >
                <option value="announcement">Announcement</option>
                <option value="tip_template">Budgeting Tip</option>
                <option value="warning">System Advisory / Warning</option>
              </select>
            </div>

            <div>
              <label className="input-label">Target Audience</label>
              <select
                className="luxury-select"
                value={createForm.targetAudience}
                onChange={(e) => setCreateForm({ ...createForm, targetAudience: e.target.value })}
              >
                <option value="all">All Students</option>
                <option value="1st Year">1st Year Only</option>
                <option value="2nd Year">2nd Year Only</option>
                <option value="3rd Year">3rd Year Only</option>
                <option value="4th Year">4th Year Only</option>
                <option value="Graduate">Graduate Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">Message Content</label>
            <textarea
              className="luxury-textarea"
              rows={4}
              placeholder="Write the full message details..."
              value={createForm.content}
              onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={createLoading}>
              Broadcast Now
            </Button>
          </div>
        </form>
      </Modal>

      {/* 4. Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Announcement"
        subtitle="Update announcement details"
      >
        <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="input-label">Title</label>
            <input
              type="text"
              className="luxury-input"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="input-label">Type</label>
              <select
                className="luxury-select"
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
              >
                <option value="announcement">Announcement</option>
                <option value="tip_template">Budgeting Tip</option>
                <option value="warning">System Advisory / Warning</option>
              </select>
            </div>

            <div>
              <label className="input-label">Target Audience</label>
              <select
                className="luxury-select"
                value={editForm.targetAudience}
                onChange={(e) => setEditForm({ ...editForm, targetAudience: e.target.value })}
              >
                <option value="all">All Students</option>
                <option value="1st Year">1st Year Only</option>
                <option value="2nd Year">2nd Year Only</option>
                <option value="3rd Year">3rd Year Only</option>
                <option value="4th Year">4th Year Only</option>
                <option value="Graduate">Graduate Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">Message Content</label>
            <textarea
              className="luxury-textarea"
              rows={4}
              value={editForm.content}
              onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              required
            />
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

      {/* 5. Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Announcement"
        subtitle="Remove this announcement from the platform"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: '#CBD5E1', fontSize: '0.95rem', margin: 0 }}>
            Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>"{itemToDelete?.title}"</strong>?
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

export default AdminAnnouncements;
