/**
 * Custom hook for managing meetings data
 */

import {useState, useEffect, useCallback} from 'react';
import {Meeting} from '../types/meeting';
import {
  getCurrentMeeting,
  getNextMeeting,
  getTodayMeetings,
} from '../database/queries/meetingQueries';
import StorageService from '../utils/StorageService';
import {logger} from '../utils/SecureLogger';
import DatabaseService from '../database/DatabaseService';
import {MockDataService} from '../services/mock/MockDataService';
import {upsertMeetings} from '../database/queries/meetingQueries';
import i18n from '../language/i18n';

interface UseMeetingsReturn {
  currentMeeting: Meeting | null;
  nextMeeting: Meeting | null;
  todayMeetings: Meeting[];
  isLoading: boolean;
  error: string | null;
  refreshMeetings: () => Promise<void>;
}

/**
 * Hook to fetch and manage meetings for the current room
 */
export function useMeetings(): UseMeetingsReturn {
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);
  const [nextMeeting, setNextMeeting] = useState<Meeting | null>(null);
  const [todayMeetings, setTodayMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMeetings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize database if needed - ensure it's fully initialized
      try {
        await DatabaseService.initialize();
        logger.info('Database initialized successfully');
      } catch (initError) {
        logger.error('Database initialization failed', {error: initError});
        throw new Error(`Database initialization failed: ${initError instanceof Error ? initError.message : 'Unknown error'}`);
      }

      // Wait a bit for storage to be ready (in case we just navigated from setup)
      await new Promise(resolve => setTimeout(resolve, 200));

      // Get room ID from storage - retry if not found initially
      let roomInfo = await StorageService.getItem<{
        roomId: string;
        roomName: string;
      }>(StorageService.storageKeys.roomInfo, false);

      // If not found, retry once after a short delay
      if (!roomInfo?.roomId) {
        await new Promise(resolve => setTimeout(resolve, 300));
        roomInfo = await StorageService.getItem<{
          roomId: string;
          roomName: string;
        }>(StorageService.storageKeys.roomInfo, false);
      }

      if (!roomInfo?.roomId) {
        logger.error('Room not configured', {
          roomInfo,
          keys: Object.keys(StorageService.storageKeys),
        });
        setError(i18n.t('meetings.error.roomNotConfigured'));
        setIsLoading(false);
        return;
      }

      logger.info('Room info loaded', {roomId: roomInfo.roomId});

      // Always regenerate meetings with fresh future times for testing
      // This ensures all 9 meetings appear in the upcoming list for scroll testing
      try {
        const db = DatabaseService.getDatabase();
        // Delete existing meetings - wrap in try-catch to handle if table doesn't exist yet
        const deleteResult = await db.executeSql('DELETE FROM meetings WHERE room_id = ?', [roomInfo.roomId]);
        logger.info('Cleared existing meetings', {affected: deleteResult[0]?.rowsAffected || 0});
      } catch (deleteError) {
        // If delete fails (table might not exist), that's okay - we'll create it during upsert
        logger.warn('Failed to delete existing meetings (may not exist yet)', {error: deleteError});
      }
      
      // Load fresh mock data - all meetings will have future times
      const mockMeetings = await MockDataService.fetchMeetings(roomInfo.roomId);
      logger.info('Generated fresh mock meetings with future times', {
        count: mockMeetings.length,
        firstMeetingTime: mockMeetings[0]?.startTime,
        lastMeetingTime: mockMeetings[mockMeetings.length - 1]?.startTime,
        now: Date.now(),
      });
      
      // Upsert meetings to database
      try {
        await upsertMeetings(mockMeetings);
        logger.info('Successfully saved meetings to database', {count: mockMeetings.length});
      } catch (upsertError) {
        logger.error('Failed to upsert meetings', {error: upsertError, count: mockMeetings.length});
        throw new Error(`Failed to save meetings: ${upsertError instanceof Error ? upsertError.message : 'Unknown error'}`);
      }

      // Fetch meetings in parallel
      try {
        const [current, next, today] = await Promise.all([
          getCurrentMeeting(roomInfo.roomId),
          getNextMeeting(roomInfo.roomId),
          getTodayMeetings(roomInfo.roomId),
        ]);

        logger.info('Successfully fetched meetings from database', {
          current: current?.id || null,
          next: next?.id || null,
          todayCount: today.length,
        });

        setCurrentMeeting(current);
        setNextMeeting(next);
        setTodayMeetings(today);
      } catch (fetchError) {
        logger.error('Failed to fetch meetings from database', {error: fetchError});
        throw new Error(`Failed to fetch meetings: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      }
    } catch (err) {
      const fallbackMessage = i18n.t('meetings.error.loadFailed');
      const errorMessage = err instanceof Error ? err.message : fallbackMessage;
      logger.error('Failed to load meetings', {
        error: err,
        errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
      });
      setError(fallbackMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMeetings();

    // Refresh every minute to update current/next meeting status
    const interval = setInterval(() => {
      loadMeetings();
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [loadMeetings]);

  return {
    currentMeeting,
    nextMeeting,
    todayMeetings,
    isLoading,
    error,
    refreshMeetings: loadMeetings,
  };
}

