/**
 * Room Info Component
 * Displays room name and additional information
 */

import React from 'react';
import {View} from 'react-native';
import Text from '../Text';
import {useStyles} from './RoomInfo.styles';
import {useDeviceInfo} from '../../hooks/useDeviceInfo';
import {useTranslation} from 'react-i18next';

const RoomInfo: React.FC = () => {
  const styles = useStyles();
  const {roomConfig, isLoading} = useDeviceInfo();
  const {t} = useTranslation();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>{t('loading.title')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.roomName}>
        {roomConfig?.roomName || t('roomInfo.defaultName')}
      </Text>
      {roomConfig?.roomId && (
        <Text 
          style={styles.roomId}
          includeFontPadding={false}>
          {roomConfig.roomId}
        </Text>
      )}
    </View>
  );
};

export default RoomInfo;

