/**
 * ViewModel for Admin Access screen
 * Manages password authentication state and logic
 */

import {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AdminAuthService from '../../services/auth/AdminAuth';
import {logger} from '../../utils/SecureLogger';
import {RootStackNavigationProp, Routes} from '../../types/navigation';

type AdminAccessViewModelReturn = {
  t: ReturnType<typeof useTranslation>['t'];
  password: string;
  isLoading: boolean;
  onChangePassword: (value: string) => void;
  handlePasswordSubmit: () => Promise<void>;
  handleGoBack: () => void;
};

const useAdminAccessViewModel = (): AdminAccessViewModelReturn => {
  const {t} = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp>();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChangePassword = useCallback((value: string) => {
    setPassword(value);
  }, []);

  const handlePasswordSubmit = useCallback(async () => {
    if (!password.trim()) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('adminAccess.toast.missingPassword'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const isValid = await AdminAuthService.verifyAdminPassword(password);
      if (isValid) {
        setPassword('');
        Toast.show({
          type: 'success',
          text1: t('adminAccess.toast.successTitle'),
          text2: t('adminAccess.toast.successMessage'),
        });
        // Navigate to Admin Settings screen
        navigation.navigate(Routes.ADMIN_SETTINGS);
      } else {
        Toast.show({
          type: 'error',
          text1: t('adminAccess.toast.failureTitle'),
          text2: t('adminAccess.toast.failureMessage'),
        });
        setPassword('');
      }
    } catch (error) {
      logger.error('Password verification failed', {error});
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('adminAccess.toast.verificationFailed'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [password, navigation, t]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    t,
    password,
    isLoading,
    onChangePassword,
    handlePasswordSubmit,
    handleGoBack,
  };
};

export default useAdminAccessViewModel;

