import {StyleSheet} from 'react-native';
import {moderateScale, screenWidth, verticalScale} from 'utils/Dimensions';
import {M_1, M_10, M_12, M_16, M_8, V_15, V_40} from 'utils/SizeUtility';
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
      marginTop: verticalScale(150),
      marginBottom: V_40,
    },

    input: {
      height: verticalScale(40),
      borderColor: 'gray',
      borderWidth: M_1,
      paddingHorizontal: M_10,
      width: '100%',
      marginVertical: V_15,
      borderRadius: M_8,
      fontSize: M_12,
    },
    subContainer: {
      margin: M_16,
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    btnStyle: {
      marginTop: V_40,
    },
    imageStyle: {
      height: moderateScale(120),
      width: screenWidth * 0.8,
    },
  });
};
