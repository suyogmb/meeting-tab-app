/**
 * Sync-related TypeScript types and interfaces
 */

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime?: number;
  lastSyncSuccess?: boolean;
  syncError?: string;
  pendingSyncCount: number;
}

export interface SyncLog {
  id: string;
  type: 'full' | 'incremental' | 'manual' | 'scheduled';
  status: 'pending' | 'in-progress' | 'success' | 'failed';
  startTime: number;
  endTime?: number;
  recordsSynced?: number;
  error?: string;
  createdAt: number;
}

export interface SyncOptions {
  type?: 'full' | 'incremental';
  force?: boolean;
  roomId?: string;
  dateRange?: {
    start: number;
    end: number;
  };
}

export interface SyncResult {
  success: boolean;
  recordsSynced: number;
  error?: string;
  syncTime: number;
}

