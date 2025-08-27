# HOCs Documentation

This document provides comprehensive documentation for all Higher-Order Components (HOCs) in the React Native TypeScript boilerplate. These HOCs are designed to provide reusable functionality and cross-cutting concerns with type safety and consistent patterns.

## 📋 Overview

The HOCs in this boilerplate are built with TypeScript for type safety and follow React HOC best practices. They are designed to be:

- **Reusable** - Can be applied to multiple components
- **Type-safe** - Full TypeScript integration with proper prop types
- **Cross-cutting** - Handle common concerns like loading states and internationalization
- **Consistent** - Follow the same patterns and implementation approach
- **Composable** - Can be combined with other HOCs and components

## 📁 HOC Files

### Core HOCs

| HOC | File | Description |
|-----|------|-------------|
| **Loader** | `src/hocs/Loader.tsx` | Loading overlay component with activity indicator |
| **LanguageProvider** | `src/hocs/LanguageProvider.ts` | Internationalization provider using react-i18next |

### HOC Exports
- `src/hocs/Loader.tsx` - Exports Loader component
- `src/hocs/LanguageProvider.ts` - Exports LanguageProvider component

## 🎯 HOC Details & Usage Examples

### 1. Loader HOC

**Purpose**: Provides a full-screen loading overlay with activity indicator and internationalized loading text.

**File**: `src/hocs/Loader.tsx`

**Features**:
- Full-screen overlay with semi-transparent background
- Configurable activity indicator size (small/large)
- Customizable color for the activity indicator
- Internationalized loading text using react-i18next
- Absolute positioning to cover entire screen
- Centered content with proper styling

**Props**:
- `size`: 'small' | 'large' - Size of the activity indicator
- `color`: ColorValue - Color of the activity indicator

**Usage Example**:
```tsx
import React from 'react';
import {View, StyleSheet} from 'react-native';
import Loader from 'hocs/Loader';

// Basic usage with default props
const LoadingScreen = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <Loader size="large" color="#0077b6" />;
  }

  return (
    <View style={styles.container}>
      {/* Your content here */}
    </View>
  );
};

// Usage in a component with conditional rendering
const DataScreen = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.example.com/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {data && (
        <View>
          {/* Render your data */}
        </View>
      )}
      {loading && <Loader size="small" color="#ffffff" />}
    </View>
  );
};

// Usage with custom colors
const CustomLoader = () => {
  return (
    <Loader 
      size="large" 
      color="#00b4d8" 
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});
```

### 2. LanguageProvider HOC

**Purpose**: Provides internationalization support using react-i18next for the entire application.

**File**: `src/hocs/LanguageProvider.ts`

**Features**:
- React i18next integration for internationalization
- English language support with fallback
- JSON-based translation files
- Interpolation support for dynamic content
- XSS protection with escape value configuration
- Compatibility with React Native v3

**Configuration**:
- **Resources**: English translations from `src/language/en.json`
- **Language**: English (en) as default and fallback
- **Interpolation**: Disabled escape value for React XSS protection
- **Compatibility**: React Native v3 JSON format

**Usage Example**:
```tsx
import React from 'react';
import {LanguageProvider} from 'hocs/LanguageProvider';
import App from './App';

// Wrap your app with LanguageProvider
const AppWrapper = () => {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
};

export default AppWrapper;

// Using translations in components
import React from 'react';
import {View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

const LoginScreen = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('login.button.title')}
      </Text>
      
      <TextInput
        placeholder={t('login.input.email.placeholder')}
        style={styles.input}
      />
      
      <TextInput
        placeholder={t('login.input.password.placeholder')}
        secureTextEntry
        style={styles.input}
      />
    </View>
  );
};

// Using translations with interpolation
const MovieCard = ({movie}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {t('dashboard.detail.name')}: {movie.name}
      </Text>
      <Text style={styles.subtitle}>
        {t('dashboard.detail.publisher')}: {movie.publisher}
      </Text>
      <Text style={styles.body}>
        {t('dashboard.detail.firstAppearance')}: {movie.firstappearance}
      </Text>
    </View>
  );
};

// Using translations in async operations
const DataScreen = () => {
  const {t} = useTranslation();
  const [loading, setLoading] = React.useState(false);

  const handleDataFetch = async () => {
    setLoading(true);
    try {
      // Fetch data
      await fetchData();
    } catch (error) {
      console.error(t('error.fetch.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <Loader size="large" color="#0077b6" />}
      <Text>{t('dashboard.list.title')}</Text>
    </View>
  );
};
```

**Translation System**:
The LanguageProvider uses a comprehensive translation system with the following key translations:

**Login & Authentication**:
- `login.button.title`: "Login"
- `login.input.email.placeholder`: "Email"
- `login.input.password.placeholder`: "Password"

**Loading States**:
- `loading.title`: "Loading..."

**Dashboard & Content**:
- `dashboard.list.title`: "Movie List"
- `dashboard.detail.title`: "Movie Details"
- `dashboard.button.title`: "Back"

**Detail Information**:
- `dashboard.detail.name`: "Name"
- `dashboard.detail.team`: "Team"
- `dashboard.detail.firstAppearance`: "First Appearance"
- `dashboard.detail.publisher`: "Publisher"
- `dashboard.detail.bio`: "Bio"