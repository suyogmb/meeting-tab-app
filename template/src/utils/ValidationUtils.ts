
/**
 * Checks if a string is empty, null, or undefined.
 * @param value The string value to check.
 * @returns True if empty/null/undefined, otherwise false.
 */
export const isEmptyOrNull = (value?: string): boolean => {
  return !value?.trim();
};


/**
 * Validates if an email address is in a valid format.
 * @param email The email string to check.
 * @returns True if the email format is valid, otherwise false.
 */
export const isValidEmail = (email: string): boolean => {
  // Regular expression to match a typical email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};

/**
 * Validates if a password meets a minimum length requirement.
 * @param password The password string to check.
 * @param minLength The minimum length of the password.
 * @returns True if the password meets the length requirement, otherwise false.
 */
export const isValidPassword = (password: string, minLength: number = 6): boolean => {
  return password.length >= minLength;
};
