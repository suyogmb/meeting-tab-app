/**
 * Styles for Room Info component
 */

import {useTheme} from '../../contexts/ThemeContext';
import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    container: {
      paddingHorizontal: scaleSize(24),
      paddingTop: scaleSize(8),
      paddingBottom: scaleSize(8),
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    roomName: {
      fontSize: scaleSize(30),
      fontWeight: '600',
      color: themeColors.text,
      marginBottom: scaleSize(8),
      padding:10
    },
    roomId: {
      fontSize: scaleSize(28),
      fontWeight: 'bold',
      color: themeColors.text,
      lineHeight: scaleSize(56), // Add lineHeight to prevent text clipping
    },
    loading: {
      fontSize: scaleSize(18),
      color: themeColors.textSecondary,
    },
  });
};

