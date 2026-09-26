import React from 'react';
import { formatCurrency } from '../../utils/currency';

const CurrencyText = ({
  amount,
  type = 'neutral', // 'income' | 'expense' | 'neutral'
  showSign = false,
  currency = 'PKR',
  className = ''
}) => {
  const numeric = Number(amount) || 0;
  const isPositive = numeric > 0;
  const isNegative = numeric < 0;

  const getColor = () => {
    if (type === 'income' || (type === 'neutral' && isPositive && showSign)) return '#34D399';
    if (type === 'expense' || (type === 'neutral' && isNegative && showSign)) return '#F87171';
    return '#F8FAFC';
  };

  const getSign = () => {
    if (!showSign) return '';
    if (type === 'income' || isPositive) return '+ ';
    if (type === 'expense' || isNegative) return '- ';
    return '';
  };

  return (
    <span
      style={{
        color: getColor(),
        fontWeight: 600,
        fontFamily: 'var(--font-heading)'
      }}
      className={className}
    >
      {getSign()}
      {formatCurrency(Math.abs(numeric), currency)}
    </span>
  );
};

export default CurrencyText;
