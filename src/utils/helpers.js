/**
 * Format a date string for display
 */
export const formatDate = (dateStr, opts = { month: 'short', year: 'numeric' }) => {
  if (!dateStr) return 'N/A';
  try { return new Date(dateStr).toLocaleDateString('en-US', opts); }
  catch { return dateStr; }
};

/**
 * Truncate text to n chars
 */
export const truncate = (str, n = 120) =>
  str && str.length > n ? str.slice(0, n) + '…' : str;

/**
 * Safely parse a JSON field that might already be an object/array
 */
export const parseJSON = (value, fallback = null) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch { return fallback; }
};

/**
 * Build a URL-safe slug from text
 */
export const slugify = (text) =>
  text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

/**
 * Clamp a number between min and max
 */
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
