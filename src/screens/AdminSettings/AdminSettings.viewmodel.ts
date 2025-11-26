/**
 * ViewModel for Admin Settings screen
 * Manages admin settings actions and state
 */

import {useCallback} from 'react';
import {Alert, Platform, BackHandler} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import StorageService from '../../utils/StorageService';
import DatabaseService from '../../database/DatabaseService';
import KioskService from '../../services/kiosk/KioskService';
import {logger} from '../../utils/SecureLogger';
import {RootStackNavigationProp, Routes} from '../../types/navigation';
import MeetingsApiService from '../../services/api/MeetingsApiService';
import RoomApiService from '../../services/api/RoomApiService';
import {upsertMeetings} from '../../database/queries/meetingQueries';

type AdminSettingsViewModelReturn = {
  t: ReturnType<typeof useTranslation>['t'];
  handleResetRoom: () => void;
  handleExitKiosk: () => void;
  handleGoBack: () => void;
  handleRefreshData: () => Promise<void>;
};

const useAdminSettingsViewModel = (): AdminSettingsViewModelReturn => {
  const {t} = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp>();

  /**
   * Handle room configuration reset
   * 
   * Complete reset strategy:
   * 1. Preserves: DeviceID (for device tracking/analytics)
   * 2. Clears: All other MMKV data (room info, admin password, FCM token, sync data, etc.)
   * 3. Clears: All SQLite database data (meetings, rooms, sync logs)
   * 4. Result: Clean slate for new room setup while maintaining device identity
   */
  const handleResetRoom = useCallback(() => {
    Alert.alert(
      t('adminSettings.reset.title'),
      t('adminSettings.reset.description'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.reset'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Save deviceId before clearing (preserve device identification)
              const deviceId = await StorageService.getItem<string>(
                StorageService.storageKeys.deviceId,
                true,
              );
              
              logger.info('Starting complete reset', {
                deviceId: deviceId ? 'preserved' : 'none',
              });

              // Clear ALL MMKV storage (room info, passwords, tokens, sync data, etc.)
              StorageService.clearLocalStorage();
              logger.info('All MMKV storage cleared');

              // Clear database - delete and reinitialize
              try {
                await DatabaseService.deleteDatabase();
                await DatabaseService.initialize();
                logger.info('Database deleted and reinitialized');
              } catch (dbError) {
                logger.warn('Database reset failed, continuing anyway', {error: dbError});
              }

              // Restore deviceId if it existed (preserve device tracking)
              if (deviceId) {
                await StorageService.storeItem(
                  StorageService.storageKeys.deviceId,
                  deviceId,
                  true,
                );
                logger.info('DeviceId restored after reset');
              }

              Toast.show({
                type: 'success',
                text1: t('adminSettings.reset.toastSuccessTitle'),
                text2: t('adminSettings.reset.toastSuccessMessage'),
              });

              logger.info('Room configuration reset completed successfully');

              // Navigate to First Run Setup (full setup required)
              navigation.reset({
                index: 0,
                routes: [{name: Routes.FIRST_RUN_SETUP}],
              });
            } catch (error) {
              logger.error('Failed to reset room configuration', {error});
              Toast.show({
                type: 'error',
                text1: t('common.error'),
                text2: t('adminSettings.reset.toastErrorMessage'),
              });
            }
          },
        },
      ],
    );
  }, [navigation, t]);

  const handleExitKiosk = useCallback(() => {
    Alert.alert(
      t('adminSettings.exitKioskTitle'),
      t('adminSettings.exitKioskMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('adminSettings.exitKioskButton'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Stop kiosk mode
              KioskService.stopKiosk();
              // Disable boot auto-start
              KioskService.enableBootAutoStart(false);
              
              Toast.show({
                type: 'success',
                text1: 'Kiosk Mode Exited',
                text2: 'You can now close the app',
              });
              logger.info('Kiosk mode exited by admin');
              
              // Navigate back to dashboard first
              navigation.goBack();
              
              // On Android, exit the app after a short delay
              if (Platform.OS === 'android') {
                setTimeout(() => {
                  BackHandler.exitApp();
                }, 500);
              }
            } catch (error) {
              logger.error('Failed to exit kiosk mode', {error});
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to exit kiosk mode',
              });
            }
          },
        },
      ],
    );
  }, [navigation, t]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  /**
   * Handle manual refresh - calls APIs and updates local database
   * This compares API response with local data and updates accordingly
   */
  const handleRefreshData = useCallback(async () => {
    try {
      // Get room info
      const roomInfo = await StorageService.getItem<{
        roomId: string;
        roomName: string;
      }>(StorageService.storageKeys.roomInfo, false);

      if (!roomInfo?.roomId) {
        Toast.show({
          type: 'error',
          text1: t('common.error'),
          text2: 'Room not configured',
        });
        return;
      }

      // Show loading toast
      Toast.show({
        type: 'info',
        text1: 'Refreshing data...',
        text2: 'Please wait',
      });

      // Ensure database is initialized
      await DatabaseService.initialize();

      // Fetch room details and meetings from API in parallel
      const [meetingsResult, roomDetailsResult] = await Promise.allSettled([
        MeetingsApiService.fetchMeetingsListByRoomCode(roomInfo.roomId),
        RoomApiService.fetchRoomDetailsByRoomCode(roomInfo.roomId),
      ]);

      // Handle meetings result
      if (meetingsResult.status === 'fulfilled') {
        const apiMeetings = meetingsResult.value;
        
        // Clear existing meetings for this room
        const db = DatabaseService.getDatabase();
        await db.executeSql('DELETE FROM meetings WHERE room_id = ?', [roomInfo.roomId]);
        
        // Upsert meetings to database (this compares and updates)
        await upsertMeetings(apiMeetings);
        
        logger.info('Meetings refreshed successfully', {
          count: apiMeetings.length,
          roomId: roomInfo.roomId,
        });
      } else {
        logger.error('Failed to fetch meetings during refresh', {
          error: meetingsResult.reason,
        });
        throw new Error('Failed to fetch meetings');
      }

      // Handle room details result (optional - don't fail if this fails)
      if (roomDetailsResult.status === 'fulfilled') {
        const roomDetails = roomDetailsResult.value;
        
        // Save room details to storage so dashboard can access it
        await StorageService.storeItem(
          StorageService.storageKeys.roomDetails,
          roomDetails,
          false,
        );
        
        logger.info('Room details refreshed and saved successfully', {
          roomCode: roomDetails.roomCode,
          name: roomDetails.name,
        });
      } else {
        logger.warn('Failed to fetch room details during refresh', {
          error: roomDetailsResult.reason,
        });
      }

      // Update last sync timestamp after successful refresh
      await StorageService.storeItem(
        StorageService.storageKeys.lastSyncTimestamp,
        Date.now(),
        false,
      );

      logger.info('Last sync timestamp updated', {
        timestamp: Date.now(),
      });

      Toast.show({
        type: 'success',
        text1: 'Data refreshed',
        text2: 'Meetings and room details updated',
      });

      logger.info('Manual refresh completed successfully');

      // Navigate directly to dashboard to show updated data
      // Dashboard will automatically refresh when it comes into focus
      navigation.navigate(Routes.DASHBOARD);
    } catch (error) {
      logger.error('Failed to refresh data', {error});
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: error instanceof Error ? error.message : 'Failed to refresh data',
      });
    }
  }, [t]);

  return {
    t,
    handleResetRoom,
    handleExitKiosk,
    handleGoBack,
    handleRefreshData,
  };
};

export default useAdminSettingsViewModel;

