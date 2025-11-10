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
    headerBackground: '#001d3d',
    surface: '#001d3d',
    error: '#c1121f',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    inputValue: '#ffffff',
    inputPlaceholder: '#b0b0b0',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    border: '#2a2a2a',
    backgroundPrimary: 'white',

  },
  [ThemeOptions.light]: {
    primary: {
      [10]: '#00b4d8',
      [50]: '#0077b6',
      [90]: '#03045e',
    },
    secondary: '#caf0f8',
    background: '#f8f9fa',
    headerBackground: '#ffffff',
    surface: '#ffffff',
    error: '#c1121f',
    text: '#212529',
    textSecondary: '#6c757d',
    inputValue: '#212529',
    inputPlaceholder: '#6c757d',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    border: '#E0E0E0',
    backgroundPrimary: 'white',
  },
};
