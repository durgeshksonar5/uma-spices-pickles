import { businessConfig } from '../config/businessConfig';

/**
 * Formats a numeric value into currency format (e.g. ₹450)
 * @param {number} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${businessConfig.currencySymbol}0`;
  }
  return `${businessConfig.currencySymbol}${amount.toLocaleString('en-IN')}`;
};
