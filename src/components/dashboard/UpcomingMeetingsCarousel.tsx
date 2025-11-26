/**
 * Upcoming Meetings List Component
 * Vertical scrolling list with meeting cards
 */

import React from 'react';
import {
  View,
  FlatList,
  ListRenderItem,
} from 'react-native';
import {Meeting} from '../../types/meeting';
import Text from '../Text';
import ErrorDisplay from '../ErrorDisplay';
import {useStyles} from './UpcomingMeetingsCarousel.styles';
import {useTranslation} from 'react-i18next';
import {scaleSize} from '../../utils/SizeUtility';
import RoomNumberIcon from '../../assets/SVGs/room-number.svg';
import RoomCapacityIcon from '../../assets/SVGs/room-capacity.svg';
// Import SVG icons - will use fallback if they don't exist
let OrganizerIcon: React.ComponentType<any> | null = null;
let AttendeesIcon: React.ComponentType<any> | null = null;

// Try to import organizer icon
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  OrganizerIcon = require('../../assets/SVGs/organizer.svg').default;
} catch (e) {
  // Icon doesn't exist, will skip icon
}

// Try to import attendees icon
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  AttendeesIcon = require('../../assets/SVGs/attendees.svg').default;
} catch (e) {
  // If attendees icon doesn't exist, use room-capacity icon as fallback
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    AttendeesIcon = require('../../assets/SVGs/room-capacity.svg').default;
  } catch (e2) {
    // No icon available
  }
}

interface UpcomingMeetingsCarouselProps {
  meetings: Meeting[];
  onMeetingPress?: (meeting: Meeting) => void;
}

const UpcomingMeetingsCarousel: React.FC<UpcomingMeetingsCarouselProps> = ({
  meetings,
  onMeetingPress,
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderItem: ListRenderItem<Meeting> = ({item}) => {
    return (
      <View style={styles.card}>
    
        <View style={styles.row1}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{formatTime(item.startTime)} - {formatTime(item.endTime)}</Text>
        </View>
      </View>
    );
  };

  if (meetings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('dashboard.noUpcomingMeetings')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={meetings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

export default UpcomingMeetingsCarousel;

