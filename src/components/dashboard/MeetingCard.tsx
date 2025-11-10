/**
 * Meeting Card Component
 * Wallet-style card for displaying current or next meeting
 */

import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Text from '../Text';
import {Meeting, MeetingDisplayState} from '../../types/meeting';
import {useStyles} from './MeetingCard.styles';
import {useTranslation} from 'react-i18next';

interface MeetingCardProps {
  meeting: Meeting;
  displayState: MeetingDisplayState;
  onPress?: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  displayState,
  onPress,
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

  const getCardStyle = () => {
    switch (displayState) {
      case 'current':
        return [styles.card, styles.cardCurrent];
      case 'next':
        return [styles.card, styles.cardNext];
      default:
        return styles.card;
    }
  };

  const getTitleStyle = () => {
    switch (displayState) {
      case 'current':
        return [styles.title, styles.titleCurrent];
      case 'next':
        return [styles.titleNext]; // Use smaller title style for upcoming meetings
      default:
        return [styles.title];
    }
  };

  const CardContent = (
      <View style={getCardStyle()}>
        <View style={styles.cardHeader}>
          <Text style={styles.label}>
            {displayState === 'current'
              ? t('meetingCard.currentLabel')
              : t('meetingCard.nextLabel')}
          </Text>
          <Text style={[
            displayState === 'current' ? styles.timeRangeCurrent : 
            displayState === 'next' ? styles.timeRangeNext : 
            styles.timeRange
          ]}>
            {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
          </Text>
      </View>

      <Text style={getTitleStyle()}>
        {meeting.title}
      </Text>

      {meeting.organizer && (
        <Text style={displayState === 'next' ? styles.organizerNext : styles.organizer}>
          {meeting.organizer}
        </Text>
      )}

      {meeting.description && displayState !== 'next' && (
        <Text style={styles.description}>
          {meeting.description}
        </Text>
      )}

      {meeting.attendeeCount !== undefined && (
        <Text style={displayState === 'next' ? styles.attendeesNext : styles.attendees}>
          {t('meetingCard.attendees', {count: meeting.attendeeCount})}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};


export default MeetingCard;

