# Language Documentation

This document provides comprehensive documentation for all language and internationalization (i18n) resources in the React Native TypeScript boilerplate. These language files are designed to provide consistent text localization with type safety and maintainable structure.

## 📋 Overview

The language resources in this boilerplate are built with JSON format for easy maintenance and follow i18n best practices. They are designed to be:

- **Maintainable** - Easy to update and manage text content
- **Scalable** - Support for multiple languages and locales
- **Consistent** - Follow the same naming conventions and structure
- **Type-safe** - Integration with TypeScript for compile-time checking
- **Organized** - Logical grouping of related text content

## 📁 Language Files

### Core Language Resources

| Language | File | Description |
|----------|------|-------------|
| **English** | `src/language/en.json` | English language translations for the application |

### Language Exports
- `src/language/en.json` - Exports English language translations

## 🎯 Language Details & Usage Examples

### 1. English Language Resource

**Purpose**: Provides English language translations for all user-facing text in the application.

**File**: `src/language/en.json`

**Features**:
- JSON-based translation structure
- Hierarchical key organization
- Consistent naming conventions
- Support for placeholders and interpolation
- Easy to extend and maintain
- Compatible with react-i18next

**Translation Structure**:
The language file uses a hierarchical structure organized by feature and context:

```json
{
  "feature.section.element": "Translation Value"
}
```

**Usage Example**:
```tsx
import React from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

// Basic translation usage
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
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        placeholder={t('login.input.password.placeholder')}
        style={styles.input}
        secureTextEntry
        autoCapitalize="none"
      />
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          {t('login.button.title')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Usage with loading states
const LoadingComponent = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0077b6" />
      <Text style={styles.loadingText}>
        {t('loading.title')}
      </Text>
    </View>
  );
};

// Usage in dashboard components
const DashboardScreen = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('dashboard.list.title')}
      </Text>
      
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.buttonText}>
          {t('dashboard.button.title')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Usage with movie details
const MovieDetailScreen = ({movie}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('dashboard.detail.title')}
      </Text>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>
          {t('dashboard.detail.name')}:
        </Text>
        <Text style={styles.value}>{movie.name}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>
          {t('dashboard.detail.publisher')}:
        </Text>
        <Text style={styles.value}>{movie.publisher}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>
          {t('dashboard.detail.firstAppearance')}:
        </Text>
        <Text style={styles.value}>{movie.firstappearance}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>
          {t('dashboard.detail.team')}:
        </Text>
        <Text style={styles.value}>{movie.team}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>
          {t('dashboard.detail.bio')}:
        </Text>
        <Text style={styles.value}>{movie.bio}</Text>
      </View>
    </View>
  );
};

// Usage with conditional rendering
const ConditionalComponent = ({isLoading, hasError}) => {
  const {t} = useTranslation();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          {t('loading.title')}
        </Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorMessage}>
          Error occurred
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('dashboard.list.title')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#212529',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#0077b6',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6c757d',
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingVertical: 5,
  },
  label: {
    fontWeight: 'bold',
    width: 120,
    color: '#495057',
  },
  value: {
    flex: 1,
    color: '#212529',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: '#6c757d',
  },
  errorMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: '#dc3545',
  },
});
```

**Translation Categories**:
The language file is organized into logical categories for easy maintenance:

**Authentication & Login**:
- `login.button.title`: "Login" - Login button text
- `login.input.email.placeholder`: "Email" - Email input placeholder
- `login.input.password.placeholder`: "Password" - Password input placeholder

**Loading States**:
- `loading.title`: "Loading..." - Loading indicator text

**Dashboard & Navigation**:
- `dashboard.list.title`: "Movie List" - Dashboard list header
- `dashboard.detail.title`: "Movie Details" - Detail screen header
- `dashboard.button.title`: "Back" - Back button text

**Detail Information**:
- `dashboard.detail.name`: "Name" - Name field label
- `dashboard.detail.team`: "Team" - Team field label
- `dashboard.detail.firstAppearance`: "First Appearance" - First appearance field label
- `dashboard.detail.publisher`: "Publisher" - Publisher field label
- `dashboard.detail.bio`: "Bio" - Bio field label

**Translation Key Naming Convention**:
The translation keys follow a consistent naming pattern:

```
feature.section.element
```

Examples:
- `login.button.title` - Login feature, button section, title element
- `dashboard.detail.name` - Dashboard feature, detail section, name element
- `loading.title` - Loading feature, title element