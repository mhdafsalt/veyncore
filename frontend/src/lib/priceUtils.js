/**
 * Centralized Price Parsing and Formatting Utilities for VEYNCORE
 * Prevents regex/dot bugs where 'Rs.' period was treated as a decimal separator.
 */

/**
 * Safely parse any price value into a clean number.
 * Handles numbers (1199), string numbers ("1199"), formatted currency ("Rs. 1,199.00", "₹1,599", "1,499.00 INR").
 *
 * @param {any} val - Raw price input
 * @param {number} fallback - Fallback number if invalid (defaults to 0)
 * @returns {number}
 */
export function parseNumericPrice(val, fallback = 0) {
  if (typeof val === 'number') {
    return isNaN(val) ? fallback : val;
  }
  if (!val) return fallback;

  const str = String(val);
  // Specifically remove 'Rs.' or 'Rs' or 'INR' before matching numbers so the dot in 'Rs.' is never parsed as a decimal!
  const stripped = str
    .replace(/Rs\./gi, '')
    .replace(/Rs/gi, '')
    .replace(/INR/gi, '')
    .replace(/[₹$,]/g, '')
    .trim();

  const match = stripped.match(/(\d+(?:\.\d+)?)/);
  if (match) {
    const parsed = parseFloat(match[1]);
    return isNaN(parsed) ? fallback : parsed;
  }

  return fallback;
}

/**
 * Format any numeric or raw price to Indian Rupee format (e.g. ₹1,199)
 *
 * @param {any} amount
 * @returns {string}
 */
export function formatINR(amount) {
  const num = parseNumericPrice(amount, 0);
  return `₹${Math.round(num).toLocaleString('en-IN')}`;
}
