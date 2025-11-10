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
      paddingVertical: scaleSize(8), // Add some vertical padding
      paddingBottom: scaleSize(16), // Extra padding at bottom
    },
    touchableContainer: {
      width: '100%',
      minHeight: 120, // Minimum height for collapsed state
      marginBottom: scaleSize(20), // Gap between cards to make them look separate
    },
    touchableContainerExpanded: {
      minHeight: 200, // Minimum height when expanded (will grow based on content)
    },
    card: {
      backgroundColor: 'rgba(61, 61, 92, 0.7)', // Semi-transparent background for cards
      borderRadius: scaleSize(12),
      padding: scaleSize(20),
      minHeight: 120, // Minimum height for collapsed state
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
      width: '100%',
    },
    cardExpanded: {
      minHeight: 200, // Expanded minimum height
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: scaleSize(8),
    },
    title: {
      fontSize: scaleSize(18),
      fontWeight: '600',
      fontFamily: fontFamily.semiBold, // Poppins SemiBold
      color: '#FFFFFF',
      flex: 1,
      textAlign: 'left',
    },
    expandIndicator: {
      fontSize: scaleSize(24),
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginLeft: scaleSize(12),
    },
    time: {
      fontSize: scaleSize(14),
      fontWeight: '600',
      fontFamily: fontFamily.semiBold, // Poppins SemiBold
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: scaleSize(12),
      textAlign: 'left',
    },
    expandedContent: {
      width: '100%',
      marginTop: scaleSize(8),
      paddingTop: scaleSize(12),
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    detailRow: {
      flexDirection: 'row',
      marginBottom: scaleSize(10),
      flexWrap: 'wrap',
    },
    detailLabel: {
      fontSize: scaleSize(14),
      fontWeight: '600',
      fontFamily: fontFamily.semiBold,
      color: 'rgba(255, 255, 255, 0.9)',
      marginRight: scaleSize(8),
    },
    detailValue: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.regular,
      color: 'rgba(255, 255, 255, 0.8)',
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: scaleSize(32),
    },
    emptyText: {
      fontSize: scaleSize(16),
      color: '#FFFFFF',
      textAlign: 'center',
    },
  });
};

