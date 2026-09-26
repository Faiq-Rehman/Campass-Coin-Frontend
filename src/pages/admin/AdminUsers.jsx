import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  GraduationCap,
  KeyRound
} from 'lucide-react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

const AdminUsers = () => {
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, totalCount: 0 });

  // Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Password Reset Modal
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const fetchUsers = async (page = pagination.page) => {
    try {
      setLoading(true);
      const params = { page, limit: pagination.limit };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await adminService.getUsers(params);
      if (res.success && res.data) {
        setUsers(res.data.users || []);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch student directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(1), 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Toggle status
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    try {
      const res = await adminService.toggleUserStatus(user._id, newStatus);
      if (res.success) {
        toast.success(`Student status updated to ${newStatus}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update user status');
    }
  };

  // View details
  const handleViewDetails = async (userId) => {
    try {
      setDetailLoading(true);
      setDetailModalOpen(true);
      const res = await adminService.getUserById(userId);
      if (res.success && res.data) {
        setSelectedUserDetail(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch student profile');
      setDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  // Delete user
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await adminService.deleteUser(userToDelete._id);
      if (res.success) {
        toast.success('Student and all related records deleted');
        setDeleteModalOpen(false);
        setUserToDelete(null);
        fetchUsers(pagination.page);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete student');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Reset Student Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setResetLoading(true);
      const res = await adminService.resetStudentPassword(userToResetPassword._id, newPassword);
      if (res.success) {
        toast.success(`Password reset for ${userToResetPassword.fullName}`);
        setPasswordModalOpen(false);
        setUserToResetPassword(null);
        setNewPassword('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to reset student password');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
          Student Directory
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '0.25rem', marginBottom: 0 }}>
          Inspect registered campus students, oversee account permissions, and manage access
        </p>
      </div>

      {/* 2. Search & Filter Bar */}
      <Card elevated style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: '1 1 260px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search by student name or email..."
              className="luxury-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <div style={{ minWidth: '150px' }}>
            <select
              className="luxury-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="disabled">Disabled Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 3. Table */}
      {loading ? (
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
            <SkeletonCard height="45px" />
            <SkeletonCard height="45px" />
            <SkeletonCard height="45px" />
          </div>
        </Card>
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Students Found"
          description="No student profiles match your search criteria or registration filter."
        />
      ) : (
        <div className="luxury-table-container">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Academic Year</th>
                <th>Monthly Allowance</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ textAlign: 'center', width: '130px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  {/* Name & Email */}
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.fullName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{u.email}</div>
                  </td>

                  {/* Academic Year */}
                  <td style={{ color: 'var(--text-secondary)' }}>{u.academicYear || '1st Year'}</td>

                  {/* Allowance */}
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {formatCurrency(u.monthlyAllowance || 0)}
                  </td>

                  {/* Status */}
                  <td>
                    <Badge variant={u.status === 'active' ? 'success' : 'danger'}>
                      {u.status === 'active' ? 'Active' : 'Disabled'}
                    </Badge>
                  </td>

                  {/* Joined Date */}
                  <td style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                    {formatDate(u.createdAt)}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        onClick={() => handleViewDetails(u._id)}
                        title="View Details"
                        className="icon-action-btn"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(u)}
                        title={u.status === 'active' ? 'Deactivate Student' : 'Activate Student'}
                        className="icon-action-btn"
                        style={{ color: u.status === 'active' ? '#FBBF24' : '#34D399' }}
                      >
                        {u.status === 'active' ? <UserX size={15} /> : <UserCheck size={15} />}
                      </button>

                      <button
                        onClick={() => {
                          setUserToResetPassword(u);
                          setPasswordModalOpen(true);
                        }}
                        title="Reset Student Password"
                        className="icon-action-btn"
                        style={{ color: '#06B6D4' }}
                      >
                        <KeyRound size={15} />
                      </button>

                      <button
                        onClick={() => {
                          setUserToDelete(u);
                          setDeleteModalOpen(true);
                        }}
                        title="Delete Account"
                        className="icon-action-btn delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                Page {pagination.page} of {pagination.totalPages} ({pagination.totalCount} total students)
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchUsers(pagination.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchUsers(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Student Details Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Student Profile Overview"
        subtitle="Individual activity statistics and account status"
      >
        {detailLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            <SkeletonCard height="80px" />
          </div>
        ) : selectedUserDetail ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>
                {selectedUserDetail.user?.fullName?.charAt(0) || 'S'}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {selectedUserDetail.user?.fullName}
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                  {selectedUserDetail.user?.email}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Transactions Recorded</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#06B6D4' }}>
                  {selectedUserDetail.stats?.transactionCount || 0}
                </div>
              </div>
              <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Active Budgets</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>
                  {selectedUserDetail.stats?.budgetCount || 0}
                </div>
              </div>
              <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Monthly Allowance</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {formatCurrency(selectedUserDetail.user?.monthlyAllowance || 0)}
                </div>
              </div>
              <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Savings Goal</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {formatCurrency(selectedUserDetail.user?.savingsGoal || 0)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* 5. Delete Account Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Student Account"
        subtitle="Irreversible administrator action"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>"{userToDelete?.fullName}"</strong>? All their logged transactions, monthly budgets, and notifications will be permanently removed.
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

      {/* 6. Password Reset Modal */}
      <Modal
        isOpen={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          setUserToResetPassword(null);
          setNewPassword('');
        }}
        title="Reset Student Password"
        subtitle={`Set a new temporary or permanent password for ${userToResetPassword?.fullName || 'student'}`}
      >
        <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.5rem' }}>
              Student Email
            </label>
            <input
              type="text"
              readOnly
              value={userToResetPassword?.email || ''}
              className="luxury-input"
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.5rem' }}>
              New Password (minimum 6 characters)
            </label>
            <input
              type="password"
              placeholder="Enter new student password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="luxury-input"
              required
              minLength={6}
              autoFocus
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPasswordModalOpen(false);
                setUserToResetPassword(null);
                setNewPassword('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={resetLoading}>
              Save New Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
