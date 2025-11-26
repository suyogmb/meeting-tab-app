/**
 * Meeting-related TypeScript types and interfaces
 */

export interface Meeting {
  id: string;
  roomId: string;
  title: string;
  description?: string;
  organizer?: string;
  startTime: number; // Unix timestamp in milliseconds
  endTime: number; // Unix timestamp in milliseconds
  attendeeCount?: number;
  isAllDay?: boolean;
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: number; // Unix timestamp in milliseconds
  updatedAt: number; // Unix timestamp in milliseconds
  syncedAt?: number; // Last sync timestamp
}

/**
 * API Response Types (matching backend structure)
 */
export type MeetingPlatform = 'ZOOM' | 'TEAMS' | 'GOOGLE_MEET' | 'WEBEX';
export type MeetingFormat = 'HYBRID' | 'ONLINE' | 'IN_PERSON';
export type MeetingStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface MeetingApiResponse {
  id?: number;
  meetingUuid: string;
  meetingPlatformId: string;
  platform: MeetingPlatform;
  platformUserEmail?: string | null;
  topic: string;
  startTime: string; // ISO 8601 format: "2024-01-15T10:00:00"
  duration: number; // Duration in minutes
  timezone: string;
  joinUrl?: string | null;
  startUrl?: string | null;
  status: MeetingStatus;
  createdBy?: number;
  recordingUrl?: string | null;
  agenda?: string;
  meetingType?: string;
  participantEmails: string[];
  hostParticipant?: string;
  hostName?: string;
  hostEmail?: string;
  enableWaitingRoom?: boolean;
  allowRecording?: boolean;
  password?: string;
  useSpecificAccount?: boolean;
  isRecurring: boolean;
  recurrenceType?: string | null;
  repeatInterval?: number | null;
  endTimes?: number | null;
  endDateTime?: string | null;
  recurrence?: string | null;
  // Legacy fields for backward compatibility
  meetingPlatform?: MeetingPlatform;
  meetingFormat?: MeetingFormat;
  meetingRoomId?: number;
  createdAt?: string; // ISO 8601 format
}

export interface MeetingsApiResponse {
  success: boolean;
  message: string;
  data: {
    models: MeetingApiResponse[];
    totalElements: number;
    totalPages: number;
    isFirst: boolean;
    isLast: boolean;
  };
}

/**
 * New API Response format (matching actual API structure)
 */
export interface MeetingsListApiResponse {
  message: string;
  code: number;
  data: MeetingApiResponse[];
  timestamp: string;
}

export interface MeetingResponse {
  id: string;
  roomId: string;
  title: string;
  description?: string;
  organizer?: string;
  startTime: string; // ISO 8601 string from API
  endTime: string; // ISO 8601 string from API
  attendeeCount?: number;
  isAllDay?: boolean;
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

/**
 * Meeting display states for UI
 */
export type MeetingDisplayState = 'current' | 'next' | 'upcoming' | 'past';

/**
 * Meeting card props for wallet-style display
 */
export interface MeetingCardProps {
  meeting: Meeting;
  displayState: MeetingDisplayState;
  onPress?: () => void;
}

/**
 * Meeting list filter options
 */
export interface MeetingListFilter {
  date?: Date;
  roomId?: string;
  status?: Meeting['status'];
  limit?: number;
}

/**
 * Room Details API Response
 */
export interface RoomDetails {
  id: number;
  uuid: string;
  roomCode: string;
  name: string;
  capacity: number;
  description: string | null;
  backgroundUrl: string | null;
}

export interface RoomDetailsApiResponse {
  message: string;
  code: number;
  data: RoomDetails;
  timestamp: string;
}

