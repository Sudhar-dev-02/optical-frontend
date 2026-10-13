/**
 * Utility functions for continuous serial bill numbers:
 * 001, 002, 003 ... 010, 011 ... 099, 100 ... 999, 1000, 1001 ... 2000
 */

/**
 * Format any bill number into a continuous serial string with at least 3 digits.
 * Examples:
 * 1 -> "001"
 * 2 -> "002"
 * 10 -> "010"
 * 99 -> "099"
 * 100 -> "100"
 * 999 -> "999"
 * 1000 -> "1000"
 * 2000 -> "2000"
 */
export const formatBillNo = (val) => {
  if (val === null || val === undefined || val === '') return '';
  const cleaned = String(val).trim();
  const digitsOnly = cleaned.replace(/\D/g, '');
  if (!digitsOnly) return cleaned;
  const num = parseInt(digitsOnly, 10);
  if (isNaN(num)) return cleaned;
  return String(num).padStart(3, '0');
};

/**
 * Extract integer value from bill number for calculations, comparisons, and sorting.
 */
export const parseBillNo = (val) => {
  if (val === null || val === undefined || val === '') return 0;
  const digitsOnly = String(val).replace(/\D/g, '');
  const num = parseInt(digitsOnly, 10);
  return isNaN(num) ? 0 : num;
};

/**
 * Calculate the next continuous sequential bill number starting from '001'.
 * Finds highest bill number in list and increments by 1.
 * If empty list or no bills, starts at '001'.
 */
export const getNextSequentialBillNo = (billList = []) => {
  if (!billList || !Array.isArray(billList) || billList.length === 0) return '001';
  const maxNo = billList.reduce((max, b) => {
    const num = parseBillNo(b?.billNo);
    return num > max ? num : max;
  }, 0);
  const nextNum = maxNo + 1;
  return String(nextNum).padStart(3, '0');
};
