import React from 'react';
import {View, Text} from 'react-native';
import useViewModel from './Login.viewmodel';

const LoginScreen = () => {
  useViewModel();
  return (
    <View>
      <Text>LoginScreen</Text>
    </View>
  );
};

export default LoginScreen;
