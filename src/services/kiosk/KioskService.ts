/**
 * Kiosk Service - React Native bridge for kiosk mode operations
 * Handles lock task mode, device owner status, and kiosk exit
 */

import {NativeModules, Platform} from 'react-native';
import {KioskModeState, LockTaskStatus} from '../../types/kiosk';
import {logger} from '../../utils/SecureLogger';

const {KioskModule} = NativeModules;

/**
 * Kiosk Service interface
 */
interface KioskServiceInterface {
  /**
   * Start lock task mode (kiosk mode)
   */
  startLockTask(): Promise<boolean>;

  /**
   * Stop lock task mode (exit kiosk)
   */
  stopLockTask(): Promise<boolean>;

  /**
   * Check if lock task is active
   */
  isLockTaskActive(): Promise<boolean>;

  /**
   * Check if device is device owner
   */
  isDeviceOwner(): Promise<boolean>;

  /**
   * Get kiosk mode state
   */
  getKioskModeState(): Promise<KioskModeState>;

  /**
   * Exit kiosk mode (requires password verification via native)
   */
  exitKioskMode(password: string): Promise<boolean>;
}

/**
 * Kiosk Service implementation
 */
class KioskService implements KioskServiceInterface {
  /**
   * Start lock task mode (kiosk mode)
   */
  async startLockTask(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      logger.warn('Kiosk mode is only available on Android');
      return false;
    }

    try {
      if (!KioskModule) {
        logger.error('KioskModule not available');
        return false;
      }

      const result = await KioskModule.startLockTask();
      logger.info('Lock task started', {result});
      return result;
    } catch (error) {
      logger.error('Failed to start lock task', {error});
      return false;
    }
  }

  /**
   * Stop lock task mode (exit kiosk)
   */
  async stopLockTask(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      if (!KioskModule) {
        logger.error('KioskModule not available');
        return false;
      }

      const result = await KioskModule.stopLockTask();
      logger.info('Lock task stopped', {result});
      return result;
    } catch (error) {
      logger.error('Failed to stop lock task', {error});
      return false;
    }
  }

  /**
   * Check if lock task is active
   */
  async isLockTaskActive(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      if (!KioskModule) {
        return false;
      }
      return await KioskModule.isLockTaskActive();
    } catch (error) {
      logger.error('Failed to check lock task status', {error});
      return false;
    }
  }

  /**
   * Check if device is device owner
   */
  async isDeviceOwner(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      if (!KioskModule) {
        return false;
      }
      return await KioskModule.isDeviceOwner();
    } catch (error) {
      logger.error('Failed to check device owner status', {error});
      return false;
    }
  }

  /**
   * Get kiosk mode state
   */
  async getKioskModeState(): Promise<KioskModeState> {
    if (Platform.OS !== 'android') {
      return {
        isKioskMode: false,
        isLockTaskActive: false,
        isDeviceOwner: false,
        canExitKiosk: true,
      };
    }

    try {
      const [isLockTaskActive, isDeviceOwner] = await Promise.all([
        this.isLockTaskActive(),
        this.isDeviceOwner(),
      ]);

      return {
        isKioskMode: isLockTaskActive,
        isLockTaskActive,
        isDeviceOwner,
        canExitKiosk: !isDeviceOwner, // Can't exit if device owner
      };
    } catch (error) {
      logger.error('Failed to get kiosk mode state', {error});
      return {
        isKioskMode: false,
        isLockTaskActive: false,
        isDeviceOwner: false,
        canExitKiosk: true,
      };
    }
  }

  /**
   * Exit kiosk mode (requires password verification)
   * Note: Password verification happens in native code
   */
  async exitKioskMode(password: string): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      if (!KioskModule) {
        logger.error('KioskModule not available');
        return false;
      }

      const result = await KioskModule.exitKioskMode(password);
      if (result) {
        logger.warn('Kiosk mode exited');
      }
      return result;
    } catch (error) {
      logger.error('Failed to exit kiosk mode', {error});
      return false;
    }
  }
}

// Export singleton instance
export default new KioskService();

