import React from 'react';
import {Text as RNText, TextStyle, StyleSheet, TextProps as RNTextProps} from 'react-native';
import {TextProps} from 'types/types';
import {useTheme} from '../contexts/ThemeContext';
import {getTypographyStyle, TypographyStyleEnum} from '../utils/Typography';

const Text = ({children, style, ...props}: TextProps & RNTextProps) => {
  const {themeColors} = useTheme();
  const defaultStyles: TextStyle = {
    color: themeColors.text,
    textTransform: 'capitalize',
    ...getTypographyStyle(TypographyStyleEnum.BODY),
  };
  return (
    <RNText style={StyleSheet.flatten([defaultStyles, style])} {...props}>
      {children}
    </RNText>
  );
};

export default Text;
