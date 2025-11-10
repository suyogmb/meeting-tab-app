/**
 * Room-related TypeScript types and interfaces
 */

export interface Room {
  id: string;
  name: string;
  building?: string;
  floor?: number;
  capacity?: number;
  features?: string[]; // e.g., ['projector', 'whiteboard', 'video-conference']
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface RoomResponse {
  id: string;
  name: string;
  building?: string;
  floor?: number;
  capacity?: number;
  features?: string[];
  description?: string;
}

/**
 * Room configuration for kiosk device
 */
export interface RoomConfig {
  roomId: string;
  roomName: string;
  deviceId: string;
  lastConfigured: number;
}

