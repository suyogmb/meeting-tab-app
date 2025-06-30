import {MMKV} from 'react-native-mmkv';

/**
 *  @description: A class for managing storage operations.
 *  @see: https://github.com/mrousavy/react-native-mmkv#readme
 */
class StorageManager {
  private storage: MMKV;

  /**
   * Storage keys for storage
   */
  public storageKeys = {
    isLoggedIn: 'isLoggedIn',
    token: 'token',
    refresh_token: 'refresh_token',
  };

  constructor() {
    this.storage = new MMKV();
  }

  // Store data in storage
  public storeItem<T>(key: string, value: T): void {
    try {
      if (typeof value === 'object') {
        this.storage.set(key, JSON.stringify(value));
      } else {
        this.storage.set(key, String(value));
      }
    } catch (error) {
      console.error(`Error storing item ${key}:`, error);
    }
  }

  // Get data from storage
  public getItem<ReturnType>(key: string): ReturnType | null {
    try {
      const value = this.storage.getString(key);
      if (value) {
        try {
          return JSON.parse(value) as ReturnType;
        } catch {
          return value as ReturnType;
        }
      }

      return null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  // Clear all data in storage
  public clearLocalStorage(): void {
    try {
      this.storage.clearAll();
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  }

  // Remove data from storage
  public removeItem(key: string): void {
    try {
      this.storage.delete(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  // Get all keys
  public getAllKeys(): string[] {
    try {
      return this.storage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  // Check if a key exists
  public hasItem(key: string): boolean {
    try {
      return this.storage.contains(key);
    } catch (error) {
      console.error(`Error checking item ${key}:`, error);
      return false;
    }
  }
}

// Singleton instance
const StorageService = new StorageManager();
export default StorageService;
// Optional: Export the class for custom instantiation
// export default StorageManager;
