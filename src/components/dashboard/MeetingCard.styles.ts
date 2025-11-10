/**
 * Styles for Meeting Card component
 */

import {useTheme} from '../../contexts/ThemeContext';
import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    card: {
      backgroundColor: themeColors.surface,
      borderRadius: scaleSize(16),
      padding: scaleSize(24),
      marginBottom: scaleSize(12),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      justifyContent: 'space-between',
    },
    cardCurrent: {
      backgroundColor:
        typeof themeColors.primary === 'string'
          ? themeColors.primary
          : themeColors.primary?.[50] || '#007AFF',
      padding: scaleSize(32),
      minHeight: scaleSize(220),
      marginBottom: scaleSize(24),
    },
    cardNext: {
      backgroundColor: themeColors.surface,
      padding: scaleSize(12), // Reduced padding for upcoming meetings
      minHeight: scaleSize(90), // Reduced min height for more visibility
      marginBottom: scaleSize(8), // Reduced margin between cards
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scaleSize(12), // Reduced margin for upcoming meetings
    },
    label: {
      fontSize: scaleSize(12),
      fontWeight: 'bold',
      color: themeColors.textSecondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    timeRange: {
      fontSize: scaleSize(16),
      fontWeight: '600',
      color: themeColors.text,
    },
    timeRangeNext: {
      fontSize: scaleSize(12), // Smaller font for upcoming meetings
      fontWeight: '600',
      color: themeColors.text,
    },
    timeRangeCurrent: {
      fontSize: scaleSize(20),
      color: '#FFFFFF',
    },
    title: {
      fontSize: scaleSize(24),
      fontWeight: 'bold',
      color: themeColors.text,
      marginBottom: scaleSize(8),
    },
    titleCurrent: {
      color: '#FFFFFF',
    },
    titleNext: {
      fontSize: scaleSize(18), // Smaller font for upcoming meetings
      fontWeight: '600',
      color: themeColors.text,
      marginBottom: scaleSize(4),
    },
    organizer: {
      fontSize: scaleSize(16),
      color: themeColors.textSecondary,
      marginBottom: scaleSize(8),
    },
    organizerNext: {
      fontSize: scaleSize(12), // Smaller font for upcoming meetings
      color: themeColors.textSecondary,
      marginBottom: scaleSize(4),
    },
    description: {
      fontSize: scaleSize(14),
      color: themeColors.textSecondary,
      marginBottom: scaleSize(12),
      lineHeight: scaleSize(20),
    },
    descriptionNext: {
      fontSize: scaleSize(11), // Smaller font for upcoming meetings
      color: themeColors.textSecondary,
      marginBottom: scaleSize(6),
      lineHeight: scaleSize(16),
    },
    attendees: {
      fontSize: scaleSize(14),
      color: themeColors.textSecondary,
      fontWeight: '500',
    },
    attendeesNext: {
      fontSize: scaleSize(11), // Smaller font for upcoming meetings
      color: themeColors.textSecondary,
      fontWeight: '500',
    },
  });
};

