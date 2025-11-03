import Config from 'react-native-config';
import {ConfigType} from 'types/types';

const config: ConfigType = Config as ConfigType;

export const Endpoints = {
  // API endpoints
  Movies: `${config.BASE_URL}/demos/marvel`,
};
