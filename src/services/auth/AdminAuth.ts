/**
 * Admin authentication service
 * Handles admin password management and verification
 */

import StorageService from '../../utils/StorageService';
import {hashPassword, verifyPassword} from './PasswordHash';
import {logger} from '../../utils/SecureLogger';
import i18n from '../../language/i18n';

/**
 * Admin authentication service
 */
class AdminAuthService {
  /**
   * Set admin password (first time setup or password change)
   * @param password - New admin password
   * @returns Promise resolving when password is set
   */
  async setAdminPassword(password: string): Promise<void> {
    try {
      if (!password || password.length < 8) {
        throw new Error(i18n.t('auth.error.passwordLength'));
      }

      const hashedPassword = await hashPassword(password);
      await StorageService.storeItem(
        StorageService.storageKeys.adminPasswordHash,
        hashedPassword,
        true, // Store in secure storage
      );

      // Update last changed timestamp
      await StorageService.storeItem(
        'adminPasswordLastChanged',
        Date.now(),
        true,
      );

      logger.info('Admin password set successfully');
    } catch (error) {
      logger.error('Failed to set admin password', {error});
      throw error;
    }
  }

  /**
   * Verify admin password
   * @param password - Password to verify
   * @returns Promise resolving to true if password is correct, false otherwise
   */
  async verifyAdminPassword(password: string): Promise<boolean> {
    try {
      // getItem already ensures storage is initialized, so no need for extra await
      const storedHash = await StorageService.getItem<string>(
        StorageService.storageKeys.adminPasswordHash,
        true,
      );

      if (!storedHash) {
        logger.warn('No admin password found');
        return false;
      }

      // Verify password using bcrypt (hash format includes salt rounds, so works with any rounds)
      const isValid = await verifyPassword(password, storedHash);
      if (isValid) {
        logger.info('Admin password verified successfully');
      }
      return isValid;
    } catch (error) {
      logger.error('Password verification failed', {error});
      return false;
    }
  }

  /**
   * Check if admin password is set
   * @returns Promise resolving to true if password is set
   */
  async isAdminPasswordSet(): Promise<boolean> {
    try {
      const storedHash = await StorageService.getItem<string>(
        StorageService.storageKeys.adminPasswordHash,
        true,
      );
      return !!storedHash;
    } catch (error) {
      logger.error('Failed to check admin password status', {error});
      return false;
    }
  }

  /**
   * Change admin password (requires current password)
   * @param currentPassword - Current admin password
   * @param newPassword - New admin password
   * @returns Promise resolving when password is changed
   */
  async changeAdminPassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      // Verify current password
      const isValid = await this.verifyAdminPassword(currentPassword);
      if (!isValid) {
        throw new Error(i18n.t('auth.error.currentPasswordIncorrect'));
      }

      // Set new password
      await this.setAdminPassword(newPassword);
      logger.info('Admin password changed successfully');
    } catch (error) {
      logger.error('Failed to change admin password', {error});
      throw error;
    }
  }

  /**
   * Clear admin password (for testing/reset)
   * WARNING: This should only be used in development or emergency situations
   */
  async clearAdminPassword(): Promise<void> {
    try {
      await StorageService.removeItem(
        StorageService.storageKeys.adminPasswordHash,
        true,
      );
      await StorageService.removeItem('adminPasswordLastChanged', true);
      logger.warn('Admin password cleared');
    } catch (error) {
      logger.error('Failed to clear admin password', {error});
      throw error;
    }
  }
}

// Export singleton instance
export default new AdminAuthService();

