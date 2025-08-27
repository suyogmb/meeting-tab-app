import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {TextInputProps} from 'types/types';
import {V_10} from 'utils/SizeUtility';
import Text from './Text';
import {useTheme} from '../contexts/ThemeContext';
import {getTypographyStyle, TypographyStyleEnum} from '../utils/Typography';

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
  onBlur,
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
        onBlur={onBlur}
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
    marginBottom: V_10,
  },
});
