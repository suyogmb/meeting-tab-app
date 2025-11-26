/**
 * Android Tablet Meeting Room Kiosk App
 * React Native application for displaying meeting room information on Android tablets
 * 
 * Features:
 * - Kiosk mode (Device Owner + Lock Task Mode)
 * - Offline-first meeting data with local caching
 * - Firebase Cloud Messaging for push notifications
 * - Admin settings modal with password protection
 * - Landscape-optimized dashboard UI
 *
 * @format
 */
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import firebase from '@react-native-firebase/app';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { NetworkProvider } from './src/contexts/NetworkContext';
import LanguageProvider from './src/hocs/LanguageProvider';
import 'react-native-get-random-values';
import RootStackNavigator from 'navigators/RootStackNavigator';
import FCMService from './src/services/fcm/FCMService';
import NotificationHandler from './src/services/fcm/NotificationHandler';
import KioskService from './src/services/kiosk/KioskService';
import BackgroundSyncService from './src/services/sync/BackgroundSyncService';
import CacheExpirationService from './src/services/cache/CacheExpirationService';
import { initializeLogger, logger } from './src/utils/SecureLogger';
import StorageService from './src/utils/StorageService';
import NetworkStatusBar from './src/components/NetworkStatusBar';

function App(): React.JSX.Element {
  useEffect(() => {
    (async () => {
      try {
        await initializeLogger();
        logger.info('Secure logger initialized');

        const defaultApp = firebase.app();
        logger.info('Firebase app configured', {
          name: defaultApp.name,
          projectId: defaultApp.options.projectId,
          applicationId: defaultApp.options.appId,
        });
      } catch (error) {
        logger.error('Firebase default app not initialized', { error });
      }

      // Initialize Analytics
      try {
        const appInstanceId = await analytics().getAppInstanceId();
        await analytics().logEvent('app_open');
        logger.info('App opened', { appInstanceId });
      } catch (error) {
        logger.error('Failed to initialize analytics', { error });
      }

      // Initialize FCM
      try {
        // Register notification handler
        FCMService.registerNotificationHandler(async (message) => {
          await NotificationHandler.processNotification(message);
        });

        // Initialize FCM service
        await FCMService.initialize();

        // Subscribe to room-specific topic if room is configured
        const roomInfo = await StorageService.getItem<{ roomId: string }>(
          StorageService.storageKeys.roomInfo,
          false,
        );
        if (roomInfo?.roomId) {
          await FCMService.subscribeToRoom(roomInfo.roomId);
          logger.info('Subscribed to room topic', { roomId: roomInfo.roomId });
        }

        // Get FCM token for logging/debugging
        const token = await FCMService.getToken();
        if (token) {
          logger.info('FCM token obtained', {
            token: token.substring(0, 20) + '...',
          });
          // Console log for Registration Token
          console.log('=== Registration Token (App Initialization) ===');
          console.log('A unique token string that identifies each client app instance.');
          console.log('Registration Token:', token);
          console.log('==============================================');
        }
      } catch (error) {
        logger.error('Failed to initialize FCM', { error });
      }

      // Initialize Kiosk Mode
      try {
        // Initialize kiosk mode (sets up device admin, lock task, and starts kiosk)
        await KioskService.initializeKioskMode();
        logger.info('Kiosk mode initialization completed');
      } catch (error) {
        logger.error('Failed to initialize kiosk mode', { error });
      }

      // Initialize Background Sync Service
      try {
        await BackgroundSyncService.initialize();
        logger.info('Background sync service initialized');
      } catch (error) {
        logger.error('Failed to initialize background sync service', { error });
      }

      // Initialize Cache Expiration Service
      try {
        await CacheExpirationService.initialize();
        logger.info('Cache expiration service initialized');
      } catch (error) {
        logger.error('Failed to initialize cache expiration service', { error });
      }
    })();

    // Cleanup on unmount
    return () => {
      FCMService.cleanup();
      BackgroundSyncService.stop();
      CacheExpirationService.stop();
    };
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NetworkProvider>
          <LanguageProvider>
            <ThemeProvider>
              <StatusBar hidden backgroundColor="black" barStyle="light-content" />
              <NetworkStatusBar />
              <RootStackNavigator />
           
              <Toast />
            </ThemeProvider>
          </LanguageProvider>
        </NetworkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
