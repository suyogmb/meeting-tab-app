/**
 * Styles for Status Card component
 */

import {useTheme} from '../../contexts/ThemeContext';
import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    card: {
      backgroundColor: '#7133AE', // Primary color for available
      borderRadius: scaleSize(16),
      paddingTop: scaleSize(40),
      paddingBottom: scaleSize(40),
      paddingHorizontal: scaleSize(48),
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
      backgroundColor: '#7133AE', // Primary color #7133AE
      alignItems: 'center', // Center align when available
    },
    cardBusy: {
      backgroundColor: '#FF6B35', // Orange for busy/meeting in progress
      alignItems: 'flex-start', // Left align when busy
    },
    statusText: {
      fontSize: scaleSize(60),
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: scaleSize(16),
      lineHeight: scaleSize(56), // Add lineHeight to prevent text clipping
    },
    statusTextCentered: {
      textAlign: 'center', // Center text when available
    },
    timeRangeText: {
      fontSize: scaleSize(30),
      color: '#FFFFFF',
      fontWeight: '500',
    },
    timeRangeTextCentered: {
      textAlign: 'center', // Center text when available
    },
  });
};

