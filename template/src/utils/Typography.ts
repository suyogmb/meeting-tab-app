import {TextStyle} from 'react-native';

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
      fontFamily: 'Poppins-Regular',
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
    },
    [TypographyStyleEnum.BODY]: {
      fontFamily: 'Poppins-Regular',
      fontSize: 16,
      lineHeight: 24,
    },
    [TypographyStyleEnum.CAPTION]: {
      fontFamily: 'Poppins-Regular',
      fontSize: 12,
      lineHeight: 16,
    },
    [TypographyStyleEnum.TITLE]: {
      fontFamily: 'Poppins-Regular',
      fontSize: 20,
      fontWeight: 'bold',
      lineHeight: 28,
    },
    [TypographyStyleEnum.SUBTITLE]: {
      fontFamily: 'Poppins-Regular',
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 26,
    },
    [TypographyStyleEnum.BUTTON]: {
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      fontWeight: 'bold',
      lineHeight: 20,
    },
    [TypographyStyleEnum.OVERLINE]: {
      fontFamily: 'Poppins-Regular',
      fontSize: 10,
      fontWeight: 'normal',
      lineHeight: 12,
    },
    [TypographyStyleEnum.LABEL]: {
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 18,
    },
    [TypographyStyleEnum.INPUT]: {
      fontFamily: 'Poppins-Regular',
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 22,
    },
  };

  return styles[style] || styles[TypographyStyleEnum.BODY];
}
