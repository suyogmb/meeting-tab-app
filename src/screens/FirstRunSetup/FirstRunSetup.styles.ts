/**
 * Styles for First Run Setup screen
 */

import {StyleSheet} from 'react-native';
import {fontFamily} from '../../utils/FontUtils';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    keyboardAvoidingView: {
      flex: 1,
      width: '100%',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
      backgroundColor: '#f5f5f5',
    },
    logoContainer: {
      marginBottom: 80,
      alignItems: 'center',
      justifyContent: 'center',
    },
    subtitle: {
      fontSize: 18,
      fontFamily: fontFamily.regular,
      color: '#666',
      textAlign: 'center',
      marginBottom: 40,
    },
    inputContainer: {
      width: '100%',
      maxWidth: 500,
    },
    input: {
      backgroundColor: '#fff',
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 8,
      fontSize: 16,
      fontFamily: fontFamily.regular,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#ddd',
      color: 'black',
    },
    button: {
      width: '100%',
      maxWidth: 500,
      paddingVertical: 15,
      backgroundColor: '#7133AE',
    },
    buttonText: {
      fontFamily: fontFamily.semiBold,
    },
  });
};

