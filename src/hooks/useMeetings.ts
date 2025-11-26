/**
 * Custom hook for managing meetings data
 */

import {useState, useEffect, useCallback} from 'react';
import {Meeting, RoomDetails} from '../types/meeting';
import {
  getCurrentMeeting,
  getTodayMeetings,
  getAllMeetings,
} from '../database/queries/meetingQueries';
import StorageService from '../utils/StorageService';
import {logger} from '../utils/SecureLogger';
import DatabaseService from '../database/DatabaseService';
import MeetingsApiService from '../services/api/MeetingsApiService';
import RoomApiService from '../services/api/RoomApiService';
import {upsertMeetings} from '../database/queries/meetingQueries';
import i18n from '../language/i18n';

interface UseMeetingsReturn {
  currentMeeting: Meeting | null;
  todayMeetings: Meeting[];
  roomDetails: RoomDetails | null;
  isLoading: boolean;
  error: string | null;
  refreshMeetings: () => Promise<void>;
  refreshFromDatabase: () => Promise<void>;
}

/**
 * Hook to fetch and manage meetings for the current room
 */
export function useMeetings(): UseMeetingsReturn {
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);
  const [todayMeetings, setTodayMeetings] = useState<Meeting[]>([]);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const loadMeetings = useCallback(async (showLoading: boolean = false) => {
    try {
      // Only show loading on initial load or when explicitly requested
      if (showLoading || isInitialLoad) {
        setIsLoading(true);
      }
      setError(null);

      // Initialize database if needed - ensure it's fully initialized
      try {
        await DatabaseService.initialize();
        logger.info('Database initialized successfully');
      } catch (initError) {
        logger.error('Database initialization failed', {error: initError});
        throw new Error(`Database initialization failed: ${initError instanceof Error ? initError.message : 'Unknown error'}`);
      }

      const roomInfo = await StorageService.getItem<{
        roomId: string;
        roomName: string;
      }>(StorageService.storageKeys.roomInfo, false);

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

      // Fetch room details and meetings from API in parallel
      let apiMeetings: Meeting[] = [];
      let roomDetailsData: RoomDetails | null = null;

      try {
        const [meetingsResult, roomDetailsResult] = await Promise.allSettled([
          MeetingsApiService.fetchMeetingsListByRoomCode(roomInfo.roomId),
          RoomApiService.fetchRoomDetailsByRoomCode(roomInfo.roomId),
        ]);

        // Handle meetings result
        if (meetingsResult.status === 'fulfilled') {
          apiMeetings = meetingsResult.value;
          logger.info('Fetched meetings from API', {
            count: apiMeetings.length,
            firstMeetingTime: apiMeetings[0]?.startTime,
            lastMeetingTime: apiMeetings[apiMeetings.length - 1]?.startTime,
            now: Date.now(),
          });
        } else {
          logger.error('Failed to fetch meetings from API', {
            error: meetingsResult.reason,
            roomId: roomInfo.roomId,
          });
          throw new Error(
            `Failed to fetch meetings from API: ${meetingsResult.reason instanceof Error ? meetingsResult.reason.message : 'Unknown error'}`,
          );
        }

        // Handle room details result
        if (roomDetailsResult.status === 'fulfilled') {
          roomDetailsData = roomDetailsResult.value;
          logger.info('Fetched room details from API', {
            roomCode: roomDetailsData.roomCode,
            name: roomDetailsData.name,
          });
        } else {
          logger.warn('Failed to fetch room details from API', {
            error: roomDetailsResult.reason,
            roomId: roomInfo.roomId,
          });
          // Don't throw error for room details - it's not critical
        }
      } catch (apiError) {
        logger.error('Failed to fetch data from API', {
          error: apiError,
          roomId: roomInfo.roomId,
        });
        throw new Error(
          `Failed to fetch data from API: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`,
        );
      }

      // Update room details state and save to storage
      if (roomDetailsData) {
        setRoomDetails(roomDetailsData);
        // Save to storage for persistence
        await StorageService.storeItem(
          StorageService.storageKeys.roomDetails,
          roomDetailsData,
          false,
        );
      }
      
      // Clear existing meetings for this room
      try {
        const db = DatabaseService.getDatabase();
        const deleteResult = await db.executeSql('DELETE FROM meetings WHERE room_id = ?', [roomInfo.roomId]);
        logger.info('Cleared existing meetings', {affected: deleteResult[0]?.rowsAffected || 0});
      } catch (deleteError) {
        // If delete fails (table might not exist), that's okay - we'll create it during upsert
        logger.warn('Failed to delete existing meetings (may not exist yet)', {error: deleteError});
      }
      
      // Upsert meetings to database
      try {
        await upsertMeetings(apiMeetings);
        logger.info('Successfully saved meetings to database', {count: apiMeetings.length});
      } catch (upsertError) {
        logger.error('Failed to upsert meetings', {error: upsertError, count: apiMeetings.length});
        throw new Error(`Failed to save meetings: ${upsertError instanceof Error ? upsertError.message : 'Unknown error'}`);
      }

      // Update last sync timestamp after successfully fetching and saving data
      await StorageService.storeItem(
        StorageService.storageKeys.lastSyncTimestamp,
        Date.now(),
        false,
      );
      logger.info('Last sync timestamp updated after initial load', {
        timestamp: Date.now(),
      });

      // Fetch meetings from local database (not from API)
      // After initial load, data will be updated via Firebase push notifications
      try {
        const [current, allMeetings] = await Promise.all([
          getCurrentMeeting(roomInfo.roomId),
          getAllMeetings(roomInfo.roomId), // Get all meetings from local database
        ]);

        // Console log for debugging
        console.log('========================================');
        console.log('📋 USE MEETINGS HOOK - SETTING STATE');
        console.log('========================================');
        console.log('Current meeting:', current ? {
          id: current.id,
          title: current.title,
          startTime: new Date(current.startTime).toISOString(),
          endTime: new Date(current.endTime).toISOString(),
        } : null);
        console.log('All meetings count:', allMeetings.length);
        console.log('All meetings:', allMeetings.map(m => ({
          id: m.id,
          title: m.title,
          startTime: new Date(m.startTime).toISOString(),
          endTime: new Date(m.endTime).toISOString(),
        })));
        console.log('========================================');

        logger.info('Successfully fetched meetings from local database', {
          current: current?.id || null,
          allMeetingsCount: allMeetings.length,
        });

        setCurrentMeeting(current);
        setTodayMeetings(allMeetings); // Use all meetings for upcoming list
        
        // Mark initial load as complete
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
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
      // Only set loading to false if we set it to true
      if (showLoading || isInitialLoad) {
        setIsLoading(false);
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      }
    }
  }, [isInitialLoad]);

  // Refresh from database only (no API calls) - used after Admin Settings refresh
  const refreshFromDatabase = useCallback(async () => {
    try {
      const roomInfo = await StorageService.getItem<{
        roomId: string;
        roomName: string;
      }>(StorageService.storageKeys.roomInfo, false);

      if (!roomInfo?.roomId) {
        return;
      }

      // Load room details from storage (saved by Admin Settings refresh)
      const savedRoomDetails = await StorageService.getItem<RoomDetails>(
        StorageService.storageKeys.roomDetails,
        false,
      );
      if (savedRoomDetails) {
        setRoomDetails(savedRoomDetails);
      }

      // Fetch meetings from local database
      const [current, allMeetings] = await Promise.all([
        getCurrentMeeting(roomInfo.roomId),
        getAllMeetings(roomInfo.roomId),
      ]);

      setCurrentMeeting(current);
      setTodayMeetings(allMeetings);

      logger.info('Refreshed from database', {
        current: current?.id || null,
        allMeetingsCount: allMeetings.length,
      });
    } catch (error) {
      logger.error('Failed to refresh from database', {error});
      // Don't throw - just log error, don't break the UI
    }
  }, []);

  // Load room details from storage on mount (if available)
  useEffect(() => {
    const loadRoomDetailsFromStorage = async () => {
      try {
        const savedRoomDetails = await StorageService.getItem<RoomDetails>(
          StorageService.storageKeys.roomDetails,
          false,
        );
        if (savedRoomDetails) {
          setRoomDetails(savedRoomDetails);
          logger.info('Loaded room details from storage', {
            roomCode: savedRoomDetails.roomCode,
          });
        }
      } catch (error) {
        logger.warn('Failed to load room details from storage', {error});
      }
    };
    loadRoomDetailsFromStorage();
  }, []);

  useEffect(() => {
    // Initial load only - call APIs and store in local database
    // After this, data will be updated via Firebase push notifications
    // Manual refresh can be triggered from Admin Settings
    loadMeetings(true);
  }, [loadMeetings]);

  // Periodically refresh current meeting to handle meeting transitions
  useEffect(() => {
    if (isInitialLoad) {
      return; // Don't start periodic refresh until initial load is complete
    }

    // Refresh current meeting every 30 seconds to catch meeting transitions
    const interval = setInterval(async () => {
      try {
        const roomInfo = await StorageService.getItem<{
          roomId: string;
          roomName: string;
        }>(StorageService.storageKeys.roomInfo, false);

        if (!roomInfo?.roomId) {
          return;
        }

        // Only refresh current meeting from database (no API call)
        const current = await getCurrentMeeting(roomInfo.roomId);
        
        console.log('========================================');
        console.log('🔄 PERIODIC CURRENT MEETING REFRESH');
        console.log('========================================');
        console.log('Previous current meeting:', currentMeeting?.id || 'none');
        console.log('New current meeting:', current?.id || 'none');
        console.log('Changed?', currentMeeting?.id !== current?.id);
        console.log('========================================');
        
        setCurrentMeeting(current);
      } catch (error) {
        logger.error('Failed to refresh current meeting periodically', {error});
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isInitialLoad, currentMeeting]);

  return {
    currentMeeting,
    todayMeetings,
    roomDetails,
    isLoading,
    error,
    refreshMeetings: () => loadMeetings(true), // Manual refresh should show loading
    refreshFromDatabase, // Refresh from database only (no API calls)
  };
}

