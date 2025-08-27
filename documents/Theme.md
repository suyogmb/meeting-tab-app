# Theme Documentation

This document provides documentation for the theme color system used across the React Native TypeScript boilerplate. The theme is consumed through `ThemeContext` to provide consistent, type-safe colors for both light and dark modes.

## 📋 Overview

The theme system is:

- **Type-safe** - Keys mapped to `ThemeOptions.light` and `ThemeOptions.dark`
- **Centralized** - Single source for color tokens
- **Themed** - Light and dark variants for UI parity
- **Composable** - Used via `useTheme()` across screens and components

## 📁 Theme Files

| Module | File | Description |
|--------|------|-------------|
| **colors** | `src/theme/colors.ts` | Theme color tokens for light and dark themes |

### Exports
- `colors` - An object keyed by `ThemeOptions` with color tokens

## 🎯 Theme Details & Usage Examples

### Theme Structure

```ts
export const colors = {
  [ThemeOptions.dark]: {
    primary: { 10: '#00b4d8', 50: '#0077b6', 90: '#03045e' },
    secondary: '#caf0f8',
    background: '#000814',
    headerBackground: '#001d3d',
    error: '#c1121f',
    text: '#ffffff',
    inputValue: '#ffffff',
    inputPlaceholder: '#b0b0b0',
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  [ThemeOptions.light]: {
    primary: { 10: '#00b4d8', 50: '#0077b6', 90: '#03045e' },
    secondary: '#caf0f8',
    background: '#f8f9fa',
    headerBackground: '#ffffff',
    error: '#c1121f',
    text: '#212529',
    inputValue: '#212529',
    inputPlaceholder: '#6c757d',
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
};
```

### Using Theme via ThemeContext

```tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from 'contexts/ThemeContext';

const ThemedCard = () => {
  const {themeColors} = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: themeColors.background,
      borderColor: themeColors.primary[50],
      borderWidth: 1,
      padding: 16,
      borderRadius: 8,
    },
    title: {
      color: themeColors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Themed Card</Text>
    </View>
  );
};
```

### Switching Theme

```tsx
import React from 'react';
import {Switch} from 'react-native';
import {useTheme, ThemeOptions} from 'contexts/ThemeContext';

const ThemeToggle = () => {
  const {theme, setTheme, themeColors} = useTheme();
  const isDark = theme === ThemeOptions.dark;

  return (
    <Switch
      value={isDark}
      onValueChange={(newVal) => setTheme(newVal ? ThemeOptions.dark : ThemeOptions.light)}
      trackColor={{false: themeColors.primary[50], true: themeColors.primary[10]}}
      thumbColor={isDark ? themeColors.primary[90] : themeColors.primary[50]}
    />
  );
};
```

## 🎨 Theme Color Tokens

**Dark Theme**:
- `primary[10]`: #00b4d8
- `primary[50]`: #0077b6
- `primary[90]`: #03045e
- `secondary`: #caf0f8
- `background`: #000814
- `headerBackground`: #001d3d
- `error`: #c1121f
- `text`: #ffffff
- `inputValue`: #ffffff
- `inputPlaceholder`: #b0b0b0
- `borderBottomColor`: rgba(0,0,0,0.1)

**Light Theme**:
- `primary[10]`: #00b4d8
- `primary[50]`: #0077b6
- `primary[90]`: #03045e
- `secondary`: #caf0f8
- `background`: #f8f9fa
- `headerBackground`: #ffffff
- `error`: #c1121f
- `text`: #212529
- `inputValue`: #212529
- `inputPlaceholder`: #6c757d
- `borderBottomColor`: rgba(0,0,0,0.1)
