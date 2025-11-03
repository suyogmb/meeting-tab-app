/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import analytics from '@react-native-firebase/analytics';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { ThemeProvider } from './src/contexts/ThemeContext';
import LanguageProvider from './src/hocs/LanguageProvider';
import RootStackNavigator from './src/navigators/RootStackNavigator';
import store from './src/redux/app/store';
import 'react-native-get-random-values';

function App(): React.JSX.Element {
  useEffect(() => {
    try {
      (async () => {
        const appInstanceId = await analytics().getAppInstanceId();
        await analytics().logEvent('app_open');
        console.log('APP INSTANTANCE', appInstanceId);
      })();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>
      <SafeAreaProvider>
        <Provider store={store}>
          <LanguageProvider>
            <ThemeProvider>
              <RootStackNavigator />
              <Toast />
            </ThemeProvider>
          </LanguageProvider>
        </Provider>
      </SafeAreaProvider>
    </>
  );
}

export default App;
