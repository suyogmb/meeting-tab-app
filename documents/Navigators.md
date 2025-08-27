# Navigators Documentation

This document provides comprehensive documentation for all navigation components and routing logic in the React Native TypeScript boilerplate. These navigators are designed to provide type-safe navigation with proper screen management and authentication flow.

## 📋 Overview

The navigators in this boilerplate are built with React Navigation v6 and TypeScript for type safety and follow navigation best practices. They are designed to be:

- **Type-safe** - Full TypeScript integration with proper navigation types
- **Hierarchical** - Clear navigation structure with proper nesting
- **Authentication-aware** - Conditional navigation based on user login status
- **Scalable** - Easy to add new screens and navigation flows
- **Consistent** - Follow the same patterns and implementation approach

## 📁 Navigator Files

### Core Navigation Components

| Navigator | File | Description |
|-----------|------|-------------|
| **RootStackNavigator** | `src/navigators/RootStackNavigator.tsx` | Root navigation container with authentication logic |
| **AuthStackNavigator** | `src/navigators/AuthStackNavigator.tsx` | Authentication flow navigation stack |
| **MainStackNavigator** | `src/navigators/MainStackNavigator.tsx` | Main app navigation stack for authenticated users |
| **HomeTabNavigator** | `src/navigators/HomeTabNavigator.tsx` | Bottom tab navigation for main app screens |
| **routes.ts** | `src/navigators/routes.ts` | Navigation route constants and enums |

### Navigator Exports
- `src/navigators/RootStackNavigator.tsx` - Exports RootStackNavigator component
- `src/navigators/AuthStackNavigator.tsx` - Exports AuthStackNavigator component
- `src/navigators/MainStackNavigator.tsx` - Exports MainStackNavigator component
- `src/navigators/HomeTabNavigator.tsx` - Exports HomeTabNavigator component
- `src/navigators/routes.ts` - Exports navigation route constants

## 🎯 Navigator Details & Usage Examples

### 1. Routes Configuration

**Purpose**: Defines navigation route constants and enums for type-safe navigation throughout the application.

**File**: `src/navigators/routes.ts`

**Features**:
- Enum-based route definitions
- Type-safe navigation constants
- Organized by navigation stack
- Easy to maintain and extend

**Route Structure**:
```tsx
enum MAIN_STACK_NAVIGATOR {
  HOME_TAB_NAVIGATOR = 'HOME_TAB_NAVIGATOR',
}

enum AUTH_STACK_NAVIGATOR {
  LOGIN_SCREEN = 'LOGIN_SCREEN',
  HOME = 'HOME',
  HOME_DETAILS = 'HOME_DETAILS',
}

enum HOME_TAB_NAVIGATOR {
  HOME = 'HOME',
  HOME_DETAILS = 'HOME_DETAILS',
}
```

**Usage Example**:
```tsx
import {AUTH_STACK_NAVIGATOR, HOME_TAB_NAVIGATOR} from 'navigators/routes';

// Navigate to login screen
navigation.navigate(AUTH_STACK_NAVIGATOR.LOGIN_SCREEN);

// Navigate to home details
navigation.navigate(HOME_TAB_NAVIGATOR.HOME_DETAILS, {
  data: { name: 'Movie Name' }
});
```

### 2. RootStackNavigator

**Purpose**: Root navigation container that manages authentication state and provides conditional navigation between authenticated and unauthenticated flows.

**File**: `src/navigators/RootStackNavigator.tsx`

**Features**:
- Authentication state management
- Conditional navigation rendering
- Firebase analytics integration
- Boot splash handling
- Error boundary wrapper
- Storage service integration

**Navigation Logic**:
- Renders `MainStackNavigator` when user has access token
- Renders `AuthStackNavigator` when user is not authenticated
- Integrates with Redux state for authentication status

**Usage Example**:
```tsx
import React from 'react';
import RootStackNavigator from 'navigators/RootStackNavigator';

const App = () => {
  return (
    <RootStackNavigator />
  );
};

export default App;
```

### 3. AuthStackNavigator

**Purpose**: Manages navigation for unauthenticated users, including login screen and limited access screens.

**File**: `src/navigators/AuthStackNavigator.tsx`

**Features**:
- Stack-based navigation
- Type-safe navigation parameters
- Screen-specific options configuration
- Movie details data passing

**Screen Configuration**:
- `LOGIN_SCREEN`: Login component with hidden header
- `HOME`: Home component with hidden header
- `HOME_DETAILS`: Details screen with hidden header and data parameter

**Type Definitions**:
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
  LOGIN_SCREEN: undefined;
  HOME: undefined;
  HOME_DETAILS: {data?: MovieDetails};
};
```

**Usage Example**:
```tsx
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {AUTH_STACK_NAVIGATOR} from 'navigators/routes';

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleLoginSuccess = () => {
    // Navigate to home after successful login
    navigation.navigate(AUTH_STACK_NAVIGATOR.HOME);
  };

  const handleViewDetails = (movieData) => {
    navigation.navigate(AUTH_STACK_NAVIGATOR.HOME_DETAILS, {
      data: movieData
    });
  };

  return (
    <View style={styles.container}>
      {/* Login form */}
      <TouchableOpacity onPress={handleLoginSuccess}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### 4. MainStackNavigator

**Purpose**: Manages navigation for authenticated users, providing access to the main application features.

**File**: `src/navigators/MainStackNavigator.tsx`

**Features**:
- Stack-based navigation
- Hidden headers by default
- Integration with tab navigator
- Clean navigation structure

**Screen Configuration**:
- `HOME_TAB_NAVIGATOR`: Home tab navigator component

**Usage Example**:
```tsx
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {MAIN_STACK_NAVIGATOR} from 'navigators/routes';

const MainScreen = () => {
  const navigation = useNavigation();

  const navigateToHomeTabs = () => {
    navigation.navigate(MAIN_STACK_NAVIGATOR.HOME_TAB_NAVIGATOR);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateToHomeTabs}>
        <Text>Go to Home Tabs</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### 5. HomeTabNavigator

**Purpose**: Provides bottom tab navigation for the main application screens, allowing users to switch between different sections.

**File**: `src/navigators/HomeTabNavigator.tsx`

**Features**:
- Bottom tab navigation
- Type-safe navigation parameters
- Movie details data passing
- Hidden headers by default

**Tab Configuration**:
- `HOME`: Home screen tab
- `HOME_DETAILS`: Details screen tab with data parameter

**Type Definitions**:
```tsx
interface MovieDetails {
  name?: string;
  imageurl?: string;
  team?: string;
  firstappearance?: string;
  publisher?: string;
  bio?: string;
}

type HomeTabParamList = {
  HOME: undefined;
  HOME_DETAILS: {data?: MovieDetails};
};
```

**Usage Example**:
```tsx
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {HOME_TAB_NAVIGATOR} from 'navigators/routes';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleMoviePress = (movieData) => {
    navigation.navigate(HOME_TAB_NAVIGATOR.HOME_DETAILS, {
      data: movieData
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleMoviePress(movieData)}>
        <Text>View Movie Details</Text>
      </TouchableOpacity>
    </View>
  );
};
```

**Navigation Flow**:
The application follows this navigation hierarchy:

```
RootStackNavigator
├── AuthStackNavigator (when not authenticated)
│   ├── LOGIN_SCREEN
│   ├── HOME
│   └── HOME_DETAILS
└── MainStackNavigator (when authenticated)
    └── HomeTabNavigator
        ├── HOME
        └── HOME_DETAILS
```

**Navigation Parameters**:
Each screen can receive specific parameters:

- **LOGIN_SCREEN**: No parameters
- **HOME**: No parameters
- **HOME_DETAILS**: `{data?: MovieDetails}` - Optional movie data object
