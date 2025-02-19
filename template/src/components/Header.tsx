import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getTypographyStyle, TypographyStyleEnum} from '../utils/Typography';
import {useTheme} from '../contexts/ThemeContext';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const Header = ({title = 'Header', showBackButton = true, onBackPress, rightComponent}: HeaderProps) => {
  const navigation = useNavigation();
  const {themeColors} = useTheme();

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
            source={require('../assets/back.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* Center - Title */}
      <Text style={{...styles.title, ...getTypographyStyle(TypographyStyleEnum.SUBTITLE), color: themeColors.text}}>
        {title}
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
    fontSize: 18,
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
