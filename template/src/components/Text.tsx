import {Text as RNText, StyleSheetProperties, TextStyle} from 'react-native';
import React from 'react';
import {useTheme} from '../contexts/ThemeContext';
import {getTypographyStyle, TypographyStyleEnum} from 'assets/fonts/typography';

interface TextProps {
  style?: StyleSheetProperties;
  children: React.JSX.Element;
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
