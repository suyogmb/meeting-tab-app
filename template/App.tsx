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

function App(): React.JSX.Element {
  useEffect(() => {}, []);
  return (
    <>
      <Provider store={store}>
        <RootStackNavigator />
      </Provider>
    </>
  );
}

export default App;
