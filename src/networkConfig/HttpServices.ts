import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  Method,
} from 'axios';
import Toast from 'react-native-toast-message';
import {ApiResponse} from 'types/types';
import {ERROR_CODES, TOAST_TYPE} from '../utils/Constants';
import i18n from '../language/i18n';

/**
 * HTTP Service for Kiosk App API communication
 * Handles API requests with error handling and response interceptors
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: '', // Set the base URL dynamically if needed
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request interceptor - can be extended to add API keys, device tokens, etc.
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add any request headers here (e.g., API key, device ID, etc.)
    // Example:
    // const deviceId = await StorageService.getItem('deviceId');
    // if (deviceId) {
    //   config.headers['X-Device-ID'] = deviceId;
    // }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handles errors globally
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const {status} = error.response;

      if (status === ERROR_CODES.UNAUTHORIZED) {
        // Handle unauthorized access
        Toast.show({
          type: TOAST_TYPE.ERROR,
          text1: i18n.t('http.error.unauthorized'),
        });
      } else if (status === ERROR_CODES.FORBIDDEN) {
        // Handle forbidden access
        Toast.show({
          type: TOAST_TYPE.ERROR,
          text1: i18n.t('http.error.forbidden'),
        });
      } else if (status === ERROR_CODES.INTERNAL_SERVER_ERROR) {
        Toast.show({
          type: TOAST_TYPE.ERROR,
          text1: i18n.t('http.error.server'),
        });
      }
    }

    return Promise.reject(error);
  },
);

export default class HTTPService {
  private static async request<T>(
    method: Method,
    url: string,
    body?: Record<string, unknown>,
    params?: Record<string, unknown>,
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
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Unified error handler
  private static handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || error.message || i18n.t('http.error.generic');
      console.error('API Error:', message);
      return new Error(message);
    }
    return new Error(i18n.t('http.error.generic'));
  }

  static async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('get', url, undefined, params);
  }

  static async post<T>(url: string, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('post', url, body);
  }

  static async put<T>(url: string, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('put', url, body);
  }

  static async delete<T>(url: string, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('delete', url, body);
  }
}
