/**
 * Error Screen with Recovery Options
 * Provides multiple recovery mechanisms for kiosk resilience
 */

import React from 'react';
import {View, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Text from '../../components/Text';
import ReusableButton from '../../components/ReusableButton';
import {RootStackParamList, Routes} from '../../types/navigation';
import {useStyles} from './ErrorScreen.styles';
import useErrorScreenViewModel from './ErrorScreen.viewmodel';
import {useTranslation} from 'react-i18next';

type ErrorScreenProps = {
  route?: RouteProp<RootStackParamList, Routes.ERROR_SCREEN>;
  error?: unknown;
};

const ErrorScreen: React.FC<ErrorScreenProps> = ({route, error}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {
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
  } = useErrorScreenViewModel({
    routeError: route?.params?.error,
    fallbackError: error,
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Error Icon/Title */}
        <View style={styles.headerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.title}>{t('error.title')}</Text>
        </View>

        {/* Error Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{errorMessage}</Text>
        </View>

        {/* Auto-Retry Countdown */}
        {autoRetryCountdown > 0 && !isRetrying && (
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>
              {t('error.autoRetryIn', {seconds: autoRetryCountdown})}
            </Text>
            <TouchableOpacity
              onPress={cancelAutoRetry}
              style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>
                {t('error.cancelAutoRetry')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading Indicator */}
        {isRetrying && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>{t('error.recovering')}</Text>
          </View>
        )}

        {/* Recovery Actions */}
        {!isRetrying && (
          <View style={styles.actionsContainer}>
            {/* Primary Action: Retry */}
            <ReusableButton
              title={t('error.retryButton')}
              onPress={handleRetry}
              style={styles.primaryButton}
              textStyle={styles.primaryButtonText}
            />

            {/* Secondary Actions */}
            <View style={styles.secondaryActions}>
              <TouchableOpacity
                onPress={handleGoToDashboard}
                style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>
                  {t('error.goToDashboard')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClearCache}
                style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>
                  {t('error.clearCache')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleGoToAdmin}
                style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>
                  {t('error.goToAdmin')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleResetApp}
                style={[styles.secondaryButton, styles.dangerButton]}>
                <Text style={[styles.secondaryButtonText, styles.dangerText]}>
                  {t('error.resetApp')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Error Details (Collapsible) */}
        <View style={styles.detailsContainer}>
          <TouchableOpacity onPress={toggleDetails} style={styles.detailsToggle}>
            <Text style={styles.detailsToggleText}>
              {showDetails ? t('error.hideDetails') : t('error.showDetails')}
            </Text>
            <Text style={styles.detailsToggleIcon}>
              {showDetails ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>

          {showDetails && errorStack && (
            <View style={styles.stackContainer}>
              <Text style={styles.stackText}>{errorStack}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ErrorScreen;
