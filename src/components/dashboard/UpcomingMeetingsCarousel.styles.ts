/**
 * Styles for Upcoming Meetings List component
 */

import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';
import {fontFamily} from '../../utils/FontUtils';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    },
    listContent: {
      paddingVertical: scaleSize(8),
      paddingBottom: scaleSize(16),
    },
    card: {
      backgroundColor: 'rgba(255,255,255,0.15)', // Semi-transparent background for cards
      borderRadius: scaleSize(12),
      padding: scaleSize(15),
      marginBottom: scaleSize(20), // Gap between cards
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '100%',
    },
    row1: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    title: {
      fontSize: scaleSize(18),
      fontFamily: fontFamily.semiBold,
      color: '#FFFFFF',
      flex: 1,
      textAlign: 'left',
    },
    date: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.regular,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'right',
    },
    row2: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scaleSize(8),

    },
    detailValue: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.regular,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: scaleSize(32),
    },
    emptyText: {
      fontSize: scaleSize(16),
      fontFamily: fontFamily.regular,
      color: '#FFFFFF',
      textAlign: 'center',
    },
  });
};

