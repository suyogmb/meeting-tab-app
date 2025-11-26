/**
 * Notification-related TypeScript types
 */

/**
 * FCM notification payload structure
 */
export interface FCMNotification {
  title?: string;
  body?: string;
  data?: Record<string, string | number | boolean>;
  sound?: string;
  badge?: number;
}

/**
 * FCM message structure
 */
export interface FCMMessage {
  messageId: string;
  notification?: FCMNotification;
  data?: Record<string, string>;
  from?: string;
  sentTime?: number;
  ttl?: number;
}

/**
 * Notification data payload for meeting updates
 */
export interface MeetingNotificationData {
  type: 'meeting_updated' | 'meeting_cancelled' | 'meeting_created' | 'sync_required';
  meetingId?: string;
  meetingUuid?: string; // UUID of the meeting from Firebase push notification
  roomId?: string;
  timestamp?: number;
}

/**
 * FCM token information
 */
export interface FCMTokenInfo {
  token: string;
  updatedAt: number;
}

/**
 * Notification handler callback type
 */
export type NotificationHandler = (message: FCMMessage) => void | Promise<void>;

/**
 * Token refresh handler callback type
 */
export type TokenRefreshHandler = (token: string) => void | Promise<void>;

