/**
 * Navigation-related TypeScript types
 */

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

/**
 * Root stack navigation param list
 */
export type RootStackParamList = {
  FirstRunSetup: undefined;
  Dashboard: undefined;
  ErrorScreen: {error?: string};
};

/**
 * Navigation prop types
 */
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Route names
 */
export enum Routes {
  FIRST_RUN_SETUP = 'FirstRunSetup',
  DASHBOARD = 'Dashboard',
  ERROR_SCREEN = 'ErrorScreen',
}

