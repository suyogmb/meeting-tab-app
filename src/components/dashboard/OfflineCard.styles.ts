/**
 * Styles for Offline Card component
 */

import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';
import {fontFamily} from '../../utils/FontUtils';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: 'rgba(244, 67, 54, 0.2)', // Light red background with transparency
      borderRadius: scaleSize(12),
      padding: scaleSize(20),
      marginTop: scaleSize(20),
      marginLeft: scaleSize(20),
      marginRight: scaleSize(20),
      borderWidth: 1.5,
      borderColor: 'rgba(244, 67, 54, 0.4)', // Subtle red border
      width: '70%',
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: scaleSize(12),
    },
    icon: {
      fontSize: scaleSize(36),
    },
    title: {
      fontSize: scaleSize(18),
      fontFamily: fontFamily.semiBold,
      color: '#F44336',
      textAlign: 'center',
      marginBottom: scaleSize(10),
      letterSpacing: 0.3,
    },
    description: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.regular,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: scaleSize(10),
      lineHeight: scaleSize(20),
      opacity: 0.95,
    },
    hint: {
      fontSize: scaleSize(12),
      fontFamily: fontFamily.regular,
      color: '#FFFFFF',
      textAlign: 'center',
      lineHeight: scaleSize(18),
      opacity: 0.85,
    },
  });
};

