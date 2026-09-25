import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Sparkles,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  Pin,
  ArrowRight,
  TrendingDown,
  DollarSign,
  HelpCircle
} from 'lucide-react';
import insightService from '../services/insightService';
import dashboardService from '../services/dashboardService';
import tipService from '../services/tipService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { SkeletonCard, SkeletonItem } from '../components/common/LoadingSkeleton';
import { formatCurrency } from '../utils/currency';

const QUICK_PROMPTS = [
  'Can I afford dining out tonight?',
  'Where am I overspending this month?',
  'How can I reach my monthly savings target?',
  'Analyze my spending spikes'
];

const AIAssistant = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [insight, setInsight] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // Chat conversation state
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${user?.fullName?.split(' ')[0] || 'Student'}! I am your CampusCoin AI Assistant. I analyze your real-time expenses, alert you to spending spikes, and guide your savings goals. How can I assist you with your finances today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [insightRes, dashRes, tipsRes] = await Promise.all([
        insightService.getCurrent(),
        dashboardService.getDashboardData(),
        tipService.getTips()
      ]);

      if (insightRes.success) setInsight(insightRes.data);
      if (dashRes.success) setDashboardData(dashRes.data);
      if (tipsRes.success) setTips(tipsRes.data || []);
    } catch (err) {
      toast.error('Unable to fetch live financial records for AI analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReanalyze = async () => {
    try {
      setAnalyzing(true);
      const res = await insightService.generate();
      if (res.success && res.data) {
        setInsight(res.data);
        toast.success('Fresh spending spike analysis generated!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to re-analyze spending');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSendMessage = (queryText) => {
    const query = queryText || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      generateAIResponse(query);
      setIsTyping(false);
    }, 700);
  };

  const generateAIResponse = (query) => {
    const q = query.toLowerCase();
    const balance = dashboardData?.summary?.currentBalance || 0;
    const expenseThisMonth = dashboardData?.summary?.expenseThisMonth || 0;
    const incomeThisMonth = dashboardData?.summary?.incomeThisMonth || 0;
    const topCat = dashboardData?.topSpendingCategory;
    const allowance = dashboardData?.summary?.monthlyAllowance || user?.monthlyAllowance || 0;
    const savingsGoal = dashboardData?.summary?.savingsGoal || user?.savingsGoal || 0;
    const netSavings = incomeThisMonth - expenseThisMonth;

    let responseText = '';

    if (q.includes('afford') || q.includes('dinner') || q.includes('out') || q.includes('cafe')) {
      if (balance > 100) {
        responseText = `Yes! Your current available balance is ${formatCurrency(balance)}. An average student meal or dinner out ($15-$30) is well within your budget. Just keep an eye on your remaining monthly limits!`;
      } else if (balance > 25) {
        responseText = `You can afford a modest meal ($10-$20) with your current balance of ${formatCurrency(balance)}, but your funds are running low for the term. Consider cooking or campus meal passes.`;
      } else {
        responseText = `Caution: Your balance is currently ${formatCurrency(balance)}. I recommend avoiding dining out today to avoid overspending your baseline allowance!`;
      }
    } else if (q.includes('overspending') || q.includes('highest') || q.includes('spike')) {
      if (topCat) {
        responseText = `Based on your live MongoDB records, ${topCat.name} is your largest expense center this month, accounting for ${formatCurrency(topCat.amount)} (${topCat.percentage}% of all expenses). We detected a spending spike here — try reducing takeaway orders or subscription tiers!`;
      } else {
        responseText = `Great news! You haven't recorded significant expenses yet this month, so no severe overspending spikes were detected.`;
      }
    } else if (q.includes('saving') || q.includes('target') || q.includes('goal')) {
      if (savingsGoal > 0) {
        const pct = Math.min(100, Math.round((Math.max(0, netSavings) / savingsGoal) * 100));
        responseText = `Your monthly savings target is ${formatCurrency(savingsGoal)}. Currently, your net savings are ${formatCurrency(Math.max(0, netSavings))} (${pct}% progress). To hit 100%, consider capping non-academic discretionary expenses.`;
      } else {
        responseText = `You haven't set a monthly savings goal yet! Head to your Profile page to set an allowance target and monthly savings ambition.`;
      }
    } else {
      responseText = `Here is your live financial snapshot: You have earned ${formatCurrency(incomeThisMonth)} and spent ${formatCurrency(expenseThisMonth)} this month, leaving a current balance of ${formatCurrency(balance)}. ${topCat ? `${topCat.name} remains your top spending category.` : ''} Feel free to ask about specific budgets, dining affordability, or savings advice!`;
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleTogglePinTip = async (tipId) => {
    try {
      await tipService.pinTip(tipId);
      toast.success('Tip bookmark updated');
      loadData();
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#00E699',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginBottom: '0.5rem'
            }}
          >
            <Sparkles size={13} /> Live Behavioral Intelligence
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            AI Financial Assistant
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', margin: '0.25rem 0 0 0' }}>
            Advisory financial analysis and plain-language insights tailored to student lifestyle
          </p>
        </div>

        <Button variant="gold" icon={RefreshCw} loading={analyzing} onClick={handleReanalyze}>
          Re-Analyze Spending
        </Button>
      </div>

      {/* Main Grid: Narrative Spike Analysis & AI Chat */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Spending Spikes Narrative Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Card style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'rgba(0, 230, 153, 0.08)',
                filter: 'blur(30px)',
                pointerEvents: 'none'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Bot size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Monthly Spending Narrative
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#00E699', fontWeight: 600 }}>
                  Automated Behavioral Audit
                </span>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <SkeletonItem height="25px" width="60%" />
                <SkeletonItem height="60px" />
                <SkeletonItem height="40px" />
              </div>
            ) : insight ? (
              <div>
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    border: '1px solid var(--border)',
                    marginBottom: '1.25rem'
                  }}
                >
                  <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-primary)', margin: 0 }}>
                    {insight.narrativeText}
                  </p>
                </div>

                {insight.highlights && insight.highlights.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                      Key Spending Highlights:
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {insight.highlights.map((h, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                            fontSize: '0.82rem',
                            color: 'var(--text-dim)'
                          }}
                        >
                          <CheckCircle2 size={15} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '1.25rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Disclaimer: {insight.disclaimer}
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                No narrative analysis generated yet. Click "Re-Analyze Spending" above to process your transactions.
              </p>
            )}
          </Card>

          {/* Bookmarked Actionable Saving Tips */}
          <Card style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lightbulb size={18} style={{ color: '#00E699' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Actionable Saving Advice
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tips.length} Tips Available</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tips.slice(0, 3).map((tip) => (
                <div
                  key={tip._id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: tip.isPinned ? '1px solid #10B981' : '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00E699', textTransform: 'uppercase' }}>
                      {tip.isPinned ? 'Bookmarked Tip' : 'Smart Suggestion'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTogglePinTip(tip._id)}
                      title={tip.isPinned ? 'Unbookmark' : 'Bookmark to Dashboard'}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: tip.isPinned ? '#10B981' : 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                    >
                      <Bookmark size={16} fill={tip.isPinned ? '#10B981' : 'none'} />
                    </button>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                    {tip.tipText}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Interactive AI Advisory Chat */}
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '620px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                CampusCoin Live Chat
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Connected to MongoDB</span>
          </div>

          {/* Messages scroll box */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {messages.map((m, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '0.75rem 1rem',
                    borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: m.sender === 'user'
                      ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                      : 'var(--bg-secondary)',
                    color: m.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                    border: m.sender === 'user' ? 'none' : '1px solid var(--border)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.45, margin: 0 }}>
                    {m.text}
                  </p>
                  <span style={{ display: 'block', fontSize: '0.65rem', marginTop: '0.35rem', textAlign: 'right', opacity: 0.7 }}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '0.6rem 0.9rem', borderRadius: '12px', background: 'var(--bg-secondary)', color: 'var(--text-dim)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={14} className="animate-spin text-[#00E699]" /> Analyzing transaction database...
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.75rem', paddingTop: '0.25rem' }}>
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '0.72rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '9999px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about your spending or budget..."
              className="luxury-input"
              style={{ fontSize: '0.88rem' }}
            />
            <Button type="submit" variant="gold" icon={Send} style={{ flexShrink: 0 }}>
              Ask
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;
