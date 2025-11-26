/**
 * Styles for Sync Status Display component
 */

import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';
import {fontFamily} from '../../utils/FontUtils';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      marginTop: scaleSize(16),
      paddingVertical: scaleSize(8),
      paddingLeft: scaleSize(20),
    },
    label: {
      fontSize: scaleSize(12),
      fontFamily: fontFamily.regular,
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: scaleSize(4),
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaleSize(4),
    },
    statusIndicator: {
      width: scaleSize(8),
      height: scaleSize(8),
      borderRadius: scaleSize(4),
      marginRight: scaleSize(6),
    },
    statusText: {
      fontSize: scaleSize(12),
      fontFamily: fontFamily.regular,
      color: '#FFFFFF',
    },
    timestamp: {
      fontSize: scaleSize(11),
      fontFamily: fontFamily.regular,
      color: 'rgba(255, 255, 255, 0.6)',
    },
    compactContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: scaleSize(5),
      paddingVertical: scaleSize(8),
      paddingLeft: scaleSize(20),
    },
    compactText: {
      fontSize: scaleSize(11),
      fontFamily: fontFamily.regular,
      color: 'rgba(255, 255, 255, 0.7)',
      marginLeft: scaleSize(6),
    },
  });
};

