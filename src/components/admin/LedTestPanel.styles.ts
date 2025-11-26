/**
 * Styles for LED Test Panel component
 */

import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';
import {fontFamily} from '../../utils/FontUtils';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      width: '100%',
      maxWidth: 500,
      padding: scaleSize(20),
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: scaleSize(8),
    },
    title: {
      fontSize: scaleSize(20),
      fontFamily: fontFamily.semiBold,
      color: '#333',
      marginBottom: scaleSize(8),
      textAlign: 'center',
    },
    subtitle: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.regular,
      color: '#666',
      marginBottom: scaleSize(12),
      textAlign: 'center',
    },
    infoBox: {
      backgroundColor: '#FFF3CD',
      padding: scaleSize(12),
      borderRadius: scaleSize(8),
      marginBottom: scaleSize(24),
      borderWidth: 1,
      borderColor: '#FFC107',
    },
    infoText: {
      fontSize: scaleSize(12),
      fontFamily: fontFamily.regular,
      color: '#856404',
      textAlign: 'center',
      lineHeight: scaleSize(18),
    },
    buttonContainer: {
      gap: scaleSize(16),
      marginBottom: scaleSize(24),
    },
    ledButton: {
      paddingVertical: scaleSize(16),
      paddingHorizontal: scaleSize(24),
      borderRadius: scaleSize(8),
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: scaleSize(52),
    },
    ledButtonOff: {
      backgroundColor: '#666666',
    },
    ledButtonRed: {
      backgroundColor: '#F44336',
    },
    ledButtonBlue: {
      backgroundColor: '#2196F3',
    },
    ledButtonYellow: {
      backgroundColor: '#FFC107',
    },
    ledButtonText: {
      fontSize: scaleSize(16),
      fontFamily: fontFamily.semiBold,
      color: '#FFFFFF',
    },
    backButton: {
      marginTop: scaleSize(16),
      paddingVertical: scaleSize(12),
      paddingHorizontal: scaleSize(24),
      backgroundColor: '#7133AE',
      borderRadius: scaleSize(8),
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButtonText: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.semiBold,
      color: '#FFFFFF',
    },
  });
};

