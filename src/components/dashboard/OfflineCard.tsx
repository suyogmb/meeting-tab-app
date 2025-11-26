/**
 * Offline Card Component
 * Displays offline status information on the dashboard
 */

import React from 'react';
import {View} from 'react-native';
import Text from '../Text';
import {useStyles} from './OfflineCard.styles';
import {useNetwork} from '../../contexts/NetworkContext';
import {useTranslation} from 'react-i18next';

const OfflineCard: React.FC = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {isOnline} = useNetwork();

  // Only show when offline
  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.container}>
  
      <Text style={styles.title}>{t('dashboard.offline.title')}</Text>
      <Text style={styles.description}>
        {t('dashboard.offline.description')}
      </Text>
      <Text style={styles.hint}>
        {t('dashboard.offline.hint')}
      </Text>
    </View>
  );
};

export default OfflineCard;

