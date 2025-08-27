import React from 'react';
import {Image as RNImage} from 'react-native';
import {CustomImageProps} from 'types/types';

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
