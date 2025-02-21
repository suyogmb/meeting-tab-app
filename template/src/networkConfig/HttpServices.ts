import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  Method,
} from 'axios';
import {getItem, storeItem} from '../utils/AsyncStorage';
import {ERROR_CODES, TOAST_TYPE} from '../utils/Constants';
import Toast from 'react-native-toast-message';
const AUTHORIZATION = 'Authorization';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '', // Set the base URL dynamically if needed
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

let isRefreshing = false;
let failedQueue: {resolve: (value?: unknown) => void; reject: (reason?: any) => void}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Attach the access token to requests
axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getItem('token'); // Retrieve token from storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Extend InternalAxiosRequestConfig to include _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Handle response errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response) {
      const {status} = error.response;

      if (status === ERROR_CODES.UNAUTHORIZED) {
        if (!originalRequest._retry) {
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const newToken = await refreshAccessToken(); // Refresh token
              storeItem('token', newToken); // Store new token
              axiosInstance.defaults.headers[AUTHORIZATION] = `Bearer ${newToken}`;
              processQueue(null, newToken);
              return axiosInstance(originalRequest);
            } catch (err) {
              processQueue(err, null);
              logoutUser();
              return Promise.reject(err);
            } finally {
              isRefreshing = false;
            }
          }

          return new Promise((resolve, reject) => {
            failedQueue.push({resolve, reject});
          })
            .then((token) => {
              originalRequest.headers![AUTHORIZATION] = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }
      } else if (status === ERROR_CODES.FORBIDDEN) {
        logoutUser();
      } else if (status === ERROR_CODES.INTERNAL_SERVER_ERROR) {
        Toast.show({
          type: TOAST_TYPE.ERROR,
          text1: 'Server error. Please try again later.',
        });
      }
    }

    return Promise.reject(error);
  },
);

async function refreshAccessToken(): Promise<string> {
  try {
    const refreshToken = await getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    //replace with your api endpoint here
    //e.x const url = 'https://mindbowser.com/auth/refresh';
    const response = await axios.post<ApiResponse<{token: string}>>('/auth/refresh', {refreshToken});
    return response.data.data.token;
  } catch (error) {
    throw new Error('Token refresh failed');
  }
}

function logoutUser() {
  // Implement logout functionality here
  // Clear local storage and navigate to login page
}

export default class HTTPService {
  private static async request<T>(
    method: Method,
    url: string,
    body?: any,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.request<ApiResponse<T>>({
        method,
        url,
        data: body,
        params,
        ...config,
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Unified error handler
  private static handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error('API Error:', message);
      return new Error(message);
    }
    return new Error('Something went wrong');
  }

  static async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('get', url, undefined, params);
  }

  static async post<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('post', url, body);
  }

  static async put<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('put', url, body);
  }

  static async delete<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('delete', url, body);
  }
}

// // Unified error handler
// function handleError(error: any): Error {
//   if (axios.isAxiosError(error)) {
//     const message = error.response?.data?.message || error.message;
//     console.error('API Error:', message);
//     return new Error(message);
//   }
//   return new Error('Something went wrong');
// }
