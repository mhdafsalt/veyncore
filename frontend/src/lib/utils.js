/**
 * General helper utilities
 */

/**
 * Combines class names conditionally
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats ISO date string to readable format
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return dateString;
  }
}
