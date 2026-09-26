import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Info,
  Check,
  Calendar,
  Receipt
} from 'lucide-react';
import notificationService from '../services/notificationService';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { SkeletonCard, SkeletonItem } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/date';

const Notifications = () => {
  const toast = useToast();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const res = await notificationService.markRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      const res = await notificationService.markAllRead();
      if (res.success) {
        toast.success('All notifications marked as read');
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      toast.error('Failed to mark all notifications read');
    } finally {
      setMarkingAll(false);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'budget_exceeded':
        return <AlertCircle size={20} style={{ color: '#F87171' }} />;
      case 'budget_warning':
        return <AlertTriangle size={20} style={{ color: '#FBBF24' }} />;
      case 'tip':
        return <Sparkles size={20} style={{ color: '#D6B36A' }} />;
      case 'transaction':
        return <Receipt size={20} style={{ color: '#34D399' }} />;
      default:
        return <Info size={20} style={{ color: '#A78BFA' }} />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. Header with Mark All as Read */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Notifications
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginTop: '0.25rem', marginBottom: 0 }}>
            Real-time budget alerts, campus announcements, and transaction updates
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            icon={CheckCheck}
            loading={markingAll}
            onClick={handleMarkAllRead}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* 2. Filter Tabs */}
      <div className="luxury-tabs">
        <button
          className={`luxury-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Inbox ({notifications.length})
        </button>
        <button
          className={`luxury-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* 3. Notification List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SkeletonCard height="90px" />
          <SkeletonCard height="90px" />
          <SkeletonCard height="90px" />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
          description={
            filter === 'unread'
              ? 'You have read all your campus budget and spending notifications.'
              : 'Important threshold warnings and campus announcements will show up here.'
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <AnimatePresence>
            {filteredNotifications.map((notif) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                layout
              >
                <Card
                  elevated
                  hoverable
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    borderLeft: !notif.read ? '4px solid #D6B36A' : '1px solid var(--border)',
                    backgroundColor: !notif.read ? 'var(--bg-secondary)' : 'var(--bg-card)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div
                      style={{
                        padding: '0.6rem',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2px'
                      }}
                    >
                      {getNotifIcon(notif.type)}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#D6B36A',
                              boxShadow: '0 0 8px #D6B36A'
                            }}
                          />
                        )}
                      </div>

                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, marginBottom: '0.5rem' }}>
                        {notif.message}
                      </p>

                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {formatDate(notif.createdAt)}
                      </span>
                    </div>
                  </div>

                  {!notif.read && (
                    <button
                      onClick={() => handleMarkRead(notif._id)}
                      title="Mark as read"
                      className="icon-action-btn"
                      style={{ flexShrink: 0 }}
                    >
                      <Check size={16} />
                    </button>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Notifications;
