/**
 * Checks if it contains 0-9 or a-z only (lowercase only)
 * @param {string} str  string to be checked
 */
export const isLowerCase = str => /^[a-z0-9]+$/.test(str);

/**
 * Checks if it contains alphanumeric only
 * @param {string} str  string to be checked
 */
export const isAlphaNumeric = str => /^[\w]+$/.test(str);

/**
 * Checks if it contains alphanumeric and string only
 * @param {string} str  string to be checked
 */
export const isAlphaNumericSpace = str => /^[\w\s]+$/.test(str);
