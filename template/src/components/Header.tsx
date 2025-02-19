import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getTypographyStyle, TypographyStyleEnum} from '../utils/Typography';
import {useTheme} from '../contexts/ThemeContext';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode; // Custom right-side component (e.g., button, icon)
}

const Header = ({title = 'Header', showBackButton = true, onBackPress, rightComponent}: HeaderProps) => {
  const navigation = useNavigation();
  const {themeColors} = useTheme();

  return (
    <View style={styles.container}>
      {/* Left - Back Button */}
      {showBackButton ? (
        <TouchableOpacity
          onPress={onBackPress || (() => navigation.goBack())}
          style={{...styles.iconButton}}
        >
          <Image
            style={{...styles.icon, tintColor: themeColors.text}}
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
  },
  iconButton: {
    padding: 8,
  },
  title: {
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 30,
  },
  icon: {
    height: 30,
    width: 30,
  },
});

export default Header;
