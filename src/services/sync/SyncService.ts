/**
 * Sync Service
 * Handles data synchronization between local database and API
 * Network-aware: checks connectivity before syncing and handles offline scenarios
 */

import {
  upsertMeetings,
  getTodayMeetings,
  deleteOldMeetings,
} from '../../database/queries/meetingQueries';
import {Meeting} from '../../types/meeting';
import {SyncResult, SyncOptions} from '../../types/sync';
import StorageService from '../../utils/StorageService';
import MeetingsApiService from '../api/MeetingsApiService';
import {logger} from '../../utils/SecureLogger';
import DatabaseService from '../../database/DatabaseService';
import HTTPService from '../../networkConfig/HttpServices';
import {Endpoints} from '../../networkConfig/Endpoints';
import NetworkService from '../network/NetworkService';
import CacheExpirationService from '../cache/CacheExpirationService';

/**
 * Sync Service class
 * Handles synchronization of meeting data with network awareness
 */
class SyncServiceClass {
  private readonly SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes default sync interval
  private readonly MAX_CACHE_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours max cache age

  /**
   * Check if device is online and can sync
   * @returns Promise resolving to true if online, false otherwise
   */
  async isOnline(): Promise<boolean> {
    try {
      const isConnected = await NetworkService.isConnected();
      const isInternetReachable = await NetworkService.isInternetReachable();
      return isConnected === true && isInternetReachable === true;
    } catch (error) {
      logger.error('Failed to check network status', {error});
      return false;
    }
  }

  /**
   * Check if sync is needed based on last sync time
   * @param force - Force sync regardless of last sync time
   * @returns Promise resolving to true if sync is needed
   */
  async shouldSync(force: boolean = false): Promise<boolean> {
    if (force) {
      return true;
    }

    try {
      const lastSync = await StorageService.getItem<number>(
        StorageService.storageKeys.lastSyncTimestamp,
        false,
      );

      if (!lastSync) {
        // Never synced before
        return true;
      }

      const timeSinceLastSync = Date.now() - lastSync;
      return timeSinceLastSync >= this.SYNC_INTERVAL_MS;
    } catch (error) {
      logger.error('Failed to check if sync is needed', {error});
      // Default to syncing if we can't determine
      return true;
    }
  }

  /**
   * Check if cached data is still valid
   * @returns Promise resolving to true if cache is valid
   */
  async isCacheValid(): Promise<boolean> {
    try {
      const lastSync = await StorageService.getItem<number>(
        StorageService.storageKeys.lastSyncTimestamp,
        false,
      );

      if (!lastSync) {
        return false;
      }

      const cacheAge = Date.now() - lastSync;
      return cacheAge < this.MAX_CACHE_AGE_MS;
    } catch (error) {
      logger.error('Failed to check cache validity', {error});
      return false;
    }
  }

  /**
   * Sync meetings for the configured room
   * Network-aware: checks connectivity before syncing
   * @param options - Sync options
   * @returns Promise resolving to sync result
   */
  async syncMeetings(options: SyncOptions = {}): Promise<SyncResult> {
    const startTime = Date.now();

    try {
      // Get room configuration
      const roomInfo = await StorageService.getItem<{roomId: string}>(
        StorageService.storageKeys.roomInfo,
        false,
      );

      if (!roomInfo?.roomId) {
        throw new Error('Room not configured');
      }

      // Check network connectivity
      const isOnline = await this.isOnline();

      if (!isOnline) {
        // Device is offline
        const cacheValid = await this.isCacheValid();
        
        logger.info('Sync skipped: device is offline', {
          roomId: roomInfo.roomId,
          cacheValid,
        });

        return {
          success: false,
          recordsSynced: 0,
          error: 'Device is offline',
          syncTime: Date.now() - startTime,
        };
      }

      // Check if sync is needed (unless forced)
      if (!options.force) {
        const shouldSync = await this.shouldSync(false);
        if (!shouldSync) {
          logger.debug('Sync skipped: too soon since last sync', {
            roomId: roomInfo.roomId,
          });
          return {
            success: true,
            recordsSynced: 0,
            syncTime: Date.now() - startTime,
          };
        }
      }

      logger.info('Starting sync', {
        roomId: roomInfo.roomId,
        force: options.force,
        type: options.type || 'full',
      });

      // Fetch meetings from API
      const meetings = await MeetingsApiService.fetchAllMeetingsByRoomCode(roomInfo.roomId);
      logger.info('Fetched meetings from API for sync', {
        count: meetings.length,
        roomId: roomInfo.roomId,
      });
      
      // Clear existing meetings for this room before upserting (to avoid duplicates)
      const db = DatabaseService.getDatabase();
      await db.executeSql('DELETE FROM meetings WHERE room_id = ?', [roomInfo.roomId]);

      // Upsert meetings to database
      await upsertMeetings(meetings);

      // Clean up old meetings using cache expiration service config
      const cacheConfig = CacheExpirationService.getConfig();
      const cutoffTime =
        Date.now() - cacheConfig.oldMeetingsRetentionDays * 24 * 60 * 60 * 1000;
      await deleteOldMeetings(cutoffTime);

      // Update last sync timestamp
      await StorageService.storeItem(
        StorageService.storageKeys.lastSyncTimestamp,
        Date.now(),
        false,
      );

      const syncTime = Date.now() - startTime;
      logger.info('Meetings synced successfully', {
        recordsSynced: meetings.length,
        syncTime,
        roomId: roomInfo.roomId,
      });

      return {
        success: true,
        recordsSynced: meetings.length,
        syncTime,
      };
    } catch (error) {
      // Check if error is due to network issues
      const isOnline = await this.isOnline();
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Determine if error is network-related
      const isNetworkError = 
        !isOnline || 
        errorMessage.includes('offline') || 
        errorMessage.includes('network') ||
        errorMessage.includes('timeout');

      logger.error('Sync failed', {
        error: errorMessage,
        isNetworkError,
        isOnline,
      });

      return {
        success: false,
        recordsSynced: 0,
        error: isNetworkError 
          ? 'Network error: Unable to sync. Please check your connection.'
          : errorMessage,
        syncTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Get sync status information
   * @returns Promise resolving to sync status
   */
  async getSyncStatus(): Promise<{
    lastSyncTime?: number;
    isOnline: boolean;
    cacheValid: boolean;
    shouldSync: boolean;
  }> {
    try {
      const lastSyncTime = await StorageService.getItem<number>(
        StorageService.storageKeys.lastSyncTimestamp,
        false,
      );

      const isOnline = await this.isOnline();
      const cacheValid = await this.isCacheValid();
      const shouldSync = await this.shouldSync(false);

      return {
        lastSyncTime: lastSyncTime || undefined,
        isOnline,
        cacheValid,
        shouldSync,
      };
    } catch (error) {
      logger.error('Failed to get sync status', {error});
      return {
        isOnline: false,
        cacheValid: false,
        shouldSync: false,
      };
    }
  }

  /**
   * Force sync (ignores cache, always fetches from API)
   * Network-aware: will fail gracefully if offline
   */
  async forceSync(): Promise<SyncResult> {
    return this.syncMeetings({force: true});
  }

  /**
   * Attempt sync when connectivity is restored
   * Called automatically by NetworkContext when device comes online
   */
  async syncOnConnectivityRestore(): Promise<SyncResult> {
    logger.info('Connectivity restored, attempting sync');
    return this.syncMeetings({force: false});
  }
}

// Export singleton instance
export default new SyncServiceClass();

