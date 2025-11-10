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
import analytics from '@react-native-firebase/analytics';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from './src/contexts/ThemeContext';
import LanguageProvider from './src/hocs/LanguageProvider';
// import RootStackNavigator from './src/navigators/RootStackNavigator';
import DummyDashboard from './src/screens/DummyDashboard/DummyDashboard';
import 'react-native-get-random-values';
import RootStackNavigator from 'navigators/RootStackNavigator';
import FCMService from './src/services/fcm/FCMService';
import NotificationHandler from './src/services/fcm/NotificationHandler';
import { logger } from './src/utils/SecureLogger';
import StorageService from './src/utils/StorageService';

function App(): React.JSX.Element {
  useEffect(() => {
    // Initialize Analytics
    try {
      (async () => {
        const appInstanceId = await analytics().getAppInstanceId();
        await analytics().logEvent('app_open');
        logger.info('App opened', { appInstanceId });
      })();
    } catch (error) {
      logger.error('Failed to initialize analytics', { error });
    }

    // Initialize FCM
    const initializeFCM = async () => {
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
            token: token.substring(0, 20) + '...' 
          });
        }
      } catch (error) {
        logger.error('Failed to initialize FCM', { error });
      }
    };

    initializeFCM();

    // Cleanup on unmount
    return () => {
      FCMService.cleanup();
    };
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <ThemeProvider>
            <RootStackNavigator />
         
            <Toast />
          </ThemeProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
