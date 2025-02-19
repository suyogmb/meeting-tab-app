import {StyleSheet} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    text: {
      textAlign: 'center',
      color: themeColors.text,
    },
    subText: {
      color: themeColors.text,
      marginBottom: 8,
    },
    dashboardFlatListSeparator: {
      height: 0.8,
      width: '100%',
      backgroundColor: themeColors.primary[10],
      marginTop: 10,
      marginBottom: 10,
    },
    listView: {
      flexDirection: 'row',
    },
    image: {
      height: 100,
      width: 100,
      marginRight: 8,
      borderRadius: 6,
    },

    safeView: {
      flex: 1,
    },
    listMain: {
      margin: 16,
      marginTop: 40,
    },
    detailsPageImage: {
      width: '100%',
      height: 300,
      borderBottomRightRadius: 40,
      borderBottomLeftRadius: 40,
      marginBottom: 16,
    },
    mainView: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    mainSubView: {
      flex: 1,
    },
    detailTextView: {
      marginHorizontal: 16,
    },
    btnStyle: {
      marginTop: 16,
    },
  });
};
