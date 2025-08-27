# Components Documentation

This document provides comprehensive documentation for all reusable components in the React Native TypeScript boilerplate. These components are designed to be modular, type-safe, and follow consistent design patterns.

## 📋 Overview

The components in this boilerplate are built with TypeScript for type safety and follow React Native best practices. They are designed to be:

- **Reusable** - Can be used across different screens and features
- **Type-safe** - Full TypeScript integration with proper prop types
- **Customizable** - Accept props for styling and behavior customization
- **Accessible** - Built with accessibility in mind
- **Consistent** - Follow the same design patterns and styling approach

## 📁 Component Files

### Core Components

| Component | File | Description |
|-----------|------|-------------|
| **ErrorHandler** | `src/components/ErrorHandler.tsx` | Error boundary component for graceful error handling |
| **Flatlist** | `src/components/Flatlist.tsx` | Custom FlatList component with enhanced features |
| **Header** | `src/components/Header.tsx` | Navigation header component with back button |
| **Image** | `src/components/Image.tsx` | Custom Image component with error handling |
| **ReusableButton** | `src/components/ReusableButton.tsx` | Versatile button component with multiple variants |
| **Text** | `src/components/Text.tsx` | Custom Text component with typography support |
| **TextInput** | `src/components/TextInput.tsx` | Enhanced TextInput with validation support |

### Component Exports
- `src/components/index.ts` - Central export file for all components

## 🎯 Component Details & Usage Examples

### 1. ErrorHandler Component

**Purpose**: Provides error boundary functionality to catch and handle JavaScript errors gracefully.

**File**: `src/components/ErrorHandler.tsx`

**Features**:
- Catches JavaScript errors in child components
- Displays user-friendly error messages
- Prevents app crashes
- Logs errors for debugging

**Usage Example**:
```tsx
import React from 'react';
import {ErrorHandler} from 'components';

const App = () => {
  return (
    <ErrorHandler>
      <YourAppContent />
    </ErrorHandler>
  );
};

// Or wrap specific components
const Screen = () => {
  return (
    <ErrorHandler>
      <RiskyComponent />
    </ErrorHandler>
  );
};
```

### 2. Flatlist Component

**Purpose**: Enhanced FlatList component with built-in loading states, error handling, and empty states.

**File**: `src/components/Flatlist.tsx`

**Features**:
- Loading indicator
- Empty state handling
- Error state display
- Pull-to-refresh functionality
- Infinite scrolling support
- Type-safe data handling

**Usage Example**:
```tsx
import React from 'react';
import {Flatlist} from 'components';

interface User {
  id: string;
  name: string;
  email: string;
}

const UserList = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const renderUser = ({item}: {item: User}) => (
    <View style={styles.userItem}>
      <Text>{item.name}</Text>
      <Text>{item.email}</Text>
    </View>
  );

  const onRefresh = async () => {
    setLoading(true);
    try {
      // Fetch users
      const response = await fetchUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flatlist
      data={users}
      renderItem={renderUser}
      keyExtractor={(item) => item.id}
      onRefresh={onRefresh}
      refreshing={loading}
    />
  );
};
```

### 3. Header Component

**Purpose**: Navigation header component with back button and customizable title.

**File**: `src/components/Header.tsx`

**Features**:
- Back button with navigation
- Customizable title
- Right action buttons
- Theme-aware styling
- Safe area handling

**Usage Example**:
```tsx
import React from 'react';
import {Header} from 'components';
import {useNavigation} from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEditPress = () => {
    // Navigate to edit screen
    navigation.navigate('EditProfile');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Profile"
        showBackButton
        onBackPress={handleBackPress}
        rightComponent={
          <TouchableOpacity onPress={handleEditPress}>
            <Text>Edit</Text>
          </TouchableOpacity>
        }
      />
      {/* Screen content */}
    </View>
  );
};
```

### 4. Image Component

**Purpose**: Enhanced Image component with error handling and loading states.

**File**: `src/components/Image.tsx`

**Features**:
- Error state handling
- Loading indicator
- Placeholder image support
- Caching support
- Responsive sizing

**Usage Example**:
```tsx
import React from 'react';
import {Image} from 'components';

const ProductCard = ({product}) => {
  return (
    <View style={styles.card}>
      <Image
        source={{uri: product.imageUrl}}
        style={styles.productImage}
        onError={() => console.log('Image failed to load')}
        resizeMode="cover"
      />
      <Text>{product.name}</Text>
    </View>
  );
};

// With local image
const Logo = () => {
  return (
    <Image
      source={require('../assets/logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
};
```

### 5. ReusableButton Component

**Purpose**: Versatile button component with multiple variants and states.

**File**: `src/components/ReusableButton.tsx`

**Features**:
- Multiple button variants (primary, secondary, outline)
- Loading state
- Disabled state
- Custom styling
- Icon support
- Accessibility features

**Usage Example**:
```tsx
import React from 'react';
import {ReusableButton} from 'components';

const LoginScreen = () => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Login logic
      await performLogin();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Primary button */}
      <ReusableButton
        title="Login"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.loginButton}
      />

      {/* Secondary button */}
      <ReusableButton
        title="Sign Up"
        onPress={() => navigation.navigate('SignUp')}
        style={styles.signUpButton}
      />

      {/* Outline button */}
      <ReusableButton
        title="Forgot Password?"
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotButton}
      />

      {/* Button with icon */}
      <ReusableButton
        title="Continue with Google"
        onPress={handleGoogleLogin}
        style={styles.googleButton}
      />
    </View>
  );
};
```

### 6. Text Component

**Purpose**: Custom Text component with typography support and theme integration.

**File**: `src/components/Text.tsx`

**Features**:
- Typography variants (HEADING, BODY, CAPTION, TITLE, SUBTITLE, BUTTON, OVERLINE, LABEL, INPUT)
- Theme-aware styling with automatic color application
- Custom font support with Poppins font family
- Automatic text capitalization
- Responsive typography system

**Typography System**:
The Text component uses a comprehensive typography system defined in `src/utils/Typography.ts`:

- **HEADING**: 24px, bold, for main headings
- **TITLE**: 20px, bold, for section titles
- **SUBTITLE**: 18px, semi-bold, for subtitles
- **BODY**: 16px, regular, for main content
- **CAPTION**: 12px, regular, for small text
- **BUTTON**: 14px, bold, for button text
- **LABEL**: 14px, regular, for form labels
- **INPUT**: 16px, regular, for input text
- **OVERLINE**: 10px, regular, for overline text

**Usage Example** (Based on Home Screen Implementation):
```tsx
import React from 'react';
import {View, TouchableOpacity, Image, FlatList} from 'react-native';
import {Text} from 'components';
import {getTypographyStyle, TypographyStyleEnum} from 'utils/Typography';

interface Movie {
  name: string;
  publisher: string;
  firstappearance: string;
  imageurl: string;
}

const MovieCard = ({movie}: {movie: Movie}) => {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.content}>
        {/* Title with TITLE typography */}
        <Text style={{
          ...styles.text,
          ...getTypographyStyle(TypographyStyleEnum.TITLE)
        }}>
          {movie.name}
        </Text>
        
        {/* Subtitle with SUBTITLE typography */}
        <Text style={{
          ...styles.text,
          ...getTypographyStyle(TypographyStyleEnum.SUBTITLE)
        }}>
          {movie.publisher}
        </Text>
        
        {/* Body text with BODY typography */}
        <Text style={{
          ...styles.text,
          ...getTypographyStyle(TypographyStyleEnum.BODY)
        }}>
          {movie.firstappearance}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Complete Home Screen Example
const HomeScreen = () => {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  
  const renderMovie = ({item}: {item: Movie}) => (
    <MovieCard movie={item} />
  );

  return (
    <View style={styles.container}>
      {/* Header with HEADING typography */}
      <Text style={{
        ...styles.headerText,
        ...getTypographyStyle(TypographyStyleEnum.HEADING)
      }}>
        Movie List
      </Text>
      
      {/* Movie list */}
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.name}
      />
      
      {/* Footer with CAPTION typography */}
      <Text style={{
        ...styles.footerText,
        ...getTypographyStyle(TypographyStyleEnum.CAPTION)
      }}>
        Total: {movies.length} movies
      </Text>
    </View>
  );
};

### 7. TextInput Component

**Purpose**: Enhanced TextInput component with validation and error handling.

**File**: `src/components/TextInput.tsx`

**Features**:
- Error state display
- Validation support
- Custom styling
- Placeholder text
- Secure text entry
- Keyboard types
- Auto-capitalization

**Usage Example**:
```tsx
import React from 'react';
import {TextInput} from 'components';

const LoginForm = () => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={formik.values.email}
        onChangeText={formik.handleChange('email')}
        onBlur={formik.handleBlur('email')}
        error={formik.touched.email && formik.errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        error={formik.touched.password && formik.errors.password}
        secureTextEntry
        autoCapitalize="none"
        style={styles.input}
      />

      <ReusableButton
        title="Login"
      />
    </View>
  );
};
```

