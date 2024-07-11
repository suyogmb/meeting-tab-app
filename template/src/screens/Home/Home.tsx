import {View, Text} from 'react-native';
import React from 'react';
import useViewModel from './Home.viewmodel';

const Home = () => {
  useViewModel();
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

export default Home;
