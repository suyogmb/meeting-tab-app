# Context Documentation

This document provides comprehensive documentation for all context implementations in the React Native TypeScript boilerplate. These contexts are designed to provide global state management with type safety and consistent patterns.

## 📋 Overview

The contexts in this boilerplate are built with TypeScript for type safety and follow React Context best practices. They are designed to be:

- **Global State Management** - Provide application-wide state access
- **Type-safe** - Full TypeScript integration with proper type definitions
- **Performance Optimized** - Efficient state distribution using React Context
- **Consistent** - Follow the same patterns and implementation approach
- **Reusable** - Can be used across different components and screens

## 📁 Context Files

### Core Contexts

| Context | File | Description |
|---------|------|-------------|
| **ThemeContext** | `src/contexts/ThemeContext.tsx` | Theme management context for light/dark mode switching |

### Context Exports
- `src/contexts/ThemeContext.tsx` - Exports ThemeProvider, useTheme hook, and ThemeOptions

## 🎯 Context Details & Usage Examples

### 1. ThemeContext

**Purpose**: Provides centralized theme management system for switching between light and dark themes throughout the application.

**File**: `src/contexts/ThemeContext.tsx`

**Features**:
- Type-safe theme management with TypeScript
- Dynamic theme switching between light and dark modes
- Theme-specific color palettes
- Global state management across the entire application
- Performance optimized using React Context API
- Custom hook for easy theme access

**Theme Options**:
- `ThemeOptions.dark`: Dark theme with dark backgrounds and light text
- `ThemeOptions.light`: Light theme with light backgrounds and dark text

**Usage Example**:
```tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme, ThemeOptions} from 'contexts/ThemeContext';

// Basic theme usage in components
const ThemedComponent = () => {
  const {theme, themeColors} = useTheme();
  
  return (
    <View style={{backgroundColor: themeColors.background}}>
      <Text style={{color: themeColors.text}}>
        Current theme: {theme}
      </Text>
    </View>
  );
};

// Theme switching functionality
const ThemeToggle = () => {
  const {theme, setTheme, themeColors} = useTheme();
  
  const toggleTheme = () => {
    const newTheme = theme === ThemeOptions.dark 
      ? ThemeOptions.light 
      : ThemeOptions.dark;
    setTheme(newTheme);
  };
  
  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      style={{backgroundColor: themeColors.primary[50]}}
    >
      <Text style={{color: themeColors.text}}>
        Switch to {theme === ThemeOptions.dark ? 'Light' : 'Dark'} Mode
      </Text>
    </TouchableOpacity>
  );
};

// Conditional styling based on theme
const ThemedScreen = () => {
  const {themeColors} = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: themeColors.background,
      borderColor: themeColors.primary[50],
    },
    text: {
      color: themeColors.text,
    },
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Themed content</Text>
    </View>
  );
};

// Setting up ThemeProvider in app root
const AppWrapper = () => {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

// Custom themed components
const ThemedTextInput = ({placeholder, ...props}) => {
  const {themeColors} = useTheme();
  
  const styles = StyleSheet.create({
    input: {
      backgroundColor: themeColors.background,
      color: themeColors.inputValue,
      borderBottomColor: themeColors.borderBottomColor,
    },
  });
  
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={themeColors.inputPlaceholder}
      {...props}
    />
  );
};
```

**Theme Color System**:
The ThemeContext provides a comprehensive color system with both dark and light theme variants:

**Dark Theme Colors**:
- `primary[10]`: #00b4d8 (Light blue)
- `primary[50]`: #0077b6 (Medium blue) 
- `primary[90]`: #03045e (Dark blue)
- `secondary`: #caf0f8 (Light cyan)
- `background`: #000814 (Very dark blue-black)
- `headerBackground`: #001d3d (Dark blue)
- `error`: #c1121f (Red)
- `text`: #ffffff (White)
- `inputValue`: #ffffff (White)
- `inputPlaceholder`: #b0b0b0 (Light gray)
- `borderBottomColor`: rgba(0,0,0,0.1) (Transparent black)

**Light Theme Colors**:
- `primary[10]`: #00b4d8 (Light blue)
- `primary[50]`: #0077b6 (Medium blue)
- `primary[90]`: #03045e (Dark blue)
- `secondary`: #caf0f8 (Light cyan)
- `background`: #f8f9fa (Light gray)
- `headerBackground`: #ffffff (White)
- `error`: #c1121f (Red)
- `text`: #212529 (Dark gray)
- `inputValue`: #212529 (Dark gray)
- `inputPlaceholder`: #6c757d (Medium gray)
- `borderBottomColor`: rgba(0,0,0,0.1) (Transparent black)