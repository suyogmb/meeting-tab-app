import {TextStyle} from 'react-native';
import {fontFamily} from './FontUtils';
import {M_10, M_12, M_14, M_16, M_18, M_20, M_22, M_24, M_26, M_28, M_32} from './SizeUtility';

export enum TypographyStyleEnum {
  HEADING = 'heading',
  BODY = 'body',
  CAPTION = 'caption',
  TITLE = 'title',
  SUBTITLE = 'subtitle',
  BUTTON = 'button',
  OVERLINE = 'overline',
  LABEL = 'label',
  INPUT = 'input',
}

export function getTypographyStyle(style: TypographyStyleEnum): TextStyle {
  const styles: {[key in TypographyStyleEnum]: TextStyle} = {
    [TypographyStyleEnum.HEADING]: {
      fontFamily: fontFamily.regular,
      fontSize: M_24,
      fontWeight: 'bold',
      lineHeight: M_32,
    },
    [TypographyStyleEnum.BODY]: {
      fontFamily: fontFamily.regular,
      fontSize: M_16,
      lineHeight: M_24,
    },
    [TypographyStyleEnum.CAPTION]: {
      fontFamily: fontFamily.regular,
      fontSize: M_12,
      lineHeight: M_16,
    },
    [TypographyStyleEnum.TITLE]: {
      fontFamily: fontFamily.regular,
      fontSize: M_20,
      fontWeight: 'bold',
      lineHeight: M_28,
    },
    [TypographyStyleEnum.SUBTITLE]: {
      fontFamily: fontFamily.regular,
      fontSize: M_18,
      fontWeight: '600',
      lineHeight: M_26,
    },
    [TypographyStyleEnum.BUTTON]: {
      fontFamily: fontFamily.regular,
      fontSize: M_14,
      fontWeight: 'bold',
      lineHeight: M_20,
    },
    [TypographyStyleEnum.OVERLINE]: {
      fontFamily: fontFamily.regular,
      fontSize: M_10,
      fontWeight: 'normal',
      lineHeight: M_12,
    },
    [TypographyStyleEnum.LABEL]: {
      fontFamily: fontFamily.regular,
      fontSize: M_14,
      fontWeight: 'normal',
      lineHeight: M_18,
    },
    [TypographyStyleEnum.INPUT]: {
      fontFamily: fontFamily.regular,
      fontSize: M_16,
      fontWeight: 'normal',
      lineHeight: M_22,
    },
  };

  return styles[style] || styles[TypographyStyleEnum.BODY];
}
