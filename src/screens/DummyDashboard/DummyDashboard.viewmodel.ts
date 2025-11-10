/**
 * ViewModel for Dummy Dashboard screen.
 * Provides static data and handlers for preview purposes.
 */

import {useCallback, useMemo} from 'react';
import {Meeting} from '../../types/meeting';

type DummyDashboardViewModelReturn = {
  currentMeeting: Meeting;
  upcomingMeetings: Meeting[];
  showAvailableStatus: boolean;
  handleSettingsPress: () => void;
};

const useDummyDashboardViewModel = (): DummyDashboardViewModelReturn => {
  const showAvailableStatus = true;

  const currentMeeting = useMemo<Meeting>(
    () => ({
      id: 'meeting-ongoing',
      roomId: 'ROOM-001',
      title: 'Team Standup',
      description: 'Daily team synchronization meeting',
      organizer: 'John Doe',
      startTime: Date.now() - 30 * 60 * 1000,
      endTime: Date.now() + 30 * 60 * 1000,
      attendeeCount: 5,
      isAllDay: false,
      status: 'in-progress',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
      syncedAt: Date.now() - 3600000,
    }),
    [],
  );

  const upcomingMeetings = useMemo<Meeting[]>(
    () => [
      {
        id: 'meeting-1',
        roomId: 'ROOM-001',
        title: 'Client Presentation',
        description: 'Quarterly business review presentation',
        organizer: 'Jane Smith',
        startTime: Date.now() + 60 * 60 * 1000,
        endTime: Date.now() + 2 * 60 * 60 * 1000,
        attendeeCount: 8,
        isAllDay: false,
        status: 'scheduled',
        createdAt: Date.now() - 172800000,
        updatedAt: Date.now() - 172800000,
        syncedAt: Date.now() - 3600000,
      },
      {
        id: 'meeting-2',
        roomId: 'ROOM-001',
        title: 'Lunch Break',
        description: 'Team lunch',
        organizer: 'Team Lead',
        startTime: Date.now() + 3 * 60 * 60 * 1000,
        endTime: Date.now() + 4 * 60 * 60 * 1000,
        attendeeCount: 12,
        isAllDay: false,
        status: 'scheduled',
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000,
        syncedAt: Date.now() - 3600000,
      },
      {
        id: 'meeting-3',
        roomId: 'ROOM-001',
        title: 'Product Planning',
        description: 'Q2 product roadmap planning session',
        organizer: 'Sarah Johnson',
        startTime: Date.now() + 4 * 60 * 60 * 1000,
        endTime: Date.now() + 5 * 60 * 60 * 1000,
        attendeeCount: 6,
        isAllDay: false,
        status: 'scheduled',
        createdAt: Date.now() - 259200000,
        updatedAt: Date.now() - 259200000,
        syncedAt: Date.now() - 3600000,
      },
      {
        id: 'meeting-4',
        roomId: 'ROOM-001',
        title: 'Code Review',
        description: 'Sprint review and code review session',
        organizer: 'Mike Wilson',
        startTime: Date.now() + 5 * 60 * 60 * 1000,
        endTime: Date.now() + 6 * 60 * 60 * 1000,
        attendeeCount: 4,
        isAllDay: false,
        status: 'scheduled',
        createdAt: Date.now() - 172800000,
        updatedAt: Date.now() - 172800000,
        syncedAt: Date.now() - 3600000,
      },
      {
        id: 'meeting-5',
        roomId: 'ROOM-001',
        title: 'Design Review',
        description: 'UI/UX design review and feedback session',
        organizer: 'Emily Davis',
        startTime: Date.now() + 6 * 60 * 60 * 1000,
        endTime: Date.now() + 7 * 60 * 60 * 1000,
        attendeeCount: 7,
        isAllDay: false,
        status: 'scheduled',
        createdAt: Date.now() - 259200000,
        updatedAt: Date.now() - 259200000,
        syncedAt: Date.now() - 3600000,
      },
      {
        id: 'meeting-6',
        roomId: 'ROOM-001',
        title: 'Strategy Session',
        description: 'Quarterly business strategy planning',
        organizer: 'Robert Brown',
        startTime: Date.now() + 7 * 60 * 60 * 1000,
        endTime: Date.now() + 8 * 60 * 60 * 1000,
        attendeeCount: 10,
        isAllDay: false,
        status: 'scheduled',
        createdAt: Date.now() - 345600000,
        updatedAt: Date.now() - 345600000,
        syncedAt: Date.now() - 3600000,
      },
      {
        id: 'meeting-7',
        roomId: 'ROOM-001',
        title: 'Team Building',
        description: 'Team building activities and games',
        organizer: 'Lisa Anderson',
        startTime: Date.now() + 8 * 60 * 60 * 1000,
        endTime: Date.now() + 9 * 60 * 60 * 1000,
        attendeeCount: 15,
        isAllDay: false,
        status: 'scheduled',
        createdAt: Date.now() - 432000000,
        updatedAt: Date.now() - 432000000,
        syncedAt: Date.now() - 3600000,
      },
      {
        id: 'meeting-8',
        roomId: 'ROOM-001',
        title: 'Training Workshop',
        description: 'Technical skills training workshop',
        organizer: 'David Martinez',
        startTime: Date.now() + 9 * 60 * 60 * 1000,
        endTime: Date.now() + 10 * 60 * 60 * 1000,
        attendeeCount: 12,
        isAllDay: false,
        status: 'scheduled',
        createdAt: Date.now() - 518400000,
        updatedAt: Date.now() - 518400000,
        syncedAt: Date.now() - 3600000,
      },
    ],
    [],
  );

  const handleSettingsPress = useCallback(() => {
    console.log('Settings pressed');
  }, []);

  return {
    currentMeeting,
    upcomingMeetings,
    showAvailableStatus,
    handleSettingsPress,
  };
};

export default useDummyDashboardViewModel;

