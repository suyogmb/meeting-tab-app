import {Text as RNText, StyleSheetProperties, TextStyle} from 'react-native';
import React from 'react';
import {useTheme} from '../contexts/ThemeContext';
import {getTypographyStyle, TypographyStyleEnum} from '../utils/Typography';

interface TextProps {
  style?: TextStyle;
  children: React.ReactNode;
}

const Text = ({children, style}: TextProps) => {
  const {themeColors} = useTheme();
  const defaultStyles: TextStyle = {
    color: themeColors.text,
    textTransform: 'capitalize',
    ...getTypographyStyle(TypographyStyleEnum.BODY),
  };
  return <RNText style={{...defaultStyles, ...style}}>{children}</RNText>;
};

export default Text;
