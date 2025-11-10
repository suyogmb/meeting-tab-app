/**
 * Sync Button Component
 * Button for manual data synchronization
 */

import React, {useState} from 'react';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import Text from '../Text';
import {useStyles} from './SyncButton.styles';
import ReusableButton from '../ReusableButton';

interface SyncButtonProps {
  onSync: () => Promise<void>;
  lastSyncTime?: number;
}

const SyncButton: React.FC<SyncButtonProps> = ({onSync, lastSyncTime}) => {
  const styles = useStyles();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await onSync();
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSync = (timestamp?: number): string => {
    if (!timestamp) return 'Never synced';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleSync}
      disabled={isSyncing}
      activeOpacity={0.7}>
      <ReusableButton
        title={isSyncing ? 'Syncing...' : 'Sync Now'}
        onPress={handleSync}
        disabled={isSyncing}
        style={styles.button}
      />
      {lastSyncTime && (
        <Text style={styles.lastSyncText}>
          Last sync: {formatLastSync(lastSyncTime)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default SyncButton;

