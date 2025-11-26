/**
 * Styles for Sync Button component
 */

import {useTheme} from '../../contexts/ThemeContext';
import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';
import {fontFamily} from '../../utils/FontUtils';

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
      fontFamily: fontFamily.regular,
      color: themeColors.textSecondary,
      marginTop: scaleSize(8),
    },
  });
};

