import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DetailScreen from 'screens/DetailScreen/DetailScreen';
import Home from 'screens/Home/Home';
import {HomeTabParamList} from 'types/types';
import {HOME_TAB_NAVIGATOR} from './routes';

const HomeTabNavigator = () => {
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
