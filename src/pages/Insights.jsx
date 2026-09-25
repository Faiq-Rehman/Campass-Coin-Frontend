import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Tag,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import insightService from '../services/insightService';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { SkeletonCard, SkeletonItem } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { formatCurrency } from '../utils/currency';

const Insights = () => {
  const toast = useToast();

  const [currentInsight, setCurrentInsight] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const [currentRes, historyRes] = await Promise.all([
        insightService.getCurrent(),
        insightService.getHistory()
      ]);

      if (currentRes.success && currentRes.data) {
        setCurrentInsight(currentRes.data);
      }
      if (historyRes.success && historyRes.data) {
        setHistory(historyRes.data || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleGenerateFresh = async () => {
    try {
      setGenerating(true);
      const res = await insightService.generate();
      if (res.success && res.data) {
        setCurrentInsight(res.data);
        toast.success('Fresh monthly narrative insight generated!');
        fetchInsights();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to generate new insight');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* 1. Header with Fresh Analysis CTA */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
            Spending Insights
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginTop: '0.25rem', marginBottom: 0 }}>
            Plain-language behavioral analysis and tailored student financial advice
          </p>
        </div>

        <Button
          variant="gold"
          icon={RefreshCw}
          loading={generating}
          onClick={handleGenerateFresh}
        >
          Re-Analyze Spending
        </Button>
      </div>

      {/* 2. Featured Monthly Narrative Insight Card */}
      {loading ? (
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
            <SkeletonItem height="30px" width="40%" />
            <SkeletonItem height="80px" />
            <SkeletonItem height="40px" />
          </div>
        </Card>
      ) : currentInsight ? (
        <Card elevated goldBorder style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'rgba(214, 179, 106, 0.12)',
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #F0D89A 0%, #D6B36A 100%)',
                  color: '#070B14',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(214, 179, 106, 0.25)'
                }}
              >
                <Sparkles size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#D6B36A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Monthly Executive Summary
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  {currentInsight.month} Performance
                </h2>
              </div>
            </div>

            {currentInsight.topCategory && currentInsight.topCategory.name !== 'None' && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#0D1320', padding: '0.4rem 0.85rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Tag size={14} style={{ color: '#D6B36A' }} />
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Top Outflow:</span>
                <strong style={{ color: '#F8FAFC', fontSize: '0.85rem' }}>
                  {currentInsight.topCategory.name} ({formatCurrency(currentInsight.topCategory.amount)})
                </strong>
              </div>
            )}
          </div>

          {/* Narrative Plain-Language Text */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#0D1320',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '1.5rem'
            }}
          >
            <p style={{ fontSize: '1rem', color: '#F8FAFC', lineHeight: 1.7, margin: 0 }}>
              {currentInsight.narrativeText}
            </p>
          </div>

          {/* Key Observations / Highlights */}
          {currentInsight.highlights && currentInsight.highlights.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#D6B36A', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Key Behavioral Observations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {currentInsight.highlights.map((hl, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.04)'
                    }}
                  >
                    <CheckCircle2 size={18} style={{ color: '#34D399', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: 1.5 }}>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Educational Disclaimer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem' }}>
            <ShieldAlert size={15} style={{ color: '#64748B', flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
              {currentInsight.disclaimer}
            </span>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={Lightbulb}
          title="No Monthly Analysis Available"
          description="Log a few student transactions this month so our analysis engine can generate your personalized financial breakdown."
          actionText="Generate Analysis"
          onAction={handleGenerateFresh}
        />
      )}

      {/* 3. Historical Insights Section */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '1rem' }}>
          Historical Analysis Archive
        </h2>

        {history.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {history.map((h) => (
              <Card key={h._id} elevated hoverable style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} style={{ color: '#D6B36A' }} />
                    <span style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '1rem' }}>{h.month}</span>
                  </div>
                  <Badge variant={h.savingsTotal >= 0 ? 'success' : 'danger'}>
                    Net: {formatCurrency(h.savingsTotal)}
                  </Badge>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {h.narrativeText}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748B', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                  <span>Income: {formatCurrency(h.incomeTotal)}</span>
                  <span>Expense: {formatCurrency(h.expenseTotal)}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
            Historical insight summaries will automatically archive here at the close of every month.
          </Card>
        )}
      </div>
    </div>
  );
};

export default Insights;
