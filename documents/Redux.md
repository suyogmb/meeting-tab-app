# Redux Documentation

This document provides comprehensive documentation for all Redux state management components in the React Native TypeScript boilerplate. These Redux components are designed to provide centralized state management with type safety and predictable data flow.

## 📋 Overview

The Redux implementation in this boilerplate is built with Redux Toolkit and TypeScript for type safety and follows Redux best practices. They are designed to be:

- **Type-safe** - Full TypeScript integration with proper state and action types
- **Centralized** - Single source of truth for application state
- **Predictable** - Predictable state updates through reducers
- **Maintainable** - Clean slice architecture with clear separation of concerns
- **Scalable** - Easy to add new slices and extend existing functionality

## 📁 Redux Files

### Core Redux Components

| Component | File | Description |
|-----------|------|-------------|
| **Store** | `src/redux/app/store.ts` | Main Redux store configuration |
| **Constants** | `src/redux/constants/index.ts` | Redux action constants and thunk actions |
| **AppSlice** | `src/redux/reducer/AppSlice/index.ts` | Application-wide state management |
| **CounterSlice** | `src/redux/reducer/CounterSlice/index.ts` | Counter state management with basic actions |
| **UserSlice** | `src/redux/reducer/UserSlice/index.ts` | User profile state management |
| **DashboardSlice** | `src/redux/reducer/DashboardSlice/index.ts` | Dashboard data management with async thunks |

### Redux Exports
- `src/redux/app/store.ts` - Exports store, ReduxStateType, and AppDispatch
- `src/redux/constants/index.ts` - Exports ThunkActions constants
- `src/redux/reducer/*/index.ts` - Exports slice reducers and actions

## 🎯 Redux Details & Usage Examples

### 1. Store Configuration

**Purpose**: Central Redux store that combines all reducers and provides the application's state management.

**File**: `src/redux/app/store.ts`

**Features**:
- Redux Toolkit store configuration
- Automatic type inference for state and dispatch
- Combined reducer configuration
- Type-safe store exports

**Store Structure**:
```tsx
const store = configureStore({
  reducer: {
    counter: counterReducer,
    app: appReducer,
    user: userReducer,
    dashboard: dashboardSlice,
  },
});

// Type inference
export type ReduxStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Usage Example**:
```tsx
import React from 'react';
import {Provider} from 'react-redux';
import store from 'redux/app/store';
import App from './App';

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppWrapper;
```

### 2. Redux Constants

**Purpose**: Defines action constants and thunk action types for consistent Redux usage.

**File**: `src/redux/constants/index.ts`

**Features**:
- Centralized action constants
- Thunk action definitions
- Easy to maintain and extend

**Constants Structure**:
```tsx
export const ThunkActions = {
  GET_MOVIES: 'home/dashboard',
  GET_USER_PROFILE: 'userProfile/profile',
};
```

**Usage Example**:
```tsx
import {ThunkActions} from 'redux/constants';

// Use in async thunks
export const getMoviesData = createAsyncThunk(
  ThunkActions.GET_MOVIES,
  async () => {
    // API call implementation
  }
);

// Use in components
const handleGetMovies = () => {
  dispatch(getMoviesData());
};
```

### 3. App Slice

**Purpose**: Manages application-wide state including authentication tokens and global settings.

**File**: `src/redux/reducer/AppSlice/index.ts`

**Features**:
- Access token management
- Simple state updates
- Type-safe actions

**State Interface**:
```tsx
export interface AppState {
  accessToken: string;
}

const initialState: AppState = {
  accessToken: '',
};
```

**Actions**:
```tsx
export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const {setToken} = appSlice.actions;
```

**Usage Example**:
```tsx
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setToken} from 'redux/reducer/AppSlice';
import useTypedSelector from 'hooks/useTypedSelector';

const LoginComponent = () => {
  const dispatch = useDispatch();
  const accessToken = useTypedSelector((state) => state.app.accessToken);

  const handleLogin = async (credentials) => {
    try {
      const response = await loginAPI(credentials);
      dispatch(setToken(response.accessToken));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Token: {accessToken}</Text>
      <TouchableOpacity onPress={() => handleLogin(credentials)}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### 4. Counter Slice

**Purpose**: Demonstrates basic Redux state management with simple increment/decrement actions.

**File**: `src/redux/reducer/CounterSlice/index.ts`

**Features**:
- Basic counter state management
- Increment and decrement actions
- Immer-based immutable updates

**State Interface**:
```tsx
export interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 0,
};
```

**Actions**:
```tsx
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
  },
});

export const {increment, decrement} = counterSlice.actions;
```

**Usage Example**:
```tsx
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {increment, decrement} from 'redux/reducer/CounterSlice';
import useTypedSelector from 'hooks/useTypedSelector';

const CounterComponent = () => {
  const dispatch = useDispatch();
  const count = useTypedSelector((state) => state.counter.count);

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
```

### 5. User Slice

**Purpose**: Manages user profile state with prepared structure for future async operations.

**File**: `src/redux/reducer/UserSlice/index.ts`

**Features**:
- User profile state management
- Prepared for async thunk implementation
- Type-safe state interface

**State Interface**:
```tsx
export interface UserState {
  userProfile: object;
}

const initialState: UserState = {
  userProfile: {},
};
```

**Future Implementation**:
```tsx
// Future async thunk implementation
export const getUserProfileData = createAsyncThunk<
  UserProfileResponse,
  void,
  {rejectValue: ErrorResponse}
>(ThunkActions.GET_USER_PROFILE, async (_, {rejectWithValue}) => {
  try {
    const response = await HTTPService.get('/api/user/profile');
    return response.data;
  } catch (error: any) {
    return rejectWithValue({message: error.message || 'Something went wrong'});
  }
});

// Future extra reducers
builder.addCase(getUserProfileData.pending, (state) => {
  // Handle loading state
});
builder.addCase(getUserProfileData.fulfilled, (state, action) => {
  state.userProfile = action.payload;
});
builder.addCase(getUserProfileData.rejected, (state, action) => {
  // Handle error state
});
```

**Usage Example**:
```tsx
import React from 'react';
import useTypedSelector from 'hooks/useTypedSelector';

const UserProfileComponent = () => {
  const userProfile = useTypedSelector((state) => state.user.userProfile);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text>Profile Data: {JSON.stringify(userProfile)}</Text>
    </View>
  );
};
```

### 6. Dashboard Slice

**Purpose**: Manages dashboard data with async thunk operations for API calls.

**File**: `src/redux/reducer/DashboardSlice/index.ts`

**Features**:
- Async thunk implementation
- Movie data management
- Error handling
- Loading states

**State Interface**:
```tsx
export interface Movie {
  name?: string;
  imageurl?: string;
  firstappearance?: string;
  publisher?: string;
}

export interface DashboardState {
  movieData: Movie[];
}

const initialState: DashboardState = {
  movieData: [],
};
```

**Async Thunk**:
```tsx
export const getMoviesData = createAsyncThunk<
  Movie[],
  void,
  {rejectValue: ErrorResponse}
>(ThunkActions.GET_MOVIES, async (_, {rejectWithValue, fulfillWithValue}) => {
  try {
    const response = await HTTPService.get(Endpoints.Movies);
    if (Array.isArray(response)) {
      return fulfillWithValue(response) as unknown as Movie[];
    } else {
      return fulfillWithValue([response]) as unknown as Movie[];
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue({message: error.message});
    }
    return rejectWithValue({message: 'Something went wrong'});
  }
});
```

**Reducers**:
```tsx
export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMoviesData.pending, (_state, _action) => {
      // Handle loading state
    });
    builder.addCase(getMoviesData.fulfilled, (state, action) => {
      state.movieData = action.payload;
    });
    builder.addCase(getMoviesData.rejected, (_state, _action) => {
      // Handle error state
    });
  },
});
```

**Usage Example**:
```tsx
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getMoviesData} from 'redux/reducer/DashboardSlice';
import useTypedSelector from 'hooks/useTypedSelector';

const DashboardComponent = () => {
  const dispatch = useDispatch();
  const movieData = useTypedSelector((state) => state.dashboard.movieData);

  useEffect(() => {
    dispatch(getMoviesData());
  }, [dispatch]);

  const renderMovie = (movie, index) => (
    <View key={index} style={styles.movieCard}>
      <Text style={styles.movieTitle}>{movie.name}</Text>
      <Text style={styles.moviePublisher}>{movie.publisher}</Text>
      <Text style={styles.movieAppearance}>{movie.firstappearance}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {movieData.map(renderMovie)}
    </View>
  );
};
```

**Complete Redux Usage Example**:
```tsx
import React from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import useTypedSelector from 'hooks/useTypedSelector';
import {increment, decrement} from 'redux/reducer/CounterSlice';
import {setToken} from 'redux/reducer/AppSlice';
import {getMoviesData} from 'redux/reducer/DashboardSlice';

const ReduxExampleComponent = () => {
  const dispatch = useDispatch();
  
  // Select state from multiple slices
  const count = useTypedSelector((state) => state.counter.count);
  const accessToken = useTypedSelector((state) => state.app.accessToken);
  const movieData = useTypedSelector((state) => state.dashboard.movieData);
  const userProfile = useTypedSelector((state) => state.user.userProfile);

  const handleIncrement = () => dispatch(increment());
  const handleDecrement = () => dispatch(decrement());
  const handleSetToken = () => dispatch(setToken('new-token-123'));
  const handleGetMovies = () => dispatch(getMoviesData());

  const renderMovie = ({item, index}) => (
    <View style={styles.movieCard}>
      <Text style={styles.movieTitle}>{item.name}</Text>
      <Text style={styles.moviePublisher}>{item.publisher}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redux State Management</Text>
      
      {/* Counter Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Counter: {count}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleIncrement} style={styles.button}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDecrement} style={styles.button}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App State Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Access Token: {accessToken}</Text>
        <TouchableOpacity onPress={handleSetToken} style={styles.button}>
          <Text style={styles.buttonText}>Update Token</Text>
        </TouchableOpacity>
      </View>

      {/* Dashboard Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Movies ({movieData.length})</Text>
        <TouchableOpacity onPress={handleGetMovies} style={styles.button}>
          <Text style={styles.buttonText}>Fetch Movies</Text>
        </TouchableOpacity>
        <FlatList
          data={movieData}
          renderItem={renderMovie}
          keyExtractor={(_, index) => index.toString()}
          style={styles.movieList}
        />
      </View>

      {/* User Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Profile</Text>
        <Text>{JSON.stringify(userProfile)}</Text>
      </View>
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
    textAlign: 'center',
    color: '#212529',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#495057',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#0077b6',
    padding: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  movieList: {
    maxHeight: 200,
  },
  movieCard: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  moviePublisher: {
    fontSize: 14,
    color: '#6c757d',
  },
});
```

**State Structure**:
The Redux store maintains the following state structure:

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

interface AppState {
  accessToken: string;
}

interface UserState {
  userProfile: object;
}

interface DashboardState {
  movieData: Movie[];
}

interface Movie {
  name?: string;
  imageurl?: string;
  firstappearance?: string;
  publisher?: string;
}
```