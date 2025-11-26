/**
 * Meetings API Service
 * Handles all meeting-related API calls
 */

import HTTPService from '../../networkConfig/HttpServices';
import {Endpoints} from '../../networkConfig/Endpoints';
import {
  Meeting,
  MeetingsApiResponse,
  MeetingsListApiResponse,
  MeetingApiResponse,
} from '../../types/meeting';
import {logger} from '../../utils/SecureLogger';

/**
 * Convert API meeting response to internal Meeting format
 */
/**
 * Expand recurring meeting into individual instances
 * @param apiMeeting - The recurring meeting from API
 * @param roomCode - Room code
 * @param daysAhead - Number of days ahead to expand (default: 30)
 * @returns Array of Meeting instances
 */
function expandRecurringMeeting(
  apiMeeting: MeetingApiResponse,
  roomCode: string,
  daysAhead: number = 30,
): Meeting[] {
  const meetings: Meeting[] = [];
  const baseStartTime = new Date(apiMeeting.startTime).getTime();
  const duration = apiMeeting.duration * 60 * 1000; // Convert minutes to milliseconds
  const endTime = baseStartTime + duration;
  
  // Calculate end date for expansion
  const endDate = apiMeeting.endDateTime
    ? new Date(apiMeeting.endDateTime).getTime()
    : Date.now() + (daysAhead * 24 * 60 * 60 * 1000); // Default to daysAhead days from now
  
  const maxDate = Math.min(endDate, Date.now() + (daysAhead * 24 * 60 * 60 * 1000));
  
  // Map API status to internal status
  const statusMap: Record<string, Meeting['status']> = {
    'SCHEDULED': 'scheduled',
    'IN_PROGRESS': 'in-progress',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled',
  };

  // Determine organizer - prefer hostEmail, then hostName, then first participant
  let organizer: string | undefined;
  if (apiMeeting.hostEmail) {
    organizer = apiMeeting.hostEmail;
  } else if (apiMeeting.hostName) {
    organizer = apiMeeting.hostName;
  } else if (apiMeeting.participantEmails && apiMeeting.participantEmails.length > 0) {
    organizer = apiMeeting.participantEmails[0];
  }

  const createdAt = apiMeeting.createdAt
    ? new Date(apiMeeting.createdAt).getTime()
    : Date.now();

  // Handle different recurrence types
  const recurrenceType = apiMeeting.recurrenceType?.toUpperCase();
  const repeatInterval = apiMeeting.repeatInterval || 1;
  const maxOccurrences = apiMeeting.endTimes || Math.floor(daysAhead / (repeatInterval || 1));

  let currentTime = baseStartTime;
  let occurrenceCount = 0;

  while (currentTime <= maxDate && occurrenceCount < maxOccurrences) {
    const instanceEndTime = currentTime + duration;
    
    // Create unique ID for each occurrence (base UUID + occurrence index)
    const instanceId = `${apiMeeting.meetingUuid}-${occurrenceCount}`;

    meetings.push({
      id: instanceId,
      roomId: roomCode,
      title: apiMeeting.topic,
      description: apiMeeting.agenda,
      organizer,
      startTime: currentTime,
      endTime: instanceEndTime,
      attendeeCount: apiMeeting.participantEmails?.length || 0,
      isAllDay: false,
      status: statusMap[apiMeeting.status] || 'scheduled',
      createdAt,
      updatedAt: createdAt,
      syncedAt: Date.now(),
    });

    // Calculate next occurrence based on recurrence type
    switch (recurrenceType) {
      case 'DAILY':
        currentTime += repeatInterval * 24 * 60 * 60 * 1000;
        break;
      case 'WEEKLY':
        currentTime += repeatInterval * 7 * 24 * 60 * 60 * 1000;
        break;
      case 'MONTHLY':
        // Approximate: add 30 days per interval
        currentTime += repeatInterval * 30 * 24 * 60 * 60 * 1000;
        break;
      case 'YEARLY':
        // Approximate: add 365 days per interval
        currentTime += repeatInterval * 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        // Default to weekly if unknown
        currentTime += repeatInterval * 7 * 24 * 60 * 60 * 1000;
        break;
    }

    occurrenceCount++;
  }

  return meetings;
}

function convertApiMeetingToMeeting(apiMeeting: MeetingApiResponse, roomCode: string): Meeting {
  // Parse ISO 8601 datetime strings
  const startTime = new Date(apiMeeting.startTime).getTime();
  const endTime = startTime + (apiMeeting.duration * 60 * 1000); // Convert minutes to milliseconds
  
  // Console log for debugging meeting time conversion
  console.log('========================================');
  console.log('🕐 CONVERTING API MEETING TO INTERNAL FORMAT');
  console.log('========================================');
  console.log('Meeting UUID:', apiMeeting.meetingUuid);
  console.log('Topic:', apiMeeting.topic);
  console.log('API startTime (string):', apiMeeting.startTime);
  console.log('API timezone:', apiMeeting.timezone);
  console.log('API duration (minutes):', apiMeeting.duration);
  console.log('Calculated startTime (timestamp):', startTime);
  console.log('Calculated startTime (ISO):', new Date(startTime).toISOString());
  console.log('Calculated startTime (local):', new Date(startTime).toLocaleString());
  console.log('Calculated endTime (timestamp):', endTime);
  console.log('Calculated endTime (ISO):', new Date(endTime).toISOString());
  console.log('Calculated endTime (local):', new Date(endTime).toLocaleString());
  console.log('Current time (timestamp):', Date.now());
  console.log('Current time (ISO):', new Date().toISOString());
  console.log('Current time (local):', new Date().toLocaleString());
  console.log('Is meeting current?', startTime <= Date.now() && endTime >= Date.now());
  console.log('========================================');
  
  // Handle createdAt - use current time if not provided
  const createdAt = apiMeeting.createdAt
    ? new Date(apiMeeting.createdAt).getTime()
    : Date.now();

  // Map API status to internal status
  const statusMap: Record<string, Meeting['status']> = {
    'SCHEDULED': 'scheduled',
    'IN_PROGRESS': 'in-progress',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled',
  };

  // Determine organizer - prefer hostEmail, then hostName, then first participant
  let organizer: string | undefined;
  if (apiMeeting.hostEmail) {
    organizer = apiMeeting.hostEmail;
  } else if (apiMeeting.hostName) {
    organizer = apiMeeting.hostName;
  } else if (apiMeeting.participantEmails && apiMeeting.participantEmails.length > 0) {
    organizer = apiMeeting.participantEmails[0];
  }

  return {
    id: apiMeeting.meetingUuid, // Use UUID as the ID
    roomId: roomCode, // Use the room code as room ID
    title: apiMeeting.topic,
    description: apiMeeting.agenda,
    organizer,
    startTime,
    endTime,
    attendeeCount: apiMeeting.participantEmails?.length || 0,
    isAllDay: false,
    status: statusMap[apiMeeting.status] || 'scheduled',
    createdAt,
    updatedAt: createdAt, // API doesn't provide updatedAt, use createdAt
    syncedAt: Date.now(),
  };
}

/**
 * Meetings API Service
 */
class MeetingsApiServiceClass {
  /**
   * Fetch meetings for a specific room code (without pagination)
   * @param roomCode - 4-digit room code (e.g., "1234")
   * @returns Promise with array of meetings
   */
  async fetchMeetingsByRoomCode(roomCode: string): Promise<Meeting[]> {
    try {
      logger.info('Fetching meetings from API', {roomCode});

      const url = Endpoints.meetingsByRoomCode(roomCode);
      const response = await HTTPService.get<MeetingsListApiResponse>(url);

      // Handle response structure (same as meetingsListByRoomCode)
      const apiResponse: MeetingsListApiResponse = 
        'code' in response && response.code !== undefined
          ? (response as any)
          : (response as any).data || response;

      // Check if the response is successful
      if (!apiResponse || apiResponse.code !== 200 || !apiResponse.data) {
        logger.error('API returned unsuccessful response', {
          message: apiResponse?.message,
          code: apiResponse?.code,
        });
        throw new Error(apiResponse?.message || 'Failed to fetch meetings');
      }

      // Convert API meetings to internal Meeting format
      const meetings = apiResponse.data.map(apiMeeting =>
        convertApiMeetingToMeeting(apiMeeting, roomCode),
      );

      logger.info('Meetings fetched successfully', {
        count: meetings.length,
      });

      return meetings;
    } catch (error) {
      logger.error('Failed to fetch meetings', {
        error,
        roomCode,
      });
      throw error;
    }
  }

  /**
   * Fetch all meetings for a room (no pagination - uses simple endpoint)
   * @param roomCode - 4-digit room code
   * @returns Promise with array of all meetings
   */
  async fetchAllMeetingsByRoomCode(roomCode: string): Promise<Meeting[]> {
    // Since API no longer uses pagination, just use the simple endpoint
    return this.fetchMeetingsByRoomCode(roomCode);
  }

  /**
   * Fetch meetings list for a room (new API format without pagination)
   * @param roomCode - 4-digit room code
   * @returns Promise with array of meetings
   */
  async fetchMeetingsListByRoomCode(roomCode: string): Promise<Meeting[]> {
    try {
      logger.info('Fetching meetings list from API', {roomCode});

      const url = Endpoints.meetingsListByRoomCode(roomCode);
      
      // Console log URL and payload
      console.log('=== MEETINGS API CALL ===');
      console.log('URL:', url);
      console.log('Method: GET');
      console.log('Payload: None (GET request)');
      console.log('Room Code:', roomCode);

      let response;
      try {
        response = await HTTPService.get<MeetingsListApiResponse>(url);
      } catch (error) {
        console.error('=== MEETINGS API ERROR ===');
        console.error('Error:', error);
        console.error('Error Type:', typeof error);
        console.error('Error Message:', error instanceof Error ? error.message : String(error));
        throw error;
      }

      // Console log response - safely handle undefined/null
      console.log('=== MEETINGS API RESPONSE ===');
      console.log('Response:', response);
      console.log('Response Type:', typeof response);
      console.log('Response is null:', response === null);
      console.log('Response is undefined:', response === undefined);
      
      if (response) {
        try {
          console.log('Full Response (stringified):', JSON.stringify(response, null, 2));
          console.log('Response Keys:', Object.keys(response));
        } catch (stringifyError) {
          console.error('Error stringifying response:', stringifyError);
          console.log('Response (direct):', response);
        }
      } else {
        console.warn('Response is null or undefined!');
      }

      // HTTPService.get returns ApiResponse<T>, but the actual implementation
      // returns axios response.data directly, which is the API response body
      // The API returns { message, code, data, timestamp }
      // So we need to access response.data to get the actual API response
      // However, TypeScript thinks response.data is MeetingsListApiResponse (which is correct)
      // but the runtime might have it nested, so we check both structures
      const apiResponse: MeetingsListApiResponse = 
        'code' in response && response.code !== undefined
          ? (response as any)
          : (response as any).data || response;

      console.log('=== PARSED API RESPONSE ===');
      if (apiResponse) {
        try {
          console.log('Parsed Response (stringified):', JSON.stringify(apiResponse, null, 2));
        } catch (stringifyError) {
          console.error('Error stringifying parsed response:', stringifyError);
          console.log('Parsed Response (direct):', apiResponse);
        }
      } else {
        console.warn('Parsed response is null or undefined!');
      }
      console.log('Response Code:', apiResponse?.code);
      console.log('Response Message:', apiResponse?.message);
      console.log('Data Count:', apiResponse?.data?.length || 0);

      // Check if the response is successful
      if (!apiResponse || apiResponse.code !== 200 || !apiResponse.data) {
        let responseString = 'Unable to stringify';
        try {
          responseString = JSON.stringify(response);
        } catch (stringifyError) {
          console.error('Error stringifying response in error handler:', stringifyError);
          responseString = String(response);
        }
        
        logger.error('API returned unsuccessful response', {
          message: apiResponse?.message,
          code: apiResponse?.code,
          response: responseString,
        });
        throw new Error(apiResponse?.message || 'Failed to fetch meetings');
      }

      // Convert API meetings to internal Meeting format and expand recurring meetings
      const allMeetings: Meeting[] = [];
      
      for (const apiMeeting of apiResponse.data) {
        if (apiMeeting.isRecurring && apiMeeting.recurrenceType) {
          // Expand recurring meeting into individual instances
          const expandedMeetings = expandRecurringMeeting(apiMeeting, roomCode, 30); // Expand 30 days ahead
          allMeetings.push(...expandedMeetings);
          
          logger.debug('Expanded recurring meeting', {
            meetingUuid: apiMeeting.meetingUuid,
            recurrenceType: apiMeeting.recurrenceType,
            instances: expandedMeetings.length,
          });
        } else {
          // Regular meeting - convert directly
          const meeting = convertApiMeetingToMeeting(apiMeeting, roomCode);
          allMeetings.push(meeting);
        }
      }

      logger.info('Meetings list fetched and processed successfully', {
        originalCount: apiResponse.data.length,
        totalCount: allMeetings.length,
        recurringExpanded: apiResponse.data.filter(m => m.isRecurring).length,
      });

      return allMeetings;
    } catch (error) {
      logger.error('Failed to fetch meetings list', {
        error,
        roomCode,
      });
      throw error;
    }
  }

  /**
   * Fetch a single meeting by UUID
   * @param roomCode - 4-digit room code
   * @param meetingUuid - Meeting UUID
   * @returns Promise with Meeting or null if not found
   */
  async fetchMeetingByUuid(roomCode: string, meetingUuid: string): Promise<Meeting | null> {
    try {
      logger.info('Fetching meeting by UUID from API', {roomCode, meetingUuid});

      const url = Endpoints.meetingByUuid(roomCode, meetingUuid);
      
      console.log('=== FETCH MEETING BY UUID API CALL ===');
      console.log('URL:', url);
      console.log('Method: GET');
      console.log('Room Code:', roomCode);
      console.log('Meeting UUID:', meetingUuid);

      let response;
      try {
        response = await HTTPService.get<MeetingsListApiResponse>(url);
      } catch (error) {
        console.error('=== FETCH MEETING BY UUID API ERROR ===');
        console.error('Error:', error);
        throw error;
      }

      console.log('=== FETCH MEETING BY UUID API RESPONSE ===');
      console.log('Response:', JSON.stringify(response, null, 2));

      // Handle response structure (same as meetingsListByRoomCode)
      const apiResponse: MeetingsListApiResponse = 
        'code' in response && response.code !== undefined
          ? (response as any)
          : (response as any).data || response;

      // Check if the response is successful
      if (!apiResponse || apiResponse.code !== 200 || !apiResponse.data) {
        logger.error('API returned unsuccessful response', {
          message: apiResponse?.message,
          code: apiResponse?.code,
        });
        return null; // Return null if meeting not found
      }

      // Check if we have any meetings in the response
      if (!apiResponse.data || apiResponse.data.length === 0) {
        logger.info('No meeting found with UUID', {meetingUuid, roomCode});
        return null;
      }

      // Get the first meeting (should be only one)
      const apiMeeting = apiResponse.data[0];

      // Convert API meeting to internal Meeting format
      // For single meeting fetch by UUID, we return the base meeting (not expanded instances)
      // The meeting ID will be the meetingUuid
      const meeting = convertApiMeetingToMeeting(apiMeeting, roomCode);

      logger.info('Meeting fetched successfully by UUID', {
        meetingId: meeting.id,
        title: meeting.title,
        startTime: meeting.startTime,
      });

      return meeting;
    } catch (error) {
      logger.error('Failed to fetch meeting by UUID', {
        error,
        roomCode,
        meetingUuid,
      });
      throw error;
    }
  }
}

// Export singleton instance
const MeetingsApiService = new MeetingsApiServiceClass();
export default MeetingsApiService;

