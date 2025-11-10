/**
 * Database model for SyncLog entity
 * SQLite table schema for tracking sync operations
 */

export interface SyncLogDB {
  id: string;
  type: string; // 'full' | 'incremental' | 'manual' | 'scheduled'
  status: string; // 'pending' | 'in-progress' | 'success' | 'failed'
  start_time: number;
  end_time: number | null;
  records_synced: number | null;
  error: string | null;
  created_at: number;
}

/**
 * SQL table creation statement for sync_logs
 */
export const SYNC_LOG_TABLE_CREATE = `
  CREATE TABLE IF NOT EXISTS sync_logs (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    start_time INTEGER NOT NULL,
    end_time INTEGER,
    records_synced INTEGER,
    error TEXT,
    created_at INTEGER NOT NULL
  );
`;

/**
 * SQL indexes for sync_logs table
 */
export const SYNC_LOG_INDEXES = [
  'CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);',
  'CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON sync_logs(created_at);',
  'CREATE INDEX IF NOT EXISTS idx_sync_logs_type ON sync_logs(type);',
];

