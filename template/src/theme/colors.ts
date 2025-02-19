import {ThemeOptions} from '../types/types';

export const colors = {
  [ThemeOptions.dark]: {
    primary: {
      [10]: '#00b4d8',
      [50]: '#0077b6',
      [90]: '#03045e',
    },
    secondary: '#caf0f8',
    background: '#000814',
    error: '#c1121f',
    text: '#ffffff',
    inputValue: '#ffffff', // Text input value color
    inputPlaceholder: '#b0b0b0', // Text input placeholder color
  },
  [ThemeOptions.light]: {
    primary: {
      [10]: '#00b4d8',
      [50]: '#0077b6',
      [90]: '#03045e',
    },
    secondary: '#caf0f8',
    background: '#f8f9fa',
    error: '#c1121f',
    text: '#212529',
    inputValue: '#212529', // Text input value color
    inputPlaceholder: '#6c757d', // Text input placeholder color
  },
};
