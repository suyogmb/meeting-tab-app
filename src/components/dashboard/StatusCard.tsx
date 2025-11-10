/**
 * Status Card Component
 * Large card showing current availability or meeting status
 */

import React from 'react';
import {View} from 'react-native';
import Text from '../Text';
import {Meeting} from '../../types/meeting';
import {useStyles} from './StatusCard.styles';
import {useTranslation} from 'react-i18next';

interface StatusCardProps {
  currentMeeting?: Meeting | null;
  nextMeeting?: Meeting | null;
}

const StatusCard: React.FC<StatusCardProps> = ({
  currentMeeting,
  nextMeeting,
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getCurrentStatus = () => {
    const now = new Date();
    
    if (currentMeeting) {
      return {
        status: currentMeeting.title,
        timeRange: `${formatTime(new Date(currentMeeting.startTime))} - ${formatTime(new Date(currentMeeting.endTime))}`,
        isAvailable: false,
      };
    }

    // Calculate next available slot
    if (nextMeeting) {
      const nextStart = new Date(nextMeeting.startTime);
      return {
        status: t('status.available'),
        timeRange: `${formatTime(now)} - ${formatTime(nextStart)}`,
        isAvailable: true,
      };
    }

    // No meetings, fully available
    return {
      status: t('status.available'),
      timeRange: t('status.allDay'),
      isAvailable: true,
    };
  };

  const status = getCurrentStatus();

  return (
    <View style={[styles.card, status.isAvailable ? styles.cardAvailable : styles.cardBusy]}>
      <Text 
        style={[styles.statusText, status.isAvailable && styles.statusTextCentered]}
        includeFontPadding={false}>
        {status.status}
      </Text>
      <Text style={[styles.timeRangeText, status.isAvailable && styles.timeRangeTextCentered]}>
        {status.timeRange}
      </Text>
    </View>
  );
};

export default StatusCard;

