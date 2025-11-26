/**
 * ViewModel for Error Screen
 * Provides error recovery mechanisms for kiosk resilience
 */

import {useState, useEffect, useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import DatabaseService from '../../database/DatabaseService';
import StorageService from '../../utils/StorageService';
import {logger} from '../../utils/SecureLogger';
import {RootStackNavigationProp, Routes} from '../../types/navigation';

type ErrorScreenViewModelParams = {
  routeError?: string | null;
  fallbackError?: unknown;
};

const resolveErrorMessage = (
  routeError: string | null | undefined,
  fallbackError: unknown,
): string | undefined => {
  if (routeError) {
    return routeError;
  }

  if (fallbackError instanceof Error) {
    return fallbackError.message;
  }

  if (typeof fallbackError === 'string') {
    return fallbackError;
  }

  return undefined;
};

const resolveErrorStack = (
  fallbackError: unknown,
): string | undefined => {
  if (fallbackError instanceof Error && fallbackError.stack) {
    return fallbackError.stack;
  }
  return undefined;
};

const useErrorScreenViewModel = ({
  routeError,
  fallbackError,
}: ErrorScreenViewModelParams) => {
  const {t} = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp>();
  
  const [isRetrying, setIsRetrying] = useState(false);
  const [autoRetryCountdown, setAutoRetryCountdown] = useState(10); // Auto-retry in 10 seconds
  const [showDetails, setShowDetails] = useState(false);

  const errorMessage = useMemo(() => {
    const resolved = resolveErrorMessage(routeError, fallbackError);
    return resolved ?? t('common.error');
  }, [fallbackError, routeError, t]);

  const errorStack = useMemo(() => {
    return resolveErrorStack(fallbackError);
  }, [fallbackError]);

  // Auto-retry countdown for kiosk (no user present)
  useEffect(() => {
    if (autoRetryCountdown <= 0) {
      handleRetry();
      return;
    }

    const timer = setTimeout(() => {
      setAutoRetryCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoRetryCountdown]);

  /**
   * Attempt automatic recovery
   */
  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    logger.info('Attempting error recovery', {error: errorMessage});

    try {
      // Attempt 1: Reinitialize database
      try {
        await DatabaseService.initialize();
        logger.info('Database reinitialized successfully');
      } catch (dbError) {
        logger.warn('Database reinit failed, attempting recovery', {error: dbError});
        
        // Attempt 2: Delete and recreate database
        try {
          await DatabaseService.deleteDatabase();
          await DatabaseService.initialize();
          logger.info('Database recreated successfully');
        } catch (recreateError) {
          logger.error('Database recovery failed', {error: recreateError});
        }
      }

      // Navigate back to Dashboard to retry
      Toast.show({
        type: 'info',
        text1: t('error.retrying'),
        text2: t('error.retryMessage'),
      });

      // Small delay for toast to show
      await new Promise(resolve => setTimeout(resolve, 500));

      navigation.replace(Routes.DASHBOARD);
    } catch (error) {
      logger.error('Retry failed', {error});
      Toast.show({
        type: 'error',
        text1: t('error.retryFailed'),
        text2: t('error.retryFailedMessage'),
      });
      
      // Reset countdown for another auto-retry
      setAutoRetryCountdown(30); // Wait 30 seconds before next attempt
    } finally {
      setIsRetrying(false);
    }
  }, [errorMessage, navigation, t]);

  /**
   * Navigate to Dashboard (skip error recovery)
   */
  const handleGoToDashboard = useCallback(() => {
    logger.info('User navigating to Dashboard from error screen');
    navigation.replace(Routes.DASHBOARD);
  }, [navigation]);

  /**
   * Navigate to Admin Access
   */
  const handleGoToAdmin = useCallback(() => {
    logger.info('User navigating to Admin from error screen');
    navigation.navigate(Routes.ADMIN_ACCESS);
  }, [navigation]);

  /**
   * Clear cache and restart
   */
  const handleClearCache = useCallback(async () => {
    try {
      setIsRetrying(true);
      logger.info('Clearing cache from error screen');

      // Clear sync timestamps and cache data (keep room config)
      await StorageService.removeItem(StorageService.storageKeys.lastSyncTimestamp, false);
      await StorageService.removeItem(StorageService.storageKeys.requestQueue, false);

      // Clear and reinitialize database
      await DatabaseService.deleteDatabase();
      await DatabaseService.initialize();

      Toast.show({
        type: 'success',
        text1: t('error.cacheClearedTitle'),
        text2: t('error.cacheClearedMessage'),
      });

      logger.info('Cache cleared successfully');

      // Small delay for toast
      await new Promise(resolve => setTimeout(resolve, 500));

      navigation.replace(Routes.DASHBOARD);
    } catch (error) {
      logger.error('Failed to clear cache', {error});
      Toast.show({
        type: 'error',
        text1: t('error.clearCacheFailed'),
        text2: error instanceof Error ? error.message : t('common.unknownError'),
      });
    } finally {
      setIsRetrying(false);
    }
  }, [navigation, t]);

  /**
   * Reset to FirstRunSetup (nuclear option)
   */
  const handleResetApp = useCallback(async () => {
    try {
      setIsRetrying(true);
      logger.info('Resetting app from error screen');

      // Save deviceId before clearing
      const deviceId = await StorageService.getItem<string>(
        StorageService.storageKeys.deviceId,
        true,
      );

      // Clear all storage
      StorageService.clearLocalStorage();

      // Clear database
      await DatabaseService.deleteDatabase();
      await DatabaseService.initialize();

      // Restore deviceId
      if (deviceId) {
        await StorageService.storeItem(
          StorageService.storageKeys.deviceId,
          deviceId,
          true,
        );
      }

      Toast.show({
        type: 'success',
        text1: t('error.appResetTitle'),
        text2: t('error.appResetMessage'),
      });

      logger.info('App reset successfully');

      // Small delay for toast
      await new Promise(resolve => setTimeout(resolve, 500));

      navigation.reset({
        index: 0,
        routes: [{name: Routes.FIRST_RUN_SETUP}],
      });
    } catch (error) {
      logger.error('Failed to reset app', {error});
      Toast.show({
        type: 'error',
        text1: t('error.resetFailed'),
        text2: error instanceof Error ? error.message : t('common.unknownError'),
      });
    } finally {
      setIsRetrying(false);
    }
  }, [navigation, t]);

  /**
   * Toggle error details visibility
   */
  const toggleDetails = useCallback(() => {
    setShowDetails(prev => !prev);
  }, []);

  /**
   * Cancel auto-retry countdown
   */
  const cancelAutoRetry = useCallback(() => {
    setAutoRetryCountdown(0);
    logger.info('Auto-retry cancelled by user');
  }, []);

  return {
    errorMessage,
    errorStack,
    isRetrying,
    autoRetryCountdown,
    showDetails,
    handleRetry,
    handleGoToDashboard,
    handleGoToAdmin,
    handleClearCache,
    handleResetApp,
    toggleDetails,
    cancelAutoRetry,
  };
};

export default useErrorScreenViewModel;

