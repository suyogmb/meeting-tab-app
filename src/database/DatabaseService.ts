/**
 * Database Service for SQLite
 * Handles database initialization, migrations, and common operations
 */

import SQLite from 'react-native-sqlite-storage';
import {MEETING_TABLE_CREATE, MEETING_INDEXES} from './models/Meeting';
import {ROOM_TABLE_CREATE, ROOM_INDEXES} from './models/Room';
import {SYNC_LOG_TABLE_CREATE, SYNC_LOG_INDEXES} from './models/SyncLog';
import {logger} from '../utils/SecureLogger';

// Enable promise-based SQLite
SQLite.enablePromise(true);

/**
 * Database service class
 * Singleton pattern for global database access
 */
class DatabaseService {
  private static instance: DatabaseService;
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;
  private readonly DB_NAME = 'kiosk_app.db';
  private readonly DB_VERSION = 1;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Initialize database connection
   */
  async initialize(): Promise<void> {
    if (this.isInitialized && this.db) {
      return;
    }

    try {
      this.db = await SQLite.openDatabase({
        name: this.DB_NAME,
        location: 'default',
      });

      await this.runMigrations();
      this.isInitialized = true;
      logger.info('Database initialized successfully', {dbName: this.DB_NAME});
    } catch (error) {
      logger.error('Database initialization failed', {error});
      throw error;
    }
  }

  /**
   * Run database migrations
   */
  private async runMigrations(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      // Create tables
      await this.db.executeSql(MEETING_TABLE_CREATE);
      await this.db.executeSql(ROOM_TABLE_CREATE);
      await this.db.executeSql(SYNC_LOG_TABLE_CREATE);

      // Create indexes
      for (const index of MEETING_INDEXES) {
        await this.db.executeSql(index);
      }
      for (const index of ROOM_INDEXES) {
        await this.db.executeSql(index);
      }
      for (const index of SYNC_LOG_INDEXES) {
        await this.db.executeSql(index);
      }

      logger.info('Database migrations completed');
    } catch (error) {
      logger.error('Database migration failed', {error});
      throw error;
    }
  }

  /**
   * Get database instance
   */
  getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db || !this.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  /**
   * Execute a SQL query
   */
  async executeSql(
    sql: string,
    params: any[] = [],
  ): Promise<SQLite.ResultSet> {
    const db = this.getDatabase();
    try {
      const [results] = await db.executeSql(sql, params);
      return results;
    } catch (error) {
      logger.error('SQL execution failed', {error, sql, params});
      throw error;
    }
  }

  /**
   * Execute a transaction
   */
  async executeTransaction(
    callback: (transaction: SQLite.Transaction) => Promise<void>,
  ): Promise<void> {
    const db = this.getDatabase();
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx: SQLite.Transaction) => {
          callback(tx)
            .then(() => {
              // Transaction success - do nothing, resolve will be called by success callback
            })
            .catch((error) => {
              // Transaction error - reject to trigger rollback
              logger.error('Transaction callback error', {error});
              reject(error);
            });
        },
        (error: any) => {
          // Transaction failed - error callback
          logger.error('Transaction failed', {error});
          reject(error || new Error('Transaction failed'));
        },
        () => {
          // Transaction success callback
          resolve();
        },
      );
    });
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      this.isInitialized = false;
      logger.info('Database closed');
    }
  }

  /**
   * Delete database (for testing/reset)
   */
  async deleteDatabase(): Promise<void> {
    try {
      await SQLite.deleteDatabase({
        name: this.DB_NAME,
        location: 'default',
      });
      this.db = null;
      this.isInitialized = false;
      logger.info('Database deleted');
    } catch (error) {
      logger.error('Database deletion failed', {error});
      throw error;
    }
  }
}

// Export singleton instance
export default DatabaseService.getInstance();

