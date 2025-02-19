import {StyleSheet} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    logo: {
      flexDirection: 'row',
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 200,
      marginBottom: 40,
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
      marginBottom: 20,
      paddingHorizontal: 10,
      width: '100%',
      marginVertical: 16,
      borderRadius: 8,
    },
    subContainer: {
      margin: 16,
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    btnStyle: {
      marginTop: 40,
    },
  });
};
