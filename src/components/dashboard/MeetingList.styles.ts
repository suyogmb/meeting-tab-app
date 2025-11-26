/**
 * Styles for Meeting List component
 */

import {useTheme} from '../../contexts/ThemeContext';
import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';
import {fontFamily} from '../../utils/FontUtils';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: scaleSize(24),
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent dark overlay
    },
    sectionTitle: {
      fontSize: scaleSize(24),
      fontFamily: fontFamily.bold,
      color: themeColors.text,
      marginBottom: scaleSize(16),
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: scaleSize(16),
    },
    meetingItem: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: scaleSize(8),
      padding: scaleSize(16),
      marginBottom: scaleSize(8),
      marginHorizontal: scaleSize(8),
    },
    meetingItemCurrent: {
      backgroundColor:
        typeof themeColors.primary === 'string'
          ? themeColors.primary
          : themeColors.primary?.[50] || '#007AFF',
      borderLeftColor: '#FFFFFF',
    },
    meetingItemPast: {
      opacity: 0.6,
      borderLeftColor: themeColors.textSecondary,
    },
    meetingItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scaleSize(8),
    },
    meetingTime: {
      fontSize: scaleSize(16),
      fontFamily: fontFamily.semiBold,
      color: '#FFFFFF',
    },
    attendeeCount: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.regular,
      color: 'rgba(255, 255, 255, 0.7)',
    },
    meetingTitle: {
      fontSize: scaleSize(18),
      fontFamily: fontFamily.semiBold,
      color: '#FFFFFF',
      marginBottom: scaleSize(4),
    },
    meetingTitleCurrent: {
      color: '#FFFFFF',
    },
    meetingTitlePast: {
      color: themeColors.textSecondary,
    },
    meetingOrganizer: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.regular,
      color: 'rgba(255, 255, 255, 0.7)',
    },
    meetingOrganizerPast: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: scaleSize(32),
    },
    emptyText: {
      fontSize: scaleSize(18),
      fontFamily: fontFamily.regular,
      color: themeColors.textSecondary,
      textAlign: 'center',
    },
  });
};

