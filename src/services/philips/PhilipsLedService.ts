/**
 * Philips LED Service
 * Controls Philips display LED lights via SICP protocol
 */

import {NativeModules, Platform} from 'react-native';
import {logger} from '../../utils/SecureLogger';

const {PhilipsLedModule} = NativeModules;

interface PhilipsLedServiceInterface {
  setLedOff: () => Promise<boolean>;
  setLedRed: () => Promise<boolean>;
  setLedBlue: () => Promise<boolean>;
  setLedYellow: () => Promise<boolean>;
  setDisplayIP: (ip: string) => Promise<boolean>;
}

class PhilipsLedServiceClass {
  /**
   * Check if module is available
   */
  isAvailable(): boolean {
    if (Platform.OS !== 'android') {
      logger.warn('Philips LED control is only available on Android');
      return false;
    }

    if (!PhilipsLedModule) {
      logger.error('PhilipsLedModule is not available');
      return false;
    }

    return true;
  }

  /**
   * Set LED to OFF
   */
  async setLedOff(): Promise<boolean> {
    if (!this.isAvailable()) {
      throw new Error('Philips LED module is not available');
    }

    try {
      await PhilipsLedModule.setLedOff();
      logger.info('LED set to OFF');
      return true;
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      const errorCode = error?.code || 'UNKNOWN';
      logger.error('Failed to set LED OFF', {error: errorMessage, code: errorCode});
      
      if (errorCode === 'LED_CONNECTION_ERROR' || errorMessage.includes('Cannot connect')) {
        throw new Error(
          `Cannot connect to display.\n\nPlease verify:\n• Display is powered on\n• SICP port is enabled in display settings\n• Port is set to 5000\n• Display IP is correct (currently: 127.0.0.1)`
        );
      } else if (errorCode === 'LED_TIMEOUT_ERROR' || errorMessage.includes('timeout')) {
        throw new Error(
          `Connection timeout.\n\nDisplay did not respond. Please check:\n• Display is accessible on the network\n• Firewall is not blocking port 5000`
        );
      } else {
        throw new Error(`Failed to set LED OFF: ${errorMessage}`);
      }
    }
  }

  /**
   * Set LED to RED
   */
  async setLedRed(): Promise<boolean> {
    if (!this.isAvailable()) {
      throw new Error('Philips LED module is not available');
    }

    try {
      await PhilipsLedModule.setLedRed();
      logger.info('LED set to RED');
      return true;
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      const errorCode = error?.code || 'UNKNOWN';
      logger.error('Failed to set LED RED', {error: errorMessage, code: errorCode});
      
      if (errorCode === 'LED_CONNECTION_ERROR' || errorMessage.includes('Cannot connect')) {
        throw new Error(
          `Cannot connect to display.\n\nPlease verify:\n• Display is powered on\n• SICP port is enabled in display settings\n• Port is set to 5000\n• Display IP is correct (currently: 127.0.0.1)`
        );
      } else if (errorCode === 'LED_TIMEOUT_ERROR' || errorMessage.includes('timeout')) {
        throw new Error(
          `Connection timeout.\n\nDisplay did not respond. Please check:\n• Display is accessible on the network\n• Firewall is not blocking port 5000`
        );
      } else {
        throw new Error(`Failed to set LED RED: ${errorMessage}`);
      }
    }
  }

  /**
   * Set LED to BLUE
   */
  async setLedBlue(): Promise<boolean> {
    if (!this.isAvailable()) {
      throw new Error('Philips LED module is not available');
    }

    try {
      await PhilipsLedModule.setLedBlue();
      logger.info('LED set to BLUE');
      return true;
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      const errorCode = error?.code || 'UNKNOWN';
      logger.error('Failed to set LED BLUE', {
        error: errorMessage,
        code: errorCode,
        fullError: error,
      });
      
      // Provide more user-friendly error messages
      if (errorCode === 'LED_CONNECTION_ERROR' || errorMessage.includes('Cannot connect')) {
        throw new Error(
          `Cannot connect to display.\n\nPlease verify:\n• Display is powered on\n• SICP port is enabled in display settings\n• Port is set to 5000\n• Display IP is correct (currently: 127.0.0.1)`
        );
      } else if (errorCode === 'LED_TIMEOUT_ERROR' || errorMessage.includes('timeout')) {
        throw new Error(
          `Connection timeout.\n\nDisplay did not respond. Please check:\n• Display is accessible on the network\n• Firewall is not blocking port 5000`
        );
      } else {
        throw new Error(`Failed to set LED BLUE: ${errorMessage}`);
      }
    }
  }

  /**
   * Set LED to YELLOW
   */
  async setLedYellow(): Promise<boolean> {
    if (!this.isAvailable()) {
      throw new Error('Philips LED module is not available');
    }

    try {
      await PhilipsLedModule.setLedYellow();
      logger.info('LED set to YELLOW');
      return true;
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      const errorCode = error?.code || 'UNKNOWN';
      logger.error('Failed to set LED YELLOW', {error: errorMessage, code: errorCode});
      
      if (errorCode === 'LED_CONNECTION_ERROR' || errorMessage.includes('Cannot connect')) {
        throw new Error(
          `Cannot connect to display.\n\nPlease verify:\n• Display is powered on\n• SICP port is enabled in display settings\n• Port is set to 5000\n• Display IP is correct (currently: 127.0.0.1)`
        );
      } else if (errorCode === 'LED_TIMEOUT_ERROR' || errorMessage.includes('timeout')) {
        throw new Error(
          `Connection timeout.\n\nDisplay did not respond. Please check:\n• Display is accessible on the network\n• Firewall is not blocking port 5000`
        );
      } else {
        throw new Error(`Failed to set LED YELLOW: ${errorMessage}`);
      }
    }
  }

  /**
   * Set display IP address (for future use)
   */
  async setDisplayIP(ip: string): Promise<boolean> {
    if (!this.isAvailable()) {
      throw new Error('Philips LED module is not available');
    }

    try {
      await PhilipsLedModule.setDisplayIP(ip);
      logger.info('Display IP set', {ip});
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to set display IP', {error: errorMessage, ip});
      throw new Error(`Failed to set display IP: ${errorMessage}`);
    }
  }
}

// Export singleton instance
export default new PhilipsLedServiceClass();

