/**
 * Time Display Component
 * Displays current time and date in large, readable format
 */

import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import Text from '../Text';
import {useStyles} from './TimeDisplay.styles';

const TimeDisplay: React.FC = () => {
  const styles = useStyles();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(currentTime)}</Text>
      <Text style={styles.date}>{formatDate(currentTime)}</Text>
    </View>
  );
};

export default TimeDisplay;

