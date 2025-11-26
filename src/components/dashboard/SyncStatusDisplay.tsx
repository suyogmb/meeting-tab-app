/**
 * Sync Status Display Component
 * Shows last sync timestamp and sync status
 */

import React, {useState, useEffect, useCallback} from 'react';
import {View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Text from '../Text';
import {useStyles} from './SyncStatusDisplay.styles';
import SyncService from '../../services/sync/SyncService';
import {useTranslation} from 'react-i18next';

interface SyncStatusDisplayProps {
  showLabel?: boolean;
  compact?: boolean;
}

const SyncStatusDisplay: React.FC<SyncStatusDisplayProps> = ({
  showLabel = true,
  compact = false,
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [lastSyncTime, setLastSyncTime] = useState<number | undefined>();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [cacheValid, setCacheValid] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState(Date.now()); // Force re-render for time updates

  useEffect(() => {
    // Load initial sync status
    loadSyncStatus();

    // Update sync status every 30 seconds
    const statusInterval = setInterval(() => {
      loadSyncStatus();
    }, 30000);

    // Update current time every 15 seconds to refresh "time ago" display
    // This ensures the elapsed time updates accurately
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 15000); // Update every 15 seconds for accurate time display

    return () => {
      clearInterval(statusInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const loadSyncStatus = useCallback(async () => {
    try {
      const status = await SyncService.getSyncStatus();
      setLastSyncTime(status.lastSyncTime);
      setIsOnline(status.isOnline);
      setCacheValid(status.cacheValid);
      // Update currentTime to trigger immediate re-render with new timestamp
      setCurrentTime(Date.now());
    } catch (error) {
      console.error('Failed to load sync status', error);
    }
  }, []);

  // Refresh sync status immediately when screen comes into focus
  // This ensures "Last Synced" updates right away after refresh
  useFocusEffect(
    useCallback(() => {
      loadSyncStatus();
    }, [loadSyncStatus]),
  );

  const formatLastSync = (timestamp?: number): string => {
    if (!timestamp) {
      return t('sync.neverSynced');
    }

    // Use currentTime state to ensure display updates even when timestamp doesn't change
    const now = currentTime;
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return t('sync.justNow');
    }
    if (minutes < 60) {
      return t('sync.minutesAgo', {count: minutes});
    }
    if (hours < 24) {
      return t('sync.hoursAgo', {count: hours});
    }
    if (days < 7) {
      return t('sync.daysAgo', {count: days});
    }

    // For older syncs, show formatted date
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const getStatusColor = (): string => {
    if (!isOnline) {
      return '#F44336'; // Red for offline
    }
    if (!cacheValid) {
      return '#FF9800'; // Orange for stale
    }
    return '#4CAF50'; // Green for online
  };

  const getStatusText = (): string => {
    if (!isOnline) {
      return t('sync.offline');
    }
    if (!cacheValid) {
      return t('sync.stale');
    }
    return t('sync.online');
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.statusIndicator, {backgroundColor: getStatusColor()}]} />
        <Text style={styles.compactText}>
          {showLabel ? `${t('sync.lastSync')}: ` : ''}
          {formatLastSync(lastSyncTime)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={styles.label}>{t('sync.lastSync')}</Text>
      )}
      <View style={styles.statusRow}>
        <View style={[styles.statusIndicator, {backgroundColor: getStatusColor()}]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
      <Text style={styles.timestamp}>{formatLastSync(lastSyncTime)}</Text>
    </View>
  );
};

export default SyncStatusDisplay;

