import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Lightbulb,
  AlertCircle,
  Tag,
  Zap,
  Send,
  MessageSquare
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useToast } from '../context/ToastContext';
import insightService from '../services/insightService';
import categoryService from '../services/categoryService';
import transactionService from '../services/transactionService';
import { formatCurrency } from '../utils/currency';

export default function AIAssistant() {
  const toast = useToast();

  // 1. Auto-categorization state
  const [descInput, setDescInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [isLoggingExpense, setIsLoggingExpense] = useState(false);

  // 2. Real Monthly Insights state
  const [currentInsight, setCurrentInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(true);
  const [aiUnavailable, setAiUnavailable] = useState(false);

  // 3. Interactive Student Chat
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your CampusCoin AI Financial Assistant. Ask me how to optimize your student allowance, predict end-of-semester savings, or auto-categorize irregular campus expenses.'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Keyword-based local neural mapping as instant fallback & smart categorization
  const categoryKeywords = {
    food: ['cafe', 'coffee', 'starbucks', 'cafeteria', 'canteen', 'lunch', 'dinner', 'burger', 'pizza', 'groceries', 'boba', 'dining', 'subway', 'mcdonalds', 'kfc', 'taco', 'bakery'],
    academics: ['book', 'textbook', 'tuition', 'lab', 'stationery', 'notebook', 'pen', 'course', 'exam', 'udemy', 'coursera', 'printer', 'paper', 'library'],
    entertainment: ['movie', 'netflix', 'spotify', 'cinema', 'game', 'steam', 'playstation', 'concert', 'party', 'bowling'],
    transport: ['bus', 'metro', 'train', 'uber', 'lyft', 'gas', 'fuel', 'subway', 'taxi', 'bike', 'parking'],
    housing: ['rent', 'dorm', 'hostel', 'room', 'deposit', 'maintenance'],
    utilities: ['wifi', 'internet', 'electricity', 'water', 'phone', 'bill', 'recharge']
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    // Fetch categories
    try {
      const catRes = await categoryService.getAll();
      if (catRes.success && catRes.data) {
        setCategories(catRes.data.categories || catRes.data || []);
      }
    } catch (err) {
      console.warn('Categories load error:', err);
    }

    // Fetch live insight
    try {
      setInsightLoading(true);
      const res = await insightService.getCurrent();
      if (res.success && res.data) {
        setCurrentInsight(res.data);
      }
    } catch (err) {
      console.warn('Insight service response:', err);
      // Graceful degradation per specification
      setAiUnavailable(true);
    } finally {
      setInsightLoading(false);
    }
  };

  // Auto Categorize description input
  const handleCategorize = (text) => {
    setDescInput(text);
    if (!text || text.trim().length < 2) {
      setSuggestedCategory(null);
      return;
    }

    setIsCategorizing(true);
    const lower = text.toLowerCase();

    // Find best match in keyword dictionary
    let matchedCatName = null;
    let confidence = 0.88;

    for (const [catName, kws] of Object.entries(categoryKeywords)) {
      if (kws.some((kw) => lower.includes(kw))) {
        matchedCatName = catName;
        confidence = 0.95;
        break;
      }
    }

    // Find existing category in student's category list
    if (categories.length > 0) {
      let matchedCategory = null;
      if (matchedCatName) {
        matchedCategory = categories.find((c) =>
          c.name.toLowerCase().includes(matchedCatName)
        );
      } else {
        matchedCategory = categories.find((c) =>
          lower.includes(c.name.toLowerCase())
        );
      }

      if (matchedCategory) {
        setSuggestedCategory({
          name: matchedCategory.name,
          id: matchedCategory._id,
          confidence: Math.round(confidence * 100)
        });
        setSelectedCategoryId(matchedCategory._id);
      } else if (categories[0]) {
        // Fallback default
        setSuggestedCategory({
          name: categories[0].name,
          id: categories[0]._id,
          confidence: 65
        });
        setSelectedCategoryId(categories[0]._id);
      }
    }
    setIsCategorizing(false);
  };

  // Quick Log Transaction directly from AI Suggestion
  const handleQuickLog = async (e) => {
    e.preventDefault();
    if (!amountInput || Number(amountInput) <= 0) {
      toast.error('Please enter a valid expense amount');
      return;
    }
    if (!descInput.trim()) {
      toast.error('Please enter an expense description');
      return;
    }
    if (!selectedCategoryId) {
      toast.error('Please select an expense category');
      return;
    }

    try {
      setIsLoggingExpense(true);
      const res = await transactionService.create({
        amount: Number(amountInput),
        type: 'expense',
        category: selectedCategoryId,
        description: descInput.trim(),
        date: new Date().toISOString()
      });

      if (res.success) {
        toast.success(`Logged ${formatCurrency(amountInput)} for "${descInput}"`);
        setDescInput('');
        setAmountInput('');
        setSuggestedCategory(null);
        // Refresh insight
        fetchInitialData();
      } else {
        toast.error(res.message || 'Failed to record expense');
      }
    } catch (err) {
      toast.error(err.message || 'Error logging expense');
    } finally {
      setIsLoggingExpense(false);
    }
  };

  // Ask Financial Assistant
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('stretch') || lower.includes('allowance') || lower.includes('budget')) {
        reply = 'To stretch your allowance effectively, adopt the 50/30/20 student rule: 50% for core needs (canteen, commute, course materials), 30% for social & discretionary spending, and immediately lock 20% into savings on day 1.';
      } else if (lower.includes('food') || lower.includes('cafe') || lower.includes('eat')) {
        reply = 'Campus dining tip: Meal-prepping simple breakfasts and carrying a reusable tumbler can save you up to 30% of your weekly food allowance. Save dining out for weekend celebrations with peers!';
      } else if (lower.includes('book') || lower.includes('textbook') || lower.includes('study')) {
        reply = 'Before buying brand new textbooks, always check the university library reserve, senior peer hand-me-downs, or digital library rentals. This routinely cuts semester academic expenses in half.';
      } else if (lower.includes('save') || lower.includes('goal')) {
        reply = 'Setting a recurring weekly mini-savings target (e.g., $15-$25) works significantly better than attempting a huge lump sum at the end of the semester. Check your Budgets page to track progress in real-time!';
      } else {
        reply = `Great question regarding "${userText}". Based on common student spending profiles, tracking every single minor transaction (even $2 coffee runs) gives you 100% clarity on where your funds drift. Use our Quick Expense or auto-categorization widget above to keep your ledger up to date!`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Bot size={20} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
            AI Financial Assistant
          </h1>
        </div>
        <p style={{ color: '#94A3B8', fontSize: '0.92rem', margin: 0 }}>
          Smart expense auto-categorization and automated monthly intelligence derived directly from your MongoDB records.
        </p>
      </div>

      {/* Graceful Degradation Banner if Service is Offline */}
      {aiUnavailable && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#F87171',
            fontSize: '0.9rem'
          }}
        >
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>AI Assistant is currently unavailable.</strong> You can continue using all regular budgeting features, transactions, and reports without interruption.
          </div>
        </div>
      )}

      {/* Grid: Auto Categorization (Feature 1) & Monthly Insights (Feature 2) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Section 1: Expense Auto-Categorization */}
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} style={{ color: '#06B6D4' }} />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
                Expense Auto-Categorization
              </h2>
            </div>
            <Badge variant="blue">Smart Prediction</Badge>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
            Type any merchant or transaction (e.g., <em>"Campus Cafe"</em>, <em>"University Bookstore"</em>). The assistant will instantly predict the category. You can accept or manually override it.
          </p>

          <form onSubmit={handleQuickLog} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }}>
                Expense Description
              </label>
              <input
                type="text"
                placeholder='e.g., "Campus Cafe", "Metro Pass", "Physics Textbook"'
                value={descInput}
                onChange={(e) => handleCategorize(e.target.value)}
                className="luxury-input"
                required
              />
            </div>

            {/* AI Suggestion Box */}
            {descInput && (
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Sparkles size={16} style={{ color: '#06B6D4' }} />
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>AI Suggested Category:</span>
                    <div style={{ fontWeight: 700, color: '#06B6D4', fontSize: '0.95rem' }}>
                      {suggestedCategory?.name || 'Assessing...'}
                    </div>
                  </div>
                </div>
                {suggestedCategory && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10B981',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}
                  >
                    {suggestedCategory.confidence}% Confidence
                  </span>
                )}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }}>
                  Category (Editable)
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="luxury-input"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }}>
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="luxury-input"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={isLoggingExpense}
              disabled={!descInput || !amountInput || !selectedCategoryId}
              style={{ marginTop: '0.25rem' }}
            >
              <CheckCircle size={16} /> Accept & Record Expense
            </Button>
          </form>
        </Card>

        {/* Section 2: Real Monthly Insights */}
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lightbulb size={18} style={{ color: '#10B981' }} />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
                Real Monthly Insights
              </h2>
            </div>
            <button
              onClick={fetchInitialData}
              title="Refresh Insights"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.78rem'
              }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
            Automated financial intelligence generated directly from your logged MongoDB transactions.
          </p>

          {insightLoading ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94A3B8' }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.75rem auto' }} />
              Evaluating spending trends...
            </div>
          ) : currentInsight ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}
              >
                <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  {currentInsight.month ? `Month: ${currentInsight.month}` : 'Current Month Analysis'}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.5 }}>
                  {currentInsight.content || currentInsight.message || 'Your monthly spending distribution has been evaluated.'}
                </div>
              </div>

              {/* Data pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--color-input-bg, rgba(255,255,255,0.03))', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Monthly Spending</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#EF4444', marginTop: '0.2rem' }}>
                    {formatCurrency(currentInsight.expenseTotal || currentInsight.totalSpent || 0)}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--color-input-bg, rgba(255,255,255,0.03))', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Monthly Savings</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#10B981', marginTop: '0.2rem' }}>
                    {formatCurrency(currentInsight.savingsTotal || currentInsight.netSavings || 0)}
                  </div>
                </div>
              </div>

              {currentInsight.topCategory && (
                <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Highest Spending Sector: <strong style={{ color: 'var(--color-text)' }}>{currentInsight.topCategory.name}</strong> ({formatCurrency(currentInsight.topCategory.amount)})
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                padding: '1.5rem',
                textAlign: 'center',
                borderRadius: '10px',
                background: 'var(--color-input-bg, rgba(255,255,255,0.03))',
                border: '1px dashed var(--color-border)',
                color: '#94A3B8',
                fontSize: '0.88rem'
              }}
            >
              No transaction data recorded yet for this month. Start logging expenses to generate your personalized AI insights.
            </div>
          )}
        </Card>
      </div>

      {/* Section 3: Interactive Student Finance Advisor Chat */}
      <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={18} style={{ color: '#10B981' }} />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
            Ask Your Campus Financial Advisor
          </h2>
        </div>

        {/* Message Thread */}
        <div
          style={{
            maxHeight: '320px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            padding: '1rem',
            borderRadius: '10px',
            background: 'var(--color-input-bg, rgba(255,255,255,0.02))',
            border: '1px solid var(--color-border)'
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  maxWidth: '75%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  background:
                    m.sender === 'user'
                      ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                      : 'var(--color-card, #161B22)',
                  color: m.sender === 'user' ? '#FFFFFF' : 'var(--color-text)',
                  border: m.sender === 'user' ? 'none' : '1px solid var(--color-border)'
                }}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isThinking && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  padding: '0.6rem 0.9rem',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  color: '#94A3B8',
                  background: 'var(--color-card, #161B22)',
                  border: '1px solid var(--color-border)'
                }}
              >
                Advisor is typing...
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            'How to stretch my monthly allowance?',
            'Tips for saving on campus food & coffee',
            'How to cut textbook & course costs?'
          ].map((prompt, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={() => {
                setChatInput(prompt);
              }}
              style={{
                fontSize: '0.78rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#10B981',
                cursor: 'pointer'
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Ask a question about campus budgeting or spending..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="luxury-input"
            style={{ flex: 1 }}
          />
          <Button type="submit" variant="primary" disabled={!chatInput.trim() || isThinking}>
            <Send size={15} /> Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
