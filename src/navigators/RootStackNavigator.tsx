import React from 'react';
import analytics from '@react-native-firebase/analytics';
import {createNavigationContainerRef, NavigationContainer} from '@react-navigation/native';
import {ErrorHandler} from 'components';
import useTypedSelector from 'hooks/useTypedSelector';
import BootSplash from 'react-native-bootsplash';
import AuthStackNavigator from './AuthStackNavigator';
import MainStackNavigator from './MainStackNavigator';

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
