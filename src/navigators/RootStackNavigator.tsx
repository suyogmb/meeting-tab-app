import React, {useEffect, useState} from 'react';
import analytics from '@react-native-firebase/analytics';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ErrorHandler} from 'components';
import BootSplash from 'react-native-bootsplash';
import {RootStackParamList, Routes} from '../types/navigation';
import {FirstRunSetup, Dashboard, ErrorScreen, AdminAccess, AdminSettings} from '../screens';
import StorageService from '../utils/StorageService';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

const RootStackNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<Routes | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if first run is complete
    const checkFirstRun = async () => {
      try {
        const isFirstRunComplete = await StorageService.getItem<boolean>(
          StorageService.storageKeys.isFirstRunComplete,
          false,
        );

        if (isFirstRunComplete) {
          setInitialRoute(Routes.DASHBOARD);
        } else {
          setInitialRoute(Routes.FIRST_RUN_SETUP);
        }
      } catch (error) {
        console.error('Failed to check first run status', error);
        setInitialRoute(Routes.FIRST_RUN_SETUP);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstRun();
  }, []);

  if (isLoading || !initialRoute) {
    // Show splash screen while determining initial route
    return null;
  }

  return (
    <ErrorHandler>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => BootSplash.hide({fade: true})}
        onStateChange={async () => {
          await analytics().logScreenView({
            screen_name: navigationRef.current?.getCurrentRoute()?.name,
          });
        }}>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            animation: 'none', // Disable animations for kiosk app
          }}>
          <Stack.Screen
            name={Routes.FIRST_RUN_SETUP}
            component={FirstRunSetup}
          />
          <Stack.Screen name={Routes.DASHBOARD} component={Dashboard} />
          <Stack.Screen name={Routes.ERROR_SCREEN} component={ErrorScreen} />
          <Stack.Screen name={Routes.ADMIN_ACCESS} component={AdminAccess} />
          <Stack.Screen name={Routes.ADMIN_SETTINGS} component={AdminSettings} />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorHandler>
  );
};

export default RootStackNavigator;
