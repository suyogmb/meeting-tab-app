/**
 * Styles for Enhanced Sync Status component
 */

import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';
import {fontFamily} from '../../utils/FontUtils';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      padding: scaleSize(20),
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: scaleSize(8),
      marginBottom: scaleSize(15),
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scaleSize(16),
    },
    sectionTitle: {
      fontSize: scaleSize(18),
      fontFamily: fontFamily.semiBold,
      color: '#333',
      flex: 1,
    },
    syncButton: {
      backgroundColor: '#38B8B3',
      width: scaleSize(40),
      height: scaleSize(40),
      borderRadius: scaleSize(20),
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#38B8B3',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    syncButtonDisabled: {
      backgroundColor: 'rgba(56, 184, 179, 0.4)',
      shadowOpacity: 0.1,
      elevation: 2,
    },
    statusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scaleSize(12),
      paddingVertical: scaleSize(4),
    },
    label: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.regular,
      color: '#666',
      flex: 1,
    },
    value: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.regular,
      color: '#333',
      textAlign: 'right',
    },
    warningValue: {
      color: '#FF9800',
      fontFamily: fontFamily.semiBold,
    },
    valueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scaleSize(8),
    },
    statusIndicator: {
      width: scaleSize(10),
      height: scaleSize(10),
      borderRadius: scaleSize(5),
    },
  });
};

