import Config from 'react-native-config';
import {ConfigType} from 'types/types';

const config: ConfigType = Config as ConfigType;

/**
 * API Endpoints for Kiosk App
 * Update these endpoints based on your backend API structure
 */
export const Endpoints = {
  // Meeting endpoints
  meetings: `${config.BASE_URL}/api/v1/meeting-rooms`,
  // Endpoint for meetings list (without pagination)
  meetingsByRoomCode: (roomCode: string) => 
    `${config.BASE_URL}/api/v1/meeting-rooms/${roomCode}/meetings`,
  meetingsListByRoomCode: (roomCode: string) => 
    `${config.BASE_URL}/api/v1/meeting-rooms/${roomCode}/meetings`,
  // Endpoint for fetching a single meeting by UUID
  meetingByUuid: (roomCode: string, meetingUuid: string) => 
    `${config.BASE_URL}/api/v1/meeting-rooms/${roomCode}/meetings?meetingUuid=${meetingUuid}`,
  meetingById: (meetingId: string) => `${config.BASE_URL}/meetings/${meetingId}`,
  
  // Room endpoints
  rooms: `${config.BASE_URL}/rooms`,
  roomById: (roomId: string) => `${config.BASE_URL}/rooms/${roomId}`,
  // New endpoint for room details
  roomDetailsByRoomCode: (roomCode: string) => 
    `${config.BASE_URL}/api/v1/meeting-rooms/${roomCode}`,
  // Device token registration endpoint
  registerDeviceToken: () => 
    `${config.BASE_URL}/api/v1/meeting-rooms/device-token`,
  
  // Device endpoints
  device: `${config.BASE_URL}/device`,
  deviceSync: `${config.BASE_URL}/device/sync`,
  
  // Sync endpoints
  sync: `${config.BASE_URL}/sync`,
};
