import {ImageProps, ImageSourcePropType, Image as RNImage} from 'react-native';
import React, {FunctionComponent} from 'react';

interface CustomImageProps extends Omit<ImageProps, 'source'> {
  source: FunctionComponent | ImageSourcePropType;
}

const Image = ({source: Source, style, ...props}: CustomImageProps) => {
  if (typeof Source === 'number' || typeof Source === 'string') {
    return (
      <RNImage
        {...props}
        source={Source}
        style={style}
      />
    );
  } else if (typeof Source === 'function') {
    return <Source />;
  } else {
    return null;
  }
};

export default Image;
