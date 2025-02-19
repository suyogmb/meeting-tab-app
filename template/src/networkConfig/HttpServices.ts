import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {getItem, storeItem} from '../utils/AsyncStorage';
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
axiosInstance.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const token = await getItem('token'); // Retrieve token from storage
  if (token) {
    config.headers![AUTHORIZATION] = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config!;

    if (error.response) {
      const {status} = error.response;

      if (status === 401) {
        if (!originalRequest._retry) {
          originalRequest._retry = true;

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
      } else if (status === 403) {
        logoutUser();
      } else if (status === 500) {
        console.error('Server error. Please try again later.');
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
  static async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.get<ApiResponse<T>>(url, {params});
      return response?.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  static async post<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.post<ApiResponse<T>>(url, body);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  static async put<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.put<ApiResponse<T>>(url, body);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  static async delete<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<T>>(url, {data: body});
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }
}

// Unified error handler
function handleError(error: any): Error {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    console.error('API Error:', message);
    return new Error(message);
  }
  return new Error('Something went wrong');
}
