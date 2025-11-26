/**
 * Request Queue Service
 * Queues failed API requests when offline and retries them when connectivity is restored
 */

import {Method} from 'axios';
import {AxiosRequestConfig} from 'axios';
import StorageService from '../../utils/StorageService';
import {logger} from '../../utils/SecureLogger';
import NetworkService from '../network/NetworkService';

export interface QueuedRequest {
  id: string;
  method: Method;
  url: string;
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
  config?: AxiosRequestConfig;
  timestamp: number;
  retryCount: number;
  priority?: number; // Higher number = higher priority
}

interface QueueStorage {
  requests: QueuedRequest[];
  lastProcessed: number;
}

/**
 * Request Queue Service class
 * Manages queued API requests for offline retry
 */
class RequestQueueServiceClass {
  private readonly STORAGE_KEY = 'requestQueue';
  private readonly MAX_RETRIES = 3;
  private readonly MAX_QUEUE_SIZE = 100;
  private readonly RETRY_DELAY_BASE = 1000; // 1 second base delay
  private readonly MAX_RETRY_DELAY = 30000; // 30 seconds max delay
  private readonly QUEUE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  private isProcessing = false;
  private processingPromise: Promise<void> | null = null;

  /**
   * Initialize the queue service
   * Loads existing queue from storage and cleans up expired requests
   */
  async initialize(): Promise<void> {
    try {
      const queue = await this.loadQueue();
      if (queue.requests.length > 0) {
        logger.info('Request queue initialized', {
          queuedRequests: queue.requests.length,
        });
        // Clean up expired requests
        await this.cleanupExpiredRequests();
      }
    } catch (error) {
      logger.error('Failed to initialize request queue', {error});
    }
  }

  /**
   * Add a request to the queue
   * @param method - HTTP method
   * @param url - Request URL
   * @param body - Request body (for POST/PUT)
   * @param params - Query parameters (for GET)
   * @param config - Additional axios config
   * @param priority - Request priority (higher = more important)
   * @returns Request ID if queued, null if queue is full
   */
  async enqueue(
    method: Method,
    url: string,
    body?: Record<string, unknown>,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
    priority: number = 0,
  ): Promise<string | null> {
    try {
      const queue = await this.loadQueue();

      // Check queue size limit
      if (queue.requests.length >= this.MAX_QUEUE_SIZE) {
        logger.warn('Request queue is full, removing oldest request', {
          queueSize: queue.requests.length,
        });
        // Remove oldest request (lowest priority first, then oldest)
        queue.requests.sort((a, b) => {
          if (a.priority !== b.priority) {
            return (b.priority || 0) - (a.priority || 0);
          }
          return a.timestamp - b.timestamp;
        });
        queue.requests.pop();
      }

      const request: QueuedRequest = {
        id: this.generateRequestId(),
        method,
        url,
        body,
        params,
        config,
        timestamp: Date.now(),
        retryCount: 0,
        priority,
      };

      queue.requests.push(request);
      await this.saveQueue(queue);

      logger.info('Request queued', {
        id: request.id,
        method,
        url,
        queueSize: queue.requests.length,
      });

      return request.id;
    } catch (error) {
      logger.error('Failed to enqueue request', {error, url, method});
      return null;
    }
  }

  /**
   * Remove a request from the queue
   * @param requestId - Request ID to remove
   */
  async dequeue(requestId: string): Promise<void> {
    try {
      const queue = await this.loadQueue();
      const initialLength = queue.requests.length;
      queue.requests = queue.requests.filter(req => req.id !== requestId);

      if (queue.requests.length < initialLength) {
        await this.saveQueue(queue);
        logger.debug('Request removed from queue', {requestId});
      }
    } catch (error) {
      logger.error('Failed to dequeue request', {error, requestId});
    }
  }

  /**
   * Get all queued requests
   * @returns Array of queued requests
   */
  async getQueuedRequests(): Promise<QueuedRequest[]> {
    try {
      const queue = await this.loadQueue();
      return queue.requests;
    } catch (error) {
      logger.error('Failed to get queued requests', {error});
      return [];
    }
  }

  /**
   * Get queue size
   * @returns Number of queued requests
   */
  async getQueueSize(): Promise<number> {
    const requests = await this.getQueuedRequests();
    return requests.length;
  }

  /**
   * Process all queued requests
   * Attempts to retry all queued requests when online
   * @returns Number of successfully processed requests
   */
  async processQueue(): Promise<number> {
    // Prevent concurrent processing
    if (this.isProcessing && this.processingPromise) {
      return this.processingPromise.then(() => this.getQueueSize());
    }

    this.processingPromise = this.doProcessQueue();
    return this.processingPromise;
  }

  /**
   * Internal method to process the queue
   */
  private async doProcessQueue(): Promise<number> {
    if (this.isProcessing) {
      return 0;
    }

    this.isProcessing = true;
    let processedCount = 0;

    try {
      // Check if online
      const isConnected = await NetworkService.isConnected();
      const isInternetReachable = await NetworkService.isInternetReachable();

      if (!isConnected || !isInternetReachable) {
        logger.debug('Skipping queue processing: device is offline');
        return 0;
      }

      const queue = await this.loadQueue();
      if (queue.requests.length === 0) {
        return 0;
      }

      logger.info('Processing request queue', {
        queueSize: queue.requests.length,
      });

      // Sort by priority (higher first), then by timestamp (older first)
      const sortedRequests = [...queue.requests].sort((a, b) => {
        if (a.priority !== b.priority) {
          return (b.priority || 0) - (a.priority || 0);
        }
        return a.timestamp - b.timestamp;
      });

      const results: {success: QueuedRequest[]; failed: QueuedRequest[]} = {
        success: [],
        failed: [],
      };

      // Process requests sequentially to avoid overwhelming the network
      for (const request of sortedRequests) {
        try {
          const success = await this.retryRequest(request);
          if (success) {
            results.success.push(request);
            processedCount++;
          } else {
            // Check if we should keep retrying
            if (request.retryCount < this.MAX_RETRIES) {
              results.failed.push(request);
            } else {
              logger.warn('Request exceeded max retries, removing from queue', {
                id: request.id,
                url: request.url,
                retryCount: request.retryCount,
              });
              // Remove from queue if max retries exceeded
            }
          }

          // Small delay between requests to avoid overwhelming the network
          await this.delay(100);
        } catch (error) {
          logger.error('Error processing queued request', {
            error,
            requestId: request.id,
            url: request.url,
          });
          if (request.retryCount < this.MAX_RETRIES) {
            results.failed.push(request);
          }
        }
      }

      // Update queue with failed requests (increment retry count)
      queue.requests = results.failed.map(req => ({
        ...req,
        retryCount: req.retryCount + 1,
      }));

      queue.lastProcessed = Date.now();
      await this.saveQueue(queue);

      logger.info('Queue processing completed', {
        processed: results.success.length,
        failed: results.failed.length,
        total: sortedRequests.length,
      });
    } catch (error) {
      logger.error('Error processing request queue', {error});
    } finally {
      this.isProcessing = false;
      this.processingPromise = null;
    }

    return processedCount;
  }

  /**
   * Retry a single queued request
   * @param request - Queued request to retry
   * @returns True if successful, false otherwise
   */
  private async retryRequest(request: QueuedRequest): Promise<boolean> {
    try {
      // Calculate exponential backoff delay
      const delay = Math.min(
        this.RETRY_DELAY_BASE * Math.pow(2, request.retryCount),
        this.MAX_RETRY_DELAY,
      );

      // Wait before retrying (except for first retry)
      if (request.retryCount > 0) {
        await this.delay(delay);
      }

      // Dynamically import HTTPService to avoid circular dependency
      const HTTPService = (await import('../../networkConfig/HttpServices')).default;

      // Make the request
      let response;
      switch (request.method.toUpperCase()) {
        case 'GET':
          response = await HTTPService.get(request.url, request.params);
          break;
        case 'POST':
          response = await HTTPService.post(request.url, request.body);
          break;
        case 'PUT':
          response = await HTTPService.put(request.url, request.body);
          break;
        case 'DELETE':
          response = await HTTPService.delete(request.url, request.body);
          break;
        default:
          logger.warn('Unsupported HTTP method in queued request', {
            method: request.method,
            id: request.id,
          });
          return false;
      }

      // Request succeeded
      logger.info('Queued request succeeded', {
        id: request.id,
        url: request.url,
        method: request.method,
        retryCount: request.retryCount,
      });

      return true;
    } catch (error) {
      logger.warn('Queued request failed', {
        id: request.id,
        url: request.url,
        method: request.method,
        retryCount: request.retryCount,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * Clean up expired requests from the queue
   */
  async cleanupExpiredRequests(): Promise<void> {
    try {
      const queue = await this.loadQueue();
      const now = Date.now();
      const initialLength = queue.requests.length;

      queue.requests = queue.requests.filter(
        req => now - req.timestamp < this.QUEUE_EXPIRY_MS,
      );

      if (queue.requests.length < initialLength) {
        await this.saveQueue(queue);
        logger.info('Cleaned up expired requests', {
          removed: initialLength - queue.requests.length,
          remaining: queue.requests.length,
        });
      }
    } catch (error) {
      logger.error('Failed to cleanup expired requests', {error});
    }
  }

  /**
   * Clear all queued requests
   */
  async clearQueue(): Promise<void> {
    try {
      const emptyQueue: QueueStorage = {
        requests: [],
        lastProcessed: Date.now(),
      };
      await this.saveQueue(emptyQueue);
      logger.info('Request queue cleared');
    } catch (error) {
      logger.error('Failed to clear request queue', {error});
    }
  }

  /**
   * Load queue from storage
   */
  private async loadQueue(): Promise<QueueStorage> {
    try {
      const stored = await StorageService.getItem<QueueStorage>(
        this.STORAGE_KEY,
        false,
      );
      return stored || {requests: [], lastProcessed: 0};
    } catch (error) {
      logger.error('Failed to load request queue', {error});
      return {requests: [], lastProcessed: 0};
    }
  }

  /**
   * Save queue to storage
   */
  private async saveQueue(queue: QueueStorage): Promise<void> {
    try {
      await StorageService.storeItem(this.STORAGE_KEY, queue, false);
    } catch (error) {
      logger.error('Failed to save request queue', {error});
      throw error;
    }
  }

  /**
   * Generate a unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Delay helper function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export default new RequestQueueServiceClass();

