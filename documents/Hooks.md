# Hooks Documentation

This document provides comprehensive documentation for all custom hooks in the React Native TypeScript boilerplate. These hooks are designed to provide reusable logic and state management with type safety and consistent patterns.

## 📋 Overview

The hooks in this boilerplate are built with TypeScript for type safety and follow React hooks best practices. They are designed to be:

- **Reusable** - Can be used across multiple components
- **Type-safe** - Full TypeScript integration with proper type definitions
- **Performance Optimized** - Efficient state management and updates
- **Consistent** - Follow the same patterns and implementation approach
- **Composable** - Can be combined with other hooks and components

## 📁 Hook Files

### Core Hooks

| Hook | File | Description |
|------|------|-------------|
| **useTypedSelector** | `src/hooks/useTypedSelector.ts` | Type-safe Redux selector hook with full TypeScript support |

### Hook Exports
- `src/hooks/useTypedSelector.ts` - Exports useTypedSelector hook

## 🎯 Hook Details & Usage Examples

### 1. useTypedSelector Hook

**Purpose**: Provides a type-safe way to access Redux store state with full TypeScript support and automatic type inference.

**File**: `src/hooks/useTypedSelector.ts`

**Features**:
- Full TypeScript integration with automatic type inference
- Type-safe Redux state access
- Automatic type checking for state properties
- Compatible with Redux Toolkit
- Prevents runtime errors through compile-time type checking
- IntelliSense support for state properties

**Type Safety**:
- `TypedUseSelectorHook<ReduxStateType>` - Provides full type safety
- `ReduxStateType` - Automatically inferred from store configuration
- Automatic type inference for all state slices

**Redux Store Structure**:
The hook works with the following Redux store structure:

```tsx
interface ReduxStateType {
  counter: CounterState;
  app: AppState;
  user: UserState;
  dashboard: DashboardState;
}

interface CounterState {
  count: number;
}

interface UserState {
  userProfile: object;
}

interface AppState {
  // App-specific state
}

interface DashboardState {
  // Dashboard-specific state
}
```

**Usage Example**:
```tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import useTypedSelector from 'hooks/useTypedSelector';
import {useDispatch} from 'react-redux';
import {increment, decrement} from 'redux/reducer/CounterSlice';

// Basic usage with type-safe state access
const CounterComponent = () => {
  const count = useTypedSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(increment());
  };

  const handleDecrement = () => {
    dispatch(decrement());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter: {count}</Text>
      <TouchableOpacity onPress={handleIncrement} style={styles.button}>
        <Text style={styles.buttonText}>Increment</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDecrement} style={styles.button}>
        <Text style={styles.buttonText}>Decrement</Text>
      </TouchableOpacity>
    </View>
  );
};

// Advanced usage with multiple state slices
const UserDashboard = () => {
  const count = useTypedSelector((state) => state.counter.count);
  const userProfile = useTypedSelector((state) => state.user.userProfile);
  const appState = useTypedSelector((state) => state.app);
  const dashboardData = useTypedSelector((state) => state.dashboard);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Dashboard</Text>
      <Text style={styles.subtitle}>Counter: {count}</Text>
      <Text style={styles.subtitle}>
        User Profile: {JSON.stringify(userProfile)}
      </Text>
    </View>
  );
};

// Usage with conditional rendering based on state
const ConditionalComponent = () => {
  const count = useTypedSelector((state) => state.counter.count);
  const userProfile = useTypedSelector((state) => state.user.userProfile);

  if (count === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Counter is at zero</Text>
      </View>
    );
  }

  if (Object.keys(userProfile).length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No user profile available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back!</Text>
      <Text style={styles.subtitle}>Current count: {count}</Text>
    </View>
  );
};

// Usage with memoized selectors for performance
const OptimizedComponent = () => {
  const count = useTypedSelector((state) => state.counter.count);
  const userProfile = useTypedSelector((state) => state.user.userProfile);

  // Memoize expensive computations
  const isUserLoggedIn = React.useMemo(() => {
    return Object.keys(userProfile).length > 0;
  }, [userProfile]);

  const isCountEven = React.useMemo(() => {
    return count % 2 === 0;
  }, [count]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Optimized Component</Text>
      <Text style={styles.subtitle}>
        User logged in: {isUserLoggedIn ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.subtitle}>
        Count is even: {isCountEven ? 'Yes' : 'No'}
      </Text>
    </View>
  );
};

// Usage with error handling
const SafeComponent = () => {
  const count = useTypedSelector((state) => state.counter.count);
  const userProfile = useTypedSelector((state) => state.user.userProfile);

  const handleStateAccess = () => {
    try {
      // Type-safe access to state properties
      console.log('Counter value:', count);
      console.log('User profile:', userProfile);
    } catch (error) {
      console.error('Error accessing state:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safe State Access</Text>
      <TouchableOpacity onPress={handleStateAccess} style={styles.button}>
        <Text style={styles.buttonText}>Log State</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
    color: '#212529',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    color: '#6c757d',
  },
  message: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0077b6',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
```

**Redux State Management**:
The useTypedSelector hook integrates with a comprehensive Redux store structure:

**Counter Slice**:
- `count`: number - Current counter value
- `increment()`: Action to increase counter
- `decrement()`: Action to decrease counter

**User Slice**:
- `userProfile`: object - User profile information
- Future async actions for user data fetching

**App Slice**:
- Application-wide state management
- Global app configuration and settings

**Dashboard Slice**:
- Dashboard-specific data and state
- UI state for dashboard components