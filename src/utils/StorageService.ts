import { Platform } from 'react-native';
import Keychain from 'react-native-keychain';
import { createMMKV, MMKV } from 'react-native-mmkv';
import { v4 as uuidv4 } from 'uuid';
import { isIos } from './Dimensions';
import { logger } from './SecureLogger';

/**
 * StorageManager - A secure storage solution for React Native applications
 *
 * This class provides two types of storage:
 * 1. Regular Storage: For app data, settings, preferences, cache, etc.
 * 2. Secure Storage: For sensitive data like tokens, passwords, personal information
 *
 * Features:
 * - Automatic encryption using MMKV
 * - Keychain integration for iOS secure key storage
 * - Fallback mechanisms for when Keychain is unavailable
 * - Type-safe operations with TypeScript
 * - Comprehensive error handling and logging
 * - Singleton pattern for global access
 *
 * @example
 * // Store sensitive data (tokens, passwords)
 * await StorageService.storeItem('userToken', 'jwt-token-here', true);
 *
 * // Store regular app data
 * await StorageService.storeItem('userPreferences', {theme: 'dark'}, false);
 *
 * // Retrieve data
 * const token = await StorageService.getItem<string>('userToken', true);
 * const prefs = await StorageService.getItem<{theme: string}>('userPreferences', false);
 */
class StorageManager {
  /** MMKV instance for regular app data storage */
  private storage: MMKV | undefined;

  /** MMKV instance for sensitive data storage with enhanced security */
  private secureStorage: MMKV | undefined;

  /** Flag to track if storage has been initialized */
  private isStorageInitialized = false;

  /** Promise to prevent multiple simultaneous initialization attempts */
  private initializingPromise: Promise<void> | null = null;

  /**
   * Predefined storage keys for common use cases
   * These keys are used throughout the app for consistent data access
   */
  public storageKeys = {
    /** Device ID for kiosk identification */
    deviceId: 'deviceId',
    /** Room information (name, ID, etc.) */
    roomInfo: 'roomInfo',
    /** Admin password hash (stored securely) */
    adminPasswordHash: 'adminPasswordHash',
    /** First run setup completed flag */
    isFirstRunComplete: 'isFirstRunComplete',
    /** Last sync timestamp */
    lastSyncTimestamp: 'lastSyncTimestamp',
    /** API endpoint configuration */
    apiBaseUrl: 'apiBaseUrl',
    /** FCM token (stored securely) */
    fcmToken: 'fcmToken',
    /** FCM token updated timestamp */
    fcmTokenUpdatedAt: 'fcmTokenUpdatedAt',
  };

  constructor() {
    // Initialize storage after a short delay to ensure React Native is fully loaded
    setTimeout(() => {
      this.initializeStorage().catch((error) => logger.error('Storage initialization error:', { error }));
    }, 100);
  }

  /**
   * Generate cryptographically secure random bytes
   * Uses the Web Crypto API which is available in React Native
   *
   * @param length - Number of bytes to generate
   * @returns Hexadecimal string representation of random bytes
   */
  private generateSecureRandomBytes(length: number): string {
    let bytes = new Uint8Array(length);
    bytes = crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Simple hash function for fallback key generation
   * This is not cryptographically secure but provides reasonable uniqueness
   *
   * @param input - String to hash
   * @returns Hexadecimal hash string
   */
  private simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Generate base encryption key for regular app data
   * Uses platform info and UUID for uniqueness
   *
   * @returns Base encryption key string
   */
  private generateBaseKey(): string {
    const platform = Platform.OS;
    const uuid = uuidv4();
    return `mmkv-base-${platform}-${uuid}`;
  }

  /**
   * Generate secure encryption key for sensitive data
   * Attempts to use Keychain on iOS, falls back to secure random generation
   *
   * @returns Promise resolving to secure encryption key
   */
  private async generateSecureKey(): Promise<string> {
    try {
      // On iOS, check if Keychain with biometric authentication is available
      if (isIos) {
        const isAvailable = await Keychain.canImplyAuthentication({
          authenticationType: Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
        });
        if (!isAvailable) {
          return this.generateFallbackSecureKey();
        }
      }

      try {
        // Try to retrieve existing key from Keychain
        const credentials = await Keychain.getInternetCredentials('mmkv-secure-key');
        if (credentials) {
          return credentials.password;
        }

        // Generate new secure key and store in Keychain
        const key = this.generateSecureRandomBytes(128); // 128 characters for secure key
        await Keychain.setInternetCredentials('mmkv-secure-key', 'secure-key', key);
        return key;
      } catch (keychainError) {
        logger.warn('Keychain operation failed for secure key:', { keychainError });
        return this.generateFallbackSecureKey();
      }
    } catch (error) {
      logger.error('Error generating secure key:', { error });
      return this.generateFallbackSecureKey();
    }
  }

  /**
   * Fallback secure key generation when Keychain is unavailable
   * Creates a complex key using multiple sources of entropy
   *
   * @returns Fallback secure key string
   */
  private generateFallbackSecureKey(): string {
    const timestamp = Date.now().toString();
    const random1 = uuidv4();
    const random2 = uuidv4();

    const platform = Platform.OS;
    const hash = this.simpleHash(`${platform}-${timestamp}-${random1}-${random2}`);
    return `secure-${hash}`;
  }

  /**
   * Initialize MMKV storage instances with appropriate encryption keys
   * This method is called automatically and handles all setup
   */
  private async initializeStorage() {
    // Prevent multiple simultaneous initialization attempts
    if (this.isStorageInitialized) return;
    if (this.initializingPromise) return this.initializingPromise;

    this.initializingPromise = (async () => {
      try {
        // Generate encryption keys
        const baseKey = this.generateBaseKey(); // Synchronous, simpler key for regular data
        const secureKey = await this.generateSecureKey(); // Async, more complex key for sensitive data

        // Initialize regular storage for app data (settings, preferences, cache, etc.)
        this.storage = createMMKV({
          id: 'app-storage',
          encryptionKey: baseKey,
        });

        // Initialize secure storage for sensitive data (tokens, passwords, personal info)
        this.secureStorage = createMMKV({
          id: 'secure-storage',
          encryptionKey: secureKey,
        });

        this.isStorageInitialized = true;
      } catch (error) {
        logger.error('Storage initialization failed:', { error });
        this.isStorageInitialized = false;
        throw error;
      } finally {
        this.initializingPromise = null;
      }
    })();
    return this.initializingPromise;
  }

  /**
   * Ensure storage is initialized before performing operations
   * This is called by all public methods to guarantee storage is ready
   */
  private async ensureStorageInitialized() {
    if (!this.isStorageInitialized) {
      await this.initializeStorage();
    }
  }

  /**
   * Store data in the appropriate storage instance
   *
   * @param key - Unique identifier for the data
   * @param value - Data to store (will be JSON stringified if object)
   * @param isSecure - Whether to use secure storage (default: true)
   * @returns Promise that resolves when storage is complete
   *
   * @example
   * // Store sensitive data
   * await StorageService.storeItem('userToken', 'jwt-token-here', true);
   *
   * // Store regular app data
   * await StorageService.storeItem('userPreferences', {theme: 'dark', language: 'en'}, false);
   */
  public async storeItem<T>(key: string, value: T, isSecure: boolean = true): Promise<void> {
    await this.ensureStorageInitialized();
    let store = isSecure ? this.secureStorage : this.storage;
    if (!store) throw new Error('Storage not initialized');

    try {
      if (typeof value === 'object') {
        store.set(key, JSON.stringify(value));
      } else {
        store.set(key, String(value));
      }
    } catch (error) {
      logger.error(`Error storing item ${key}:`, { error });
      throw error;
    }
  }

  /**
   * Retrieve data from storage
   *
   * @param key - Unique identifier for the data
   * @param isSecure - Whether to use secure storage (default: true)
   * @returns Promise resolving to the stored data or null if not found
   *
   * @example
   * // Retrieve sensitive data
   * const token = await StorageService.getItem<string>('userToken', true);
   *
   * // Retrieve regular app data
   * const prefs = await StorageService.getItem<{theme: string}>('userPreferences', false);
   */
  public async getItem<ReturnType>(key: string, isSecure: boolean = true): Promise<ReturnType | null> {
    await this.ensureStorageInitialized();
    let store = isSecure ? this.secureStorage : this.storage;
    if (!store) throw new Error('Storage not initialized');

    try {
      const value = store.getString(key);
      if (value) {
        try {
          // Attempt to parse as JSON first
          return JSON.parse(value) as ReturnType;
        } catch {
          // If JSON parsing fails, return as string
          return value as ReturnType;
        }
      }
      return null;
    } catch (error) {
      logger.error(`Error getting item ${key}:`, { error });
      return null;
    }
  }

  /**
   * Clear all data from both storage instances
   * Use with caution as this permanently deletes all stored data
   *
   * @example
   * // Clear all stored data (useful for logout)
   * StorageService.clearLocalStorage();
   */
  public clearLocalStorage(): void {
    try {
      this.storage?.clearAll();
      this.secureStorage?.clearAll();
    } catch (error) {
      logger.error('Error clearing local storage:', { error });
    }
  }

  /**
   * Remove a specific item from storage
   *
   * @param key - Unique identifier for the data to remove
   * @param isSecure - Whether to use secure storage (default: true)
   *
   * @example
   * // Remove sensitive data
   * StorageService.removeItem('userToken', true);
   *
   * // Remove regular app data
   * StorageService.removeItem('userPreferences', false);
   */
  public removeItem(key: string, isSecure: boolean = true): void {
    try {
      let store = isSecure ? this.secureStorage : this.storage;
      if (!store) throw new Error('Storage not initialized');
      store.remove(key);
    } catch (error) {
      logger.error(`Error removing item ${key}:`, { error });
    }
  }

  /**
   * Get all keys from the specified storage instance
   *
   * @param isSecure - Whether to use secure storage (default: true)
   * @returns Array of all stored keys
   *
   * @example
   * // Get all secure storage keys
   * const secureKeys = StorageService.getAllKeys(true);
   *
   * // Get all regular storage keys
   * const regularKeys = StorageService.getAllKeys(false);
   */
  public getAllKeys(isSecure: boolean = true): string[] {
    try {
      let store = isSecure ? this.secureStorage : this.storage;
      if (!store) throw new Error('Storage not initialized');
      return store.getAllKeys();
    } catch (error) {
      logger.error('Error getting all keys:', { error });
      return [];
    }
  }

  /**
   * Check if a specific key exists in storage
   *
   * @param key - Unique identifier to check
   * @param isSecure - Whether to use secure storage (default: true)
   * @returns True if key exists, false otherwise
   *
   * @example
   * // Check if user is logged in
   * const isLoggedIn = StorageService.hasItem(StorageService.storageKeys.isLoggedIn, true);
   *
   * // Check if preferences exist
   * const hasPrefs = StorageService.hasItem('userPreferences', false);
   */
  public hasItem(key: string, isSecure: boolean = true): boolean {
    try {
      let store = isSecure ? this.secureStorage : this.storage;
      if (!store) throw new Error('Storage not initialized');
      return store.contains(key);
    } catch (error) {
      logger.error(`Error checking item ${key}:`, { error });
      return false;
    }
  }
}

// Singleton instance for global access
const StorageService = new StorageManager();
export default StorageService;

// Optional: Export the class for custom instantiation
// export default StorageManager;

/**
 * USAGE EXAMPLES - KIOSK APP
 * ===========================
 *
 * 1. DEVICE & ROOM CONFIGURATION
 * ------------------------------
 *
 * // Store device ID
 * await StorageService.storeItem(StorageService.storageKeys.deviceId, 'device-123', true);
 *
 * // Store room information
 * const roomInfo = {
 *   roomId: 'room-001',
 *   roomName: 'Conference Room A',
 *   building: 'Main Building',
 *   floor: 3
 * };
 * await StorageService.storeItem(StorageService.storageKeys.roomInfo, roomInfo, false);
 *
 * // Store admin password hash (use secure storage)
 * const passwordHash = await hashPassword(adminPassword);
 * await StorageService.storeItem(StorageService.storageKeys.adminPasswordHash, passwordHash, true);
 *
 * // Mark first run as complete
 * await StorageService.storeItem(StorageService.storageKeys.isFirstRunComplete, true, false);
 *
 * // Retrieve stored data
 * const deviceId = await StorageService.getItem<string>(StorageService.storageKeys.deviceId, true);
 * const room = await StorageService.getItem<typeof roomInfo>(StorageService.storageKeys.roomInfo, false);
 *
 * 2. APP SETTINGS & CONFIGURATION
 * --------------------------------
 *
 * // Store app settings
 * const settings = {
 *   syncInterval: 300000, // 5 minutes
 *   autoSync: true,
 *   theme: 'dark',
 *   fontSize: 'large'
 * };
 * await StorageService.storeItem('appSettings', settings, false);
 *
 * // Retrieve settings
 * const appSettings = await StorageService.getItem<typeof settings>('appSettings', false);
 *
 * 3. MEETING DATA CACHE
 * ---------------------
 *
 * // Store meeting data cache
 * const meetingsCache = {
 *   meetings: [...],
 *   lastUpdated: Date.now(),
 *   expiresAt: Date.now() + 3600000 // 1 hour
 * };
 * await StorageService.storeItem('meetingsCache', meetingsCache, false);
 *
 * // Retrieve and check cache validity
 * const cache = await StorageService.getItem<typeof meetingsCache>('meetingsCache', false);
 * if (cache && cache.expiresAt > Date.now()) {
 *   // Use cached data
 *   return cache.meetings;
 * }
 *
 * 4. SYNC STATE MANAGEMENT
 * ------------------------
 *
 * // Store last sync timestamp
 * await StorageService.storeItem(StorageService.storageKeys.lastSyncTimestamp, Date.now(), false);
 *
 * // Check if sync is needed
 * const lastSync = await StorageService.getItem<number>(StorageService.storageKeys.lastSyncTimestamp, false);
 * const syncInterval = 300000; // 5 minutes
 * if (!lastSync || Date.now() - lastSync > syncInterval) {
 *   // Perform sync
 * }
 *
 * 5. UTILITY OPERATIONS
 * ---------------------
 *
 * // Check if data exists before storing
 * if (!StorageService.hasItem(StorageService.storageKeys.deviceId, true)) {
 *   await StorageService.storeItem(StorageService.storageKeys.deviceId, generateDeviceId(), true);
 * }
 *
 * // Get all keys for debugging
 * const allSecureKeys = StorageService.getAllKeys(true);
 * const allRegularKeys = StorageService.getAllKeys(false);
 *
 * // Clear all data (use with caution)
 * StorageService.clearLocalStorage();
 *
 * 6. ERROR HANDLING
 * ----------------
 *
 * try {
 *   await StorageService.storeItem('importantData', data, true);
 * } catch (error) {
 *   console.error('Failed to store data:', error);
 *   // Handle storage failure (e.g., show user message, retry, etc.)
 * }
 *
 * 7. TYPE SAFETY
 * --------------
 *
 * // Define interfaces for type safety
 * interface RoomInfo {
 *   roomId: string;
 *   roomName: string;
 *   building?: string;
 *   floor?: number;
 * }
 *
 * // Store with type safety
 * const room: RoomInfo = {
 *   roomId: 'room-001',
 *   roomName: 'Conference Room A',
 *   building: 'Main Building',
 *   floor: 3
 * };
 * await StorageService.storeItem<RoomInfo>(StorageService.storageKeys.roomInfo, room, false);
 *
 * // Retrieve with type safety
 * const savedRoom = await StorageService.getItem<RoomInfo>(StorageService.storageKeys.roomInfo, false);
 * if (savedRoom) {
 *   console.log(savedRoom.roomName); // TypeScript knows this is a string
 * }
 *
 * 8. BEST PRACTICES
 * ----------------
 *
 * - Always use secure storage (isSecure: true) for sensitive data like admin passwords, device IDs
 * - Use regular storage (isSecure: false) for app preferences, cache, room info, meeting data
 * - Handle storage errors gracefully with try-catch blocks
 * - Use TypeScript generics for type safety when retrieving data
 * - Clear sensitive data on logout or app uninstall
 * - Use descriptive key names and consider using constants for consistency
 * - Monitor storage usage and clear old cache data periodically
 * - Test storage operations on both iOS and Android
 */
