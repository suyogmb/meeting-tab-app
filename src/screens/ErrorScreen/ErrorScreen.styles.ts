import {StyleSheet} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      backgroundColor: themeColors.background,
    },
    message: {
      color: themeColors.text,
      textAlign: 'center',
    },
  });
};

