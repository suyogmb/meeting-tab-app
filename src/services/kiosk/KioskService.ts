/**
 * Kiosk Service - Wrapper for react-native-kiosk-manager
 * Handles kiosk mode, boot auto-start, and device admin management
 */

import KioskManager from 'react-native-kiosk-manager';
import {Platform} from 'react-native';
import {logger} from '../../utils/SecureLogger';

/**
 * Kiosk Service interface
 */
interface KioskServiceInterface {
  /**
   * Start kiosk mode (lock task mode)
   */
  startKiosk(): void;

  /**
   * Stop kiosk mode
   */
  stopKiosk(): void;

  /**
   * Enable/disable boot auto-start
   */
  enableBootAutoStart(enabled: boolean): void;

  /**
   * Check if boot auto-start is enabled
   */
  isBootAutoStartEnabled(): Promise<boolean>;

  /**
   * Setup lock task package (required before starting kiosk)
   */
  setupLockTaskPackage(): Promise<boolean>;

  /**
   * Request device admin permission
   */
  requestDeviceAdmin(): Promise<boolean>;

  /**
   * Check if app is device owner
   */
  isDeviceOwner(): Promise<boolean>;

  /**
   * Initialize kiosk mode
   * Sets up device admin, lock task package, and starts kiosk mode
   */
  initializeKioskMode(): Promise<boolean>;
}

/**
 * Kiosk Service implementation
 */
class KioskService implements KioskServiceInterface {
  /**
   * Start kiosk mode (lock task mode)
   */
  startKiosk(): void {
    if (Platform.OS !== 'android') {
      logger.warn('Kiosk mode is only available on Android');
      return;
    }

    try {
      KioskManager.startKiosk();
      logger.info('Kiosk mode started');
    } catch (error) {
      logger.error('Failed to start kiosk mode', {error});
    }
  }

  /**
   * Stop kiosk mode
   */
  stopKiosk(): void {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      KioskManager.stopKiosk();
      logger.info('Kiosk mode stopped');
    } catch (error) {
      logger.error('Failed to stop kiosk mode', {error});
    }
  }

  /**
   * Enable/disable boot auto-start
   */
  enableBootAutoStart(enabled: boolean): void {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      KioskManager.enableBootAutoStart(enabled);
      logger.info('Boot auto-start', {enabled});
    } catch (error) {
      logger.error('Failed to set boot auto-start', {error});
    }
  }

  /**
   * Check if boot auto-start is enabled
   */
  async isBootAutoStartEnabled(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      return await KioskManager.isBootAutoStartEnabled();
    } catch (error) {
      logger.error('Failed to check boot auto-start status', {error});
      return false;
    }
  }

  /**
   * Setup lock task package (required before starting kiosk)
   */
  async setupLockTaskPackage(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      const success = await KioskManager.setupLockTaskPackage();
      if (success) {
        logger.info('Lock task package setup successful');
      } else {
        logger.warn('Lock task package setup failed');
      }
      return success;
    } catch (error) {
      logger.error('Failed to setup lock task package', {error});
      return false;
    }
  }

  /**
   * Request device admin permission
   */
  async requestDeviceAdmin(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      const granted = await KioskManager.requestDeviceAdmin();
      if (granted) {
        logger.info('Device admin permission granted');
      } else {
        logger.warn('Device admin permission denied');
      }
      return granted;
    } catch (error) {
      logger.error('Failed to request device admin permission', {error});
      return false;
    }
  }

  /**
   * Check if app is device owner
   */
  async isDeviceOwner(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      return await KioskManager.isDeviceOwner();
    } catch (error) {
      logger.error('Failed to check device owner status', {error});
      return false;
    }
  }

  /**
   * Clear device owner status
   * Note: This may require factory reset in some cases
   */
  async clearDeviceOwner(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      const success = await KioskManager.clearDeviceOwner();
      if (success) {
        logger.info('Device owner cleared');
      } else {
        logger.warn('Failed to clear device owner');
      }
      return success;
    } catch (error) {
      logger.error('Failed to clear device owner', {error});
      return false;
    }
  }

  /**
   * Debug function to check boot auto-start status
   * Useful for troubleshooting boot issues
   */
  async checkBootAutoStartStatus(): Promise<{
    isEnabled: boolean;
    isDeviceOwner: boolean;
    hasDeviceAdmin: boolean;
  }> {
    if (Platform.OS !== 'android') {
      return {
        isEnabled: false,
        isDeviceOwner: false,
        hasDeviceAdmin: false,
      };
    }

    try {
      const [isEnabled, isOwner] = await Promise.all([
        this.isBootAutoStartEnabled(),
        this.isDeviceOwner(),
      ]);

      // Check device admin status by trying to setup lock task
      const hasAdmin = await this.setupLockTaskPackage();

      const status = {
        isEnabled,
        isDeviceOwner: isOwner,
        hasDeviceAdmin: hasAdmin,
      };

      logger.info('Boot auto-start status check', status);
      return status;
    } catch (error) {
      logger.error('Failed to check boot auto-start status', {error});
      return {
        isEnabled: false,
        isDeviceOwner: false,
        hasDeviceAdmin: false,
      };
    }
  }

  /**
   * Initialize kiosk mode
   * Sets up device admin, lock task package, and starts kiosk mode
   */
  async initializeKioskMode(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      logger.warn('Kiosk mode is only available on Android');
      return false;
    }

    try {
      // Check if device owner (best case scenario)
      const isOwner = await this.isDeviceOwner();
      if (isOwner) {
        logger.info('App is device owner, setting up kiosk mode');
        const setupSuccess = await this.setupLockTaskPackage();
        if (setupSuccess) {
          this.startKiosk();
          // Enable boot auto-start and verify
          this.enableBootAutoStart(true);
          const isEnabled = await this.isBootAutoStartEnabled();
          logger.info('Boot auto-start enabled', {isEnabled});
          return true;
        }
        return false;
      }

      // If not device owner, request device admin
      logger.info('App is not device owner, requesting device admin');
      const adminGranted = await this.requestDeviceAdmin();
      if (adminGranted) {
        const setupSuccess = await this.setupLockTaskPackage();
        if (setupSuccess) {
          this.startKiosk();
          // Enable boot auto-start AFTER device admin is granted
          this.enableBootAutoStart(true);
          // Verify boot auto-start is enabled
          const isEnabled = await this.isBootAutoStartEnabled();
          logger.info('Boot auto-start status after setup', {isEnabled});
          if (!isEnabled) {
            logger.warn('Boot auto-start was not enabled, retrying...');
            // Retry after a short delay
            setTimeout(() => {
              this.enableBootAutoStart(true);
              this.isBootAutoStartEnabled().then((enabled) => {
                logger.info('Boot auto-start retry result', {enabled});
              });
            }, 1000);
          }
          return true;
        }
      } else {
        logger.warn('Device admin permission was not granted');
      }

      logger.warn(
        'Kiosk mode initialization incomplete. Device admin or device owner required.',
      );
      return false;
    } catch (error) {
      logger.error('Failed to initialize kiosk mode', {error});
      return false;
    }
  }
}

// Export singleton instance
export default new KioskService();

