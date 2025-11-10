/**
 * Notification Handler
 * Handles specific notification types and triggers appropriate actions
 */

import {FCMMessage, MeetingNotificationData} from '../../types/notification';
import SyncService from '../sync/SyncService';
import StorageService from '../../utils/StorageService';
import {logger} from '../../utils/SecureLogger';

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

