/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {test} from '@jest/globals';

import {render, waitFor} from '@testing-library/react-native';

test('renders correctly', async () => {
  await waitFor(async () => {
    render(<App />);
  });
});
