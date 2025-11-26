/**
 * ViewModel for Dashboard screen
 * Encapsulates data fetching, state management, and side-effects.
 */

import {useCallback, useEffect, useMemo} from 'react';
import {BackHandler, Platform} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import DatabaseService from '../../database/DatabaseService';
import {useMeetings} from '../../hooks/useMeetings';
import {RootStackNavigationProp, Routes} from '../../types/navigation';
import {Meeting} from '../../types/meeting';

type DashboardViewModelReturn = {
  isLoading: boolean;
  error: string | null;
  currentMeeting: ReturnType<typeof useMeetings>['currentMeeting'];
  nextMeeting: Meeting | null;
  upcomingMeetings: ReturnType<typeof useMeetings>['todayMeetings'];
  roomDetails: ReturnType<typeof useMeetings>['roomDetails'];
  openAdminAccess: () => void;
  refreshMeetings: () => Promise<void>;
};

const useDashboardViewModel = (): DashboardViewModelReturn => {
  const {
    currentMeeting,
    todayMeetings,
    roomDetails,
    isLoading,
    error,
    refreshMeetings,
    refreshFromDatabase,
  } = useMeetings();
  const navigation = useNavigation<RootStackNavigationProp>();

  useEffect(() => {
    DatabaseService.initialize().catch((err) => {
      console.error('Database initialization failed', err);
    });

    // Note: Kiosk mode is initialized in App.tsx globally
    // No need to initialize here to avoid duplicate initialization

    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.navigate(Routes.ADMIN_ACCESS);
          return true;
        },
      );

      return () => {
        backHandler.remove();
      };
    }
  }, [navigation]);

  // Refresh data when dashboard comes into focus (e.g., after returning from Admin Settings)
  useFocusEffect(
    useCallback(() => {
      // Refresh from database only (no API calls) when screen comes into focus
      // This ensures dashboard shows latest data after refresh in Admin Settings
      // without making unnecessary API calls
      refreshFromDatabase().catch((error) => {
        console.error('Failed to refresh from database on focus', error);
      });
    }, [refreshFromDatabase]),
  );

  const upcomingMeetings = useMemo(() => {
    // Show ALL meetings in upcoming list
    // Exclude only the current meeting (if it exists) from upcoming list
    // The current meeting will be shown in the ongoing section
    
    const filtered = todayMeetings.filter((meeting) => {
      // If there's a current meeting, exclude it from upcoming list
      if (currentMeeting && meeting.id === currentMeeting.id) {
        return false; // Don't show current meeting in upcoming
      }
      // Show all other meetings (future, past, etc.) in upcoming list
      return true;
    });
    
    return filtered;
  }, [todayMeetings, currentMeeting]);

  // Calculate nextMeeting from upcomingMeetings (first future meeting)
  const nextMeeting = useMemo(() => {
    const now = Date.now();
    // Find the first meeting that starts in the future
    const futureMeetings = upcomingMeetings.filter(
      (meeting) => meeting.startTime > now && meeting.status !== 'cancelled'
    );
    // Sort by start time and get the first one
    return futureMeetings.sort((a, b) => a.startTime - b.startTime)[0] || null;
  }, [upcomingMeetings]);

  const openAdminAccess = useCallback(() => {
    navigation.navigate(Routes.ADMIN_ACCESS);
  }, [navigation]);

  return {
    isLoading,
    error,
    currentMeeting,
    nextMeeting,
    upcomingMeetings,
    roomDetails,
    openAdminAccess,
    refreshMeetings,
  };
};

export default useDashboardViewModel;

