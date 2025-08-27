# Screens Documentation

This document provides comprehensive documentation for all screens in the React Native TypeScript boilerplate. Screens are organized using an MVCS-like structure (View, Styles, ViewModel) and integrate with navigation, context, hooks, and redux.

## 📋 Overview

Screens in this boilerplate are:

- **Modular** - Split into View (`.tsx`), ViewModel (`.viewmodel.ts`), and Styles (`.styles.ts`)
- **Type-safe** - Built with TypeScript and typed navigation params
- **Themed** - Consume `ThemeContext` for colors and styles
- **Localized** - Use `react-i18next` translations
- **State-managed** - Use Redux via `useTypedSelector` and thunks

## 📁 Screen Files

### Core Screens

| Screen | Files | Description |
|--------|-------|-------------|
| **Login** | `AuthScreens/Login/Login.tsx`, `Login.styles.ts`, `Login.viewmodel.ts` | Authentication screen with validation |
| **Home** | `Home/Home.tsx`, `Home.styles.ts`, `Home.viewmodel.ts` | Movie list with theme toggle and navigation |
| **Details** | `DetailScreen/DetailScreen.tsx`, `Details.styles.ts`, `Details.viewmodel.ts` | Movie detail display with back action |
| **ErrorScreen** | `ErrorScreen/ErrorScreen.tsx` | Fallback error display |

### Screen Exports
- `src/screens/index.ts` - Exports `Login`, `Home`, and `DetailsScreen`

## 🎯 Screen Details & Usage Examples

### 1. Login Screen

**Purpose**: Authenticates the user and validates credentials with helpful error messages.

**Files**:
- `AuthScreens/Login/Login.tsx`
- `AuthScreens/Login/Login.styles.ts`
- `AuthScreens/Login/Login.viewmodel.ts`

**Features**:
- Email/password fields with Yup validation
- i18n placeholders and button labels
- Navigation to Home on success
- Themed styles and responsive sizing utilities

**Key ViewModel APIs**:
- `onSubmit()`: Validates and navigates on success
- `handleUserNameChange(text)`, `handlePasswordChange(text)`
- `onEmailBlur()`, `onPasswordBlur()` set field errors

**Usage Example**:
```tsx
import React from 'react';
import {Login} from 'screens';

const AuthFlow = () => {
  return <Login />;
};
```

### 2. Home Screen

**Purpose**: Displays a themed list of movies and allows navigation to details. Includes a theme toggle.

**Files**:
- `Home/Home.tsx`
- `Home/Home.styles.ts`
- `Home/Home.viewmodel.ts`

**Features**:
- Fetches movies via `getMoviesData` thunk
- Uses `useTypedSelector` to read `dashboard.movieData`
- Header with right-aligned theme toggle switch
- Typography system via `getTypographyStyle`

**Important Types**:
```tsx
type AuthStackParamList = {
  HOME: undefined;
  HOME_DETAILS: {data: object};
};
```

**Usage Example**:
```tsx
import React from 'react';
import Home from 'screens/Home/Home';

const HomeRoute = () => <Home />;
```

### 3. Details Screen

**Purpose**: Shows detailed information for a selected movie with localized labels and a back action.

**Files**:
- `DetailScreen/DetailScreen.tsx`
- `DetailScreen/Details.styles.ts`
- `DetailScreen/Details.viewmodel.ts`

**Features**:
- Strongly typed route params using `NativeStackScreenProps`
- Localized labels for fields
- Themed styles and responsive layout
- Back button via `navigation.goBack()`

**Param Types**:
```tsx
interface MovieDetails {
  name?: string;
  imageurl?: string;
  team?: string;
  firstappearance?: string;
  publisher?: string;
  bio?: string;
}

type AuthStackParamList = {
  HOME: undefined;
  HOME_DETAILS: {data?: MovieDetails};
};
```

**Usage Example**:
```tsx
navigation.navigate(AUTH_STACK_NAVIGATOR.HOME_DETAILS, { data: movie });
```

### 4. ErrorScreen

**Purpose**: Minimal error fallback screen.

**File**:
- `ErrorScreen/ErrorScreen.tsx`

**Usage Example**:
```tsx
import ErrorScreen from 'screens/ErrorScreen/ErrorScreen';

const Fallback = () => <ErrorScreen />;
```

## 🧩 Patterns Used

- **MVCS separation**: View, ViewModel, Styles per screen
- **Theming**: All styles derive from `ThemeContext`
- **Localization**: Copy from `src/language/en.json`
- **Navigation**: Uses enums from `navigators/routes`
- **Redux**: Data loaded via thunks; selectors via `useTypedSelector`

## 🔌 Integration Points

- `ThemeContext`: colors and theme toggle
- `react-i18next`: `t()` for labels/placeholders
- `Redux Toolkit`: store, slices, and thunks
- `React Navigation`: typed params and navigation helpers

