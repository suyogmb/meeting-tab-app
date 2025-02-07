import {createNavigationContainerRef, NavigationContainer} from '@react-navigation/native';
import React from 'react';
import analytics from '@react-native-firebase/analytics';
import BootSplash from 'react-native-bootsplash';
import MainStackNavigator from './MainStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import {ErrorHandler} from 'components';
import useTypedSelector from 'hooks/useTypedSelector';

const navigationRef = createNavigationContainerRef();

const RootStackNavigator = () => {
  const {accessToken} = useTypedSelector((state) => state.app);

  return (
    <ErrorHandler>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => BootSplash.hide({fade: true})}
        onStateChange={async () => {
          await analytics().logScreenView({
            screen_name: navigationRef.current?.getCurrentRoute()?.name,
          });
        }}
      >
        {accessToken ? <MainStackNavigator /> : <AuthStackNavigator />}
      </NavigationContainer>
    </ErrorHandler>
  );
};
export default RootStackNavigator;
