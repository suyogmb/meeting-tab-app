/**
 * Styles for Network Status Bar component
 */

import {StyleSheet, Platform} from 'react-native';
import {scaleSize} from '../utils/SizeUtility';
import {fontFamily} from '../utils/FontUtils';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#FF3B30', // Red color for offline
      zIndex: 9999, // Very high z-index to appear above everything
      paddingTop: Platform.OS === 'android' ? scaleSize(8) : scaleSize(40), // Account for status bar
      paddingBottom: scaleSize(8),
      paddingHorizontal: scaleSize(16),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5, // Android shadow
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: scaleSize(8),
    },
    indicator: {
      width: scaleSize(8),
      height: scaleSize(8),
      borderRadius: scaleSize(4),
      backgroundColor: '#FFFFFF',
    },
    text: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.semiBold,
      color: '#FFFFFF',
      textAlign: 'center',
    },
    connectionType: {
      fontSize: scaleSize(12),
      fontFamily: fontFamily.regular,
      color: '#FFFFFF',
      opacity: 0.8,
    },
  });
};

