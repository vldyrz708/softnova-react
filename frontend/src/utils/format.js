/**
 * Shared formatting utilities.
 */

/**
 * Format a number as Mexican Peso currency string.
 * @param {number|null|undefined} n
 * @returns {string}
 */
export const formatCurrency = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n ?? 0)

/**
 * Format a Date-like value to YYYY-MM-DD, or null.
 * @param {Date|string|null|undefined} d
 * @returns {string|null}
 */
export const formatDate = (d) => {
  if (!d) return null
  return new Date(d).toISOString().split('T')[0]
}
