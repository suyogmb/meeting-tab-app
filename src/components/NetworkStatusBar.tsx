/**
 * Network Status Bar Component
 * Displays network connectivity status at the top of the screen
 */

import React, {useEffect, useRef} from 'react';
import {View, Animated, Platform} from 'react-native';
import {useNetwork} from '../contexts/NetworkContext';
import Text from './Text';
import {useStyles} from './NetworkStatusBar.styles';

const NetworkStatusBar: React.FC = () => {
  const styles = useStyles();
  const {isOnline, isConnected, connectionType} = useNetwork();
  const slideAnim = useRef(new Animated.Value(-100)).current; // Start off-screen
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isOnline) {
      // Show bar when offline
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide bar when online
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOnline, slideAnim, opacityAnim]);

  // Don't render if online
  if (isOnline) {
    return null;
  }

  // Determine status message
  let statusMessage = 'No Internet Connection';
  if (isConnected === false) {
    statusMessage = 'No Network Connection';
  } else if (isConnected === true && isOnline === false) {
    statusMessage = 'No Internet Access';
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{translateY: slideAnim}],
          opacity: opacityAnim,
        },
      ]}>
      <View style={styles.content}>
        <View style={styles.indicator} />
        <Text style={styles.text}>{statusMessage}</Text>
        {connectionType !== 'none' && connectionType !== 'unknown' && (
          <Text style={styles.connectionType}>
            ({connectionType.toUpperCase()})
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

export default NetworkStatusBar;

