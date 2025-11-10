/**
 * Styles for Time Display component
 */

import {useTheme} from '../../contexts/ThemeContext';
import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    container: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingHorizontal: scaleSize(24),
      paddingTop: scaleSize(24),
      paddingBottom: scaleSize(16),
    },
    time: {
      fontSize: scaleSize(64),
      fontWeight: 'bold',
      color: themeColors.text,
      marginBottom: scaleSize(8),
      lineHeight: scaleSize(72),
    },
    date: {
      fontSize: scaleSize(18),
      color: themeColors.textSecondary,
      fontWeight: '400',
    },
  });
};

