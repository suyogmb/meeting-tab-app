/**
 * Styles for Dashboard screen
 * Landscape-optimized split-screen layout
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
      // backgroundColor removed - using background image instead
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    settingsButtonContainer: {
      position: 'absolute',
      bottom: scaleSize(24),
      left: scaleSize(40), // Changed from right to left
      zIndex: 1000, // Ensure it's on top
      // Position on bottom left of the screen
    },
    content: {
      flexDirection: 'row',
      flex: 1,
      // Split screen 50-50% horizontally
    },
    leftPane: {
      width: '50%',
      // backgroundColor removed - using background image instead
      justifyContent: 'flex-start',
      // borderRightWidth removed - no divider line
      // borderRightColor removed - no divider line
    },
    leftPaneContent: {
      flex: 1,
      paddingTop: scaleSize(5), // Small top padding for spacing
      paddingLeft: scaleSize(25),
      paddingRight: scaleSize(0),
      // Horizontal and bottom padding handled by TimeDisplay and RoomInfo components
      // Optional: Add a subtle overlay for text readability if needed
      // backgroundColor: 'rgba(0, 0, 0, 0.2)',
      gap: scaleSize(15),
    },
    rightPane: {
      width: '50%',
      // backgroundColor removed - using background image instead
      padding: scaleSize(35),
      justifyContent: 'flex-start',
    },
    ongoingCardContainer: {
      marginBottom: scaleSize(24),
    },
    upcomingListContainer: {
      flex: 1,
    },
    upcomingCardContainer: {
      flex: 1,
      // Background removed - individual cards will have their own background
    },
    upcomingTitle: {
      fontSize: scaleSize(20),
      fontFamily: fontFamily.bold, // Poppins Bold
      color: '#FFFFFF', // White text for light black background
      marginBottom: scaleSize(16),
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: scaleSize(16),
      flexGrow: 1,
    },
    upcomingMeetingItem: {
      backgroundColor: 'rgba(40, 40, 40, 0.85)', // Light black background for individual cards
      borderRadius: scaleSize(12),
      padding: scaleSize(16),
      marginBottom: scaleSize(12),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    upcomingMeetingTitle: {
      fontSize: scaleSize(16),
      fontFamily: fontFamily.semiBold, // Poppins SemiBold
      color: '#FFFFFF', // White text for light black background
      marginBottom: scaleSize(8),
    },
    upcomingMeetingTime: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.semiBold, // Poppins SemiBold
      color: 'rgba(255, 255, 255, 0.8)', // Slightly transparent white for time
    },
    emptyUpcoming: {
      padding: scaleSize(32),
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyUpcomingText: {
      fontSize: scaleSize(16),
      fontFamily: fontFamily.regular,
      color: themeColors.textSecondary,
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: scaleSize(32),
    },
    loadingText: {
      fontSize: scaleSize(18),
      fontFamily: fontFamily.regular,
      color: themeColors.textSecondary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: scaleSize(32),
    },
    errorText: {
      fontSize: scaleSize(20),
      fontFamily: fontFamily.bold,
      color: themeColors.error || '#FF3B30',
      marginBottom: scaleSize(8),
      textAlign: 'center',
    },
    errorSubtext: {
      fontSize: scaleSize(16),
      fontFamily: fontFamily.regular,
      color: themeColors.textSecondary,
      textAlign: 'center',
    },
    emptyCard: {
      backgroundColor: themeColors.surface,
      borderRadius: scaleSize(16),
      padding: scaleSize(48),
      margin: scaleSize(12),
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: scaleSize(200),
    },
    emptyCardText: {
      fontSize: scaleSize(20),
      fontFamily: fontFamily.regular,
      color: themeColors.textSecondary,
      textAlign: 'center',
    },
  });
};

