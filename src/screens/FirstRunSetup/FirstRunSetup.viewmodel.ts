/**
 * ViewModel for First Run Setup screen.
 * Manages form state, validation, and setup workflow.
 */

import {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AdminAuthService from '../../services/auth/AdminAuth';
import DatabaseService from '../../database/DatabaseService';
import StorageService from '../../utils/StorageService';
import FCMService from '../../services/fcm/FCMService';
import RoomApiService from '../../services/api/RoomApiService';
import {logger} from '../../utils/SecureLogger';
import {RootStackNavigationProp, Routes} from '../../types/navigation';

type FormErrors = {
  roomId?: string;
  adminPassword?: string;
  confirmPassword?: string;
};

type FirstRunSetupViewModelReturn = {
  t: ReturnType<typeof useTranslation>['t'];
  roomId: string;
  adminPassword: string;
  confirmPassword: string;
  errors: FormErrors;
  isLoading: boolean;
  onChangeRoomId: (value: string) => void;
  onChangeAdminPassword: (value: string) => void;
  onChangeConfirmPassword: (value: string) => void;
  handleSetup: () => Promise<void>;
};

const useFirstRunSetupViewModel = (): FirstRunSetupViewModelReturn => {
  const {t} = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp>();

  const [roomId, setRoomId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validatePasswords = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!adminPassword) {
      newErrors.adminPassword = t('firstRun.validation.passwordRequired');
    } else if (adminPassword.length < 8) {
      newErrors.adminPassword = t('firstRun.validation.passwordLength');
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('firstRun.validation.confirmPasswordRequired');
    } else if (adminPassword !== confirmPassword) {
      newErrors.confirmPassword = t('firstRun.validation.passwordsDoNotMatch');
    }

    setErrors((prev) => ({
      ...prev,
      adminPassword: newErrors.adminPassword,
      confirmPassword: newErrors.confirmPassword,
    }));

    return Object.keys(newErrors).length === 0;
  }, [adminPassword, confirmPassword, t]);

  const handleSetup = useCallback(async () => {
    const trimmedRoomId = roomId.trim();
    const newErrors: FormErrors = {};

    if (!trimmedRoomId) {
      newErrors.roomId = t('firstRun.validation.roomIdRequired');
    }

    const passwordValid = validatePasswords();

    if (Object.keys(newErrors).length > 0 || !passwordValid) {
      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));
      return;
    }

    setIsLoading(true);

    try {
      await DatabaseService.initialize();

      await StorageService.storeItem(
        StorageService.storageKeys.roomInfo,
        {
          roomId: trimmedRoomId,
          roomName: '',
        },
        false,
      );

      await AdminAuthService.setAdminPassword(adminPassword);

      await StorageService.storeItem(
        StorageService.storageKeys.isFirstRunComplete,
        true,
        false,
      );

      const savedRoomInfo = await StorageService.getItem<{
        roomId: string;
        roomName: string;
      }>(StorageService.storageKeys.roomInfo, false);

      logger.info('Room info saved', {
        saved: savedRoomInfo,
        expected: {roomId: trimmedRoomId, roomName: ''},
      });

      if (!savedRoomInfo?.roomId) {
        logger.error('Room info verification failed', {savedRoomInfo});
        throw new Error(t('firstRun.validation.saveRoomConfigurationFailed'));
      }

      // Get FCM token and register with backend
      try {
        // Get FCM token
        const fcmToken = await FCMService.getToken();
        
        if (fcmToken) {
          // Register device token with room code via API
          try {
            await RoomApiService.registerDeviceToken(trimmedRoomId, fcmToken);
            logger.info('Device token registered with backend', {
              roomId: trimmedRoomId,
              tokenLength: fcmToken.length,
            });
          } catch (registrationError) {
            logger.warn('Failed to register device token with backend', {
              error: registrationError,
            });
            // Don't fail setup if token registration fails - continue with FCM subscription
          }
        } else {
          logger.warn('FCM token not available for registration');
        }

        // Subscribe to FCM room topic
        try {
          await FCMService.subscribeToRoom(trimmedRoomId);
          logger.info('Subscribed to FCM room topic', {roomId: trimmedRoomId});
        } catch (subscriptionError) {
          logger.warn('Failed to subscribe to FCM room topic', {
            error: subscriptionError,
          });
        }
      } catch (fcmError) {
        logger.warn('FCM setup failed, continuing with setup', {
          error: fcmError,
        });
        // Don't fail setup if FCM fails - user can still use the app
      }

      logger.info('First run setup completed', {
        roomId: trimmedRoomId,
        roomName: '',
      });

      Toast.show({
        type: 'success',
        text1: t('firstRun.toast.successTitle'),
        text2: t('firstRun.toast.successMessage'),
      });

      await new Promise((resolve) => setTimeout(resolve, 300));

      setTimeout(() => {
        navigation.replace(Routes.DASHBOARD);
      }, 100);
    } catch (error) {
      logger.error('First run setup failed', {error});
      Toast.show({
        type: 'error',
        text1: t('firstRun.toast.errorTitle'),
        text2: error instanceof Error ? error.message : t('common.unknownError'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    adminPassword,
    navigation,
    roomId,
    t,
    validatePasswords,
  ]);

  const onChangeRoomId = useCallback((value: string) => {
    setRoomId(value);
    setErrors((prev) => ({...prev, roomId: undefined}));
  }, []);

  const onChangeAdminPassword = useCallback((value: string) => {
    setAdminPassword(value);
    setErrors((prev) => ({...prev, adminPassword: undefined}));
  }, []);

  const onChangeConfirmPassword = useCallback((value: string) => {
    setConfirmPassword(value);
    setErrors((prev) => ({...prev, confirmPassword: undefined}));
  }, []);

  return {
    t,
    roomId,
    adminPassword,
    confirmPassword,
    errors,
    isLoading,
    onChangeRoomId,
    onChangeAdminPassword,
    onChangeConfirmPassword,
    handleSetup,
  };
};

export default useFirstRunSetupViewModel;
