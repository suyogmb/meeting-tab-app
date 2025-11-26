/**
 * Styles for Error Display component
 */

import {StyleSheet} from 'react-native';
import {scaleSize} from '../utils/SizeUtility';
import {fontFamily} from '../utils/FontUtils';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      padding: scaleSize(20),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      borderRadius: scaleSize(8),
      borderWidth: 1,
      borderColor: 'rgba(244, 67, 54, 0.3)',
    },
    title: {
      fontSize: scaleSize(18),
      fontFamily: fontFamily.semiBold,
      color: '#F44336',
      marginBottom: scaleSize(12),
      textAlign: 'center',
    },
    errorContent: {
      alignItems: 'center',
      marginBottom: scaleSize(16),
    },
    errorIcon: {
      fontSize: scaleSize(32),
      marginBottom: scaleSize(8),
    },
    errorText: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.regular,
      color: '#F44336',
      textAlign: 'center',
      marginBottom: scaleSize(8),
    },
    hintText: {
      fontSize: scaleSize(12),
      fontFamily: fontFamily.regular,
      color: 'rgba(244, 67, 54, 0.7)',
      textAlign: 'center',
      marginTop: scaleSize(4),
    },
    retryButton: {
      backgroundColor: '#7133AE',
      paddingVertical: scaleSize(12),
      paddingHorizontal: scaleSize(24),
      borderRadius: scaleSize(8),
      minWidth: scaleSize(120),
      alignItems: 'center',
      justifyContent: 'center',
    },
    retryButtonDisabled: {
      backgroundColor: 'rgba(113, 51, 174, 0.5)',
      opacity: 0.6,
    },
    retryButtonText: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.semiBold,
      color: '#FFFFFF',
    },
    compactContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: scaleSize(12),
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      borderRadius: scaleSize(6),
      borderWidth: 1,
      borderColor: 'rgba(244, 67, 54, 0.3)',
    },
    compactErrorText: {
      fontSize: scaleSize(12),
      fontFamily: fontFamily.regular,
      color: '#F44336',
      flex: 1,
      marginRight: scaleSize(8),
    },
    compactRetryButton: {
      paddingVertical: scaleSize(6),
      paddingHorizontal: scaleSize(12),
      backgroundColor: '#7133AE',
      borderRadius: scaleSize(6),
      minWidth: scaleSize(60),
      alignItems: 'center',
      justifyContent: 'center',
    },
    compactRetryText: {
      fontSize: scaleSize(12),
      fontFamily: fontFamily.semiBold,
      color: '#FFFFFF',
    },
  });
};

