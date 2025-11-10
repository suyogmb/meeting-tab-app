/**
 * Custom hook for device information
 */

import {useState, useEffect} from 'react';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import StorageService from '../utils/StorageService';
import {RoomConfig} from '../types/room';
import i18n from '../language/i18n';

interface DeviceInfoData {
  deviceId: string;
  deviceName: string;
  roomConfig: RoomConfig | null;
  isLoading: boolean;
}

/**
 * Hook to get device information and room configuration
 */
export function useDeviceInfo(): DeviceInfoData {
  const [deviceId, setDeviceId] = useState<string>('');
  const [deviceName, setDeviceName] = useState<string>('');
  const [roomConfig, setRoomConfig] = useState<RoomConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDeviceInfo() {
      try {
        // Get or generate device ID
        let storedDeviceId = await StorageService.getItem<string>(
          StorageService.storageKeys.deviceId,
          true,
        );

        if (!storedDeviceId) {
          // Generate a device ID
          storedDeviceId =
            Platform.OS === 'android'
              ? await DeviceInfo.getAndroidId()
              : await DeviceInfo.getUniqueId();
          await StorageService.storeItem(
            StorageService.storageKeys.deviceId,
            storedDeviceId,
            true,
          );
        }

        setDeviceId(storedDeviceId);

        // Get device name
        const name = await DeviceInfo.getDeviceName();
        setDeviceName(name);

        // Get room configuration
        const roomInfo = await StorageService.getItem<{
          roomId: string;
          roomName: string;
        }>(StorageService.storageKeys.roomInfo, false);

        if (roomInfo) {
          setRoomConfig({
            roomId: roomInfo.roomId,
            roomName: roomInfo.roomName || i18n.t('roomInfo.unknownRoom'),
            deviceId: storedDeviceId,
            lastConfigured: Date.now(),
          });
        }
      } catch (error) {
        console.error('Failed to load device info', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDeviceInfo();
  }, []);

  return {
    deviceId,
    deviceName,
    roomConfig,
    isLoading,
  };
}

