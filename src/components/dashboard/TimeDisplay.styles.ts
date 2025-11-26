/**
 * Styles for Time Display component
 */

import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';
import {fontFamily} from '../../utils/FontUtils';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingLeft: scaleSize(20),
      paddingRight: scaleSize(16),
      paddingTop: scaleSize(32),
      paddingBottom: scaleSize(16),
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: scaleSize(8),
    },
    time: {
      fontSize: scaleSize(64),
      fontFamily: fontFamily.bold,
      color: '#FFFFFF', // White text as per image
      lineHeight: scaleSize(72),
    },
    timePeriod: {
      fontSize: scaleSize(24), // Smaller size for superscript effect
      fontFamily: fontFamily.regular,
      color: '#FFFFFF', // White text as per image
      marginLeft: scaleSize(4),
      marginTop: scaleSize(8), // Positioned higher for superscript effect
      lineHeight: scaleSize(28),
    },
    date: {
      fontSize: scaleSize(18),
      fontFamily: fontFamily.regular,
      color: '#FFFFFF', // White text as per image
    },
  });
};

