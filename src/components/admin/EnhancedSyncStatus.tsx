/**
 * Enhanced Sync Status Component
 * Detailed sync status information for Admin Settings
 */

import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
import Text from '../Text';
import {useStyles} from './EnhancedSyncStatus.styles';
import SyncService from '../../services/sync/SyncService';
import RequestQueueService from '../../services/queue/RequestQueueService';
import CacheExpirationService from '../../services/cache/CacheExpirationService';
import BackgroundSyncService from '../../services/sync/BackgroundSyncService';
import {useNetwork} from '../../contexts/NetworkContext';
import {useTranslation} from 'react-i18next';
import ReloadIcon from '../../assets/SVGs/reload.svg';
import {scaleSize} from '../../utils/SizeUtility';

interface EnhancedSyncStatusProps {
  onSyncPress?: () => void;
}

const EnhancedSyncStatus: React.FC<EnhancedSyncStatusProps> = ({onSyncPress}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {isOnline} = useNetwork();
  
  const [lastSyncTime, setLastSyncTime] = useState<number | undefined>();
  const [queueSize, setQueueSize] = useState<number>(0);
  const [cacheStatus, setCacheStatus] = useState<{
    meetingDataValid: boolean;
    roomInfoValid: boolean;
    staleMeetingsCount: number;
  } | null>(null);
  const [backgroundSyncStatus, setBackgroundSyncStatus] = useState<{
    isRunning: boolean;
    lastSyncAttempt: number;
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadSyncStatus();

    // Update sync status every 10 seconds
    const interval = setInterval(() => {
      loadSyncStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadSyncStatus = async () => {
    try {
      // Get sync status
      const syncStatus = await SyncService.getSyncStatus();
      setLastSyncTime(syncStatus.lastSyncTime);

      // Get queue size
      const queueSize = await RequestQueueService.getQueueSize();
      setQueueSize(queueSize);

      // Get cache status
      const cacheStatus = await CacheExpirationService.getCacheStatus();
      setCacheStatus({
        meetingDataValid: cacheStatus.meetingDataValid,
        roomInfoValid: cacheStatus.roomInfoValid,
        staleMeetingsCount: cacheStatus.staleMeetingsCount,
      });

      // Get background sync status
      const bgSyncStatus = BackgroundSyncService.getStatus();
      setBackgroundSyncStatus({
        isRunning: bgSyncStatus.isRunning,
        lastSyncAttempt: bgSyncStatus.lastSyncAttempt,
      });
    } catch (error) {
      console.error('Failed to load sync status', error);
    }
  };


  const formatLastSync = (timestamp?: number): string => {
    if (!timestamp) {
      return t('sync.neverSynced');
    }

    const now = Date.now();
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

    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatLastAttempt = (timestamp?: number): string => {
    if (!timestamp) {
      return t('sync.neverSynced');
    }
    return formatLastSync(timestamp);
  };

  const handleManualSync = async () => {
    if (isSyncing || !isOnline) {
      return;
    }

    try {
      setIsSyncing(true);
      await SyncService.forceSync();
      // Reload status after sync
      setTimeout(() => {
        loadSyncStatus();
      }, 1000);
    } catch (error) {
      console.error('Manual sync failed', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>{t('adminSettings.syncStatus.title')}</Text>
        <TouchableOpacity
          style={[styles.syncButton, (!isOnline || isSyncing) && styles.syncButtonDisabled]}
          onPress={handleManualSync}
          disabled={isSyncing || !isOnline}
          activeOpacity={0.7}>
          {isSyncing ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <ReloadIcon width={scaleSize(28)} height={scaleSize(28)} />
          )}
        </TouchableOpacity>
      </View>

      {/* Network Status */}
      <View style={styles.statusRow}>
        <Text style={styles.label}>{t('adminSettings.syncStatus.network')}</Text>
        <View style={styles.valueRow}>
          <View
            style={[
              styles.statusIndicator,
              {backgroundColor: isOnline ? '#4CAF50' : '#F44336'},
            ]}
          />
          <Text style={styles.value}>
            {isOnline ? t('sync.online') : t('sync.offline')}
          </Text>
        </View>
      </View>

      {/* Last Sync Time */}
      <View style={styles.statusRow}>
        <Text style={styles.label}>{t('sync.lastSync')}</Text>
        <Text style={styles.value}>{formatLastSync(lastSyncTime)}</Text>
      </View>

      {/* Queue Size */}
      <View style={styles.statusRow}>
        <Text style={styles.label}>{t('adminSettings.syncStatus.queueSize')}</Text>
        <Text style={[styles.value, queueSize > 0 && styles.warningValue]}>
          {queueSize}
        </Text>
      </View>

      {/* Cache Status */}
      {cacheStatus && (
        <>
          <View style={styles.statusRow}>
            <Text style={styles.label}>{t('adminSettings.syncStatus.cacheStatus')}</Text>
            <View style={styles.valueRow}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor: cacheStatus.meetingDataValid
                      ? '#4CAF50'
                      : '#FF9800',
                  },
                ]}
              />
              <Text style={styles.value}>
                {cacheStatus.meetingDataValid
                  ? t('adminSettings.syncStatus.valid')
                  : t('adminSettings.syncStatus.stale')}
              </Text>
            </View>
          </View>
          {cacheStatus.staleMeetingsCount > 0 && (
            <View style={styles.statusRow}>
              <Text style={styles.label}>
                {t('adminSettings.syncStatus.staleMeetings')}
              </Text>
              <Text style={[styles.value, styles.warningValue]}>
                {cacheStatus.staleMeetingsCount}
              </Text>
            </View>
          )}
        </>
      )}

      {/* Background Sync Status */}
      {backgroundSyncStatus && (
        <View style={styles.statusRow}>
          <Text style={styles.label}>
            {t('adminSettings.syncStatus.backgroundSync')}
          </Text>
          <View style={styles.valueRow}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: backgroundSyncStatus.isRunning
                    ? '#4CAF50'
                    : '#9E9E9E',
                },
              ]}
            />
            <Text style={styles.value}>
              {backgroundSyncStatus.isRunning
                ? t('adminSettings.syncStatus.running')
                : t('adminSettings.syncStatus.stopped')}
            </Text>
          </View>
        </View>
      )}

    </View>
  );
};

export default EnhancedSyncStatus;

