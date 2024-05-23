import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import useTypedSelector from '../hooks/useTypedSelector';
import MainStackNavigator from './MainStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';

const RootStackNavigator = () => {
    const {isLogin} = useTypedSelector((state) => state.appReducer);

    return <NavigationContainer>{isLogin ? <MainStackNavigator /> : <AuthStackNavigator />}</NavigationContainer>;
};
export default RootStackNavigator;
