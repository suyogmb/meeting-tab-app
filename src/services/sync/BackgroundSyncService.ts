/**
 * Background Sync Service
 * Handles periodic background synchronization of meeting data
 * Automatically syncs with the backend API at regular intervals
 */

import {AppState, AppStateStatus} from 'react-native';
import SyncService from './SyncService';
import NetworkService from '../network/NetworkService';
import {logger} from '../../utils/SecureLogger';
import StorageService from '../../utils/StorageService';

interface BackgroundSyncConfig {
  syncIntervalMs: number; // How often to sync (default: 5 minutes)
  syncOnAppStateChange: boolean; // Sync when app comes to foreground
  syncOnNetworkRestore: boolean; // Sync when network is restored
  enabled: boolean; // Whether background sync is enabled
}

/**
 * Background Sync Service class
 * Manages periodic background synchronization
 */
class BackgroundSyncServiceClass {
  private syncInterval: NodeJS.Timeout | null = null;
  private appStateSubscription: {remove: () => void} | null = null;
  private networkListener: (() => void) | null = null;
  private isRunning = false;
  private lastSyncAttempt: number = 0;

  private readonly DEFAULT_CONFIG: BackgroundSyncConfig = {
    syncIntervalMs: 5 * 60 * 1000, // 5 minutes
    syncOnAppStateChange: true,
    syncOnNetworkRestore: true,
    enabled: true,
  };

  private config: BackgroundSyncConfig = {...this.DEFAULT_CONFIG};

  /**
   * Initialize background sync service
   */
  async initialize(): Promise<void> {
    try {
      // Load saved configuration
      await this.loadConfig();

      if (!this.config.enabled) {
        logger.info('Background sync is disabled');
        return;
      }

      // Start background sync
      await this.start();

      logger.info('Background sync service initialized', {
        interval: this.config.syncIntervalMs,
        syncOnAppStateChange: this.config.syncOnAppStateChange,
        syncOnNetworkRestore: this.config.syncOnNetworkRestore,
      });
    } catch (error) {
      logger.error('Failed to initialize background sync service', {error});
    }
  }

  /**
   * Start background sync
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Background sync is already running');
      return;
    }

    this.isRunning = true;

    // Start periodic sync
    this.startPeriodicSync();

    // Set up app state listener
    if (this.config.syncOnAppStateChange) {
      this.setupAppStateListener();
    }

    // Set up network restore listener
    if (this.config.syncOnNetworkRestore) {
      this.setupNetworkRestoreListener();
    }

    // Perform initial sync if needed
    const shouldSync = await SyncService.shouldSync();
    if (shouldSync) {
      this.performSync().catch((error) => {
        logger.error('Initial background sync failed', {error});
      });
    }

    logger.info('Background sync started');
  }

  /**
   * Stop background sync
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    // Clear periodic sync interval
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    // Remove app state listener
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }

    // Remove network listener
    if (this.networkListener) {
      NetworkService.subscribe(this.networkListener)();
      this.networkListener = null;
    }

    logger.info('Background sync stopped');
  }

  /**
   * Start periodic sync interval
   */
  private startPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.performSync().catch((error) => {
        logger.error('Periodic background sync failed', {error});
      });
    }, this.config.syncIntervalMs);

    logger.debug('Periodic sync interval started', {
      interval: this.config.syncIntervalMs,
    });
  }

  /**
   * Set up app state change listener
   */
  private setupAppStateListener(): void {
    const listener = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App came to foreground - check if sync is needed
        const timeSinceLastSync = Date.now() - this.lastSyncAttempt;
        const minInterval = 1 * 60 * 1000; // Minimum 1 minute between syncs

        if (timeSinceLastSync >= minInterval) {
          logger.info('App came to foreground, checking if sync is needed');
          SyncService.shouldSync().then((shouldSync) => {
            if (shouldSync) {
              this.performSync().catch((error) => {
                logger.error('Foreground sync failed', {error});
              });
            }
          });
        }
      }
    };

    this.appStateSubscription = AppState.addEventListener('change', listener);
  }

  /**
   * Set up network restore listener
   */
  private setupNetworkRestoreListener(): void {
    let wasOnline = false;

    this.networkListener = NetworkService.subscribe(async (state) => {
      const isOnline =
        state.isConnected === true && state.isInternetReachable === true;

      if (isOnline && !wasOnline) {
        // Network restored - attempt sync
        logger.info('Network restored, attempting background sync');
        this.performSync().catch((error) => {
          logger.error('Network restore sync failed', {error});
        });
      }

      wasOnline = isOnline;
    });
  }

  /**
   * Perform sync operation
   */
  private async performSync(): Promise<void> {
    try {
      this.lastSyncAttempt = Date.now();

      // Check if online (sync service will handle this, but we check here too)
      const isOnline = await NetworkService.isConnected();
      const isInternetReachable = await NetworkService.isInternetReachable();

      if (!isOnline || !isInternetReachable) {
        logger.debug('Background sync skipped: device is offline');
        return;
      }

      // Check if sync is needed
      const shouldSync = await SyncService.shouldSync();
      if (!shouldSync) {
        logger.debug('Background sync skipped: too soon since last sync');
        return;
      }

      logger.info('Starting background sync');
      const result = await SyncService.syncMeetings();

      if (result.success) {
        logger.info('Background sync completed successfully', {
          recordsSynced: result.recordsSynced,
          syncTime: result.syncTime,
        });
      } else {
        logger.warn('Background sync completed with errors', {
          error: result.error,
          syncTime: result.syncTime,
        });
      }
    } catch (error) {
      logger.error('Background sync failed', {error});
      // Don't throw - background sync failures shouldn't crash the app
    }
  }

  /**
   * Update sync configuration
   */
  async updateConfig(updates: Partial<BackgroundSyncConfig>): Promise<void> {
    this.config = {...this.config, ...updates};
    await this.saveConfig();

    // Restart if running
    if (this.isRunning) {
      this.stop();
      if (this.config.enabled) {
        await this.start();
      }
    }

    logger.info('Background sync configuration updated', {config: this.config});
  }

  /**
   * Get current configuration
   */
  getConfig(): BackgroundSyncConfig {
    return {...this.config};
  }

  /**
   * Load configuration from storage
   */
  private async loadConfig(): Promise<void> {
    try {
      const saved = await StorageService.getItem<BackgroundSyncConfig>(
        'backgroundSyncConfig',
        false,
      );
      if (saved) {
        this.config = {...this.DEFAULT_CONFIG, ...saved};
      }
    } catch (error) {
      logger.error('Failed to load background sync config', {error});
      // Use default config
    }
  }

  /**
   * Save configuration to storage
   */
  private async saveConfig(): Promise<void> {
    try {
      await StorageService.storeItem('backgroundSyncConfig', this.config, false);
    } catch (error) {
      logger.error('Failed to save background sync config', {error});
    }
  }

  /**
   * Force immediate sync (bypasses interval and checks)
   */
  async forceSync(): Promise<void> {
    logger.info('Force background sync requested');
    await this.performSync();
  }

  /**
   * Get sync status
   */
  getStatus(): {
    isRunning: boolean;
    lastSyncAttempt: number;
    config: BackgroundSyncConfig;
  } {
    return {
      isRunning: this.isRunning,
      lastSyncAttempt: this.lastSyncAttempt,
      config: {...this.config},
    };
  }
}

// Export singleton instance
export default new BackgroundSyncServiceClass();

