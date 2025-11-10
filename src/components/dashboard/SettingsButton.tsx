/**
 * Settings Button Component
 * Button to open admin settings (password-protected)
 */

import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useStyles} from './SettingsButton.styles';
import SettingsIcon from '../../assets/SVGs/settings.svg';
import {scaleSize} from '../../utils/SizeUtility';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingsButtonProps {
  onPress: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({onPress}) => {
  const styles = useStyles();
  const {themeColors} = useTheme();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}>
      <SettingsIcon width={scaleSize(40)} height={scaleSize(40)}/>
    </TouchableOpacity>
  );
};

export default SettingsButton;

