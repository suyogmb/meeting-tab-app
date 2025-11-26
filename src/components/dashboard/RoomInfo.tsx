/**
 * Room Info Component
 * Displays room name, room number, and capacity with icons
 */

import React from 'react';
import {View} from 'react-native';
import Text from '../Text';
import {useStyles} from './RoomInfo.styles';
import {useTranslation} from 'react-i18next';
import RoomNumberIcon from '../../assets/SVGs/room-number.svg';
import RoomCapacityIcon from '../../assets/SVGs/room-capacity.svg';
import {scaleSize} from '../../utils/SizeUtility';
import {RoomDetails} from '../../types/meeting';

interface RoomInfoProps {
  roomDetails: RoomDetails | null;
}

const RoomInfo: React.FC<RoomInfoProps> = ({roomDetails}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  // Don't show loading - dashboard already handles loading state
  // Show room info if available, otherwise show nothing or default values
  if (!roomDetails) {
    return null; // Return null instead of showing loading
  }

  return (
    <View style={styles.container}>
      {/* Room Name */}
      <Text style={styles.roomName}>
        {roomDetails.name || t('roomInfo.defaultName')}
      </Text>
      
      {/* Room Number with Icon */}
      <View style={styles.roomNumberContainer}>
        <RoomNumberIcon width={scaleSize(20)} height={scaleSize(20)} />
        <Text style={styles.roomNumber}>{roomDetails.roomCode}</Text>
      </View>
      
      {/* Capacity with Icon */}
      <View style={styles.capacityContainer}>
        <RoomCapacityIcon width={scaleSize(20)} height={scaleSize(20)} />
        <Text style={styles.capacity}>
          {roomDetails.capacity} {t('roomInfo.people')}
        </Text>
      </View>

      {/* Description (if available) */}
      {roomDetails.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{roomDetails.description}</Text>
        </View>
      )}
    </View>
  );
};

export default RoomInfo;

