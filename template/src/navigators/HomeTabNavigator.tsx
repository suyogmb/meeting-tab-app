import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {HOME_TAB_NAVIGATOR} from './routes';
import Home from 'screens/Home/Home';
import DetailScreen from 'screens/DetailScreen/DetailScreen';

const HomeTabNavigator = () => {
  interface MovieDetails {
    name?: string;
    imageurl?: string;
    team?: string;
    firstappearance?: string;
    publisher?: string;
    bio?: string;
  }

  type HomeTabParamList = {
    HOME: undefined;
    HOME_DETAILS: {data?: MovieDetails};
  };

  const Tab = createBottomTabNavigator<HomeTabParamList>();

  //TODO: Add screens
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name={HOME_TAB_NAVIGATOR.HOME}
        component={Home}
      />
      <Tab.Screen
        name={HOME_TAB_NAVIGATOR.HOME_DETAILS}
        component={DetailScreen}
      />
    </Tab.Navigator>
  );
};

export default HomeTabNavigator;
