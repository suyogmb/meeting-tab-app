import {StyleSheet} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    subText: {
      color: themeColors.text,
      marginBottom: 8,
    },

    safeView: {
      flex: 1,
    },
    mainView: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    mainSubView: {
      flex: 1,
      marginTop: 16,
    },
    detailTextView: {
      marginHorizontal: 16,
    },
    btnStyle: {
      marginTop: 40,
    },
    detailsPageImage: {
      width: '100%',
      height: 300,
      borderBottomRightRadius: 40,
      borderBottomLeftRadius: 40,
      marginBottom: 16,
    },
  });
};
