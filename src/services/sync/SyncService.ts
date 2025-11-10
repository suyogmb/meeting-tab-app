/**
 * Sync Service
 * Handles data synchronization between local database and API
 * Currently uses mock data - replace with real API calls when available
 */

import {
  upsertMeetings,
  getTodayMeetings,
  deleteOldMeetings,
} from '../../database/queries/meetingQueries';
import {Meeting} from '../../types/meeting';
import {SyncResult, SyncOptions} from '../../types/sync';
import StorageService from '../../utils/StorageService';
import {MockDataService} from '../mock/MockDataService';
import {logger} from '../../utils/SecureLogger';
import DatabaseService from '../../database/DatabaseService';
import HTTPService from '../../networkConfig/HttpServices';
import {Endpoints} from '../../networkConfig/Endpoints';

/**
 * Sync Service class
 * Handles synchronization of meeting data
 */
class SyncServiceClass {
  /**
   * Sync meetings for the configured room
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

      // TODO: Replace with real API call when available
      // const meetings = await this.fetchMeetingsFromAPI(roomInfo.roomId);
      
      // For now, use mock data
      // Always regenerate with future times for testing
      const meetings = await MockDataService.fetchMeetings(roomInfo.roomId);
      
      // Clear existing meetings for this room before upserting (to avoid duplicates)
      const db = DatabaseService.getDatabase();
      await db.executeSql('DELETE FROM meetings WHERE room_id = ?', [roomInfo.roomId]);

      // Upsert meetings to database
      await upsertMeetings(meetings);

      // Clean up old meetings (older than 7 days)
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      await deleteOldMeetings(sevenDaysAgo);

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
      });

      return {
        success: true,
        recordsSynced: meetings.length,
        syncTime,
      };
    } catch (error) {
      logger.error('Sync failed', {error});
      return {
        success: false,
        recordsSynced: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        syncTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Fetch meetings from API (TODO: Implement when API is available)
   * @private
   */
  private async fetchMeetingsFromAPI(roomId: string): Promise<Meeting[]> {
    try {
      // TODO: Replace with real API endpoint
      // const response = await HTTPService.get<MeetingResponse[]>(
      //   Endpoints.meetingsByRoom(roomId),
      // );
      // return response.data.map((m) => this.mapAPIResponseToMeeting(m, roomId));

      // For now, return empty array (mock data is used instead)
      return [];
    } catch (error) {
      logger.error('Failed to fetch meetings from API', {error});
      throw error;
    }
  }

  /**
   * Map API response to Meeting type
   * @private
   */
  private mapAPIResponseToMeeting(
    response: any,
    roomId: string,
  ): Meeting {
    return {
      id: response.id,
      roomId,
      title: response.title,
      description: response.description,
      organizer: response.organizer,
      startTime: new Date(response.startTime).getTime(),
      endTime: new Date(response.endTime).getTime(),
      attendeeCount: response.attendeeCount,
      isAllDay: response.isAllDay || false,
      status: response.status || 'scheduled',
      createdAt: new Date(response.createdAt || Date.now()).getTime(),
      updatedAt: new Date(response.updatedAt || Date.now()).getTime(),
      syncedAt: Date.now(),
    };
  }

  /**
   * Force sync (ignores cache, always fetches from API)
   */
  async forceSync(): Promise<SyncResult> {
    return this.syncMeetings({force: true});
  }
}

// Export singleton instance
export default new SyncServiceClass();

