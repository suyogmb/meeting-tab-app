import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

//mock dependencies
jest.mock('@react-native-firebase/analytics', () => () => ({
  logEvent: jest.fn(),
  setAnalyticsCollectionEnabled: jest.fn(),
  getAppInstanceId: jest.fn(() => Promise.resolve('mock-app-instance-id')),
}));

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn(),
  show: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));
