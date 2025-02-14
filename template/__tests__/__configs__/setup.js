jest.mock('@react-native-firebase/analytics', () => () => ({
  logEvent: jest.fn(),
  setAnalyticsCollectionEnabled: jest.fn(),
  getAppInstanceId: jest.fn(() => Promise.resolve('mock-app-instance-id')),
}));

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn(),
  show: jest.fn(),
}));

