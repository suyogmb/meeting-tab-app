/**
 * Kiosk mode related TypeScript types and interfaces
 */

export interface KioskModeState {
  isKioskMode: boolean;
  isLockTaskActive: boolean;
  isDeviceOwner: boolean;
  canExitKiosk: boolean;
}

/**
 * Device owner configuration
 */
export interface DeviceOwnerConfig {
  isDeviceOwner: boolean;
  componentName: string; // Device admin receiver component name
  setupDate?: number;
}

/**
 * Lock task mode status
 */
export interface LockTaskStatus {
  isLocked: boolean;
  lockedAt?: number;
  lockedBy?: string;
}

/**
 * Kiosk exit options
 */
export interface KioskExitOptions {
  requirePassword: boolean;
  exitCode?: string;
  reason?: string;
}

/**
 * Admin password configuration
 */
export interface AdminPasswordConfig {
  isSet: boolean;
  lastChanged?: number;
  requiresChange?: boolean;
}

