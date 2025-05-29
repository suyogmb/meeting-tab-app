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
    headerBackground: '#001d3d', // New header background color
    error: '#c1121f',
    text: '#ffffff',
    inputValue: '#ffffff',
    inputPlaceholder: '#b0b0b0',
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  [ThemeOptions.light]: {
    primary: {
      [10]: '#00b4d8',
      [50]: '#0077b6',
      [90]: '#03045e',
    },
    secondary: '#caf0f8',
    background: '#f8f9fa',
    headerBackground: '#ffffff', // New header background color
    error: '#c1121f',
    text: '#212529',
    inputValue: '#212529',
    inputPlaceholder: '#6c757d',
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
};
