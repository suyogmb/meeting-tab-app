# Types Documentation

This document provides documentation for shared TypeScript types and enums used across the React Native TypeScript boilerplate.

## 📋 Overview

The shared types are:

- **Type-safe** - Centralized enums and interfaces
- **Reusable** - Consumed by contexts, components, navigation, and network
- **Consistent** - Single source of truth for app-wide typing

## 📁 Type Files

| Type Group | File | Description |
|------------|------|-------------|
| **All shared types** | `src/types/types.ts` | Enums, component props, navigation params, and API types |

### Exports
- `ThemeOptions`
- `HeaderProps`, `CustomImageProps`, `TextProps`, `TextInputProps`
- `ThemeContextType`
- `MovieDetails`, `AuthStackParamList`, `HomeTabParamList`
- `ConfigType`, `StandardApiResponse`, `ApiResponse<T>`
- `CustomAxiosRequestConfig`, `ErrorResponse`

## 🎯 Type Details & Usage Examples

### 1) ThemeOptions

Represents available UI theme modes.

```ts
enum ThemeOptions {
  dark = 'dark',
  light = 'light',
}
```

Usage with ThemeContext:
```tsx
import {useTheme, ThemeOptions} from 'contexts/ThemeContext';
```

### 2) Component Prop Types

HeaderProps:
```ts
interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}
```

CustomImageProps (ensures `source` is RN source or a FC):
```ts
interface CustomImageProps extends Omit<ImageProps, 'source'> {
  source: FunctionComponent | ImageSourcePropType;
}
```

TextProps and TextInputProps:
```ts
interface TextProps {
  style?: TextStyle;
  children: React.ReactNode;
}

interface TextInputProps {
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
```

### 3) Theme Context Types

Type used by `ThemeContext`:
```ts
interface ThemeContextType {
  theme: ThemeOptions;
  setTheme: (key: ThemeOptions) => void;
  themeColors: (typeof colors)[ThemeOptions.dark];
}
```

### 4) Navigation Param Types

MovieDetails:
```ts
interface MovieDetails {
  name?: string;
  imageurl?: string;
  team?: string;
  firstappearance?: string;
  publisher?: string;
  bio?: string;
}
```

Auth stack params:
```ts
type AuthStackParamList = {
  LOGIN_SCREEN: undefined;
  HOME: undefined;
  HOME_DETAILS: {data?: MovieDetails};
};
```

Home tab params:
```ts
type HomeTabParamList = {
  HOME: undefined;
  HOME_DETAILS: {data?: MovieDetails};
};
```

Usage with React Navigation:
```tsx
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<AuthStackParamList, 'HOME_DETAILS'>;
```

### 5) Config and API Types

Environment config:
```ts
interface ConfigType {
  API_KEY?: string;
  BASE_URL?: string;
}
```

Standard API response envelope:
```ts
interface StandardApiResponse {
  success: boolean;
  data: Record<string, unknown>;
  error?: string;
}

interface ApiResponse<T = StandardApiResponse> {
  data: T;
  status: number;
  message?: string;
}
```

Axios config extension for retry flag:
```ts
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
```

API error model:
```ts
interface ErrorResponse {
  message?: string;
}
```

## 🔌 Where These Types Are Used

- `ThemeOptions`, `ThemeContextType`, `colors`: theming in `contexts/ThemeContext` and `theme/colors.ts`
- `HeaderProps`, `CustomImageProps`, `TextProps`, `TextInputProps`: UI components in `src/components`
- `MovieDetails`, `AuthStackParamList`, `HomeTabParamList`: navigation in `src/navigators` and screens
- `ConfigType`, `ApiResponse<T>`, `CustomAxiosRequestConfig`, `ErrorResponse`: network in `src/networkConfig`
