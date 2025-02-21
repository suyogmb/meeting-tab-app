/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import RootStackNavigator from './src/navigators/RootStackNavigator';
import {Provider} from 'react-redux';
import store from './src/redux/app/store';
import Toast from 'react-native-toast-message';
import LanguageProvider from './src/hocs/LanguageProvider';
import {ThemeProvider} from './src/contexts/ThemeContext';
import analytics from '@react-native-firebase/analytics';

function App(): React.JSX.Element {
  useEffect(() => {
    try {
      (async () => {
        const appInstanceId = await analytics().getAppInstanceId();
        await analytics().logEvent('app_open');
        console.log('APP INSTANTANCE', appInstanceId);
      })();
    } catch (error) {}
  }, []);
  return (
    <>
      <Provider store={store}>
        <LanguageProvider>
          <ThemeProvider>
            <RootStackNavigator />
            <Toast />
          </ThemeProvider>
        </LanguageProvider>
      </Provider>
    </>
  );
}

export default App;
