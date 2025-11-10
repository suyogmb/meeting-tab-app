/**
 * Admin Access Modal
 * Password entry modal for admin authentication
 */

import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Platform,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Text from './Text';
import AdminAuthService from '../services/auth/AdminAuth';
import Toast from 'react-native-toast-message';
import {logger} from '../utils/SecureLogger';
import {useStyles} from './AdminAccessModalStyles';
import {useTheme} from 'contexts/ThemeContext';
import {useTranslation} from 'react-i18next';

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
      onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCardContainer}>
          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={'height'}
            keyboardVerticalOffset={20}>
            <View style={styles.authScrollContent}>
              {/* Title */}
              <View style={styles.titleContainer}>
                <Text style={styles.title} allowFontScaling={false}>
                  {t('adminAccess.title')}
                </Text>
              </View>
              <View style={styles.subtitleContainer}>
                <Text style={styles.subtitle} allowFontScaling={false}>
                  {t('adminAccess.subtitle')}
                </Text>
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>{t('common.password')}</Text>
                <RNTextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t('adminAccess.passwordPlaceholder')}
                  placeholderTextColor={themeColors.inputPlaceholder}
                  secureTextEntry
                  style={[
                    styles.passwordInput,
                    isPasswordFocused && styles.passwordInputFocused,
                  ]}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={handlePasswordSubmit}
                  returnKeyType="done"
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
        </View>
      </View>
    </Modal>
  );
};

export default AdminAccessModal;

