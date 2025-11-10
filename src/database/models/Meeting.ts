/**
 * Database model for Meeting entity
 * SQLite table schema and TypeScript interfaces
 */

export interface MeetingDB {
  id: string;
  room_id: string;
  title: string;
  description: string | null;
  organizer: string | null;
  start_time: number; // Unix timestamp in milliseconds
  end_time: number; // Unix timestamp in milliseconds
  attendee_count: number | null;
  is_all_day: number; // SQLite boolean (0 or 1)
  status: string; // 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  created_at: number;
  updated_at: number;
  synced_at: number | null;
}

/**
 * SQL table creation statement for meetings
 */
export const MEETING_TABLE_CREATE = `
  CREATE TABLE IF NOT EXISTS meetings (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    organizer TEXT,
    start_time INTEGER NOT NULL,
    end_time INTEGER NOT NULL,
    attendee_count INTEGER,
    is_all_day INTEGER DEFAULT 0,
    status TEXT DEFAULT 'scheduled',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    synced_at INTEGER
  );
`;

/**
 * SQL indexes for meetings table
 */
export const MEETING_INDEXES = [
  'CREATE INDEX IF NOT EXISTS idx_meetings_room_id ON meetings(room_id);',
  'CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON meetings(start_time);',
  'CREATE INDEX IF NOT EXISTS idx_meetings_end_time ON meetings(end_time);',
  'CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);',
  'CREATE INDEX IF NOT EXISTS idx_meetings_room_start ON meetings(room_id, start_time);',
];

