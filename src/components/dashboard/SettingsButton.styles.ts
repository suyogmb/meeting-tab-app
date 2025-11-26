/**
 * Styles for Settings Button component
 */

import {useTheme} from '../../contexts/ThemeContext';
import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    container: {
      width: scaleSize(48),
      height: scaleSize(48),
      borderRadius: scaleSize(24),
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
    },
    gearIcon: {
      fontSize: scaleSize(28),
    },
  });
};

