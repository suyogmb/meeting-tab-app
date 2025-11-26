/**
 * Styles for Admin Access screen
 */

import {StyleSheet} from 'react-native';
import {fontFamily} from '../../utils/FontUtils';
import {scaleSize} from '../../utils/SizeUtility';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: scaleSize(40),
      width: '100%',
      backgroundColor: '#f5f5f5',
    },
    logoContainer: {
      marginBottom: scaleSize(80),
      alignItems: 'center',
      justifyContent: 'center',
    },
    subtitle: {
      fontSize: scaleSize(18),
      fontFamily: fontFamily.regular,
      color: '#666',
      textAlign: 'center',
      marginBottom: scaleSize(40),
    },
    inputWrapper: {
      width: '100%',
      maxWidth: 500,
      marginBottom: scaleSize(20),
    },
    passwordInput: {
      backgroundColor: '#fff',
      paddingHorizontal: scaleSize(15),
      paddingVertical: scaleSize(15),
      borderRadius: scaleSize(8),
      fontSize: scaleSize(16),
      fontFamily: fontFamily.regular,
      borderWidth: 1,
      borderColor: '#ddd',
      color: 'black',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: scaleSize(18),
      width: '100%',
      maxWidth: 500,
      marginTop: scaleSize(20),
    },
    cancelButton: {
      flex: 1,
      paddingVertical: scaleSize(15),
      backgroundColor: '#fff',
      borderRadius: scaleSize(8),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
    },
    cancelButtonText: {
      fontSize: scaleSize(16),
      fontFamily: fontFamily.semiBold,
      color: '#333',
    },
    submitButton: {
      flex: 1,
      paddingVertical: scaleSize(15),
      backgroundColor: '#7133AE',
      borderRadius: scaleSize(8),
      justifyContent: 'center',
      alignItems: 'center',
    },
    submitButtonDisabled: {
      opacity: 0.5,
      backgroundColor: '#7133AE',
    },
    submitButtonText: {
      fontSize: scaleSize(16),
      fontFamily: fontFamily.semiBold,
      color: '#ffffff',
    },
  });
};

