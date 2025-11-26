
import { useTheme } from 'contexts/ThemeContext';
import {StyleSheet} from 'react-native';
import { fontFamily } from 'utils/FontUtils';
import { scaleSize } from 'utils/SizeUtility';


export const useStyles = () => {
  const {themeColors} = useTheme();
  const isDark = themeColors.background === '#0a0a0f' || themeColors.background === '#000814';
  const primaryColor =
    (themeColors.primary && (themeColors.primary[50] || themeColors.primary[10])) ||
    '#2563eb';
  const primaryMuted = isDark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.08)';

  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalCardContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f5f5f5',
    },
    container: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
    },
    authScrollContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
      width: '100%',
      backgroundColor: '#f5f5f5',
    },
    titleContainer: {
      width: '100%',
      maxWidth: 500,
      alignItems: 'center',
      marginBottom: 10,
    },
    title: {
      fontSize: 32,
      fontFamily: fontFamily.bold,
      color: '#333',
      padding: 5,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 18,
      fontFamily: fontFamily.regular,
      color: '#666',
      textAlign: 'center',
      marginBottom: 40,
    },
    inputWrapper: {
      width: '100%',
      maxWidth: 500,
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontFamily: fontFamily.regular,
      color: '#333',
      marginBottom: 10,
      paddingLeft: 4,
    },
    passwordInput: {
      backgroundColor: '#fff',
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 8,
      fontSize: 16,
      fontFamily: fontFamily.regular,
      borderWidth: 1,
      borderColor: '#ddd',
      color: 'black',
    },
    passwordInputFocused: {
      borderColor: primaryColor,
      backgroundColor: primaryMuted,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 18,
      width: '100%',
      maxWidth: 500,
      marginTop: 20,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 15,
      backgroundColor: '#fff',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
    },
    cancelButtonText: {
      fontSize: 16,
      fontFamily: fontFamily.semiBold,
      color: '#333',
    },
    submitButton: {
      flex: 1,
      paddingVertical: 15,
      backgroundColor: '#7133AE',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    submitButtonDisabled: {
      opacity: 0.5,
      backgroundColor: '#7133AE',
    },
    submitButtonText: {
      fontSize: 16,
      fontFamily: fontFamily.semiBold,
      color: '#ffffff',
    },
    // Legacy input style for other forms
    input: {
      width: '100%',
      maxWidth: scaleSize(400),
      marginBottom: scaleSize(24),
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: scaleSize(24),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scaleSize(32),
      paddingHorizontal: scaleSize(24),
      paddingTop: scaleSize(24),
    },
    headerTitle: {
      fontSize: scaleSize(28),
      fontWeight: '700',
      color: themeColors.text,
    },
    closeButton: {
      width: scaleSize(40),
      height: scaleSize(40),
      borderRadius: scaleSize(20),
      backgroundColor: themeColors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: scaleSize(24),
      color: themeColors.text,
      fontWeight: 'bold',
    },
    menuContainer: {
      gap: scaleSize(5),
    },
    menuItem: {
      borderRadius: scaleSize(12),
      padding: scaleSize(20)
    },
    menuItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scaleSize(16),
    },
    menuItemIcon: {
      width: scaleSize(48),
      height: scaleSize(48),
      borderRadius: scaleSize(24),
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuItemIconPurple: {
      backgroundColor: isDark ? 'rgba(113, 51, 174, 0.2)' : 'rgba(113, 51, 174, 0.1)',
    },
    dangerMenuItemIcon: {
      backgroundColor: isDark ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 59, 48, 0.1)',
    },
    menuItemIconText: {
      fontSize: scaleSize(24),
    },
    menuItemTextContainer: {
      flex: 1,
    },
    menuItemTitle: {
      fontSize: scaleSize(20),
      fontWeight: 'bold',
      color: themeColors.text,
      marginBottom: scaleSize(4),
    },
    menuItemSubtitle: {
      fontSize: scaleSize(14),
      color: themeColors.textSecondary,
    },
    menuItemArrow: {
      fontSize: scaleSize(24),
      color: themeColors.textSecondary,
    },
    dangerText: {
      color: themeColors.error || '#FF3B30',
    },
    guideContainer: {
      gap: scaleSize(24),
    },
    guideTitle: {
      fontSize: scaleSize(28),
      fontWeight: 'bold',
      color: themeColors.text,
      marginBottom: scaleSize(16),
    },
    guideSection: {
      marginBottom: scaleSize(24),
    },
    guideSectionTitle: {
      fontSize: scaleSize(20),
      fontWeight: 'bold',
      color: themeColors.text,
      marginBottom: scaleSize(8),
    },
    guideText: {
      fontSize: scaleSize(16),
      color: themeColors.textSecondary,
      lineHeight: scaleSize(24),
    },
    backButton: {
      marginTop: scaleSize(16),
    },
    formContainer: {
      gap: scaleSize(24),
    },
    formTitle: {
      fontSize: scaleSize(24),
      fontWeight: 'bold',
      color: themeColors.text,
    },
    formSubtitle: {
      fontSize: scaleSize(16),
      color: themeColors.textSecondary,
      marginBottom: scaleSize(8),
    },
    tokenContainer: {
      backgroundColor: themeColors.surface,
      borderRadius: scaleSize(8),
      padding: scaleSize(16),
      borderWidth: 1,
      borderColor: themeColors.border || '#E0E0E0',
      marginBottom: scaleSize(8),
    },
    tokenText: {
      fontSize: scaleSize(12),
      fontFamily: 'monospace',
      color: themeColors.text,
      lineHeight: scaleSize(18),
    },
  });
};