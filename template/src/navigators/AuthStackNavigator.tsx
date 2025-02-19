import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AUTH_STACK_NAVIGATOR} from './routes';
import {Login, Home} from 'screens';
import DetailsScreen from 'screens/DetailScreen/DetailScreen';

const AuthStackNavigator = () => {
  interface MovieDetails {
    name?: string;
    imageurl?: string;
    team?: string;
    firstappearance?: string;
    publisher?: string;
    bio?: string;
  }
  // Define the type for the navigator
  type AuthStackParamList = {
    LOGIN_SCREEN: undefined;
    HOME: undefined;
    HOME_DETAILS: {data?: MovieDetails}; // Ensure type consistency with DetailsScreenProps
  };

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
