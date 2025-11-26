/**
 * Error Display Component
 * Reusable component for displaying errors with retry functionality
 */

import React from 'react';
import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
import Text from './Text';
import {useStyles} from './ErrorDisplay.styles';
import {useTranslation} from 'react-i18next';
import {useNetwork} from '../contexts/NetworkContext';

export interface ErrorDisplayProps {
  error: string | Error | null;
  onRetry?: () => void | Promise<void>;
  retryLabel?: string;
  showRetry?: boolean;
  compact?: boolean;
  title?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  retryLabel,
  showRetry = true,
  compact = false,
  title,
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {isOnline} = useNetwork();
  const [isRetrying, setIsRetrying] = React.useState(false);

  if (!error) {
    return null;
  }

  const errorMessage =
    error instanceof Error ? error.message : error || t('common.unknownError');

  // Determine error type for better messaging
  const isNetworkError =
    errorMessage.includes('offline') ||
    errorMessage.includes('network') ||
    errorMessage.includes('connection');

  const handleRetry = async () => {
    if (!onRetry || isRetrying) {
      return;
    }

    try {
      setIsRetrying(true);
      await onRetry();
    } catch (retryError) {
      // Error handled by onRetry
    } finally {
      setIsRetrying(false);
    }
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactErrorText}>{errorMessage}</Text>
        {showRetry && onRetry && (
          <TouchableOpacity
            style={styles.compactRetryButton}
            onPress={handleRetry}
            disabled={isRetrying || !isOnline}>
            {isRetrying ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.compactRetryText}>
                {retryLabel || t('common.retry')}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.errorContent}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{errorMessage}</Text>
        {isNetworkError && !isOnline && (
          <Text style={styles.hintText}>
            {t('error.networkHint')}
          </Text>
        )}
      </View>
      {showRetry && onRetry && (
        <TouchableOpacity
          style={[
            styles.retryButton,
            (!isOnline || isRetrying) && styles.retryButtonDisabled,
          ]}
          onPress={handleRetry}
          disabled={isRetrying || !isOnline}
          activeOpacity={0.7}>
          {isRetrying ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.retryButtonText}>
              {retryLabel || t('common.retry')}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorDisplay;

