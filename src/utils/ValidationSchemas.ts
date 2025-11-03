import * as yup from 'yup';

/**
 * Comprehensive login validation schema using Yup
 * Covers various scenarios including email validation, password strength, and edge cases
 */
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .required('Email is required')
    .trim()
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
    .test('no-spaces', 'Email should not contain leading or trailing spaces', (value) => {
      if (!value) return true;
      return value === value.trim();
    })
    .test('valid-domain', 'Please enter a valid email domain', (value) => {
      if (!value) return true;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(value);
    })
    .test('no-special-chars', 'Email contains invalid characters', (value) => {
      if (!value) return true;
      // Check for common invalid characters in email
      const invalidChars = /[<>()[\]\\,;:\s"{}]/;
      return !invalidChars.test(value);
    }),

  password: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .required('Password is required')
    .test('no-leading-trailing-spaces', 'Password should not contain leading or trailing spaces', (value) => {
      if (!value) return true;
      return value === value.trim();
    })
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password is too long')
    .test(
      'password-strength',
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      (value) => {
        if (!value) return true;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        return hasUpperCase && hasLowerCase && hasNumbers;
      },
    )
    .test('no-common-passwords', 'Password is too common, please choose a stronger password', (value) => {
      if (!value) return true;
      const commonPasswords = [
        'password',
        '123456',
        '123456789',
        'qwerty',
        'abc123',
        'password123',
        'admin',
        'letmein',
        'welcome',
        'monkey',
        'dragon',
        'master',
        'user',
      ];
      return !commonPasswords.includes(value.toLowerCase());
    })
    .test('no-repeating-chars', 'Password should not contain repeating characters', (value) => {
      if (!value) return true;
      // Check for 3 or more repeating characters
      const repeatingChars = /(.)\1{2,}/;
      return !repeatingChars.test(value);
    })
    .test('no-sequential-chars', 'Password should not contain sequential characters', (value) => {
      if (!value) return true;
      // Check for sequential characters (like 123, abc, etc.)
      const sequentialPatterns = [
        '123',
        '234',
        '345',
        '456',
        '567',
        '678',
        '789',
        'abc',
        'bcd',
        'cde',
        'def',
        'efg',
        'fgh',
        'ghi',
        'qwe',
        'wer',
        'ert',
        'rty',
        'tyu',
        'yui',
        'uio',
      ];
      const lowerValue = value.toLowerCase();
      return !sequentialPatterns.some((pattern) => lowerValue.includes(pattern));
    }),
});

/**
 * Simplified login schema for basic validation
 * Use this when you want less strict validation
 */
export const simpleLoginSchema = yup.object().shape({
  email: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .required('Email is required')
    .email('Please enter a valid email address'),

  password: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

/**
 * Strict login schema with additional security requirements
 * Use this for high-security applications
 */
export const strictLoginSchema = yup.object().shape({
  email: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .required('Email is required')
    .trim()
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
    .test('no-spaces', 'Email should not contain leading or trailing spaces', (value) => {
      if (!value) return true;
      return value === value.trim();
    })
    .test('valid-domain', 'Please enter a valid email domain', (value) => {
      if (!value) return true;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(value);
    }),

  password: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .required('Password is required')
    .test('no-leading-trailing-spaces', 'Password should not contain leading or trailing spaces', (value) => {
      if (!value) return true;
      return value === value.trim();
    })
    .min(12, 'Password must be at least 12 characters long')
    .max(128, 'Password is too long')
    .test(
      'password-strength',
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      (value) => {
        if (!value) return true;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);
        return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
      },
    )
    .test('no-common-passwords', 'Password is too common, please choose a stronger password', (value) => {
      if (!value) return true;
      const commonPasswords = [
        'password',
        '123456',
        '123456789',
        'qwerty',
        'abc123',
        'password123',
        'admin',
        'letmein',
        'welcome',
        'monkey',
        'dragon',
        'master',
        'user',
        'password1',
        '12345678',
        'qwerty123',
        'admin123',
        'letmein123',
      ];
      return !commonPasswords.includes(value.toLowerCase());
    })
    .test('no-repeating-chars', 'Password should not contain repeating characters', (value) => {
      if (!value) return true;
      const repeatingChars = /(.)\1{2,}/;
      return !repeatingChars.test(value);
    })
    .test('no-sequential-chars', 'Password should not contain sequential characters', (value) => {
      if (!value) return true;
      const sequentialPatterns = [
        '123',
        '234',
        '345',
        '456',
        '567',
        '678',
        '789',
        '890',
        'abc',
        'bcd',
        'cde',
        'def',
        'efg',
        'fgh',
        'ghi',
        'hij',
        'qwe',
        'wer',
        'ert',
        'rty',
        'tyu',
        'yui',
        'uio',
        'iop',
      ];
      const lowerValue = value.toLowerCase();
      return !sequentialPatterns.some((pattern) => lowerValue.includes(pattern));
    })
    .test(
      'no-personal-info',
      'Password should not contain personal information like name, email, or common words',
      (value) => {
        if (!value) return true;
        const personalInfo = ['password', 'user', 'admin', 'login', 'email', 'name', 'username'];
        const lowerValue = value.toLowerCase();
        return !personalInfo.some((info) => lowerValue.includes(info));
      },
    ),
});

/**
 * Schema for password reset/forgot password
 */
export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .required('Email is required')
    .trim()
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
});

/**
 * Schema for password change/update
 */
export const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .required('Current password is required'),

  newPassword: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password is too long')
    .test(
      'password-strength',
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      (value) => {
        if (!value) return true;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        return hasUpperCase && hasLowerCase && hasNumbers;
      },
    ),

  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

/**
 * Generic helper function to validate any data against a Yup schema
 * @param data - The data to validate
 * @param schema - The Yup schema to use for validation
 * @returns Promise with validation result
 */
export const validateData = async <T extends Record<string, unknown>>(data: T, schema: yup.ObjectSchema<T>) => {
  try {
    await schema.validate(data, {abortEarly: false});
    return {isValid: true, errors: {}};
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return {isValid: false, errors};
    }
    return {isValid: false, errors: {general: 'Validation failed'}};
  }
};

/**
 * Generic helper function to validate a single field against a Yup schema
 * @param field - The field name to validate
 * @param value - The value to validate
 * @param schema - The Yup schema to use for validation
 * @returns Promise with validation result
 */
export const validateField = async <T extends Record<string, unknown>>(
  field: string,
  value: unknown,
  schema: yup.ObjectSchema<T>,
) => {
  try {
    await schema.validateAt(field, {[field]: value});
    return {isValid: true, error: ''};
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {isValid: false, error: error.message};
    }
    return {isValid: false, error: 'Validation failed'};
  }
};
