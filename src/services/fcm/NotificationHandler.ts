/**
 * Notification Handler
 * Handles specific notification types and triggers appropriate actions
 */

import {FCMMessage, MeetingNotificationData} from '../../types/notification';
import SyncService from '../sync/SyncService';
import StorageService from '../../utils/StorageService';
import {logger} from '../../utils/SecureLogger';
import MeetingsApiService from '../api/MeetingsApiService';
import {upsertMeeting, meetingExists} from '../../database/queries/meetingQueries';
import DatabaseService from '../../database/DatabaseService';

/**
 * Notification Handler class
 * Processes different types of notifications and triggers appropriate actions
 */
class NotificationHandlerClass {
  /**
   * Handle meeting-related notifications
   */
  async handleMeetingNotification(message: FCMMessage): Promise<void> {
    try {
      if (!message.data) {
        return;
      }

      const notificationData: MeetingNotificationData = {
        type: message.data.type as MeetingNotificationData['type'],
        meetingId: message.data.meetingId,
        meetingUuid: message.data.meetingUuid,
        roomId: message.data.roomId,
        timestamp: message.data.timestamp
          ? parseInt(message.data.timestamp, 10)
          : undefined,
      };

      // Console log for debugging
      console.log('========================================');
      console.log('🔔 HANDLING MEETING NOTIFICATION');
      console.log('========================================');
      console.log('Notification Type:', notificationData.type);
      console.log('Meeting ID:', notificationData.meetingId || 'N/A');
      console.log('Meeting UUID:', notificationData.meetingUuid || 'N/A');
      console.log('Room ID:', notificationData.roomId || 'N/A');
      console.log('Timestamp:', notificationData.timestamp || 'N/A');
      console.log('Full Data:', JSON.stringify(notificationData, null, 2));
      console.log('========================================');

      logger.info('Handling meeting notification', {data: notificationData});

      // Get current room ID
      const roomInfo = await StorageService.getItem<{roomId: string}>(
        StorageService.storageKeys.roomInfo,
        false,
      );

      console.log('📍 Current Room ID:', roomInfo?.roomId || 'Not configured');
      console.log('📍 Notification Room ID:', notificationData.roomId || 'N/A');

      // Only process if notification is for current room
      if (roomInfo?.roomId && notificationData.roomId !== roomInfo.roomId) {
        console.log('⚠️ Notification is for a different room, ignoring');
        logger.info('Notification is for a different room, ignoring', {
          currentRoom: roomInfo.roomId,
          notificationRoom: notificationData.roomId,
        });
        return;
      }

      // Handle meetingUuid from Firebase push notification
      if (notificationData.meetingUuid && roomInfo?.roomId) {
        console.log('📥 Processing meetingUuid from push notification');
        console.log('Meeting UUID:', notificationData.meetingUuid);
        console.log('Room Code:', roomInfo.roomId);

        try {
          // Initialize database if needed
          await DatabaseService.initialize();

          // Fetch meeting details from API
          console.log('🌐 Fetching meeting details from API...');
          const meeting = await MeetingsApiService.fetchMeetingByUuid(
            roomInfo.roomId,
            notificationData.meetingUuid,
          );

          if (!meeting) {
            console.log('⚠️ Meeting not found in API response');
            logger.warn('Meeting not found in API', {
              meetingUuid: notificationData.meetingUuid,
              roomCode: roomInfo.roomId,
            });
            // Continue with normal sync flow
          } else {
            console.log('✅ Meeting fetched from API:', {
              id: meeting.id,
              title: meeting.title,
              startTime: new Date(meeting.startTime).toISOString(),
            });

            // Check if meeting exists in local storage
            const exists = await meetingExists(meeting.id);
            console.log('📦 Meeting exists in local storage:', exists);

            if (exists) {
              console.log('🔄 Replacing existing meeting in local storage');
              logger.info('Replacing existing meeting', {
                meetingId: meeting.id,
                meetingUuid: notificationData.meetingUuid,
              });
            } else {
              console.log('➕ Adding new meeting to local storage');
              logger.info('Adding new meeting', {
                meetingId: meeting.id,
                meetingUuid: notificationData.meetingUuid,
              });
            }

            // Upsert meeting (will replace if exists, add if not)
            await upsertMeeting(meeting);
            console.log('✅ Meeting saved to local storage successfully');
            logger.info('Meeting saved to local storage', {
              meetingId: meeting.id,
              action: exists ? 'replaced' : 'added',
            });
          }
        } catch (error) {
          console.error('❌ Failed to process meetingUuid:', error);
          logger.error('Failed to process meetingUuid', {
            error,
            meetingUuid: notificationData.meetingUuid,
            roomCode: roomInfo.roomId,
          });
          // Continue with normal sync flow as fallback
        }
      }

      // Handle different notification types
      switch (notificationData.type) {
        case 'meeting_updated':
        case 'meeting_created':
        case 'meeting_cancelled':
          console.log(`🔄 Syncing meetings (type: ${notificationData.type})`);
          // Sync meetings to get latest data
          await SyncService.syncMeetings();
          console.log('✅ Meetings synced successfully');
          logger.info('Meetings synced after notification', {type: notificationData.type});
          break;

        case 'sync_required':
          console.log('🔄 Triggering sync (sync_required)');
          // Trigger sync
          await SyncService.syncMeetings();
          console.log('✅ Sync completed');
          logger.info('Sync triggered by notification');
          break;

        default:
          console.warn('⚠️ Unknown notification type:', notificationData.type);
          logger.warn('Unknown notification type', {type: notificationData.type});
      }
    } catch (error) {
      logger.error('Failed to handle meeting notification', {error});
    }
  }

  /**
   * Process notification message
   */
  async processNotification(message: FCMMessage): Promise<void> {
    try {
      console.log('🔍 Processing notification...');
      console.log('Notification Data Type:', message.data?.type || 'N/A');
      
      // Check if it's a meeting-related notification
      if (message.data?.type?.startsWith('meeting_') || message.data?.type === 'sync_required') {
        console.log('✅ Meeting-related notification detected, handling...');
        await this.handleMeetingNotification(message);
      } else {
        console.log('ℹ️ Unhandled notification type:', message.data?.type || 'none');
        logger.info('Unhandled notification type', {data: message.data});
      }
    } catch (error) {
      logger.error('Failed to process notification', {error});
      console.error('❌ Failed to process notification:', error);
    }
  }
}

// Export singleton instance
export default new NotificationHandlerClass();

