/**
 * Styles for Admin Settings screen
 */

import {useTheme} from '../../contexts/ThemeContext';
import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';
import {fontFamily} from '../../utils/FontUtils';

export const useStyles = () => {
  const {themeColors} = useTheme();
  const isDark = themeColors.background === '#0a0a0f' || themeColors.background === '#000814';
  const neutralText = '#111827';
  const secondaryText = '#4b5563';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: scaleSize(40),
    },
    logoContainer: {
      marginBottom: scaleSize(80),
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    logoContainerReduced: {
      marginBottom: scaleSize(30),
    },
    syncStatusContainer: {
      width: '100%',
      maxWidth: 500,
      marginBottom: scaleSize(24),
    },
    menuContainer: {
      width: '100%',
      maxWidth: 500,
      gap: scaleSize(20),
    },
    menuItem: {
      backgroundColor: '#fff',
      borderRadius: scaleSize(8),
      padding: scaleSize(20),
      borderWidth: 1,
      borderColor: '#ddd',
    },
    menuItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scaleSize(16),
    },
    menuItemTextContainer: {
      flex: 1,
    },
    menuItemTitle: {
      fontSize: scaleSize(18),
      fontFamily: fontFamily.semiBold,
      color: '#333',
      marginBottom: scaleSize(4),
    },
    menuItemSubtitle: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.regular,
      color: '#666',
    },
    menuItemArrow: {
      fontSize: scaleSize(24),
      color: secondaryText,
    },
    dangerText: {
      color: themeColors.error || '#FF3B30',
    },
    cancelButtonContainer: {
      width: '100%',
      maxWidth: 500,
      marginTop: scaleSize(40),
      alignItems: 'center',
    },
    cancelButton: {
      paddingVertical: scaleSize(15),
      paddingHorizontal: scaleSize(40),
      backgroundColor: '#fff',
      borderRadius: scaleSize(8),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
      minWidth: scaleSize(150),
    },
    cancelButtonText: {
      fontSize: scaleSize(16),
      fontFamily: fontFamily.semiBold,
      color: '#333',
    },
    backButton: {
      marginTop: scaleSize(16),
      paddingVertical: scaleSize(12),
      paddingHorizontal: scaleSize(24),
      backgroundColor: '#7133AE',
      borderRadius: scaleSize(8),
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButtonText: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.semiBold,
      color: '#FFFFFF',
    },
  });
};

