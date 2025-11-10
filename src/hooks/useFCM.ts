/**
 * Custom hook for FCM functionality
 * Provides easy access to FCM token and subscription methods
 */

import {useState, useEffect, useCallback} from 'react';
import FCMService from '../services/fcm/FCMService';
import {logger} from '../utils/SecureLogger';
import StorageService from '../utils/StorageService';
import i18n from '../language/i18n';

interface UseFCMReturn {
  fcmToken: string | null;
  isLoading: boolean;
  error: string | null;
  refreshToken: () => Promise<void>;
  subscribeToRoom: (roomId: string) => Promise<void>;
  unsubscribeFromRoom: (roomId: string) => Promise<void>;
}

/**
 * Hook to manage FCM token and room subscriptions
 */
export function useFCM(): UseFCMReturn {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load FCM token
   */
  const loadToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to get saved token first
      let token = await FCMService.getSavedToken();

      // If no saved token, get new token
      if (!token) {
        token = await FCMService.getToken();
      }

      setFcmToken(token);
    } catch (err) {
      const fallbackMessage = i18n.t('fcm.error.tokenLoad');
      const errorMessage = err instanceof Error ? err.message : fallbackMessage;
      logger.error('Failed to load FCM token', { error: err });
      setError(fallbackMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh FCM token
   */
  const refreshToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await FCMService.getToken();
      setFcmToken(token);
    } catch (err) {
      const fallbackMessage = i18n.t('fcm.error.tokenRefresh');
      const errorMessage = err instanceof Error ? err.message : fallbackMessage;
      logger.error('Failed to refresh FCM token', { error: err });
      setError(fallbackMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Subscribe to room topic
   */
  const subscribeToRoom = useCallback(async (roomId: string) => {
    try {
      await FCMService.subscribeToRoom(roomId);
      logger.info('Subscribed to room topic', { roomId });
    } catch (err) {
      logger.error('Failed to subscribe to room topic', { error: err, roomId });
      throw err;
    }
  }, []);

  /**
   * Unsubscribe from room topic
   */
  const unsubscribeFromRoom = useCallback(async (roomId: string) => {
    try {
      await FCMService.unsubscribeFromRoom(roomId);
      logger.info('Unsubscribed from room topic', { roomId });
    } catch (err) {
      logger.error('Failed to unsubscribe from room topic', { error: err, roomId });
      throw err;
    }
  }, []);

  // Load token on mount
  useEffect(() => {
    loadToken();

    // Register token refresh handler
    const handleTokenRefresh = async (token: string) => {
      setFcmToken(token);
      logger.info('FCM token refreshed via hook', { token: token.substring(0, 20) + '...' });
    };

    FCMService.registerTokenRefreshHandler(handleTokenRefresh);

    return () => {
      FCMService.unregisterTokenRefreshHandler(handleTokenRefresh);
    };
  }, [loadToken]);

  return {
    fcmToken,
    isLoading,
    error,
    refreshToken,
    subscribeToRoom,
    unsubscribeFromRoom,
  };
}

