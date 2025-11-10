/**
 * ViewModel for First Run Setup screen.
 * Manages form state, validation, and setup workflow.
 */

import {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AdminAuthService from '../../services/auth/AdminAuth';
import DatabaseService from '../../database/DatabaseService';
import StorageService from '../../utils/StorageService';
import KioskService from '../../services/kiosk/KioskService';
import FCMService from '../../services/fcm/FCMService';
import {logger} from '../../utils/SecureLogger';
import {RootStackNavigationProp, Routes} from '../../types/navigation';

type FormErrors = {
  roomId?: string;
  roomName?: string;
  adminPassword?: string;
  confirmPassword?: string;
};

type FirstRunSetupViewModelReturn = {
  t: ReturnType<typeof useTranslation>['t'];
  roomId: string;
  roomName: string;
  adminPassword: string;
  confirmPassword: string;
  errors: FormErrors;
  isLoading: boolean;
  currentStep: number;
  totalSteps: number;
  isStepOne: boolean;
  onChangeRoomId: (value: string) => void;
  onChangeRoomName: (value: string) => void;
  onChangeAdminPassword: (value: string) => void;
  onChangeConfirmPassword: (value: string) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  handleSetup: () => Promise<void>;
};

const useFirstRunSetupViewModel = (): FirstRunSetupViewModelReturn => {
  const {t} = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp>();

  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const totalSteps = 2;

  const validateRoomInfo = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!roomId.trim()) {
      newErrors.roomId = t('firstRun.validation.roomIdRequired');
    }

    if (!roomName.trim()) {
      newErrors.roomName = t('firstRun.validation.roomNameRequired');
    }

    setErrors((prev) => ({
      ...prev,
      roomId: newErrors.roomId,
      roomName: newErrors.roomName,
    }));

    return Object.keys(newErrors).length === 0;
  }, [roomId, roomName, t]);

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
    const roomInfoValid = validateRoomInfo();
    const passwordValid = validatePasswords();

    if (!roomInfoValid) {
      setCurrentStep(1);
    }

    if (!roomInfoValid || !passwordValid) {
      return;
    }

    setIsLoading(true);

    try {
      await DatabaseService.initialize();

      await StorageService.storeItem(
        StorageService.storageKeys.roomInfo,
        {
          roomId: roomId.trim(),
          roomName: roomName.trim(),
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
        expected: {roomId: roomId.trim(), roomName: roomName.trim()},
      });

      if (!savedRoomInfo?.roomId) {
        logger.error('Room info verification failed', {savedRoomInfo});
        throw new Error(t('firstRun.validation.saveRoomConfigurationFailed'));
      }

      try {
        await KioskService.startLockTask();
      } catch (kioskError) {
        logger.warn('Failed to start kiosk mode', {error: kioskError});
      }

      try {
        await FCMService.subscribeToRoom(roomId.trim());
        logger.info('Subscribed to FCM room topic', {roomId: roomId.trim()});
      } catch (subscriptionError) {
        logger.warn('Failed to subscribe to FCM room topic', {
          error: subscriptionError,
        });
      }

      logger.info('First run setup completed', {
        roomId: roomId.trim(),
        roomName: roomName.trim(),
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
    roomName,
    t,
    validatePasswords,
    validateRoomInfo,
  ]);

  const onChangeRoomId = useCallback((value: string) => {
    setRoomId(value);
  }, []);

  const onChangeRoomName = useCallback((value: string) => {
    setRoomName(value);
  }, []);

  const onChangeAdminPassword = useCallback((value: string) => {
    setAdminPassword(value);
  }, []);

  const onChangeConfirmPassword = useCallback((value: string) => {
    setConfirmPassword(value);
  }, []);

  const goToNextStep = useCallback(() => {
    if (validateRoomInfo()) {
      setCurrentStep(2);
    }
  }, [validateRoomInfo]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep(1);
  }, []);

  const isStepOne = useMemo(() => currentStep === 1, [currentStep]);

  return {
    t,
    roomId,
    roomName,
    adminPassword,
    confirmPassword,
    errors,
    isLoading,
    currentStep,
    totalSteps,
    isStepOne,
    onChangeRoomId,
    onChangeRoomName,
    onChangeAdminPassword,
    onChangeConfirmPassword,
    goToNextStep,
    goToPreviousStep,
    handleSetup,
  };
};

export default useFirstRunSetupViewModel;
