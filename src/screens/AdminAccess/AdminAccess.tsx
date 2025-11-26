/**
 * Admin Access Screen
 * Password entry screen for admin authentication
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Text from '../../components/Text';
import {useStyles} from './AdminAccess.styles';
import TextInputComponent from '../../components/TextInput';
import useAdminAccessViewModel from './AdminAccess.viewmodel';
import EpicoLogo from '../../assets/SVGs/EPICO-Scheduler.svg';
import {scaleSize} from '../../utils/SizeUtility';

const AdminAccess: React.FC = () => {
  const styles = useStyles();
  const {
    t,
    password,
    isLoading,
    onChangePassword,
    handlePasswordSubmit,
    handleGoBack,
  } = useAdminAccessViewModel();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        enabled>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <EpicoLogo width={scaleSize(220)} height={scaleSize(110)} />
          </View>
          <Text style={styles.subtitle}>{t('adminAccess.subtitle')}</Text>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <TextInputComponent
              value={password}
              onChangeText={onChangePassword}
              placeholder={t('adminAccess.passwordPlaceholder')}
              secureTextEntry
              style={styles.passwordInput}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleGoBack}
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
  );
};

export default AdminAccess;

