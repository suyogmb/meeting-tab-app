import {useTheme} from 'contexts/ThemeContext';
import React from 'react';
import {TextInput, KeyboardTypeOptions, TextInputProps as RNTextInputProps, View, StyleSheet} from 'react-native';
import Text from './Text';
import {getTypographyStyle, TypographyStyleEnum} from '../utils/Typography';

interface TextInputProps {
  value: string;
  onChangeText(text: string): void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none';
  secureTextEntry?: boolean;
  style?: RNTextInputProps['style'];
  isError?: boolean;
  errorMsg?: string;
}

const TextInputComponent = ({
  value = '',
  onChangeText = () => {},
  placeholder = '',
  keyboardType = 'default',
  autoCapitalize = 'none',
  secureTextEntry = false,
  style = {},
  isError = false,
  errorMsg = '',
}: TextInputProps) => {
  const {themeColors} = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        style={{color: themeColors.inputValue, ...style}}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={themeColors.inputPlaceholder}
      />
      {isError && (
        <Text style={{...styles.text, color: themeColors.error, ...getTypographyStyle(TypographyStyleEnum.CAPTION)}}>
          {errorMsg}
        </Text>
      )}
    </View>
  );
};

export default TextInputComponent;
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  text: {
    marginBottom: 16,
  },
});
