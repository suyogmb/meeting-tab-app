import Config from 'react-native-config';

// Define an interface for expected config values
interface ConfigType {
  API_KEY?: string;
  BASE_URL?: string;
}

const config: ConfigType = Config as ConfigType;

export const Endpoints = {
  // API endpoints
  Movies: `${config.BASE_URL}/demos/marvel`,
};
