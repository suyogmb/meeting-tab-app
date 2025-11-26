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

  const formatTime = (date: Date): {time: string; period: string} => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    const hours12 = hours % 12 || 12;
    
    // Format time as "HH:MM"
    const time = `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    return {
      time, // e.g., "5:29"
      period, // e.g., "PM"
    };
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const {time, period} = formatTime(currentTime);

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.timePeriod}>{period}</Text>
      </View>
      <Text style={styles.date}>{formatDate(currentTime)}</Text>
    </View>
  );
};

export default TimeDisplay;

