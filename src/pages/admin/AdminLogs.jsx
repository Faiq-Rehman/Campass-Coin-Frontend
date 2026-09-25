import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  Shield,
  Search,
  Filter,
  RefreshCw,
  User,
  AlertCircle
} from 'lucide-react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/date';

const AdminLogs = () => {
  const toast = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getLogs();
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch administrator audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.action?.toLowerCase().includes(q) ||
      log.target?.toLowerCase().includes(q) ||
      log.adminUsername?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Admin Activity Audit Logs
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
            Permanent, tamper-proof MongoDB audit trail for administrative operations & password resets
          </p>
        </div>

        <Button variant="outline" icon={RefreshCw} onClick={fetchLogs} loading={loading}>
          Refresh Logs
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <Card style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="luxury-input"
              style={{ paddingLeft: '2.4rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logs by action, target student, or administrator..."
            />
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '1.5rem' }}>
            <SkeletonCard height="240px" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Activity Logs Recorded"
            description="Administrative actions such as account overrides or category updates will appear here."
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Action</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Target</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Admin</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Details</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log._id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#00E699',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {log.target || 'System'}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)' }}>
                      {log.adminUsername}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-dim)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details || '')}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminLogs;
