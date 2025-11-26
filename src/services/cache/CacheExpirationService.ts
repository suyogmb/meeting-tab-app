/**
 * Cache Expiration Service
 * Handles cache expiration logic for meeting data and other cached information
 * Works with real API data to manage local database cache
 */

import DatabaseService from '../../database/DatabaseService';
import {deleteOldMeetings} from '../../database/queries/meetingQueries';
import StorageService from '../../utils/StorageService';
import {logger} from '../../utils/SecureLogger';
import SyncService from '../sync/SyncService';

interface CacheExpirationConfig {
  meetingDataMaxAge: number; // Max age for meeting data (default: 24 hours)
  oldMeetingsRetentionDays: number; // Keep meetings for N days after end time (default: 7)
  roomInfoMaxAge: number; // Max age for room info cache (default: 30 days)
  requestQueueMaxAge: number; // Max age for queued requests (default: 7 days)
  enabled: boolean; // Whether cache expiration is enabled
}

/**
 * Cache Expiration Service class
 * Manages cache expiration and cleanup
 */
class CacheExpirationServiceClass {
  private cleanupInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  private readonly DEFAULT_CONFIG: CacheExpirationConfig = {
    meetingDataMaxAge: 24 * 60 * 60 * 1000, // 24 hours
    oldMeetingsRetentionDays: 7, // 7 days
    roomInfoMaxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    requestQueueMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    enabled: true,
  };

  private config: CacheExpirationConfig = {...this.DEFAULT_CONFIG};

  /**
   * Initialize cache expiration service
   */
  async initialize(): Promise<void> {
    try {
      // Load saved configuration
      await this.loadConfig();

      if (!this.config.enabled) {
        logger.info('Cache expiration is disabled');
        return;
      }

      // Perform initial cleanup
      await this.cleanupExpiredData();

      // Start periodic cleanup (every 6 hours)
      this.startPeriodicCleanup();

      logger.info('Cache expiration service initialized', {
        meetingDataMaxAge: this.config.meetingDataMaxAge,
        oldMeetingsRetentionDays: this.config.oldMeetingsRetentionDays,
      });
    } catch (error) {
      logger.error('Failed to initialize cache expiration service', {error});
    }
  }

  /**
   * Start periodic cleanup
   */
  private startPeriodicCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    // Cleanup every 6 hours
    const CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000;

    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredData().catch((error) => {
        logger.error('Periodic cache cleanup failed', {error});
      });
    }, CLEANUP_INTERVAL_MS);

    this.isRunning = true;
    logger.debug('Periodic cache cleanup started', {
      interval: CLEANUP_INTERVAL_MS,
    });
  }

  /**
   * Stop cache expiration service
   */
  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.isRunning = false;
    logger.info('Cache expiration service stopped');
  }

  /**
   * Clean up all expired data
   */
  async cleanupExpiredData(): Promise<void> {
    try {
      logger.info('Starting cache expiration cleanup');

      // Clean up expired meetings
      const meetingsDeleted = await this.cleanupExpiredMeetings();

      // Clean up stale meeting data
      const staleMeetings = await this.identifyStaleMeetingData();

      // Validate room info cache
      const roomInfoValid = await this.validateRoomInfoCache();

      logger.info('Cache expiration cleanup completed', {
        meetingsDeleted,
        staleMeetingsCount: staleMeetings.length,
        roomInfoValid,
      });
    } catch (error) {
      logger.error('Cache expiration cleanup failed', {error});
    }
  }

  /**
   * Clean up expired meetings (meetings that ended more than retention days ago)
   */
  private async cleanupExpiredMeetings(): Promise<number> {
    try {
      const cutoffTime =
        Date.now() - this.config.oldMeetingsRetentionDays * 24 * 60 * 60 * 1000;
      const deletedCount = await deleteOldMeetings(cutoffTime);

      if (deletedCount > 0) {
        logger.info('Cleaned up expired meetings', {
          deletedCount,
          cutoffTime: new Date(cutoffTime).toISOString(),
        });
      }

      return deletedCount;
    } catch (error) {
      logger.error('Failed to cleanup expired meetings', {error});
      return 0;
    }
  }

  /**
   * Identify stale meeting data (meetings with old synced_at timestamps)
   */
  private async identifyStaleMeetingData(): Promise<string[]> {
    try {
      const db = DatabaseService.getDatabase();
      const cutoffTime = Date.now() - this.config.meetingDataMaxAge;

      const sql = `
        SELECT id, synced_at
        FROM meetings
        WHERE synced_at IS NOT NULL
        AND synced_at < ?
      `;

      const results = await db.executeSql(sql, [cutoffTime]);
      const rows = results[0].rows.raw() as Array<{id: string; synced_at: number}>;

      const staleIds = rows.map(row => row.id);

      if (staleIds.length > 0) {
        logger.warn('Identified stale meeting data', {
          count: staleIds.length,
          cutoffTime: new Date(cutoffTime).toISOString(),
        });
      }

      return staleIds;
    } catch (error) {
      logger.error('Failed to identify stale meeting data', {error});
      return [];
    }
  }

  /**
   * Validate room info cache
   */
  private async validateRoomInfoCache(): Promise<boolean> {
    try {
      const roomInfo = await StorageService.getItem<{
        roomId: string;
        roomName: string;
        cachedAt?: number;
      }>(StorageService.storageKeys.roomInfo, false);

      if (!roomInfo) {
        return false;
      }

      // If room info has a cachedAt timestamp, check if it's expired
      if (roomInfo.cachedAt) {
        const cacheAge = Date.now() - roomInfo.cachedAt;
        if (cacheAge > this.config.roomInfoMaxAge) {
          logger.warn('Room info cache is expired', {
            cacheAge,
            maxAge: this.config.roomInfoMaxAge,
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      logger.error('Failed to validate room info cache', {error});
      return false;
    }
  }

  /**
   * Check if meeting data cache is valid
   */
  async isMeetingDataCacheValid(): Promise<boolean> {
    try {
      // Check sync service cache validity
      const syncCacheValid = await SyncService.isCacheValid();

      if (!syncCacheValid) {
        return false;
      }

      // Check if there are any stale meetings
      const staleMeetings = await this.identifyStaleMeetingData();
      return staleMeetings.length === 0;
    } catch (error) {
      logger.error('Failed to check meeting data cache validity', {error});
      return false;
    }
  }

  /**
   * Get cache status information
   */
  async getCacheStatus(): Promise<{
    meetingDataValid: boolean;
    roomInfoValid: boolean;
    lastCleanup?: number;
    staleMeetingsCount: number;
  }> {
    try {
      const meetingDataValid = await this.isMeetingDataCacheValid();
      const roomInfoValid = await this.validateRoomInfoCache();
      const staleMeetings = await this.identifyStaleMeetingData();

      const lastCleanup = await StorageService.getItem<number>(
        'cacheLastCleanup',
        false,
      );

      return {
        meetingDataValid,
        roomInfoValid,
        lastCleanup: lastCleanup || undefined,
        staleMeetingsCount: staleMeetings.length,
      };
    } catch (error) {
      logger.error('Failed to get cache status', {error});
      return {
        meetingDataValid: false,
        roomInfoValid: false,
        staleMeetingsCount: 0,
      };
    }
  }

  /**
   * Force cleanup of expired data
   */
  async forceCleanup(): Promise<void> {
    logger.info('Force cache cleanup requested');
    await this.cleanupExpiredData();

    // Update last cleanup timestamp
    await StorageService.storeItem('cacheLastCleanup', Date.now(), false);
  }

  /**
   * Update configuration
   */
  async updateConfig(updates: Partial<CacheExpirationConfig>): Promise<void> {
    this.config = {...this.config, ...updates};
    await this.saveConfig();

    // Restart if running
    if (this.isRunning) {
      this.stop();
      if (this.config.enabled) {
        await this.initialize();
      }
    }

    logger.info('Cache expiration configuration updated', {config: this.config});
  }

  /**
   * Get current configuration
   */
  getConfig(): CacheExpirationConfig {
    return {...this.config};
  }

  /**
   * Load configuration from storage
   */
  private async loadConfig(): Promise<void> {
    try {
      const saved = await StorageService.getItem<CacheExpirationConfig>(
        'cacheExpirationConfig',
        false,
      );
      if (saved) {
        this.config = {...this.DEFAULT_CONFIG, ...saved};
      }
    } catch (error) {
      logger.error('Failed to load cache expiration config', {error});
      // Use default config
    }
  }

  /**
   * Save configuration to storage
   */
  private async saveConfig(): Promise<void> {
    try {
      await StorageService.storeItem('cacheExpirationConfig', this.config, false);
    } catch (error) {
      logger.error('Failed to save cache expiration config', {error});
    }
  }
}

// Export singleton instance
export default new CacheExpirationServiceClass();

