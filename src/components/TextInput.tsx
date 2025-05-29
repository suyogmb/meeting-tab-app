import React from 'react';
import {KeyboardTypeOptions, StyleProp, StyleSheet, TextInput, TextStyle, View} from 'react-native';
import Text from './Text';
import {useTheme} from '../contexts/ThemeContext';
import {getTypographyStyle, TypographyStyleEnum} from '../utils/Typography';

interface TextInputProps {
  value: string;
  onChangeText(text: string): void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none';
  secureTextEntry?: boolean;
  style?: StyleProp<TextStyle> | undefined;
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
  style,
  isError = false,
  errorMsg = '',
}: TextInputProps) => {
  const {themeColors} = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        style={[style, {color: themeColors.inputValue}]}
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
