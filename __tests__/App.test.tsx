/**
 * @format
 */

import 'react-native';
import React from 'react';
// Note: import explicitly to use the types shipped with jest.
import {test} from '@jest/globals';
import {render, waitFor} from '@testing-library/react-native';
import App from '../App';

test('renders correctly', async () => {
  await waitFor(async () => {
    render(<App />);
  });
});
