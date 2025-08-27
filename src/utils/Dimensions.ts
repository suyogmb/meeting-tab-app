import {Dimensions, PixelRatio, Platform} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const scale = screenWidth / 320;

const widthPercentageToDP = (widthPercent: string): number => {
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

const heightPercentageToDP = (heightPercent: string): number => {
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

const normalize = (size: number): number => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const isIos = Platform.OS == 'ios';
const isAndroid = Platform.OS == 'android';

const guidelineBaseWidth = screenWidth > screenHeight ? 680 : 350;
const guidelineBaseHeight = screenWidth > screenHeight ? 350 : 680;

let [shortDimension, longDimension] =
  screenWidth < screenHeight ? [screenWidth, screenHeight] : [screenHeight, screenWidth];

const generalScale = (size: number) => (shortDimension / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (longDimension / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => size + (generalScale(size) - size) * factor;

export {
  screenWidth,
  screenHeight,
  widthPercentageToDP,
  heightPercentageToDP,
  normalize,
  isIos,
  isAndroid,
  generalScale,
  verticalScale,
  moderateScale,
};
