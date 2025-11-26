/**
 * Styles for Room Info component
 */

import {StyleSheet} from 'react-native';
import {scaleSize} from '../../utils/SizeUtility';
import {fontFamily} from '../../utils/FontUtils';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      width: '100%',
      paddingLeft: scaleSize(20),
      paddingRight: scaleSize(16),
      paddingTop: scaleSize(4),
      paddingBottom: scaleSize(12),
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    roomName: {
      fontSize: scaleSize(30),
      fontFamily: fontFamily.semiBold,
      color: '#FFFFFF', // White text as per image
      marginBottom: scaleSize(12),
    },
    roomNumberContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaleSize(12),
      gap: scaleSize(8),
    },
    roomNumber: {
      fontSize: scaleSize(18),
      fontFamily: fontFamily.regular,
      color: '#FFFFFF', // White text as per image
    },
    capacityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scaleSize(8),
    },
    capacity: {
      fontSize: scaleSize(18),
      fontFamily: fontFamily.regular,
      color: '#FFFFFF', // White text as per image
    },
    descriptionContainer: {
      marginTop: scaleSize(8),
      paddingTop: scaleSize(8),
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    description: {
      fontSize: scaleSize(14),
      fontFamily: fontFamily.regular,
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: scaleSize(20),
    },
    loading: {
      fontSize: scaleSize(18),
      color: '#FFFFFF',
      fontFamily: fontFamily.regular,
    },
  });
};

