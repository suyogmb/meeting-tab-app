import React, {FunctionComponent} from 'react';
import {ImageProps, ImageSourcePropType, KeyboardTypeOptions, StyleProp, TextStyle} from 'react-native';
import {InternalAxiosRequestConfig} from 'axios';
import {colors} from 'theme/colors';

//Enums
enum ThemeOptions {
  dark = 'dark',
  light = 'light',
}

export interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export interface CustomImageProps extends Omit<ImageProps, 'source'> {
  source: FunctionComponent | ImageSourcePropType;
}

export interface TextProps {
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  includeFontPadding?: boolean; // Android-specific prop to prevent text clipping
}

export interface TextInputProps {
  value: string;
  onChangeText(text: string): void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none';
  secureTextEntry?: boolean;
  style?: StyleProp<TextStyle> | undefined;
  isError?: boolean;
  errorMsg?: string;
  onBlur?: () => void;
  eyeIconBottom?: number; // Bottom offset for eye icon positioning
}

export interface ThemeContextType {
  theme: ThemeOptions;
  setTheme: (key: ThemeOptions) => void;
  themeColors: (typeof colors)[ThemeOptions.dark];
}

/**
 * Common types used across the kiosk app
 * For specific types, see:
 * - meeting.ts - Meeting-related types
 * - room.ts - Room-related types
 * - kiosk.ts - Kiosk mode types
 * - sync.ts - Sync-related types
 * - navigation.ts - Navigation types
 */

export interface ConfigType {
  API_KEY?: string;
  BASE_URL?: string;
}

export interface StandardApiResponse {
  success: boolean;
  data: Record<string, unknown>;
  error?: string;
}

export interface ApiResponse<T = StandardApiResponse> {
  data: T;
  status: number;
  message?: string;
}


export interface ErrorResponse {
  message?: string;
}

export {ThemeOptions};
