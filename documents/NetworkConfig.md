# Network Configuration Documentation

This document provides comprehensive documentation for all network configuration and HTTP service components in the React Native TypeScript boilerplate. These services are designed to provide type-safe API communication with proper error handling and authentication management.

## 📋 Overview

The network configuration in this boilerplate is built with Axios and TypeScript for type safety and follows HTTP service best practices. They are designed to be:

- **Type-safe** - Full TypeScript integration with proper API response types
- **Secure** - Built-in authentication and token management
- **Reliable** - Comprehensive error handling and retry mechanisms
- **Maintainable** - Clean service architecture with interceptors
- **Scalable** - Easy to extend with new endpoints and methods

## 📁 Network Configuration Files

### Core Network Components

| Component | File | Description |
|-----------|------|-------------|
| **Endpoints** | `src/networkConfig/Endpoints.ts` | API endpoint definitions and configuration |
| **HttpServices** | `src/networkConfig/HttpServices.ts` | HTTP service class with interceptors and authentication |

### Network Configuration Exports
- `src/networkConfig/Endpoints.ts` - Exports API endpoint constants
- `src/networkConfig/HttpServices.ts` - Exports HTTPService class

## 🎯 Network Configuration Details & Usage Examples

### 1. Endpoints Configuration

**Purpose**: Defines API endpoints and configuration values for the application's network requests.

**File**: `src/networkConfig/Endpoints.ts`

**Features**:
- Environment-based configuration using react-native-config
- Type-safe configuration interface
- Centralized endpoint management
- Easy to maintain and extend

**Configuration Structure**:
```tsx
interface ConfigType {
  API_KEY?: string;
  BASE_URL?: string;
}

export const Endpoints = {
  Movies: `${config.BASE_URL}/demos/marvel`,
};
```

**Usage Example**:
```tsx
import {Endpoints} from 'networkConfig/Endpoints';
import HTTPService from 'networkConfig/HttpServices';

// Fetch movies from the API
const fetchMovies = async () => {
  try {
    const response = await HTTPService.get(Endpoints.Movies);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    throw error;
  }
};

// Add new endpoints
export const Endpoints = {
  Movies: `${config.BASE_URL}/demos/marvel`,
  Users: `${config.BASE_URL}/api/users`,
  Auth: `${config.BASE_URL}/api/auth`,
  Profile: `${config.BASE_URL}/api/profile`,
};
```

### 2. HTTP Service

**Purpose**: Provides a comprehensive HTTP service with authentication, error handling, and request/response interceptors.

**File**: `src/networkConfig/HttpServices.ts`

**Features**:
- Axios-based HTTP client
- Automatic token management
- Request/response interceptors
- Token refresh mechanism
- Error handling and retry logic
- Toast notifications for errors
- Type-safe API responses

**Core Components**:

**Axios Instance Configuration**:
```tsx
const axiosInstance: AxiosInstance = axios.create({
  baseURL: '', // Set dynamically if needed
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, // 20 seconds
});
```

**Request Interceptor**:
- Automatically attaches authorization headers
- Retrieves tokens from storage service
- Handles token injection for authenticated requests

**Response Interceptor**:
- Handles authentication errors (401, 403)
- Implements token refresh logic
- Manages failed request queues
- Provides user-friendly error messages

**Usage Example**:
```tsx
import HTTPService from 'networkConfig/HttpServices';
import {Endpoints} from 'networkConfig/Endpoints';

// Basic GET request
const fetchData = async () => {
  try {
    const response = await HTTPService.get(Endpoints.Movies);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// POST request with body
const createUser = async (userData) => {
  try {
    const response = await HTTPService.post('/api/users', userData);
    console.log('User created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// PUT request for updates
const updateUser = async (userId, userData) => {
  try {
    const response = await HTTPService.put(`/api/users/${userId}`, userData);
    console.log('User updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// DELETE request
const deleteUser = async (userId) => {
  try {
    const response = await HTTPService.delete(`/api/users/${userId}`);
    console.log('User deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Request with query parameters
const searchMovies = async (query, page = 1) => {
  try {
    const params = {
      q: query,
      page: page,
      limit: 20,
    };
    const response = await HTTPService.get('/api/movies/search', params);
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

```

**Authentication Flow**:
The service automatically handles authentication through interceptors:

1. **Request Interceptor**: Attaches Bearer token to all requests
2. **Response Interceptor**: Handles 401 errors by attempting token refresh
3. **Token Refresh**: Automatically refreshes expired tokens
4. **Queue Management**: Queues failed requests during token refresh
5. **Error Handling**: Provides appropriate error messages and logout functionality

**Error Handling**:
```tsx
// Custom error handling in components
const handleApiCall = async () => {
  try {
    const response = await HTTPService.get('/api/data');
    return response.data;
  } catch (error) {
    if (error.message.includes('401')) {
      // Handle unauthorized access
      navigation.navigate('Login');
    } else if (error.message.includes('500')) {
      // Handle server errors
      showErrorMessage('Server error. Please try again later.');
    } else {
      // Handle other errors
      showErrorMessage('Something went wrong. Please try again.');
    }
  }
};
```

**Type Safety**:
The service provides type-safe API responses:

```tsx
interface Movie {
  id: string;
  name: string;
  publisher: string;
  firstappearance: string;
  imageurl: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Type-safe API calls
const fetchMovie = async (movieId: string): Promise<Movie> => {
  const response = await HTTPService.get<Movie>(`/api/movies/${movieId}`);
  return response.data;
};

const createMovie = async (movieData: Partial<Movie>): Promise<Movie> => {
  const response = await HTTPService.post<Movie>('/api/movies', movieData);
  return response.data;
};
```

**Configuration Management**:
Environment-based configuration using react-native-config:

```tsx
// .env file
BASE_URL=https://api.example.com
API_KEY=your_api_key_here

// Usage in Endpoints.ts
import Config from 'react-native-config';

const config: ConfigType = Config as ConfigType;

export const Endpoints = {
  Movies: `${config.BASE_URL}/demos/marvel`,
  Users: `${config.BASE_URL}/api/users`,
  Auth: `${config.BASE_URL}/api/auth`,
};
```