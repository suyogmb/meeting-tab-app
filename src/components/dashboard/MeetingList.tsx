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
    const isPast = item.endTime < Date.now();
    const isCurrent = item.startTime <= Date.now() && item.endTime >= Date.now();

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

