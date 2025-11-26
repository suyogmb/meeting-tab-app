import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {M_16, M_20, M_8, V_10} from 'utils/SizeUtility';
import {useTranslation} from 'react-i18next';
import {fontFamily} from '../utils/FontUtils';

type ReusableButtonProps = {
  title?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

const ReusableButton = ({
  title,
  onPress = () => {},
  style,
  textStyle,
  disabled = false,
}: ReusableButtonProps) => {
  const {t} = useTranslation();
  const resolvedTitle = title ?? t('common.defaultButtonTitle');
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        disabled && styles.disabledButton, // Apply disabled styles
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled} // Disable the button if `disabled` is true
    >
      <Text style={[styles.buttonText, textStyle]}>{resolvedTitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: V_10,
    paddingHorizontal: M_20,
    borderRadius: M_8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: M_16,
    fontFamily: fontFamily.bold,
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
});

export default ReusableButton;
