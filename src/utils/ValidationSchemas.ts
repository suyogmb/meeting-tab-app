import * as yup from 'yup';
import i18n from '../language/i18n';

/**
 * Validation utility functions for the Kiosk app
 * Generic helper functions for validating data against Yup schemas
 */

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
    return {isValid: false, errors: {general: i18n.t('validation.failed')}};
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
    return {isValid: false, error: i18n.t('validation.failed')};
  }
};
