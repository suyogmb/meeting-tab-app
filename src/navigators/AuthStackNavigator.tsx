import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home, Login} from 'screens';
import DetailsScreen from 'screens/DetailScreen/DetailScreen';
import {AuthStackParamList} from 'types/types';
import {AUTH_STACK_NAVIGATOR} from './routes';

const AuthStackNavigator = () => {
  // Explicitly type the stack
  const Stack = createNativeStackNavigator<AuthStackParamList>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={AUTH_STACK_NAVIGATOR.LOGIN_SCREEN}
        component={Login}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={AUTH_STACK_NAVIGATOR.HOME}
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={AUTH_STACK_NAVIGATOR.HOME_DETAILS}
        component={DetailsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
