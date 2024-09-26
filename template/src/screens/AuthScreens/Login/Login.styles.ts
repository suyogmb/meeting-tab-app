import {StyleSheet} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: themeColors.background,
    },
    logo: {
      height: 60,
      width: 60,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 10,
    },
  });
};
