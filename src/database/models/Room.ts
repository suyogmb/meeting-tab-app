/**
 * Database model for Room entity
 * SQLite table schema and TypeScript interfaces
 */

export interface RoomDB {
  id: string;
  name: string;
  building: string | null;
  floor: number | null;
  capacity: number | null;
  features: string | null; // JSON string array
  description: string | null;
  created_at: number;
  updated_at: number;
}

/**
 * SQL table creation statement for rooms
 */
export const ROOM_TABLE_CREATE = `
  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    building TEXT,
    floor INTEGER,
    capacity INTEGER,
    features TEXT,
    description TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`;

/**
 * SQL indexes for rooms table
 */
export const ROOM_INDEXES = [
  'CREATE INDEX IF NOT EXISTS idx_rooms_name ON rooms(name);',
];

