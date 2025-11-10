/**
 * Password hashing utilities using bcryptjs
 * Provides secure password hashing for admin passwords
 */

import bcrypt from 'bcryptjs';
import {logger} from '../../utils/SecureLogger';

/**
 * Salt rounds for bcrypt hashing
 * Higher values = more secure but slower
 * For mobile apps, 10 rounds is a good balance between security and performance
 * (10 rounds = ~100ms verification time on modern devices)
 */
const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Promise resolving to hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    logger.info('Password hashed successfully');
    return hashedPassword;
  } catch (error) {
    logger.error('Password hashing failed', {error});
    throw new Error('Failed to hash password');
  }
}

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param hash - Hashed password to compare against
 * @returns Promise resolving to true if password matches, false otherwise
 * 
 * Note: bcrypt.compare is CPU-intensive but non-blocking in React Native.
 * The hash format includes salt rounds, so verification works with any rounds used during hashing.
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    // Use async bcrypt.compare which runs on a background thread
    // This prevents blocking the UI thread during password verification
    const isValid = await bcrypt.compare(password, hash);
    if (!isValid) {
      logger.warn('Password verification failed');
    }
    return isValid;
  } catch (error) {
    logger.error('Password verification error', {error});
    return false;
  }
}

/**
 * Check if a string is a valid bcrypt hash
 * @param hash - String to check
 * @returns True if string appears to be a bcrypt hash
 */
export function isValidHash(hash: string): boolean {
  // Bcrypt hashes start with $2a$, $2b$, or $2y$ and are 60 characters long
  return /^\$2[ayb]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(hash);
}

