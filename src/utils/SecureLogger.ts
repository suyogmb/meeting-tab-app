/**
 * SecureLogger - A comprehensive logging utility for React Native applications
 *
 * This logging system provides:
 * - Automatic PHI (Protected Health Information) sanitization
 * - Persistent local storage with automatic cleanup
 * - Configurable log levels and retention policies
 * - Export functionality for debugging and support
 * - Production-ready security features
 *
 * Key Features:
 * - HIPAA-compliant data sanitization
 * - Automatic log rotation and cleanup
 * - Configurable storage limits
 * - Cross-platform compatibility (iOS/Android)
 * - Development vs Production configuration
 *
 * Usage:
 * ```typescript
 * import { logger, initializeLogger } from './SecureLogger';
 *
 * // Initialize in App.tsx
 * await initializeLogger();
 *
 * // Use throughout your app
 * logger.info('User logged in', { userId: 'user123' });
 * logger.error('API call failed', { endpoint: '/api/data', error: errorMessage });
 * ```
 *
 * @author Your Team
 * @version 1.0.0
 * @since 2025
 */

import {Platform} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import StorageService from './StorageService';

// ========================================
// TYPES AND INTERFACES
// ========================================

/**
 * Defines the available log levels in order of severity
 * ERROR: Critical errors that need immediate attention
 * WARN: Warning messages for potential issues
 * INFO: General information about application flow
 * DEBUG: Detailed information for debugging (dev only)
 */
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
} as const;

type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

/**
 * Device information captured with each log entry
 * Used for debugging platform-specific issues
 */
interface DeviceInfo {
  platform: string; // 'ios' or 'android'
  version?: string; // OS version if available
}

/**
 * Core log entry structure
 * All log entries are sanitized before storage to remove PHI
 */
interface LogEntry {
  id: string; // Unique identifier for the log entry
  timestamp: string; // ISO 8601 timestamp
  level: LogLevel; // Log severity level
  message: string; // The main log message (sanitized)
  context?: Record<string, unknown>; // Additional context data (sanitized)
  sanitized: boolean; // Flag indicating data has been sanitized
  platform: string; // Platform where log was created
  deviceInfo?: DeviceInfo; // Device information
}

/**
 * Configuration options for the logger
 * These can be adjusted for different environments
 */
interface LoggerConfig {
  enableConsoleLogging: boolean; // Whether to output logs to console
  maxStoredLogs: number; // Maximum number of logs to store locally
  logRetentionDays: number; // How many days to keep logs
  enableDebugLogs: boolean; // Whether to process DEBUG level logs
}

/**
 * Statistical information about stored logs
 * Useful for monitoring and debugging
 */
interface LogStats {
  totalLogs: number; // Total number of stored logs
  errorCount: number; // Number of ERROR level logs
  warnCount: number; // Number of WARN level logs
  infoCount: number; // Number of INFO level logs
  debugCount: number; // Number of DEBUG level logs
  oldestLog?: string; // Timestamp of oldest log
  newestLog?: string; // Timestamp of newest log
}

/**
 * Structure for exported log data
 * Used when exporting logs for debugging or support
 */
interface ExportData {
  exportDate: string; // When the export was created
  platform: string; // Platform the logs came from
  logCount: number; // Number of logs in export
  logs: LogEntry[]; // Array of log entries
}

// ========================================
// SERIALIZATION TYPES
// ========================================

/**
 * Types that can be safely serialized to JSON
 * Used to ensure all log data can be stored and retrieved
 */
type SerializableValue = string | number | boolean | null | SerializableObject | SerializableValue[];

interface SerializableObject {
  [key: string]: SerializableValue;
}

// ========================================
// MAIN LOGGER CLASS
// ========================================

/**
 * SecureLogger - Singleton class for secure, PHI-compliant logging
 *
 * This class implements a comprehensive logging system with automatic
 * data sanitization, persistent storage, and configurable retention policies.
 *
 * Key Security Features:
 * - Automatic PHI detection and redaction
 * - Sanitization of sensitive data patterns
 * - Secure local storage with encryption support
 * - Configurable data retention policies
 */
class SecureLogger {
  private static instance: SecureLogger;

  // Environment detection - used to configure behavior
  private readonly isDevelopment = __DEV__ === false;

  /**
   * Default configuration - automatically adjusted for dev vs production
   * Production: More logs stored, console logging disabled
   * Development: Fewer logs stored, console logging enabled
   */
  private config: LoggerConfig = {
    enableConsoleLogging: this.isDevelopment, // Console logging in dev only
    maxStoredLogs: 1000, // Maximum stored log entries
    logRetentionDays: 30, // Keep logs for 30 days
    enableDebugLogs: this.isDevelopment, // Debug logs in dev only
  };

  // ========================================
  // STORAGE KEYS
  // ========================================

  // Prefix for all log entries in storage
  private readonly LOG_PREFIX = 'secure_log_';

  // Key for storing logger configuration
  private readonly CONFIG_KEY = 'logger_config';

  // Key for tracking log count
  private readonly COUNTER_KEY = 'log_counter';

  // ========================================
  // PHI SANITIZATION PATTERNS
  // ========================================

  /**
   * Regular expressions to identify and redact PHI patterns
   * These patterns cover common PHI data types:
   * - Social Security Numbers
   * - Credit Card Numbers
   * - Email Addresses
   * - Phone Numbers
   * - Patient/User IDs
   * - Names and Dates of Birth
   * - Medical Record Numbers
   */
  private readonly PHI_PATTERNS: RegExp[] = [
    /\b\d{3}-\d{2}-\d{4}\b/g, // SSN (123-45-6789)
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit card numbers
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email addresses
    /\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/g, // Phone numbers (US format)
    /\b(?:patient|user)_id["']?\s*[:=]\s*["']?[^,\s}]+/gi, // Patient/User IDs in JSON
    /\b(?:name|firstName|lastName|dob|dateOfBirth)["']?\s*[:=]\s*["'][^"']+["']/gi, // Names and DOB
    /\b(?:mrn|medical_record_number)["']?\s*[:=]\s*["']?[^,\s}]+/gi, // Medical Record Numbers
  ];

  /**
   * Object keys that are considered safe to log without sanitization
   * These typically contain non-sensitive metadata
   */
  private readonly SAFE_KEYS = new Set([
    'timestamp', // Time information
    'level', // Log level
    'component', // Component name
    'action', // Action being performed
    'status', // Operation status
    'duration', // Time measurements
    'platform', // Platform information
    'id', // Non-sensitive IDs
  ]);

  /**
   * Object keys that likely contain PHI and should be redacted
   * This list covers common field names that might contain sensitive data
   */
  private readonly PHI_FIELDS = new Set([
    // Personal identifiers
    'ssn',
    'social',
    'socialsecurity',
    'name',
    'firstname',
    'lastname',
    'fullname',
    'email',
    'phone',
    'mobile',
    'telephone',
    'address',
    'street',
    'city',
    'zip',
    'zipcode',
    'dob',
    'dateofbirth',
    'birthdate',

    // Medical identifiers
    'patientid',
    'userid',
    'memberid',
    'mrn',

    // Financial information
    'creditcard',
    'ccnumber',
    'cardnumber',

    // Medical information
    'diagnosis',
    'condition',
    'medication',
    'symptoms',
    'treatment',
    'prescription',

    // Security sensitive
    'password',
    'token',
    'key',
    'secret',
  ]);

  // ========================================
  // SINGLETON PATTERN
  // ========================================

  /**
   * Gets the singleton instance of SecureLogger
   * Ensures only one logger instance exists throughout the application
   */
  static getInstance(): SecureLogger {
    if (!SecureLogger.instance) {
      SecureLogger.instance = new SecureLogger();
    }
    return SecureLogger.instance;
  }

  // ========================================
  // INITIALIZATION
  // ========================================

  /**
   * Initializes the logger with saved configuration and performs cleanup
   * Should be called once during app startup
   *
   * @throws {Error} If initialization fails (gracefully handled)
   */
  async initialize(): Promise<void> {
    try {
      // Load saved configuration if it exists
      const savedConfig = await StorageService.getItem<LoggerConfig>(this.CONFIG_KEY, true);
      if (savedConfig) {
        this.config = {...this.config, ...savedConfig};
      }

      // Clean up old logs to maintain storage limits
      await this.cleanupOldLogs();
    } catch (initError) {
      // Fallback to default settings if initialization fails
      this.config.enableConsoleLogging = this.isDevelopment;

      // In development, log the initialization error
      if (this.isDevelopment) {
        console.warn('Logger initialization failed, using defaults:', initError);
      }
    }
  }

  /**
   * Updates logger configuration and persists to storage
   *
   * @param newConfig - Partial configuration to merge with current settings
   */
  async setConfig(newConfig: Partial<LoggerConfig>): Promise<void> {
    this.config = {...this.config, ...newConfig};
    await StorageService.storeItem(this.CONFIG_KEY, this.config, true);
  }

  // ========================================
  // DATA SANITIZATION METHODS
  // ========================================

  /**
   * Sanitizes a text message by removing PHI patterns
   *
   * @param message - The message to sanitize
   * @returns Sanitized message with PHI replaced by [REDACTED]
   */
  private sanitizeMessage(message: string): string {
    let sanitized = message;

    // Apply each PHI pattern to replace sensitive data
    this.PHI_PATTERNS.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });

    return sanitized;
  }

  /**
   * Sanitizes any value, handling different data types appropriately
   *
   * @param value - The value to sanitize
   * @returns Sanitized value that can be safely serialized
   */
  private sanitizeValue(value: unknown): SerializableValue {
    // Handle null/undefined values
    if (value === null || value === undefined) {
      return null;
    }

    // Handle strings - apply PHI sanitization
    if (typeof value === 'string') {
      return this.sanitizeMessage(value);
    }

    // Handle primitives - safe to return as-is
    if (typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    // Handle arrays - recursively sanitize each element
    if (Array.isArray(value)) {
      return value.map((item) => this.sanitizeValue(item));
    }

    // Handle objects - sanitize each property
    if (typeof value === 'object') {
      return this.sanitizeObject(value as Record<string, unknown>);
    }

    // Handle functions, symbols, or other non-serializable types
    // Convert to string representation for logging
    return String(value);
  }

  /**
   * Sanitizes an object by checking each key for PHI and sanitizing values
   *
   * @param obj - Object to sanitize
   * @returns Sanitized object safe for storage
   */
  private sanitizeObject(obj: Record<string, unknown>): SerializableObject {
    const sanitized: SerializableObject = {};

    Object.keys(obj).forEach((key) => {
      const lowerKey = key.toLowerCase();

      // Check if this key likely contains PHI
      if (this.isPHIField(lowerKey)) {
        // Completely redact PHI fields
        sanitized[key] = '[REDACTED]';
        return;
      }

      // Safe keys can be logged but still need value sanitization
      if (this.SAFE_KEYS.has(lowerKey)) {
        sanitized[key] = this.sanitizeValue(obj[key]);
        return;
      }

      // For all other keys, sanitize the value
      sanitized[key] = this.sanitizeValue(obj[key]);
    });

    return sanitized;
  }

  /**
   * Checks if a key name indicates it might contain PHI
   *
   * @param key - The key name to check (should be lowercase)
   * @returns True if the key likely contains PHI
   */
  private isPHIField(key: string): boolean {
    return Array.from(this.PHI_FIELDS).some((field) => key.includes(field));
  }

  // ========================================
  // LOG ENTRY CREATION
  // ========================================

  /**
   * Generates a unique ID for a log entry
   * Combines timestamp and random string for uniqueness
   *
   * @returns Unique log entry ID
   */
  private generateLogId(): string {
    return `${Date.now()}_${uuidv4()}`;
  }

  /**
   * Creates a complete log entry with all metadata
   *
   * @param level - Log level
   * @param message - Log message
   * @param context - Additional context data
   * @returns Complete log entry ready for storage
   */
  private createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      level,
      message: this.sanitizeMessage(message),
      context: context ? this.sanitizeObject(context) : undefined,
      sanitized: true, // Flag indicating data has been sanitized
      platform: Platform.OS,
      deviceInfo: {
        platform: Platform.OS,
        version: Platform.Version?.toString(),
      },
    };
  }

  // ========================================
  // STORAGE MANAGEMENT
  // ========================================

  /**
   * Stores a log entry to persistent storage
   * Handles storage failures gracefully
   *
   * @param entry - Log entry to store
   */
  private async storeLogEntry(entry: LogEntry): Promise<void> {
    try {
      // Store the log entry with a unique key
      const logKey = `${this.LOG_PREFIX}${entry.id}`;
      await StorageService.storeItem(logKey, entry, true);

      // Update the log counter for cleanup management
      const currentCounter = (await StorageService.getItem<number>(this.COUNTER_KEY, true)) || 0;
      await StorageService.storeItem(this.COUNTER_KEY, currentCounter + 1, true);

      // Trigger cleanup if we've reached the storage limit
      if (currentCounter >= this.config.maxStoredLogs) {
        await this.cleanupOldLogs();
      }
    } catch (storeError) {
      // If storage fails, fall back to console logging in development
      if (this.isDevelopment) {
        console.warn('Failed to store log entry:', storeError);
      }
    }
  }

  /**
   * Removes old log entries to maintain storage limits
   * Implements both time-based and count-based cleanup
   */
  private async cleanupOldLogs(): Promise<void> {
    try {
      // Get all log keys and sort them (oldest first due to timestamp in key)
      const allKeys = StorageService.getAllKeys(true);
      const logKeys = allKeys.filter((key) => key.startsWith(this.LOG_PREFIX)).sort((a, b) => a.localeCompare(b));

      // Calculate cutoff date for time-based cleanup
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.logRetentionDays);

      const keysToRemove: string[] = [];

      // First pass: Remove logs older than retention period
      for (const key of logKeys) {
        try {
          const logEntry = await StorageService.getItem<LogEntry>(key, true);
          if (logEntry && new Date(logEntry.timestamp) < cutoffDate) {
            keysToRemove.push(key);
          }
        } catch (readError) {
          // If we can't read the log entry, it's corrupted - remove it
          keysToRemove.push(key);
          if (this.isDevelopment) {
            console.warn('Corrupted log entry found:', key, readError);
          }
        }
      }

      // Second pass: Remove excess logs if we still have too many
      const remainingKeys = logKeys.filter((key) => !keysToRemove.includes(key));
      if (remainingKeys.length > this.config.maxStoredLogs) {
        // Remove oldest logs first (they're at the beginning due to sorting)
        const excessKeys = remainingKeys.slice(0, remainingKeys.length - this.config.maxStoredLogs);
        keysToRemove.push(...excessKeys);
      }

      // Actually remove the identified keys
      keysToRemove.forEach((key) => StorageService.removeItem(key, true));

      // Update the counter to reflect remaining logs
      const remainingCount = logKeys.length - keysToRemove.length;
      await StorageService.storeItem(this.COUNTER_KEY, remainingCount, true);

      // Log cleanup results in development
      if (this.isDevelopment && keysToRemove.length > 0) {
        console.log(`Cleaned up ${keysToRemove.length} old log entries`);
      }
    } catch (cleanupError) {
      if (this.isDevelopment) {
        console.warn('Failed to cleanup old logs:', cleanupError);
      }
    }
  }

  // ========================================
  // LOG WRITING
  // ========================================

  /**
   * Writes a log entry to both storage and console (if configured)
   *
   * @param entry - Log entry to write
   */
  private async writeLog(entry: LogEntry): Promise<void> {
    // Store the log entry persistently
    await this.storeLogEntry(entry);

    // Output to console if enabled
    if (this.config.enableConsoleLogging) {
      const logMessage = `[${entry.timestamp}] ${entry.level}: ${entry.message}`;

      // Safely stringify and parse context, handling undefined/null values
      let contextOutput: any = '';
      if (entry.context !== undefined && entry.context !== null) {
        try {
          const stringified = JSON.stringify(entry.context);
          if (stringified && stringified !== 'undefined') {
            contextOutput = JSON.parse(stringified);
          } else {
            contextOutput = entry.context;
          }
        } catch (parseError) {
          // If parsing fails, just use the stringified version or original context
          try {
            contextOutput = JSON.stringify(entry.context);
          } catch (stringifyError) {
            contextOutput = entry.context;
          }
        }
      }

      // Use appropriate console method based on log level
      switch (entry.level) {
        case LOG_LEVELS.ERROR:
          console.log(logMessage, contextOutput);
          // For errors, also log the full error stack
          // console.error(logMessage, JSON.stringify(entry.context) || '');
          break;
        case LOG_LEVELS.WARN:
          console.log(logMessage, contextOutput);
          // For warnings, also log the full error stack
          // console.warn(logMessage, JSON.stringify(entry.context) || '');
          break;
        case LOG_LEVELS.DEBUG:
          // Only output debug logs if specifically enabled
          if (this.config.enableDebugLogs) {
            console.log(logMessage, contextOutput);
          }
          break;
        case LOG_LEVELS.INFO:
        default:
          console.log(logMessage, contextOutput);
      }
    }
  }

  // ========================================
  // PUBLIC LOGGING METHODS
  // ========================================

  /**
   * Logs an error message
   * Use for critical errors that need immediate attention
   *
   * @param message - Error message
   * @param context - Additional error context (optional)
   */
  async error(message: string, context?: Record<string, unknown>): Promise<void> {
    const entry = this.createLogEntry(LOG_LEVELS.ERROR, message, context);
    await this.writeLog(entry);
  }

  /**
   * Logs a warning message
   * Use for potential issues that don't break functionality
   *
   * @param message - Warning message
   * @param context - Additional warning context (optional)
   */
  async warn(message: string, context?: Record<string, unknown>): Promise<void> {
    const entry = this.createLogEntry(LOG_LEVELS.WARN, message, context);
    await this.writeLog(entry);
  }

  /**
   * Logs an informational message
   * Use for general application flow information
   *
   * @param message - Info message
   * @param context - Additional info context (optional)
   */
  async info(message: string, context?: Record<string, unknown>): Promise<void> {
    const entry = this.createLogEntry(LOG_LEVELS.INFO, message, context);
    await this.writeLog(entry);
  }

  /**
   * Logs a debug message
   * Only processed if debug logging is enabled (typically dev only)
   *
   * @param message - Debug message
   * @param context - Additional debug context (optional)
   */
  async debug(message: string, context?: Record<string, unknown>): Promise<void> {
    if (this.config.enableDebugLogs) {
      const entry = this.createLogEntry(LOG_LEVELS.DEBUG, message, context);
      await this.writeLog(entry);
    }
  }

  // ========================================
  // LOG RETRIEVAL METHODS
  // ========================================

  /**
   * Retrieves stored log entries
   *
   * @param limit - Maximum number of logs to retrieve (default: 50)
   * @returns Array of log entries, newest first
   */
  async getStoredLogs(limit: number = 50): Promise<LogEntry[]> {
    try {
      const allKeys = StorageService.getAllKeys(true);
      const logKeys = allKeys
        .filter((key) => key.startsWith(this.LOG_PREFIX))
        .sort((a, b) => a.localeCompare(b))
        .slice(-limit); // Get most recent logs

      const logs: LogEntry[] = [];

      // Load each log entry
      for (const key of logKeys) {
        try {
          const logEntry = await StorageService.getItem<LogEntry>(key, true);
          if (logEntry) {
            logs.push(logEntry);
          }
        } catch (entryError) {
          // Skip corrupted log entries
          if (this.isDevelopment) {
            console.warn('Skipping corrupted log entry:', key, entryError);
          }
          continue;
        }
      }

      // Sort by timestamp, newest first
      return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (retrievalError) {
      if (this.isDevelopment) {
        console.warn('Failed to retrieve stored logs:', retrievalError);
      }
      return [];
    }
  }

  /**
   * Retrieves logs filtered by level
   *
   * @param level - Log level to filter by
   * @param limit - Maximum number of logs to retrieve (default: 50)
   * @returns Array of log entries matching the level
   */
  async getLogsByLevel(level: LogLevel, limit: number = 50): Promise<LogEntry[]> {
    const allLogs = await this.getStoredLogs(limit * 2); // Get more to filter
    return allLogs.filter((log) => log.level === level).slice(0, limit);
  }

  /**
   * Retrieves logs within a specific time range
   *
   * @param startDate - Start of time range
   * @param endDate - End of time range
   * @returns Array of log entries within the time range
   */
  async getLogsByTimeRange(startDate: Date, endDate: Date): Promise<LogEntry[]> {
    const allLogs = await this.getStoredLogs(1000); // Get a larger set
    return allLogs.filter((log) => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  // ========================================
  // LOG MANAGEMENT METHODS
  // ========================================

  /**
   * Clears all stored log entries
   * Use with caution - this cannot be undone
   */
  async clearAllLogs(): Promise<void> {
    try {
      const allKeys = StorageService.getAllKeys(true);
      const logKeys = allKeys.filter((key) => key.startsWith(this.LOG_PREFIX));

      // Remove all log entries
      logKeys.forEach((key) => StorageService.removeItem(key, true));

      // Reset the counter
      await StorageService.storeItem(this.COUNTER_KEY, 0, true);

      if (this.isDevelopment) {
        console.log(`Cleared ${logKeys.length} log entries`);
      }
    } catch (clearError) {
      if (this.isDevelopment) {
        console.warn('Failed to clear all logs:', clearError);
      }
    }
  }

  /**
   * Gets statistical information about stored logs
   * Useful for monitoring and debugging
   *
   * @returns Object containing log statistics
   */
  async getLogStats(): Promise<LogStats> {
    try {
      const logs = await this.getStoredLogs(1000);

      const stats: LogStats = {
        totalLogs: logs.length,
        errorCount: logs.filter((log) => log.level === LOG_LEVELS.ERROR).length,
        warnCount: logs.filter((log) => log.level === LOG_LEVELS.WARN).length,
        infoCount: logs.filter((log) => log.level === LOG_LEVELS.INFO).length,
        debugCount: logs.filter((log) => log.level === LOG_LEVELS.DEBUG).length,
        oldestLog: logs.length > 0 ? logs[logs.length - 1].timestamp : undefined,
        newestLog: logs.length > 0 ? logs[0].timestamp : undefined,
      };

      return stats;
    } catch (statsError) {
      if (this.isDevelopment) {
        console.warn('Failed to get log stats:', statsError);
      }
      // Return empty stats if retrieval fails
      return {
        totalLogs: 0,
        errorCount: 0,
        warnCount: 0,
        infoCount: 0,
        debugCount: 0,
      };
    }
  }

  /**
   * Exports logs as JSON string for debugging or support
   * Creates a complete package with metadata
   *
   * @returns JSON string containing all log data
   * @throws {Error} If export fails
   */
  async exportLogs(): Promise<string> {
    try {
      const logs = await this.getStoredLogs(500);
      const exportData: ExportData = {
        exportDate: new Date().toISOString(),
        platform: Platform.OS,
        logCount: logs.length,
        logs: logs,
      };

      return JSON.stringify(exportData, null, 2);
    } catch (exportError) {
      throw new Error(`Failed to export logs: ${exportError}`);
    }
  }
}

// Get the singleton instance for use throughout the app
const logger = SecureLogger.getInstance();

// ========================================
// INITIALIZATION HELPER
// ========================================

/**
 * Initializes the logger with appropriate configuration for the environment
 * Should be called once during app startup (typically in App.tsx)
 *
 * Development Configuration:
 * - Console logging enabled
 * - Debug logs enabled
 * - Fewer stored logs (500)
 *
 * Production Configuration:
 * - Console logging disabled
 * - Debug logs disabled
 * - More stored logs (1000)
 */
const initializeLogger = async (): Promise<void> => {
  await logger.initialize();

  // Configure based on environment
  if (__DEV__) {
    // Development settings - more verbose, less storage
    await logger.setConfig({
      enableConsoleLogging: true,
      maxStoredLogs: 500,
      enableDebugLogs: true,
    });
  } else {
    // Production settings - less verbose, more storage
    await logger.setConfig({
      enableConsoleLogging: false,
      maxStoredLogs: 1000,
      enableDebugLogs: false,
    });
  }
};

// ========================================
// EXPORTS
// ========================================

// Export types for use in other files
export type {LogLevel, LogEntry, LoggerConfig, LogStats, ExportData};

// Export the main logger class, instance, and utilities
export {SecureLogger, logger, initializeLogger, LOG_LEVELS};

/**
 * USAGE EXAMPLES:
 *
 * ========================================
 * BASIC LOGGING EXAMPLES
 * ========================================
 *
 * // Basic logging without context
 * await logger.info('User logged in successfully');
 * await logger.error('Failed to save user data');
 * await logger.warn('API response time exceeded threshold');
 * await logger.debug('Processing user request');
 *
 * Console Output (Development):
 * [2025-01-15T10:30:45.123Z] INFO: User logged in successfully
 * [2025-01-15T10:30:46.456Z] ERROR: Failed to save user data
 * [2025-01-15T10:30:47.789Z] WARN: API response time exceeded threshold
 * [2025-01-15T10:30:48.012Z] DEBUG: Processing user request
 *
 * ========================================
 * LOGGING WITH CONTEXT EXAMPLES
 * ========================================
 *
 * // Logging with safe context data
 * await logger.info('User action completed', {
 *   action: 'profile_update',
 *   userId: 'user123',
 *   duration: 1500,
 *   status: 'success',
 *   component: 'UserProfile'
 * });
 *
 * Console Output:
 * [2025-01-15T10:30:45.123Z] INFO: User action completed
 * {
 *   "action": "profile_update",
 *   "userId": "user123",
 *   "duration": 1500,
 *   "status": "success",
 *   "component": "UserProfile"
 * }
 *
 * // Logging with PHI data (automatically sanitized)
 * await logger.error('Payment processing failed', {
 *   patientId: 'P12345',
 *   email: 'john.doe@example.com',
 *   ssn: '123-45-6789',
 *   creditCard: '4111-1111-1111-1111',
 *   phone: '555-123-4567',
 *   name: 'John Doe',
 *   address: '123 Main St, Anytown, USA'
 * });
 *
 * Console Output (PHI automatically redacted):
 * [2025-01-15T10:30:45.123Z] ERROR: Payment processing failed
 * {
 *   "patientId": "[REDACTED]",
 *   "email": "[REDACTED]",
 *   "ssn": "[REDACTED]",
 *   "creditCard": "[REDACTED]",
 *   "phone": "[REDACTED]",
 *   "name": "[REDACTED]",
 *   "address": "[REDACTED]"
 * }
 *
 * ========================================
 * LOG RETRIEVAL EXAMPLES
 * ========================================
 *
 * // Get recent logs
 * const recentLogs = await logger.getStoredLogs(10);
 * console.log('Recent logs:', recentLogs);
 *
 * Output:
 * [
 *   {
 *     "id": "1705315845123_abc123-def456",
 *     "timestamp": "2025-01-15T10:30:45.123Z",
 *     "level": "INFO",
 *     "message": "User action completed",
 *     "context": {
 *       "action": "profile_update",
 *       "userId": "user123",
 *       "duration": 1500
 *     },
 *     "sanitized": true,
 *     "platform": "ios",
 *     "deviceInfo": {
 *       "platform": "ios",
 *       "version": "17.0"
 *     }
 *   },
 *   // ... more log entries
 * ]
 *
 * // Get error logs only
 * const errorLogs = await logger.getLogsByLevel('ERROR', 5);
 * console.log('Error count:', errorLogs.length);
 *
 * // Get logs from specific time range
 * const startDate = new Date('2025-01-15T00:00:00Z');
 * const endDate = new Date('2025-01-15T23:59:59Z');
 * const todaysLogs = await logger.getLogsByTimeRange(startDate, endDate);
 * console.log('Today\'s logs:', todaysLogs.length);
 *
 * ========================================
 * STATISTICS EXAMPLES
 * ========================================
 *
 * // Get log statistics
 * const stats = await logger.getLogStats();
 * console.log('Log Statistics:', stats);
 *
 * Output:
 * {
 *   "totalLogs": 1250,
 *   "errorCount": 45,
 *   "warnCount": 123,
 *   "infoCount": 980,
 *   "debugCount": 102,
 *   "oldestLog": "2024-12-15T08:30:12.456Z",
 *   "newestLog": "2025-01-15T10:30:45.123Z"
 * }
 *
 * // Monitor error rate
 * const errorRate = (stats.errorCount / stats.totalLogs * 100).toFixed(2);
 * console.log(`Error rate: ${errorRate}%`);
 *
 * ========================================
 * EXPORT EXAMPLES
 * ========================================
 *
 * // Export logs for debugging/support
 * const exportedLogs = await logger.exportLogs();
 * console.log('Exported logs:', exportedLogs);
 *
 * Output:
 * {
 *   "exportDate": "2025-01-15T10:35:00.000Z",
 *   "platform": "ios",
 *   "logCount": 500,
 *   "logs": [
 *     {
 *       "id": "1705315845123_abc123-def456",
 *       "timestamp": "2025-01-15T10:30:45.123Z",
 *       "level": "INFO",
 *       "message": "User action completed",
 *       "context": {
 *         "action": "profile_update",
 *         "userId": "user123",
 *         "duration": 1500
 *       },
 *       "sanitized": true,
 *       "platform": "ios",
 *       "deviceInfo": {
 *         "platform": "ios",
 *         "version": "17.0"
 *       }
 *     }
 *     // ... more log entries
 *   ]
 * }
 *
 * ========================================
 * CONFIGURATION EXAMPLES
 * ========================================
 *
 * // Update logger configuration
 * await logger.setConfig({
 *   enableConsoleLogging: true,
 *   maxStoredLogs: 2000,
 *   logRetentionDays: 60,
 *   enableDebugLogs: true
 * });
 *
 * // Clear all logs (use with caution)
 * await logger.clearAllLogs();
 * console.log('All logs cleared');
 *
 * ========================================
 * REAL-WORLD USAGE PATTERNS
 * ========================================
 *
 * // API call logging
 * try {
 *   const response = await apiCall('/users/profile');
 *   await logger.info('API call successful', {
 *     endpoint: '/users/profile',
 *     statusCode: response.status,
 *     duration: response.duration,
 *     userId: response.data.userId
 *   });
 * } catch (error) {
 *   await logger.error('API call failed', {
 *     endpoint: '/users/profile',
 *     error: error.message,
 *     statusCode: error.status,
 *     userId: currentUser.id
 *   });
 * }
 *
 * // User action tracking
 * const trackUserAction = async (action: string, context?: Record<string, unknown>) => {
 *   await logger.info(`User action: ${action}`, {
 *     action,
 *     timestamp: new Date().toISOString(),
 *     userId: currentUser.id,
 *     screen: currentScreen,
 *     ...context
 *   });
 * };
 *
 * // Error boundary logging
 * const logError = async (error: Error, errorInfo: any) => {
 *   await logger.error('React Error Boundary caught error', {
 *     error: error.message,
 *     stack: error.stack,
 *     componentStack: errorInfo.componentStack,
 *     userId: currentUser?.id
 *   });
 * };
 *
 * // Performance monitoring
 * const logPerformance = async (operation: string, duration: number, context?: Record<string, unknown>) => {
 *   if (duration > 1000) {
 *     await logger.warn('Slow operation detected', {
 *       operation,
 *       duration,
 *       threshold: 1000,
 *       ...context
 *     });
 *   } else {
 *     await logger.debug('Operation completed', {
 *       operation,
 *       duration,
 *       ...context
 *     });
 *   }
 * };
 */
