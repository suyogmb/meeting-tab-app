import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {HeaderProps} from 'types/types';
import ImageConstants from 'utils/ImageConstants';
import {M_18} from 'utils/SizeUtility';
import {useTheme} from '../contexts/ThemeContext';
import {getTypographyStyle, TypographyStyleEnum} from '../utils/Typography';
import {useTranslation} from 'react-i18next';

const Header = ({title, showBackButton = true, onBackPress, rightComponent}: HeaderProps) => {
  const navigation = useNavigation();
  const {themeColors} = useTheme();
  const {t} = useTranslation();
  const resolvedTitle = title || t('common.defaultHeaderTitle');

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: themeColors.headerBackground,
        borderBottomColor: themeColors.borderBottomColor,
      }}
    >
      {/* Left - Back Button */}
      {showBackButton ? (
        <TouchableOpacity
          onPress={onBackPress || (() => navigation.goBack())}
          style={styles.iconButton}
        >
          <Image
            style={[styles.icon, {tintColor: themeColors.text}]}
            source={ImageConstants.BackIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* Center - Title */}
      <Text style={{...styles.title, ...getTypographyStyle(TypographyStyleEnum.SUBTITLE), color: themeColors.text}}>
        {resolvedTitle}
      </Text>

      {/* Right - Custom Component */}
      {rightComponent ? rightComponent : <View style={styles.placeholder} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  iconButton: {
    padding: 8,
  },
  title: {
    textAlign: 'center',
    flex: 1,
    fontSize: M_18,
    fontWeight: '600',
  },
  placeholder: {
    width: 30,
  },
  icon: {
    height: 24,
    width: 24,
  },
});

export default Header;
