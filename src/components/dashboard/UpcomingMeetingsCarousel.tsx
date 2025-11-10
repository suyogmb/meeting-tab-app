/**
 * Upcoming Meetings List Component
 * Vertical scrolling list with expandable cards using FlatList
 */

import React, {useState} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import {Meeting} from '../../types/meeting';
import Text from '../Text';
import {useStyles} from './UpcomingMeetingsCarousel.styles';
import {useTranslation} from 'react-i18next';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleCardPress = (meeting: Meeting) => {
    // Configure animation
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });

    // Toggle expanded state
    if (expandedId === meeting.id) {
      setExpandedId(null);
    } else {
      setExpandedId(meeting.id);
    }

    // Call optional onMeetingPress callback
    if (onMeetingPress) {
      onMeetingPress(meeting);
    }
  };

  const renderItem: ListRenderItem<Meeting> = ({item}) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        onPress={() => handleCardPress(item)}
        activeOpacity={0.8}
        style={[
          styles.touchableContainer,
          isExpanded && styles.touchableContainerExpanded,
        ]}>
        <View style={[styles.card, isExpanded && styles.cardExpanded]}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.expandIndicator}>{isExpanded ? '−' : '+'}</Text>
          </View>
          <Text style={styles.time}>
            {formatTime(item.startTime)} - {formatTime(item.endTime)}
          </Text>

          {isExpanded && (
            <View style={styles.expandedContent}>
              {item.description && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {t('meetingDetails.descriptionLabel')}
                  </Text>
                  <Text style={styles.detailValue}>{item.description}</Text>
                </View>
              )}
              {item.organizer && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {t('meetingDetails.organizerLabel')}
                  </Text>
                  <Text style={styles.detailValue}>{item.organizer}</Text>
                </View>
              )}
              {item.attendeeCount !== undefined && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {t('meetingDetails.attendeesLabel')}
                  </Text>
                  <Text style={styles.detailValue}>
                    {t('meetingDetails.attendeeCount', {
                      count: item.attendeeCount,
                    })}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
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

