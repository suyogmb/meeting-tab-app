/**
 * Styles for Sync Button component
 */

import {useTheme} from '../../contexts/ThemeContext';
import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    container: {
      paddingHorizontal: scaleSize(16),
      paddingVertical: scaleSize(12),
      alignItems: 'center',
      // Ensure proper spacing on tablet
    },
    button: {
      minWidth: scaleSize(120),
    },
    lastSyncText: {
      fontSize: scaleSize(12),
      color: themeColors.textSecondary,
      marginTop: scaleSize(8),
    },
  });
};

