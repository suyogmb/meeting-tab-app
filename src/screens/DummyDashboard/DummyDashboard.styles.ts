/**
 * Styles for Dummy Dashboard Screen
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
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    gradientOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 1,
    },
    settingsButtonContainer: {
      position: 'absolute',
      bottom: scaleSize(24),
      left: scaleSize(24),
      zIndex: 1000,
    },
    content: {
      flexDirection: 'row',
      flex: 1,
      zIndex: 2,
    },
    leftPane: {
      width: '50%',
      justifyContent: 'flex-start',
    },
    leftPaneContent: {
      flex: 1,
      paddingTop: scaleSize(8),
    },
    roomInfoContainer: {
      paddingHorizontal: scaleSize(24),
      paddingTop: scaleSize(8),
      paddingBottom: scaleSize(8),
    },
    roomInfo: {
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    roomName: {
      fontSize: scaleSize(36),
      fontWeight: '600',
      fontFamily: fontFamily.semiBold,
      color: '#FFFFFF',
      marginBottom: scaleSize(12),
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: {width: 0, height: 1},
      textShadowRadius: 3,
    },
    roomId: {
      fontSize: scaleSize(96),
      fontWeight: 'bold',
      fontFamily: fontFamily.bold,
      color: '#FFFFFF',
      lineHeight: scaleSize(108),
      textShadowColor: 'rgba(0, 0, 0, 0.6)',
      textShadowOffset: {width: 0, height: 2},
      textShadowRadius: 4,
    },
    rightPane: {
      width: '50%',
      padding: scaleSize(24),
      justifyContent: 'flex-start',
    },
    ongoingCardContainer: {
      marginBottom: scaleSize(24),
    },
    upcomingListContainer: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: scaleSize(16),
      flexGrow: 1,
    },
    upcomingMeetingItem: {
      backgroundColor: '#3d3d5c', // Background color for individual cards
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
      fontWeight: '600',
      fontFamily: fontFamily.semiBold, // Poppins SemiBold
      color: '#FFFFFF', // White text for light black background
      marginBottom: scaleSize(8),
    },
    upcomingMeetingTime: {
      fontSize: scaleSize(14),
      fontWeight: '600',
      fontFamily: fontFamily.semiBold, // Poppins SemiBold
      color: 'rgba(255, 255, 255, 0.8)', // Slightly transparent white for time
    },
  });
};

