import React from 'react';
import {Text as RNText, TextStyle} from 'react-native';
import {TextProps} from 'types/types';
import {useTheme} from '../contexts/ThemeContext';
import {getTypographyStyle, TypographyStyleEnum} from '../utils/Typography';

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
