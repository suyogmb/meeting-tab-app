
import { useTheme } from 'contexts/ThemeContext';
import {StyleSheet} from 'react-native';
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalCardContainer: {
    width:"50%",
    height:"80%",
    backgroundColor: themeColors.surface,
    borderRadius: scaleSize(20),
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
      paddingTop: scaleSize(16),
      paddingBottom: scaleSize(16),
      marginBottom: scaleSize(12),
      minHeight: scaleSize(70),
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    title: {
      fontSize: scaleSize(42),
      fontWeight: '700',
      color: themeColors.text,
      textAlign: 'center',
      letterSpacing: -0.5,
      paddingHorizontal: scaleSize(10),
      lineHeight: scaleSize(56),
      includeFontPadding: false,
      textTransform: 'none',
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
      fontSize: scaleSize(20),
      color: themeColors.textSecondary,
      textAlign: 'center',
      lineHeight: scaleSize(30),
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
      color: themeColors.text,
      marginBottom: scaleSize(10),
      paddingLeft: scaleSize(4),
      textTransform: 'uppercase',
      letterSpacing: 1,
      includeFontPadding: false,
    },
    passwordInput: {
      width: '100%',
      minHeight: scaleSize(68),
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
      borderRadius: scaleSize(14),
      paddingHorizontal: scaleSize(24),
      paddingVertical: scaleSize(20),
      fontSize: scaleSize(20),
      borderWidth: 2,
      borderColor: themeColors.border || '#cbd5f5',
      color: themeColors.text,
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
    passwordInputFocused: {
      borderColor: primaryColor,
      backgroundColor: primaryMuted,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: scaleSize(18),
      width: '100%',
      marginTop: scaleSize(4),
    },
    cancelButton: {
      flex: 1,
      minHeight: scaleSize(68),
      backgroundColor: 'transparent',
      borderRadius: scaleSize(14),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: themeColors.border || '#d1d5db',
    },
    cancelButtonText: {
      fontSize: scaleSize(20),
      fontWeight: '600',
      color: themeColors.text,
      includeFontPadding: false,
    },
    submitButton: {
      flex: 1,
      minHeight: scaleSize(68),
      backgroundColor: primaryColor,
      borderRadius: scaleSize(14),
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 6,
    },
    submitButtonDisabled: {
      opacity: 0.5,
      backgroundColor: primaryColor,
    },
    submitButtonText: {
      fontSize: scaleSize(20),
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