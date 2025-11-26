/**
 * Styles for Meeting Card component
 */

import {useTheme} from '../../contexts/ThemeContext';
import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';
import {fontFamily} from '../../utils/FontUtils';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    card: {
      backgroundColor: themeColors.surface,
      borderRadius: scaleSize(16),
      padding: scaleSize(24),
      minHeight: scaleSize(300),
      justifyContent: 'space-between',
    },
    cardCurrent: {
      backgroundColor: '#7133AE', // Vibrant purple color
      padding: 0,
      paddingLeft: scaleSize(30), // Generous left padding (20-30px)
      paddingRight: scaleSize(20), // Right padding for spacing
      paddingTop: scaleSize(20),
      paddingBottom: scaleSize(20),
      minHeight: scaleSize(300),
      borderRadius: scaleSize(16), // Subtly rounded corners
    },
    cardNext: {
      backgroundColor: "#38B8B3",
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
      fontFamily: fontFamily.bold,
      color: themeColors.textSecondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    timeRange: {
      fontSize: scaleSize(16),
      fontFamily: fontFamily.semiBold,
      color: themeColors.text,
    },
    timeRangeNext: {
      fontSize: scaleSize(12), // Smaller font for upcoming meetings
      fontFamily: fontFamily.semiBold,
      color: themeColors.text,
    },
    timeRangeCurrent: {
      fontSize: scaleSize(20),
      fontFamily: fontFamily.regular,
      color: '#FFFFFF',
    },
    title: {
      fontSize: scaleSize(24),
      fontFamily: fontFamily.bold,
      color: themeColors.text,
      marginBottom: scaleSize(8),
    },
    titleCurrent: {
      color: '#FFFFFF',
    },
    titleNext: {
      fontSize: scaleSize(18), // Smaller font for upcoming meetings
      fontFamily: fontFamily.semiBold,
      color: themeColors.text,
      marginBottom: scaleSize(4),
    },
    organizer: {
      fontSize: scaleSize(16),
      fontFamily: fontFamily.regular,
      color: themeColors.textSecondary,
      marginBottom: scaleSize(8),
    },
    organizerNext: {
      fontSize: scaleSize(12), // Smaller font for upcoming meetings
      fontFamily: fontFamily.regular,
      color: themeColors.textSecondary,
      marginBottom: scaleSize(4),
    },
    description: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.regular,
      color: themeColors.textSecondary,
      marginBottom: scaleSize(12),
      lineHeight: scaleSize(20),
    },
    descriptionNext: {
      fontSize: scaleSize(11), // Smaller font for upcoming meetings
      fontFamily: fontFamily.regular,
      color: themeColors.textSecondary,
      marginBottom: scaleSize(6),
      lineHeight: scaleSize(16),
    },
    attendees: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.medium,
      color: themeColors.textSecondary,
    },
    attendeesNext: {
      fontSize: scaleSize(11), // Smaller font for upcoming meetings
      fontFamily: fontFamily.medium,
      color: themeColors.textSecondary,
    },
    // New styles for ongoing meeting card
    inMeetingLabel: {
      fontSize: scaleSize(30), // Large font size
      fontFamily: fontFamily.bold,
      color: '#FFFFFF',
      marginBottom: scaleSize(8), // Reduced margin below
      lineHeight: scaleSize(38), // Add lineHeight to prevent text clipping (1.2x fontSize)
    },
    divider: {
      height: 1,
      backgroundColor: '#FFFFFF',
      marginTop: 0, // No spacing above
      marginBottom: scaleSize(16), // Spacing below
      width: '95%', // Almost full width with padding on sides
      alignSelf: 'flex-start', // Left-aligned
    },
    fieldLabel: {
      fontSize: scaleSize(14), // Smaller font size
      fontFamily: fontFamily.regular,
      color: '#FFFFFF',
      marginBottom: scaleSize(4), // Small margin below
      opacity: 0.9, // Slightly transparent
    },
    meetingTitle: {
      fontSize: scaleSize(20), // Larger than label
      fontFamily: fontFamily.semiBold,
      color: '#FFFFFF',
      marginBottom: scaleSize(16), // Noticeable margin below
    },
    timeValue: {
      fontSize: scaleSize(16), // Larger than label
      fontFamily: fontFamily.regular,
      color: '#FFFFFF',
      marginBottom: scaleSize(16), // Noticeable margin below
    },
    organizerValue: {
      fontSize: scaleSize(16), // Larger than label
      fontFamily: fontFamily.regular,
      color: '#FFFFFF',
    },
  });
};

