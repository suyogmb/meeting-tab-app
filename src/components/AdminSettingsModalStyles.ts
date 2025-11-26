
import { useTheme } from 'contexts/ThemeContext';
import {StyleSheet} from 'react-native';
import { scaleSize } from 'utils/SizeUtility';
import { fontFamily } from 'utils/FontUtils';


export const useStyles = () => {
  const {themeColors} = useTheme();
  const isDark = themeColors.background === '#0a0a0f' || themeColors.background === '#000814';
  const neutralText = '#111827';
  const secondaryText = '#4b5563';
  const borderNeutral = '#d1d5db';

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
    // Admin Access Page - Professional Design
    keyboardView: {
      flex: 1,
    },
    authScrollContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scaleSize(50),
      paddingVertical: scaleSize(40),
      width: '100%',
    },
    logoContainer: {
      width: scaleSize(240),
      height: scaleSize(240),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: scaleSize(24),
      padding: scaleSize(10),
    },
    logo: {
      width: '100%',
      height: '100%',
      maxWidth: scaleSize(240),
      maxHeight: scaleSize(240),
    },
    titleContainer: {
      width: '100%',
      maxWidth: 500,
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontFamily: fontFamily.bold,
      color: '#333',
      padding: 5,
      textAlign: 'center',
    },
    subtitleContainer: {
      paddingVertical: scaleSize(8),
      marginBottom: scaleSize(40),
      minHeight: scaleSize(50),
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    subtitle: {
      fontSize: scaleSize(18),
      color: secondaryText,
      textAlign: 'center',
      lineHeight: scaleSize(26),
      paddingHorizontal: scaleSize(20),
      includeFontPadding: false,
      textTransform: 'none',
    },
    inputWrapper: {
      width: '100%',
      marginBottom: scaleSize(36),
    },
    inputLabel: {
      fontSize: scaleSize(15),
      fontWeight: '600',
      color: neutralText,
      marginBottom: scaleSize(10),
      paddingLeft: scaleSize(4),
      textTransform: 'uppercase',
      letterSpacing: 1,
      includeFontPadding: false,
    },
    passwordInput: {
      width: '100%',
      minHeight: scaleSize(64),
      backgroundColor: isDark ? 'rgba(17, 24, 39, 0.2)' : 'rgba(17, 24, 39, 0.04)',
      borderRadius: scaleSize(12),
      paddingHorizontal: scaleSize(24),
      paddingVertical: scaleSize(18),
      fontSize: scaleSize(18),
      borderWidth: 1,
      borderColor: borderNeutral,
      color: neutralText,
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
    passwordInputFocused: {
      borderColor: neutralText,
      backgroundColor: isDark ? 'rgba(17, 24, 39, 0.28)' : 'rgba(17, 24, 39, 0.1)',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: scaleSize(18),
      width: '100%',
      marginTop: scaleSize(4),
    },
    cancelButton: {
      flex: 1,
      minHeight: scaleSize(60),
      backgroundColor: '#FFFFFF',
      borderRadius: scaleSize(12),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: borderNeutral,
    },
    cancelButtonText: {
      fontSize: scaleSize(18),
      fontWeight: '600',
      color: neutralText,
      includeFontPadding: false,
    },
    submitButton: {
      flex: 1,
      minHeight: scaleSize(60),
      backgroundColor: neutralText,
      borderRadius: scaleSize(12),
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 6,
    },
    submitButtonDisabled: {
      opacity: 0.5,
      backgroundColor: secondaryText,
    },
    submitButtonText: {
      fontSize: scaleSize(18),
      fontWeight: '700',
      color: '#ffffff',
      letterSpacing: 0.5,
      includeFontPadding: false,
    },
    // Legacy input style for other forms
    input: {
      width: '100%',
      maxWidth: scaleSize(400),
      marginBottom: scaleSize(24),
    },
    content: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    scrollContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
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
      color: neutralText,
    },
    closeButton: {
      width: scaleSize(40),
      height: scaleSize(40),
      borderRadius: scaleSize(20),
      backgroundColor: '#f3f4f6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: scaleSize(24),
      color: neutralText,
      fontWeight: 'bold',
    },
    menuContainer: {
      width: '100%',
      maxWidth: 500,
      gap: 20,
    },
    menuItem: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 20,
      borderWidth: 1,
      borderColor: '#ddd',
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
      fontSize: 18,
      fontFamily: fontFamily.semiBold,
      color: '#333',
      marginBottom: 4,
    },
    menuItemSubtitle: {
      fontSize: 14,
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
    guideContainer: {
      gap: scaleSize(24),
    },
    guideTitle: {
      fontSize: scaleSize(28),
      fontWeight: 'bold',
      color: neutralText,
      marginBottom: scaleSize(16),
    },
    guideSection: {
      marginBottom: scaleSize(24),
    },
    guideSectionTitle: {
      fontSize: scaleSize(20),
      fontWeight: 'bold',
      color: neutralText,
      marginBottom: scaleSize(8),
    },
    guideText: {
      fontSize: scaleSize(16),
      color: secondaryText,
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
      color: neutralText,
    },
    formSubtitle: {
      fontSize: scaleSize(16),
      color: secondaryText,
      marginBottom: scaleSize(8),
    },
    tokenContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: scaleSize(8),
      padding: scaleSize(16),
      borderWidth: 1,
      borderColor: borderNeutral,
      marginBottom: scaleSize(8),
    },
    tokenText: {
      fontSize: scaleSize(12),
      fontFamily: 'monospace',
      color: neutralText,
      lineHeight: scaleSize(18),
    },
  });
};