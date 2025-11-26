import {StyleSheet} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {fontFamily} from '../../utils/FontUtils';
import {scaleSize} from '../../utils/SizeUtility';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: scaleSize(24),
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: scaleSize(24),
    },
    errorIcon: {
      fontSize: scaleSize(60),
      marginBottom: scaleSize(16),
    },
    title: {
      fontSize: scaleSize(24),
      fontFamily: fontFamily.bold,
      color: themeColors.text,
      textAlign: 'center',
    },
    messageContainer: {
      backgroundColor: 'rgba(255, 59, 48, 0.1)',
      borderRadius: scaleSize(12),
      padding: scaleSize(20),
      marginBottom: scaleSize(24),
      width: '100%',
      maxWidth: scaleSize(500),
    },
    message: {
      fontSize: scaleSize(16),
      fontFamily: fontFamily.regular,
      color: themeColors.text,
      textAlign: 'center',
      lineHeight: scaleSize(24),
    },
    countdownContainer: {
      backgroundColor: 'rgba(255, 149, 0, 0.1)',
      borderRadius: scaleSize(8),
      padding: scaleSize(16),
      marginBottom: scaleSize(24),
      alignItems: 'center',
      width: '100%',
      maxWidth: scaleSize(500),
    },
    countdownText: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.medium,
      color: '#FF9500',
      marginBottom: scaleSize(8),
    },
    cancelButton: {
      paddingVertical: scaleSize(6),
      paddingHorizontal: scaleSize(12),
    },
    cancelButtonText: {
      fontSize: scaleSize(12),
      fontFamily: fontFamily.regular,
      color: '#FF9500',
      textDecorationLine: 'underline',
    },
    loadingContainer: {
      alignItems: 'center',
      marginBottom: scaleSize(24),
    },
    loadingText: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.regular,
      color: themeColors.text,
      marginTop: scaleSize(12),
    },
    actionsContainer: {
      width: '100%',
      maxWidth: scaleSize(500),
      marginBottom: scaleSize(24),
    },
    primaryButton: {
      backgroundColor: '#007AFF',
      paddingVertical: scaleSize(16),
      paddingHorizontal: scaleSize(32),
      borderRadius: scaleSize(12),
      marginBottom: scaleSize(16),
      width: '100%',
    },
    primaryButtonText: {
      fontSize: scaleSize(16),
      fontFamily: fontFamily.semiBold,
      color: '#FFFFFF',
      textAlign: 'center',
    },
    secondaryActions: {
      gap: scaleSize(12),
    },
    secondaryButton: {
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
      paddingVertical: scaleSize(12),
      paddingHorizontal: scaleSize(20),
      borderRadius: scaleSize(8),
      borderWidth: 1,
      borderColor: 'rgba(0, 122, 255, 0.3)',
    },
    secondaryButtonText: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.medium,
      color: '#007AFF',
      textAlign: 'center',
    },
    dangerButton: {
      backgroundColor: 'rgba(255, 59, 48, 0.1)',
      borderColor: 'rgba(255, 59, 48, 0.3)',
    },
    dangerText: {
      color: '#FF3B30',
    },
    detailsContainer: {
      width: '100%',
      maxWidth: scaleSize(500),
      marginTop: scaleSize(24),
    },
    detailsToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: scaleSize(12),
      gap: scaleSize(8),
    },
    detailsToggleText: {
      fontSize: scaleSize(12),
      fontFamily: fontFamily.regular,
      color: themeColors.text,
      opacity: 0.6,
    },
    detailsToggleIcon: {
      fontSize: scaleSize(10),
      color: themeColors.text,
      opacity: 0.6,
    },
    stackContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: scaleSize(8),
      padding: scaleSize(12),
      marginTop: scaleSize(12),
    },
    stackText: {
      fontSize: scaleSize(10),
      fontFamily: fontFamily.regular,
      color: themeColors.text,
      opacity: 0.7,
      lineHeight: scaleSize(14),
    },
  });
};

