import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {HOME_TAB_NAVIGATOR} from './routes';
import Home from 'screens/Home/Home';
import DetailScreen from 'screens/Home/DetailScreen';

const HomeTabNavigator = () => {
  const Tab = createBottomTabNavigator();

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
