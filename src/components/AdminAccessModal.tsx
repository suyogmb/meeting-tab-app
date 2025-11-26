/**
 * Admin Access Modal
 * Password entry modal for admin authentication
 */

import React, {useState} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Text from './Text';
import AdminAuthService from '../services/auth/AdminAuth';
import Toast from 'react-native-toast-message';
import {logger} from '../utils/SecureLogger';
import {useStyles} from './AdminAccessModalStyles';
import {useTheme} from 'contexts/ThemeContext';
import {useTranslation} from 'react-i18next';
import TextInputComponent from './TextInput';
interface AdminAccessModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

const AdminAccessModal: React.FC<AdminAccessModalProps> = ({
  visible,
  onClose,
  onAuthenticated,
}) => {
  const styles = useStyles();
  const {themeColors} = useTheme();
  const {t} = useTranslation();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handlePasswordSubmit = async () => {
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
        onAuthenticated();
        Toast.show({
          type: 'success',
          text1: t('adminAccess.toast.successTitle'),
          text2: t('adminAccess.toast.successMessage'),
        });
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
  };

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      onRequestClose={handleClose}>
      <SafeAreaView style={styles.modalOverlay} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.modalCardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          enabled>
          <View style={styles.authScrollContent}>
            {/* Title */}
            <Text style={styles.title}>{t('adminAccess.title')}</Text>
            <Text style={styles.subtitle}>{t('adminAccess.subtitle')}</Text>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <TextInputComponent
                value={password}
                onChangeText={setPassword}
                placeholder={t('adminAccess.passwordPlaceholder')}
                secureTextEntry
                style={styles.passwordInput}
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.cancelButton}
                activeOpacity={0.7}>
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePasswordSubmit}
                disabled={isLoading || !password.trim()}
                style={[
                  styles.submitButton,
                  (isLoading || !password.trim()) && styles.submitButtonDisabled,
                ]}
                activeOpacity={0.8}>
                <Text style={styles.submitButtonText}>
                  {isLoading ? t('common.verifying') : t('common.authenticate')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default AdminAccessModal;
