import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Pin,
  X,
  RefreshCw,
  Tag,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import tipService from '../services/tipService';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { SkeletonCard, SkeletonItem } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const Tips = () => {
  const toast = useToast();

  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const res = await tipService.getTips();
      if (res.success && res.data) {
        setTips(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load saving tips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const handlePin = async (id) => {
    try {
      const res = await tipService.pinTip(id);
      if (res.success) {
        toast.success(res.data?.isPinned ? 'Tip pinned to top' : 'Tip unpinned');
        fetchTips();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle pin');
    }
  };

  const handleDismiss = async (id) => {
    try {
      const res = await tipService.dismissTip(id);
      if (res.success) {
        toast.info('Tip dismissed');
        setTips((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to dismiss tip');
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const res = await tipService.generateTips();
      if (res.success && res.data) {
        setTips(res.data);
        toast.success('Fresh spending tips generated!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate tips');
    } finally {
      setGenerating(false);
    }
  };

  const pinnedTips = tips.filter((t) => t.isPinned);
  const regularTips = tips.filter((t) => !t.isPinned);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. Header with Generate Fresh Tips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Saving Tips
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginTop: '0.25rem', marginBottom: 0 }}>
            Actionable student budgeting recommendations triggered by your transaction habits
          </p>
        </div>

        <Button
          variant="gold"
          icon={RefreshCw}
          loading={generating}
          onClick={handleGenerate}
        >
          Regenerate Advice
        </Button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <SkeletonCard height="160px" />
          <SkeletonCard height="160px" />
          <SkeletonCard height="160px" />
        </div>
      ) : tips.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No Active Saving Tips"
          description="You have dismissed all tips or haven't logged recent expenses. Generate fresh tips to uncover new ways to save."
          actionText="Generate Tips"
          onAction={handleGenerate}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* 2. Pinned Tips Section */}
          {pinnedTips.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Pin size={16} style={{ color: '#D6B36A' }} />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Pinned Priority Advice ({pinnedTips.length})
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                <AnimatePresence>
                  {pinnedTips.map((tip) => (
                    <motion.div
                      key={tip._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                    >
                      <Card
                        elevated
                        goldBorder
                        style={{
                          padding: '1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                          height: '100%',
                          boxSizing: 'border-box'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#D6B36A',
                              background: 'rgba(214,179,106,0.12)',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '6px',
                              border: '1px solid rgba(214,179,106,0.3)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em'
                            }}
                          >
                            <Tag size={12} />
                            {tip.category?.name || 'General Habit'}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <button
                              onClick={() => handlePin(tip._id)}
                              title="Unpin Tip"
                              className="icon-action-btn"
                              style={{ color: 'var(--warning)' }}
                            >
                              <Pin size={15} />
                            </button>
                            <button
                              onClick={() => handleDismiss(tip._id)}
                              title="Dismiss Tip"
                              className="icon-action-btn delete"
                              style={{ color: 'var(--text-dim)' }}
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, flex: 1 }}>
                          {tip.tipText}
                        </p>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                          <span>Trigger: {tip.ruleTriggered?.replace(/_/g, ' ')}</span>
                          <span style={{ color: 'var(--warning)', fontWeight: 600 }}>&bull; Pinned</span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* 3. Regular Active Tips */}
          {regularTips.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Active Suggestions ({regularTips.length})
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                <AnimatePresence>
                  {regularTips.map((tip) => (
                    <motion.div
                      key={tip._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                    >
                      <Card
                        elevated
                        hoverable
                        style={{
                          padding: '1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                          height: '100%',
                          boxSizing: 'border-box'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#94A3B8',
                              background: 'rgba(255,255,255,0.04)',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '6px',
                              border: '1px solid rgba(255,255,255,0.08)'
                            }}
                          >
                            <Tag size={12} />
                            {tip.category?.name || 'General'}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <button
                              onClick={() => handlePin(tip._id)}
                              title="Pin to Top"
                              className="icon-action-btn"
                              style={{ color: 'var(--text-dim)' }}
                            >
                              <Pin size={15} />
                            </button>
                            <button
                              onClick={() => handleDismiss(tip._id)}
                              title="Dismiss"
                              className="icon-action-btn delete"
                              style={{ color: 'var(--text-dim)' }}
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, flex: 1 }}>
                          {tip.tipText}
                        </p>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                          Rule: {tip.ruleTriggered?.replace(/_/g, ' ')}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tips;
