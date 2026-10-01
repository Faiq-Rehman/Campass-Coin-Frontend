/**
 * Configurable currency formatter for Campus Coin
 */
const DEFAULT_CURRENCY = 'PKR';
const CURRENCY_SYMBOLS = {
  PKR: '₨',
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹'
};

/**
 * Format an amount with currency symbol
 * @param {number} amount
 * @param {string} [currency='PKR']
 * @returns {string} e.g. "₨ 25,000" or "$ 250"
 */
export const getPreferredCurrency = () => {
  try {
    const saved = localStorage.getItem('campus_coin_currency');
    return CURRENCY_SYMBOLS[saved] ? saved : DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
};

export const formatCurrency = (amount, currency) => {
  const activeCurrency = currency || getPreferredCurrency();
  const numericAmount = Number(amount) || 0;
  const symbol = CURRENCY_SYMBOLS[activeCurrency] || CURRENCY_SYMBOLS.PKR;

  const formattedNumber = numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  return `${symbol} ${formattedNumber}`;
};

/**
 * Format currency without symbol (only formatted digits)
 */
export const formatNumberOnly = (amount) => {
  const numericAmount = Number(amount) || 0;
  return numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

export const getCurrencySymbol = (currency = DEFAULT_CURRENCY) => {
  return CURRENCY_SYMBOLS[currency] || CURRENCY_SYMBOLS.PKR;
};
