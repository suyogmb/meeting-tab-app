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
import NetworkService from '../services/network/NetworkService';
import RequestQueueService from '../services/queue/RequestQueueService';
import {logger} from '../utils/SecureLogger';

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

// Request interceptor - checks network connectivity before making requests
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Check network connectivity before making request
    const isConnected = await NetworkService.isConnected();
    const isInternetReachable = await NetworkService.isInternetReachable();

    if (!isConnected || !isInternetReachable) {
      // Network is offline - queue the request for later retry
      logger.warn('API request blocked: device is offline, queuing request', {
        url: config.url,
        method: config.method,
        isConnected,
        isInternetReachable,
      });
      
      // Determine request priority (POST/PUT are higher priority than GET/DELETE)
      const priority = ['POST', 'PUT'].includes(config.method?.toUpperCase() || '') ? 1 : 0;
      
      // Queue the request
      const requestId = await RequestQueueService.enqueue(
        (config.method as Method) || 'GET',
        config.url || '',
        config.data as Record<string, unknown> | undefined,
        config.params as Record<string, unknown> | undefined,
        config,
        priority,
      );

      if (requestId) {
        logger.info('Request queued successfully', {
          requestId,
          url: config.url,
          method: config.method,
        });
      } else {
        logger.error('Failed to queue request', {
          url: config.url,
          method: config.method,
        });
      }
      
      // Reject with a CanceledError that we can identify
      const error = new Error(i18n.t('http.error.offline'));
      error.name = 'CanceledError';
      return Promise.reject(error);
    }

    // Add any request headers here (e.g., API key, device ID, etc.)
    // Example:
    // const deviceId = await StorageService.getItem('deviceId');
    // if (deviceId) {
    //   config.headers['X-Device-ID'] = deviceId;
    // }
    
    logger.debug('API request initiated', {
      url: config.url,
      method: config.method,
    });
    
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handles errors globally
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    logger.debug('API response received', {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  async (error: unknown) => {
    // Check if it's a cancelled request (offline detection)
    if (error instanceof Error && error.name === 'CanceledError') {
      logger.warn('API request cancelled: offline', {
        message: error.message,
      });
      return Promise.reject(new Error(i18n.t('http.error.offline')));
    }

    // Check if it's an Axios error
    if (axios.isAxiosError(error)) {
      // Check if it's a network error (no response received)
      if (!error.response) {
        // Network error - check current connectivity
        const isConnected = await NetworkService.isConnected();
        const isInternetReachable = await NetworkService.isInternetReachable();

        if (!isConnected || !isInternetReachable) {
          logger.warn('API request failed: device is offline', {
            url: error.config?.url,
            message: error.message,
          });
          return Promise.reject(new Error(i18n.t('http.error.offline')));
        }

        // Network error but device appears online (timeout, DNS, etc.)
        logger.error('API request failed: network error', {
          url: error.config?.url,
          message: error.message,
          code: error.code,
        });
        return Promise.reject(new Error(i18n.t('http.error.network')));
      }

      // Handle HTTP response errors
      const {status} = error.response;

      if (status === ERROR_CODES.UNAUTHORIZED) {
        // Handle unauthorized access
        Toast.show({
          type: TOAST_TYPE.ERROR,
          text1: i18n.t('http.error.unauthorized'),
        });
        logger.warn('API request failed: unauthorized', {
          url: error.config?.url,
          status,
        });
      } else if (status === ERROR_CODES.FORBIDDEN) {
        // Handle forbidden access
        Toast.show({
          type: TOAST_TYPE.ERROR,
          text1: i18n.t('http.error.forbidden'),
        });
        logger.warn('API request failed: forbidden', {
          url: error.config?.url,
          status,
        });
      } else if (status === ERROR_CODES.INTERNAL_SERVER_ERROR) {
        Toast.show({
          type: TOAST_TYPE.ERROR,
          text1: i18n.t('http.error.server'),
        });
        logger.error('API request failed: server error', {
          url: error.config?.url,
          status,
        });
      } else {
        logger.error('API request failed', {
          url: error.config?.url,
          status,
          message: error.message,
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
    // Check if it's a cancelled request (offline detection)
    if (error instanceof Error && error.name === 'CanceledError') {
      return new Error(i18n.t('http.error.offline'));
    }

    if (axios.isAxiosError(error)) {
      // Check if it's a network error (no response)
      if (!error.response) {
        // Network error - could be offline, timeout, or connection issue
        const message = error.message || i18n.t('http.error.network');
        logger.error('API Error: Network issue', {
          message: error.message,
          code: error.code,
        });
        return new Error(message);
      }

      // HTTP error response
      const message =
        error.response?.data?.message || error.message || i18n.t('http.error.generic');
      logger.error('API Error', {
        message,
        status: error.response?.status,
        url: error.config?.url,
      });
      return new Error(message);
    }

    // Unknown error type
    logger.error('API Error: Unknown error type', {error});
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
