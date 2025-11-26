/**
 * Database queries for Meeting entity
 */

import DatabaseService from '../DatabaseService';
import {Meeting, MeetingListFilter} from '../../types/meeting';
import {MeetingDB} from '../models/Meeting';
import {logger} from '../../utils/SecureLogger';

/**
 * Convert MeetingDB to Meeting type
 */
function dbToMeeting(db: MeetingDB): Meeting {
  return {
    id: db.id,
    roomId: db.room_id,
    title: db.title,
    description: db.description || undefined,
    organizer: db.organizer || undefined,
    startTime: db.start_time,
    endTime: db.end_time,
    attendeeCount: db.attendee_count || undefined,
    isAllDay: db.is_all_day === 1,
    status: db.status as Meeting['status'],
    createdAt: db.created_at,
    updatedAt: db.updated_at,
    syncedAt: db.synced_at || undefined,
  };
}

/**
 * Convert Meeting to MeetingDB type
 */
function meetingToDB(meeting: Meeting): MeetingDB {
  return {
    id: meeting.id,
    room_id: meeting.roomId,
    title: meeting.title,
    description: meeting.description || null,
    organizer: meeting.organizer || null,
    start_time: meeting.startTime,
    end_time: meeting.endTime,
    attendee_count: meeting.attendeeCount || null,
    is_all_day: meeting.isAllDay ? 1 : 0,
    status: meeting.status || 'scheduled',
    created_at: meeting.createdAt,
    updated_at: meeting.updatedAt,
    synced_at: meeting.syncedAt || null,
  };
}

/**
 * Get all meetings for a room within a date range
 */
export async function getMeetingsByRoom(
  roomId: string,
  startDate: number,
  endDate: number,
): Promise<Meeting[]> {
  const db = DatabaseService.getDatabase();
  const sql = `
    SELECT * FROM meetings
    WHERE room_id = ?
    AND start_time >= ?
    AND end_time <= ?
    ORDER BY start_time ASC
  `;
  const results = await db.executeSql(sql, [roomId, startDate, endDate]);
  const rows = results[0].rows.raw() as MeetingDB[];
  return rows.map(dbToMeeting);
}

/**
 * Get current meeting (meeting happening now)
 */
export async function getCurrentMeeting(roomId: string): Promise<Meeting | null> {
  const now = Date.now();
  const db = DatabaseService.getDatabase();
  const sql = `
    SELECT * FROM meetings
    WHERE room_id = ?
    AND start_time <= ?
    AND end_time > ?
    AND status != 'cancelled'
    ORDER BY start_time DESC
    LIMIT 1
  `;
  
  // Console log for debugging current meeting query
  console.log('========================================');
  console.log('🔍 GETTING CURRENT MEETING');
  console.log('========================================');
  console.log('Room ID:', roomId);
  console.log('Current time (timestamp):', now);
  console.log('Current time (ISO):', new Date(now).toISOString());
  console.log('Current time (local):', new Date(now).toLocaleString());
  console.log('Query: start_time <=', now, 'AND end_time >', now, '(CHANGED: >= to >)');
  console.log('========================================');
  
  const results = await db.executeSql(sql, [roomId, now, now]);
  const rows = results[0].rows.raw() as MeetingDB[];
  
  if (rows.length > 0) {
    const meeting = dbToMeeting(rows[0]);
    console.log('========================================');
    console.log('✅ CURRENT MEETING FOUND');
    console.log('========================================');
    console.log('Meeting ID:', meeting.id);
    console.log('Title:', meeting.title);
    console.log('Start time (timestamp):', meeting.startTime);
    console.log('Start time (ISO):', new Date(meeting.startTime).toISOString());
    console.log('Start time (local):', new Date(meeting.startTime).toLocaleString());
    console.log('End time (timestamp):', meeting.endTime);
    console.log('End time (ISO):', new Date(meeting.endTime).toISOString());
    console.log('End time (local):', new Date(meeting.endTime).toLocaleString());
    console.log('Current time (timestamp):', now);
    console.log('Current time (ISO):', new Date(now).toISOString());
    console.log('Current time (local):', new Date(now).toLocaleString());
    console.log('Is start_time <= now?', meeting.startTime <= now);
    console.log('Is end_time > now?', meeting.endTime > now, '(CHANGED: >= to >)');
    console.log('Time until start (ms):', meeting.startTime - now);
    console.log('Time until end (ms):', meeting.endTime - now);
    console.log('========================================');
    return meeting;
  } else {
    console.log('========================================');
    console.log('❌ NO CURRENT MEETING FOUND');
    console.log('========================================');
    return null;
  }
}

/**
 * Get next meeting (upcoming meeting)
 */
export async function getNextMeeting(roomId: string): Promise<Meeting | null> {
  const now = Date.now();
  const db = DatabaseService.getDatabase();
  const sql = `
    SELECT * FROM meetings
    WHERE room_id = ?
    AND start_time > ?
    AND status != 'cancelled'
    ORDER BY start_time ASC
    LIMIT 1
  `;
  const results = await db.executeSql(sql, [roomId, now]);
  const rows = results[0].rows.raw() as MeetingDB[];
  return rows.length > 0 ? dbToMeeting(rows[0]) : null;
}

/**
 * Get meetings for today
 */
export async function getTodayMeetings(roomId: string): Promise<Meeting[]> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;
  return getMeetingsByRoom(roomId, startOfDay, endOfDay);
}

/**
 * Get all meetings for a room (no date filter)
 */
export async function getAllMeetings(roomId: string): Promise<Meeting[]> {
  const db = DatabaseService.getDatabase();
  const sql = `
    SELECT * FROM meetings
    WHERE room_id = ?
    AND status != 'cancelled'
    ORDER BY start_time ASC
  `;
  const results = await db.executeSql(sql, [roomId]);
  const rows = results[0].rows.raw() as MeetingDB[];
  return rows.map(dbToMeeting);
}

/**
 * Upsert meeting (insert or update)
 */
export async function upsertMeeting(meeting: Meeting): Promise<void> {
  const db = DatabaseService.getDatabase();
  const meetingDB = meetingToDB(meeting);
  
  // Console log for debugging meeting upsert
  console.log('========================================');
  console.log('💾 UPSERTING MEETING TO DATABASE');
  console.log('========================================');
  console.log('Meeting ID:', meeting.id);
  console.log('Title:', meeting.title);
  console.log('Room ID:', meeting.roomId);
  console.log('Start time (timestamp):', meeting.startTime);
  console.log('Start time (ISO):', new Date(meeting.startTime).toISOString());
  console.log('Start time (local):', new Date(meeting.startTime).toLocaleString());
  console.log('End time (timestamp):', meeting.endTime);
  console.log('End time (ISO):', new Date(meeting.endTime).toISOString());
  console.log('End time (local):', new Date(meeting.endTime).toLocaleString());
  console.log('Status:', meeting.status);
  console.log('DB start_time:', meetingDB.start_time);
  console.log('DB end_time:', meetingDB.end_time);
  console.log('Current time (timestamp):', Date.now());
  console.log('Current time (ISO):', new Date().toISOString());
  console.log('Current time (local):', new Date().toLocaleString());
  console.log('========================================');
  
  const sql = `
    INSERT OR REPLACE INTO meetings (
      id, room_id, title, description, organizer,
      start_time, end_time, attendee_count, is_all_day,
      status, created_at, updated_at, synced_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await db.executeSql(sql, [
    meetingDB.id,
    meetingDB.room_id,
    meetingDB.title,
    meetingDB.description,
    meetingDB.organizer,
    meetingDB.start_time,
    meetingDB.end_time,
    meetingDB.attendee_count,
    meetingDB.is_all_day,
    meetingDB.status,
    meetingDB.created_at,
    meetingDB.updated_at,
    meetingDB.synced_at,
  ]);
  
  console.log('✅ Meeting upserted successfully');
}

/**
 * Upsert multiple meetings in a transaction
 */
export async function upsertMeetings(meetings: Meeting[]): Promise<void> {
  const db = DatabaseService.getDatabase();
  
  // Use a simple promise-based transaction
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: any) => {
        for (const meeting of meetings) {
          const meetingDB = meetingToDB(meeting);
          const sql = `
            INSERT OR REPLACE INTO meetings (
              id, room_id, title, description, organizer,
              start_time, end_time, attendee_count, is_all_day,
              status, created_at, updated_at, synced_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          tx.executeSql(sql, [
            meetingDB.id,
            meetingDB.room_id,
            meetingDB.title,
            meetingDB.description,
            meetingDB.organizer,
            meetingDB.start_time,
            meetingDB.end_time,
            meetingDB.attendee_count,
            meetingDB.is_all_day,
            meetingDB.status,
            meetingDB.created_at,
            meetingDB.updated_at,
            meetingDB.synced_at,
          ]);
        }
      },
      (error: any) => {
        // Transaction error
        logger.error('Transaction failed while upserting meetings', {error, count: meetings.length});
        reject(error);
      },
      () => {
        // Transaction success
        logger.info('Successfully upserted meetings in transaction', {count: meetings.length});
        resolve();
      },
    );
  });
}

/**
 * Get meeting by ID
 */
export async function getMeetingById(meetingId: string): Promise<Meeting | null> {
  const db = DatabaseService.getDatabase();
  const sql = 'SELECT * FROM meetings WHERE id = ? LIMIT 1';
  const results = await db.executeSql(sql, [meetingId]);
  const rows = results[0].rows.raw() as MeetingDB[];
  return rows.length > 0 ? dbToMeeting(rows[0]) : null;
}

/**
 * Check if meeting exists by ID
 */
export async function meetingExists(meetingId: string): Promise<boolean> {
  const meeting = await getMeetingById(meetingId);
  return meeting !== null;
}

/**
 * Delete meeting by ID
 */
export async function deleteMeeting(meetingId: string): Promise<void> {
  const db = DatabaseService.getDatabase();
  const sql = 'DELETE FROM meetings WHERE id = ?';
  await db.executeSql(sql, [meetingId]);
}

/**
 * Delete old meetings (older than specified timestamp)
 */
export async function deleteOldMeetings(beforeTimestamp: number): Promise<number> {
  const db = DatabaseService.getDatabase();
  const sql = 'DELETE FROM meetings WHERE end_time < ?';
  const results = await db.executeSql(sql, [beforeTimestamp]);
  return results[0].rowsAffected;
}

