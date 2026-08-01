import { businessConfig } from '../config/businessConfig';

/**
 * Formats a numeric value into currency format (e.g. ₹450)
 * Returns empty string "" if amount is 0, empty, null, or undefined.
 * @param {number|string} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || amount === '' || isNaN(Number(amount))) {
    return '';
  }
  const num = Number(amount);
  if (num === 0) {
    return '';
  }
  return `${businessConfig.currencySymbol}${num.toLocaleString('en-IN')}`;
};
