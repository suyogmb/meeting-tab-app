/**
 * Mock Data Service
 * Provides mock meeting data for development and testing
 * Replace this with real API calls when backend is available
 */

import {Meeting, MeetingResponse} from '../../types/meeting';
import {Room, RoomResponse} from '../../types/room';

/**
 * Convert API response to Meeting type
 */
function meetingResponseToMeeting(response: MeetingResponse, roomId: string): Meeting {
  return {
    id: response.id,
    roomId,
    title: response.title,
    description: response.description,
    organizer: response.organizer,
    startTime: new Date(response.startTime).getTime(),
    endTime: new Date(response.endTime).getTime(),
    attendeeCount: response.attendeeCount,
    isAllDay: response.isAllDay || false,
    status: response.status || 'scheduled',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    syncedAt: Date.now(),
  };
}

/**
 * Generate mock meetings for today
 */
export function generateMockMeetings(roomId: string): Meeting[] {
  const now = new Date();
  
  // Generate meetings throughout the day
  // Always start from next hour to ensure ALL meetings are in the future for testing
  // This ensures all 9 meetings appear in the upcoming list for scroll testing
  
  // Calculate base time - start from next hour, minimum 1 hour from now
  const baseTime = new Date(now);
  baseTime.setHours(baseTime.getHours() + 1); // Next hour
  baseTime.setMinutes(0);
  baseTime.setSeconds(0);
  baseTime.setMilliseconds(0);
  
  // Double-check: if baseTime is still in the past, add another hour
  if (baseTime.getTime() <= now.getTime()) {
    baseTime.setHours(baseTime.getHours() + 1);
  }
  
  // Now generate all 9 meetings starting from baseTime, spaced 1-2 hours apart
  
  // Calculate first meeting time - 5 minutes from now
  const fiveMinutesFromNow = now.getTime() + 5 * 60 * 1000; // 5 minutes from now
  
  // Generate 9 meetings, all in the future, spaced 1 hour apart
  // First meeting starts in 5 minutes for testing
  const meetings: Meeting[] = [
    {
      id: 'meeting-1',
      roomId,
      title: 'Team Standup',
      description: 'Daily team synchronization meeting',
      organizer: 'John Doe',
      startTime: fiveMinutesFromNow,
      endTime: fiveMinutesFromNow + 30 * 60 * 1000, // 30 minutes duration
      attendeeCount: 5,
      isAllDay: false,
      status: 'scheduled',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
      syncedAt: Date.now() - 3600000,
    },
    {
      id: 'meeting-2',
      roomId,
      title: 'Client Presentation',
      description: 'Quarterly business review presentation',
      organizer: 'Jane Smith',
      startTime: fiveMinutesFromNow + 1 * 60 * 60 * 1000, // 1 hour after first meeting
      endTime: fiveMinutesFromNow + 2 * 60 * 60 * 1000,
      attendeeCount: 8,
      isAllDay: false,
      status: 'scheduled',
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 172800000,
      syncedAt: Date.now() - 3600000,
    },
    {
      id: 'meeting-3',
      roomId,
      title: 'Lunch Break',
      description: 'Team lunch',
      organizer: 'Team Lead',
      startTime: baseTime.getTime() + 2 * 60 * 60 * 1000, // +2 hours
      endTime: baseTime.getTime() + 3 * 60 * 60 * 1000,
      attendeeCount: 12,
      isAllDay: false,
      status: 'scheduled',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
      syncedAt: Date.now() - 3600000,
    },
    {
      id: 'meeting-4',
      roomId,
      title: 'Product Planning',
      description: 'Q2 product roadmap planning session',
      organizer: 'Sarah Johnson',
      startTime: baseTime.getTime() + 3 * 60 * 60 * 1000, // +3 hours
      endTime: baseTime.getTime() + 4 * 60 * 60 * 1000,
      attendeeCount: 6,
      isAllDay: false,
      status: 'scheduled',
      createdAt: Date.now() - 259200000,
      updatedAt: Date.now() - 259200000,
      syncedAt: Date.now() - 3600000,
    },
    {
      id: 'meeting-5',
      roomId,
      title: 'Code Review',
      description: 'Sprint review and code review session',
      organizer: 'Mike Wilson',
      startTime: baseTime.getTime() + 4 * 60 * 60 * 1000, // +4 hours
      endTime: baseTime.getTime() + 5 * 60 * 60 * 1000,
      attendeeCount: 4,
      isAllDay: false,
      status: 'scheduled',
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 172800000,
      syncedAt: Date.now() - 3600000,
    },
    {
      id: 'meeting-6',
      roomId,
      title: 'Design Review',
      description: 'UI/UX design review and feedback session',
      organizer: 'Emily Davis',
      startTime: baseTime.getTime() + 5 * 60 * 60 * 1000, // +5 hours
      endTime: baseTime.getTime() + 6 * 60 * 60 * 1000,
      attendeeCount: 7,
      isAllDay: false,
      status: 'scheduled',
      createdAt: Date.now() - 259200000,
      updatedAt: Date.now() - 259200000,
      syncedAt: Date.now() - 3600000,
    },
    {
      id: 'meeting-7',
      roomId,
      title: 'Strategy Session',
      description: 'Quarterly business strategy planning',
      organizer: 'Robert Brown',
      startTime: baseTime.getTime() + 6 * 60 * 60 * 1000, // +6 hours
      endTime: baseTime.getTime() + 7 * 60 * 60 * 1000,
      attendeeCount: 10,
      isAllDay: false,
      status: 'scheduled',
      createdAt: Date.now() - 345600000,
      updatedAt: Date.now() - 345600000,
      syncedAt: Date.now() - 3600000,
    },
    {
      id: 'meeting-8',
      roomId,
      title: 'Team Building',
      description: 'Team building activities and games',
      organizer: 'Lisa Anderson',
      startTime: baseTime.getTime() + 7 * 60 * 60 * 1000, // +7 hours
      endTime: baseTime.getTime() + 8 * 60 * 60 * 1000,
      attendeeCount: 15,
      isAllDay: false,
      status: 'scheduled',
      createdAt: Date.now() - 432000000,
      updatedAt: Date.now() - 432000000,
      syncedAt: Date.now() - 3600000,
    },
    {
      id: 'meeting-9',
      roomId,
      title: 'Training Workshop',
      description: 'Technical skills training workshop',
      organizer: 'David Martinez',
      startTime: baseTime.getTime() + 8 * 60 * 60 * 1000, // +8 hours
      endTime: baseTime.getTime() + 9 * 60 * 60 * 1000,
      attendeeCount: 12,
      isAllDay: false,
      status: 'scheduled',
      createdAt: Date.now() - 518400000,
      updatedAt: Date.now() - 518400000,
      syncedAt: Date.now() - 3600000,
    },
  ];

  return meetings.sort((a, b) => a.startTime - b.startTime);
}

/**
 * Mock API service for meetings
 * Replace this with real HTTPService calls when API is available
 */
export class MockDataService {
  /**
   * Fetch meetings for a room (mock implementation)
   */
  static async fetchMeetings(roomId: string): Promise<Meeting[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Return mock data
    return generateMockMeetings(roomId);
  }

  /**
   * Fetch a single meeting by ID (mock implementation)
   */
  static async fetchMeetingById(meetingId: string, roomId: string): Promise<Meeting | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const meetings = generateMockMeetings(roomId);
    return meetings.find((m) => m.id === meetingId) || null;
  }

  /**
   * Fetch room information (mock implementation)
   */
  static async fetchRoom(roomId: string): Promise<Room | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    return {
      id: roomId,
      name: 'Conference Room A',
      building: 'Main Building',
      floor: 3,
      capacity: 20,
      features: ['projector', 'whiteboard', 'video-conference'],
      description: 'Large conference room with modern amenities',
      createdAt: Date.now() - 86400000 * 30,
      updatedAt: Date.now() - 86400000,
    };
  }
}

