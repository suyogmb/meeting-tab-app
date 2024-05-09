/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';

import RootStackNavigator from './src/navigators/RootStackNavigator';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import Toast from 'react-native-toast-message';
import LanguageProvider from './src/hocs/LanguageProvider';
import {ThemeProvider} from './src/contexts/ThemeContext';

function App(): React.JSX.Element {
  useEffect(() => {}, []);
  return (
    <>
      <Provider store={store}>
        <LanguageProvider>
          <ThemeProvider>
            <RootStackNavigator />
          </ThemeProvider>
        </LanguageProvider>
      </Provider>

      <Toast />
    </>
  );
}

export default App;
