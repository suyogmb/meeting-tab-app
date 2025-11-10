/**
 * Background Message Handler
 * This file must be imported in index.js for React Native to register it
 * Handles FCM messages when app is in background or terminated state
 */

import messaging from '@react-native-firebase/messaging';
import { logger } from '../../utils/SecureLogger';
import NotificationHandler from './NotificationHandler';
import { FCMMessage } from '../../types/notification';

/**
 * Background message handler
 * Called when app is in background or terminated state
 * Must be registered before rendering the app (in index.js)
 */
messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    const message: FCMMessage = {
      messageId: remoteMessage.messageId || '',
      notification: remoteMessage.notification,
      data: remoteMessage.data as Record<string, string> | undefined,
      from: remoteMessage.from,
      sentTime: remoteMessage.sentTime,
      ttl: remoteMessage.ttl,
    };

    // Console log for debugging
    console.log('========================================');
    console.log('📱 BACKGROUND MESSAGE HANDLER TRIGGERED');
    console.log('========================================');
    console.log('Message ID:', message.messageId);
    console.log('Title:', message.notification?.title || 'N/A');
    console.log('Body:', message.notification?.body || 'N/A');
    console.log('Data:', JSON.stringify(message.data || {}, null, 2));
    console.log('From:', message.from || 'N/A');
    console.log('Full Message:', JSON.stringify(message, null, 2));
    console.log('========================================');

    logger.info('Background message received', {
      messageId: message.messageId,
      title: message.notification?.title,
      body: message.notification?.body,
      data: message.data,
    });

    // Process notification
    await NotificationHandler.processNotification(message);
    
    console.log('✅ Background notification processed successfully');
  } catch (error) {
    logger.error('Failed to handle background message', { error });
    console.error('❌ Failed to handle background message:', error);
  }
});

