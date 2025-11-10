import Config from 'react-native-config';
import {ConfigType} from 'types/types';

const config: ConfigType = Config as ConfigType;

/**
 * API Endpoints for Kiosk App
 * Update these endpoints based on your backend API structure
 */
export const Endpoints = {
  // Meeting endpoints
  meetings: `${config.BASE_URL}/meetings`,
  meetingsByRoom: (roomId: string) => `${config.BASE_URL}/meetings/room/${roomId}`,
  meetingById: (meetingId: string) => `${config.BASE_URL}/meetings/${meetingId}`,
  
  // Room endpoints
  rooms: `${config.BASE_URL}/rooms`,
  roomById: (roomId: string) => `${config.BASE_URL}/rooms/${roomId}`,
  
  // Device endpoints
  device: `${config.BASE_URL}/device`,
  deviceSync: `${config.BASE_URL}/device/sync`,
  
  // Sync endpoints
  sync: `${config.BASE_URL}/sync`,
};
