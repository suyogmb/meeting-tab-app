/**
 * ViewModel for Dashboard screen
 * Encapsulates data fetching, state management, and side-effects.
 */

import {useCallback, useEffect, useMemo, useState} from 'react';
import {BackHandler, Platform} from 'react-native';
import DatabaseService from '../../database/DatabaseService';
import KioskService from '../../services/kiosk/KioskService';
import {useMeetings} from '../../hooks/useMeetings';

type DashboardViewModelReturn = {
  isLoading: boolean;
  error: string | null;
  currentMeeting: ReturnType<typeof useMeetings>['currentMeeting'];
  nextMeeting: ReturnType<typeof useMeetings>['nextMeeting'];
  upcomingMeetings: ReturnType<typeof useMeetings>['todayMeetings'];
  showAdminAccess: boolean;
  showAdminSettings: boolean;
  openAdminAccess: () => void;
  closeAdminAccess: () => void;
  closeAdminSettings: () => void;
  handleAdminAuthenticated: () => void;
};

const useDashboardViewModel = (): DashboardViewModelReturn => {
  const {
    currentMeeting,
    nextMeeting,
    todayMeetings,
    isLoading,
    error,
  } = useMeetings();

  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [showAdminSettings, setShowAdminSettings] = useState(false);

  useEffect(() => {
    DatabaseService.initialize().catch((err) => {
      console.error('Database initialization failed', err);
    });

    KioskService.startLockTask().catch((err) => {
      console.warn('Failed to start kiosk mode', err);
    });

    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          setShowAdminAccess(true);
          return true;
        },
      );

      return () => {
        backHandler.remove();
      };
    }
  }, []);

  const upcomingMeetings = useMemo(() => {
    const now = Date.now();
    return todayMeetings.filter((meeting) => {
      const isFuture = meeting.startTime > now;
      const isNotCurrent =
        !currentMeeting || meeting.id !== currentMeeting.id;
      return isFuture && isNotCurrent;
    });
  }, [todayMeetings, currentMeeting]);

  const openAdminAccess = useCallback(() => {
    setShowAdminAccess(true);
  }, []);

  const closeAdminAccess = useCallback(() => {
    setShowAdminAccess(false);
  }, []);

  const closeAdminSettings = useCallback(() => {
    setShowAdminSettings(false);
  }, []);

  const handleAdminAuthenticated = useCallback(() => {
    setShowAdminAccess(false);
    setShowAdminSettings(true);
  }, []);

  return {
    isLoading,
    error,
    currentMeeting,
    nextMeeting,
    upcomingMeetings,
    showAdminAccess,
    showAdminSettings,
    openAdminAccess,
    closeAdminAccess,
    closeAdminSettings,
    handleAdminAuthenticated,
  };
};

export default useDashboardViewModel;

