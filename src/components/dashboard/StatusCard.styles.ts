/**
 * Styles for Status Card component
 */

import {useTheme} from '../../contexts/ThemeContext';
import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';
import {fontFamily} from '../../utils/FontUtils';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    card: {
      backgroundColor: '#7133AE', // Default available color (greenish)
      borderRadius: scaleSize(16),
      padding: scaleSize(32),
      minHeight: scaleSize(300),
      justifyContent: 'center',
      alignItems: 'center', // Center align for available status
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    cardAvailable: {
      backgroundColor: '#38B8B3', // Greenish tone for available status
      alignItems: 'center', // Center align when available
    },
    cardBusy: {
      backgroundColor: '#FF6B35', // Orange for busy/meeting in progress
      alignItems: 'flex-start', // Left align when busy
    },
    statusText: {
      fontSize: scaleSize(60),
      fontFamily: fontFamily.bold,
      color: '#FFFFFF',
      marginBottom: scaleSize(16),
      lineHeight: scaleSize(56), // Add lineHeight to prevent text clipping
    },
    statusTextCentered: {
      textAlign: 'center', // Center text when available
    },
    timeRangeText: {
      fontSize: scaleSize(30),
      fontFamily: fontFamily.medium,
      color: '#FFFFFF',
    },
    timeRangeTextCentered: {
      textAlign: 'center', // Center text when available
    },
  });
};

