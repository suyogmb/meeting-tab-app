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
  style?: TextStyle;
  children: React.ReactNode;
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
}

export interface ThemeContextType {
  theme: ThemeOptions;
  setTheme: (key: ThemeOptions) => void;
  themeColors: (typeof colors)[ThemeOptions.dark];
}

export interface MovieDetails {
  name?: string;
  imageurl?: string;
  team?: string;
  firstappearance?: string;
  publisher?: string;
  bio?: string;
}

export type AuthStackParamList = {
  LOGIN_SCREEN: undefined;
  HOME: undefined;
  HOME_DETAILS: {data?: MovieDetails}; // Ensure type consistency with DetailsScreenProps
};

export type HomeTabParamList = {
  HOME: undefined;
  HOME_DETAILS: {data?: MovieDetails};
};

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

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export interface ErrorResponse {
  message?: string;
}

export {ThemeOptions};
