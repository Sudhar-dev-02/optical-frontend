import { clsx } from "clsx";

/**
 * Utility for conditionally joining CSS class names together.
 * @param  {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return clsx(inputs);
}

export default cn;

