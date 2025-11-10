/**
 * Firebase Cloud Messaging (FCM) Service
 * Handles FCM token management, notification registration, and message handling
 */

import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  Notification,
} from '@notifee/react-native';
import {Platform, PermissionsAndroid} from 'react-native';
import Toast from 'react-native-toast-message';
import {FCMMessage, FCMTokenInfo, NotificationHandler, TokenRefreshHandler} from '../../types/notification';
import StorageService from '../../utils/StorageService';
import {logger} from '../../utils/SecureLogger';
import SyncService from '../sync/SyncService';
import i18n from '../../language/i18n';

/**
 * FCM Service class
 * Singleton pattern for managing FCM operations
 */
class FCMServiceClass {
  private onMessageListener: (() => void) | null = null;
  private onNotificationOpenedListener: (() => void) | null = null;
  private onTokenRefreshListener: (() => void) | null = null;
  private notificationHandlers: NotificationHandler[] = [];
  private tokenRefreshHandlers: TokenRefreshHandler[] = [];

  /**
   * Storage keys for FCM
   */
  private readonly STORAGE_KEY_FCM_TOKEN = 'fcmToken';
  private readonly STORAGE_KEY_FCM_TOKEN_UPDATED_AT = 'fcmTokenUpdatedAt';

  /**
   * Request notification permissions
   * Required for receiving notifications on Android 13+ and iOS
   */
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        // Android 13+ requires runtime permission
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            logger.warn('Notification permission denied');
            return false;
          }
        }

        // Request notification channel settings for Android
        const settings = await notifee.getNotificationSettings();
        if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
          await notifee.requestPermission();
        }
      } else {
        // iOS
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          logger.warn('Notification permission denied on iOS');
          return false;
        }
      }

      logger.info('Notification permissions granted');
      return true;
    } catch (error) {
      logger.error('Failed to request notification permissions', {error});
      return false;
    }
  }

  /**
   * Create Android notification channel
   * Required for displaying notifications on Android 8.0+
   */
  async createNotificationChannel(): Promise<void> {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      const channelId = await notifee.createChannel({
        id: 'meeting_updates',
        name: 'Meeting Updates',
        description: 'Notifications for meeting room updates',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        vibrationPattern: [300, 500],
      });

      logger.info('Notification channel created', {channelId});
    } catch (error) {
      logger.error('Failed to create notification channel', {error});
    }
  }

  /**
   * Get FCM token
   */
  async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      if (token) {
        await this.saveToken(token);
        logger.info('FCM token retrieved', {token: token.substring(0, 20) + '...'});
      }
      return token;
    } catch (error) {
      logger.error('Failed to get FCM token', {error});
      return null;
    }
  }

  /**
   * Save FCM token to storage
   */
  private async saveToken(token: string): Promise<void> {
    try {
      const tokenInfo: FCMTokenInfo = {
        token,
        updatedAt: Date.now(),
      };
      await StorageService.storeItem(this.STORAGE_KEY_FCM_TOKEN, token, true);
      await StorageService.storeItem(
        this.STORAGE_KEY_FCM_TOKEN_UPDATED_AT,
        tokenInfo.updatedAt,
        false,
      );
    } catch (error) {
      logger.error('Failed to save FCM token', {error});
    }
  }

  /**
   * Get saved FCM token from storage
   */
  async getSavedToken(): Promise<string | null> {
    try {
      return await StorageService.getItem<string>(this.STORAGE_KEY_FCM_TOKEN, true);
    } catch (error) {
      logger.error('Failed to get saved FCM token', {error});
      return null;
    }
  }

  /**
   * Delete FCM token (e.g., on logout)
   */
  async deleteToken(): Promise<void> {
    try {
      await messaging().deleteToken();
      await StorageService.removeItem(this.STORAGE_KEY_FCM_TOKEN, true);
      await StorageService.removeItem(this.STORAGE_KEY_FCM_TOKEN_UPDATED_AT, false);
      logger.info('FCM token deleted');
    } catch (error) {
      logger.error('Failed to delete FCM token', {error});
    }
  }

  /**
   * Subscribe to a topic (e.g., room-specific topics)
   */
  async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      logger.info('Subscribed to FCM topic', {topic});
    } catch (error) {
      logger.error('Failed to subscribe to FCM topic', {error, topic});
    }
  }

  /**
   * Unsubscribe from a topic
   */
  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      logger.info('Unsubscribed from FCM topic', {topic});
    } catch (error) {
      logger.error('Failed to unsubscribe from FCM topic', {error, topic});
    }
  }

  /**
   * Subscribe to room-specific topic
   */
  async subscribeToRoom(roomId: string): Promise<void> {
    const topic = `room_${roomId}`;
    await this.subscribeToTopic(topic);
  }

  /**
   * Unsubscribe from room-specific topic
   */
  async unsubscribeFromRoom(roomId: string): Promise<void> {
    const topic = `room_${roomId}`;
    await this.unsubscribeFromTopic(topic);
  }

  /**
   * Register notification handler
   */
  registerNotificationHandler(handler: NotificationHandler): void {
    this.notificationHandlers.push(handler);
  }

  /**
   * Unregister notification handler
   */
  unregisterNotificationHandler(handler: NotificationHandler): void {
    this.notificationHandlers = this.notificationHandlers.filter(h => h !== handler);
  }

  /**
   * Register token refresh handler
   */
  registerTokenRefreshHandler(handler: TokenRefreshHandler): void {
    this.tokenRefreshHandlers.push(handler);
  }

  /**
   * Unregister token refresh handler
   */
  unregisterTokenRefreshHandler(handler: TokenRefreshHandler): void {
    this.tokenRefreshHandlers = this.tokenRefreshHandlers.filter(h => h !== handler);
  }

  /**
   * Handle foreground notification
   */
  private async handleForegroundMessage(remoteMessage: any): Promise<void> {
    try {
      const message: FCMMessage = {
        messageId: remoteMessage.messageId || '',
        notification: remoteMessage.notification,
        data: remoteMessage.data,
        from: remoteMessage.from,
        sentTime: remoteMessage.sentTime,
        ttl: remoteMessage.ttl,
      };

      // Console log for debugging (visible in Metro/device logs)
      console.log('========================================');
      console.log('📱 FOREGROUND NOTIFICATION RECEIVED');
      console.log('========================================');
      console.log('Message ID:', message.messageId);
      console.log('Title:', message.notification?.title || 'N/A');
      console.log('Body:', message.notification?.body || 'N/A');
      console.log('Data:', JSON.stringify(message.data || {}, null, 2));
      console.log('From:', message.from || 'N/A');
      console.log('Sent Time:', message.sentTime || 'N/A');
      console.log('Full Message:', JSON.stringify(message, null, 2));
      console.log('========================================');

      logger.info('Foreground notification received', {
        messageId: message.messageId,
        title: message.notification?.title,
        body: message.notification?.body,
        data: message.data,
      });

      // Display Toast notification for kiosk mode visibility (always show in-app)
      if (message.notification) {
        Toast.show({
          type: 'info',
          text1: message.notification.title || i18n.t('common.notification'),
          text2: message.notification.body || '',
          visibilityTime: 5000,
          topOffset: 60,
          onPress: () => {
            console.log('📱 Toast notification pressed');
          },
        });
        console.log('✅ Toast notification shown:', {
          title: message.notification.title,
          body: message.notification.body,
        });
      }

      // Display local notification for foreground messages (system notification)
      if (message.notification) {
        await this.displayLocalNotification(message);
      }

      // Call registered handlers
      for (const handler of this.notificationHandlers) {
        try {
          await handler(message);
        } catch (error) {
          logger.error('Notification handler error', {error});
          console.error('❌ Notification handler error:', error);
        }
      }
    } catch (error) {
      logger.error('Failed to handle foreground message', {error});
      console.error('❌ Failed to handle foreground message:', error);
    }
  }

  /**
   * Handle background notification
   */
  private async handleBackgroundMessage(remoteMessage: any): Promise<void> {
    try {
      const message: FCMMessage = {
        messageId: remoteMessage.messageId || '',
        notification: remoteMessage.notification,
        data: remoteMessage.data,
        from: remoteMessage.from,
        sentTime: remoteMessage.sentTime,
        ttl: remoteMessage.ttl,
      };

      // Console log for debugging
      console.log('========================================');
      console.log('📱 BACKGROUND NOTIFICATION RECEIVED');
      console.log('========================================');
      console.log('Message ID:', message.messageId);
      console.log('Title:', message.notification?.title || 'N/A');
      console.log('Body:', message.notification?.body || 'N/A');
      console.log('Data:', JSON.stringify(message.data || {}, null, 2));
      console.log('From:', message.from || 'N/A');
      console.log('Sent Time:', message.sentTime || 'N/A');
      console.log('Full Message:', JSON.stringify(message, null, 2));
      console.log('========================================');

      logger.info('Background notification received', {
        messageId: message.messageId,
        title: message.notification?.title,
        body: message.notification?.body,
        data: message.data,
      });

      // Handle notification data
      if (message.data?.type === 'sync_required' || message.data?.type === 'meeting_updated') {
        console.log('🔄 Triggering sync due to notification type:', message.data.type);
        // Trigger sync when meeting data changes
        await SyncService.syncMeetings();
      }
    } catch (error) {
      logger.error('Failed to handle background message', {error});
      console.error('❌ Failed to handle background message:', error);
    }
  }

  /**
   * Display local notification using Notifee
   */
  private async displayLocalNotification(message: FCMMessage): Promise<void> {
    try {
      if (!message.notification) {
        return;
      }

      const notification: Notification = {
        title: message.notification.title || 'Meeting Update',
        body: message.notification.body || '',
        data: message.data || {},
        android: {
          channelId: 'meeting_updates',
          importance: AndroidImportance.HIGH,
          sound: message.notification.sound || 'default',
          vibrationPattern: [300, 500],
          pressAction: {
            id: 'default',
          },
          // Make notification visible even in kiosk mode
          visibility: 1, // VISIBILITY_PUBLIC
          ongoing: false,
          autoCancel: true,
          // Add heads-up notification for kiosk mode
          style: {
            type: 1, // BIGTEXT
            text: message.notification.body || '',
          },
        },
      };

      await notifee.displayNotification(notification);
      
      console.log('✅ Local notification displayed:', {
        title: notification.title,
        body: notification.body,
        data: notification.data,
      });
      
      logger.info('Local notification displayed', {
        title: notification.title,
        body: notification.body,
        data: notification.data,
      });
    } catch (error) {
      logger.error('Failed to display local notification', {error});
      console.error('❌ Failed to display local notification:', error);
    }
  }

  /**
   * Handle notification opened (user tapped notification)
   */
  private async handleNotificationOpened(remoteMessage: any): Promise<void> {
    try {
      const message: FCMMessage = {
        messageId: remoteMessage.messageId || '',
        notification: remoteMessage.notification,
        data: remoteMessage.data,
        from: remoteMessage.from,
        sentTime: remoteMessage.sentTime,
        ttl: remoteMessage.ttl,
      };

      // Console log for debugging
      console.log('========================================');
      console.log('👆 NOTIFICATION OPENED (TAPPED)');
      console.log('========================================');
      console.log('Message ID:', message.messageId);
      console.log('Title:', message.notification?.title || 'N/A');
      console.log('Body:', message.notification?.body || 'N/A');
      console.log('Data:', JSON.stringify(message.data || {}, null, 2));
      console.log('========================================');

      logger.info('Notification opened', {
        messageId: message.messageId,
        title: message.notification?.title,
        body: message.notification?.body,
        data: message.data,
      });

      // Handle notification data (e.g., navigate to specific screen)
      if (message.data?.type === 'meeting_updated') {
        console.log('🔄 Triggering sync due to notification opened (meeting_updated)');
        // Trigger sync and refresh
        await SyncService.syncMeetings();
      }
    } catch (error) {
      logger.error('Failed to handle notification opened', {error});
      console.error('❌ Failed to handle notification opened:', error);
    }
  }

  /**
   * Initialize FCM service
   */
  async initialize(): Promise<void> {
    try {
      // Request permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        logger.warn('FCM initialization skipped: permissions not granted');
        return;
      }

      // Create notification channel (Android)
      await this.createNotificationChannel();

      // Get and save token
      const token = await this.getToken();
      if (token) {
        logger.info('FCM initialized successfully', {token: token.substring(0, 20) + '...'});
      }

      // Set up foreground message handler
      this.onMessageListener = messaging().onMessage(async remoteMessage => {
        await this.handleForegroundMessage(remoteMessage);
      });

      // Set up notification opened handler
      this.onNotificationOpenedListener = messaging().onNotificationOpenedApp(
        async remoteMessage => {
          await this.handleNotificationOpened(remoteMessage);
        },
      );

      // Check if app was opened from a notification
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        await this.handleNotificationOpened(initialNotification);
      }

      // Set up token refresh handler
      this.onTokenRefreshListener = messaging().onTokenRefresh(async token => {
        logger.info('FCM token refreshed', {token: token.substring(0, 20) + '...'});
        await this.saveToken(token);

        // Call registered handlers
        for (const handler of this.tokenRefreshHandlers) {
          try {
            await handler(token);
          } catch (error) {
            logger.error('Token refresh handler error', {error});
          }
        }
      });
    } catch (error) {
      logger.error('Failed to initialize FCM', {error});
    }
  }

  /**
   * Cleanup FCM listeners
   */
  cleanup(): void {
    if (this.onMessageListener) {
      this.onMessageListener();
      this.onMessageListener = null;
    }

    if (this.onNotificationOpenedListener) {
      this.onNotificationOpenedListener();
      this.onNotificationOpenedListener = null;
    }

    if (this.onTokenRefreshListener) {
      this.onTokenRefreshListener();
      this.onTokenRefreshListener = null;
    }

    this.notificationHandlers = [];
    this.tokenRefreshHandlers = [];
  }
}

// Export singleton instance
export default new FCMServiceClass();

