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

