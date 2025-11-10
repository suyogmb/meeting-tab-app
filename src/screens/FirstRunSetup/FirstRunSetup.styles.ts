/**
 * Styles for First Run Setup screen
 */

import {useTheme} from '../../contexts/ThemeContext';
import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';

export const useStyles = () => {
  const {themeColors} = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.backgroundPrimary,
      padding: scaleSize(15),
    },
    keyboardAvoidingView: {
      flex: 1,
      width: '100%',
    },
    overlay: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: scaleSize(24),
      paddingHorizontal: scaleSize(24),
    },
    modalCard: {
      width: '100%',
      maxWidth: scaleSize(720),
      backgroundColor: themeColors.surface,
      borderRadius: scaleSize(32),
      paddingVertical: scaleSize(32),
      paddingHorizontal: scaleSize(48),
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 16},
      shadowOpacity: 0.22,
      shadowRadius: scaleSize(28),
      elevation: 12,
      maxHeight: '85%',
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      alignItems: 'center',
      marginBottom: scaleSize(5),
    },
    heading: {
      fontSize: scaleSize(38),
      fontWeight: 'bold',
      color: themeColors.text,
      textAlign: 'center',
      marginBottom: scaleSize(12),
      lineHeight: scaleSize(44),
    },
    subheading: {
      fontSize: scaleSize(18),
      color: themeColors.textSecondary,
      marginBottom: scaleSize(15),
      textAlign: 'center',
      lineHeight: scaleSize(26),
    },
    stepIndicator: {
      fontSize: scaleSize(14),
      color: themeColors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: scaleSize(10),
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: scaleSize(26),
      fontWeight: '700',
      color: themeColors.text,
      marginBottom: scaleSize(20),
    },
    sectionDescription: {
      fontSize: scaleSize(16),
      color: themeColors.textSecondary,
      marginBottom: scaleSize(20),
      lineHeight: scaleSize(24),
    },
    input: {
      marginBottom: scaleSize(16),
    },
    summaryContainer: {
      borderRadius: scaleSize(18),
      borderWidth: 1,
      borderColor: themeColors.border,
      padding: scaleSize(16),
      marginBottom: scaleSize(20),
      backgroundColor:
        themeColors.background === '#000814'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.04)',
    },
    summaryRow: {
      flexDirection: 'row',
      marginBottom: scaleSize(6),
    },
    summaryLabel: {
      flex: 1,
      color: themeColors.textSecondary,
      fontSize: scaleSize(15),
    },
    summaryValue: {
      flex: 2,
      color: themeColors.text,
      fontSize: scaleSize(16),
      fontWeight: '600',
      textAlign: 'right',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: scaleSize(28),
    },
    button: {
      minWidth: scaleSize(160),
      paddingVertical: scaleSize(14),
      borderRadius: scaleSize(12),
      backgroundColor:
        themeColors.primary && themeColors.primary[50]
          ? themeColors.primary[50]
          : '#2563eb',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: scaleSize(16),
      fontWeight: '600',
      letterSpacing: 0.4,
    },
    buttonSpacing: {
      marginRight: scaleSize(12),
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: themeColors.border,
    },
    secondaryButtonText: {
      color: themeColors.text,
      fontSize: scaleSize(16),
      fontWeight: '600',
      letterSpacing: 0.4,
    },
  });
};

