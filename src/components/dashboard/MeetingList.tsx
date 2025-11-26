/**
 * Meeting List Component
 * Displays list of today's meetings
 */

import React from 'react';
import {View, FlatList} from 'react-native';
import Text from '../Text';
import {Meeting} from '../../types/meeting';
import {useStyles} from './MeetingList.styles';

interface MeetingListProps {
  meetings: Meeting[];
  onMeetingPress?: (meeting: Meeting) => void;
}

const MeetingList: React.FC<MeetingListProps> = ({
  meetings,
  onMeetingPress,
}) => {
  const styles = useStyles();

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatTimeRange = (start: number, end: number): string => {
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const renderMeetingItem = ({item}: {item: Meeting}) => {
    const now = Date.now();
    const isPast = item.endTime <= now; // Changed to <= to match query logic
    const isCurrent = item.startTime <= now && item.endTime > now; // Changed >= to > to match query logic
    
    // Console log for debugging meeting list rendering
    if (isCurrent) {
      console.log('========================================');
      console.log('🎯 MEETING LIST - CURRENT MEETING DETECTED');
      console.log('========================================');
      console.log('Meeting ID:', item.id);
      console.log('Title:', item.title);
      console.log('Start time (timestamp):', item.startTime);
      console.log('Start time (ISO):', new Date(item.startTime).toISOString());
      console.log('Start time (local):', new Date(item.startTime).toLocaleString());
      console.log('End time (timestamp):', item.endTime);
      console.log('End time (ISO):', new Date(item.endTime).toISOString());
      console.log('End time (local):', new Date(item.endTime).toLocaleString());
      console.log('Current time (timestamp):', now);
      console.log('Current time (ISO):', new Date(now).toISOString());
      console.log('Current time (local):', new Date(now).toLocaleString());
      console.log('Is startTime <= now?', item.startTime <= now);
      console.log('Is endTime >= now?', item.endTime >= now);
      console.log('Time until start (ms):', item.startTime - now);
      console.log('Time until end (ms):', item.endTime - now);
      console.log('========================================');
    }

    return (
      <View
        style={[
          styles.meetingItem,
          isCurrent && styles.meetingItemCurrent,
          isPast && styles.meetingItemPast,
        ]}>
        <View style={styles.meetingItemHeader}>
          <Text style={styles.meetingTime}>
            {formatTimeRange(item.startTime, item.endTime)}
          </Text>
          {item.attendeeCount !== undefined && (
            <Text style={styles.attendeeCount}>
              {item.attendeeCount} {item.attendeeCount === 1 ? 'person' : 'people'}
            </Text>
          )}
        </View>
        <Text
          style={
            isCurrent
              ? styles.meetingTitleCurrent
              : isPast
              ? styles.meetingTitlePast
              : styles.meetingTitle
          }>
          {item.title}
        </Text>
        {item.organizer && (
          <Text
            style={isPast ? styles.meetingOrganizerPast : styles.meetingOrganizer}>
            {item.organizer}
          </Text>
        )}
      </View>
    );
  };

  if (meetings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No meetings scheduled for today</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={meetings}
        renderItem={renderMeetingItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MeetingList;

