import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AUTH_STACK_NAVIGATOR} from './routes';

import LoginScreen from '../screens/AuthScreens/Login/Login';

const AuthStackNavigator = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={AUTH_STACK_NAVIGATOR.LOGIN_SCREEN}
                component={LoginScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthStackNavigator;
