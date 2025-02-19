import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Home} from 'screens';
import {useDispatch} from 'react-redux';
import useTypedSelector from 'hooks/useTypedSelector';
import useViewModel from 'screens/Home/Home.viewmodel';
import {useNavigation} from '@react-navigation/native';
import {AUTH_STACK_NAVIGATOR} from 'navigators/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTheme} from 'contexts/ThemeContext';
import {AppDispatch} from 'redux/app/store';

// Mock dependencies
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
jest.mock('hooks/useTypedSelector', () => jest.fn());

jest.mock('screens/Home/Home.viewmodel', () => jest.fn());

jest.mock('contexts/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../src/redux/reducer/DashboardSlice', () => ({
  getMoviesData: jest.fn(() => ({type: 'dashboard/getMoviesData'})),
}));

describe('Home Screen', () => {
  let mockDispatch: jest.Mock;
  let mockNavigation: jest.Mocked<NativeStackNavigationProp<any>>;
  let mockToggleSwitch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Redux dispatch
    mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch as AppDispatch);

    // Mock navigation
    mockNavigation = {navigate: jest.fn()} as any;
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);

    // Mock ViewModel
    mockToggleSwitch = jest.fn();
    (useViewModel as jest.Mock).mockReturnValue({
      styles: {
        container: {},
        safeView: {},
        listMain: {},
        listView: {},
        image: {},
        subText: {},
        dashboardFlatListSeparator: {},
      },
      t: (key: string) => key, // Mock translation function
      isEnabled: false,
      toggleSwitch: mockToggleSwitch,
    });

    // Mock Theme
    (useTheme as jest.Mock).mockReturnValue({
      themeColors: {
        primary: {10: 'lightblue', 50: 'gray', 90: 'blue'},
        secondary: 'white',
      },
    });

    // Mock Redux Selector
    (useTypedSelector as jest.Mock).mockReturnValue({
      movieData: [
        {
          id: 1,
          name: 'Movie 1',
          publisher: 'Marvel',
          firstappearance: '2022',
          imageurl: 'https://example.com/movie1.jpg',
        },
      ],
    });
  });

  test('renders Home screen correctly', () => {
    const {getByText} = render(<Home />);
    expect(getByText('dashboard.list.title')).toBeTruthy();
  });

  test('dispatches getMoviesData on mount', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({type: 'dashboard/getMoviesData'});
    });
  });

  test('displays movies in FlatList', () => {
    const {getByText} = render(<Home />);
    expect(getByText('Movie 1')).toBeTruthy();
    expect(getByText('Marvel')).toBeTruthy();
    expect(getByText('2022')).toBeTruthy();
  });

  test('navigates to details when movie is pressed', () => {
    const {getByText} = render(<Home />);
    fireEvent.press(getByText('Movie 1'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(AUTH_STACK_NAVIGATOR.HOME_DETAILS, {
      data: {
        id: 1,
        name: 'Movie 1',
        publisher: 'Marvel',
        firstappearance: '2022',
        imageurl: 'https://example.com/movie1.jpg',
      },
    });
  });

  test('toggles switch correctly', () => {
    const {getByRole} = render(<Home />);
    const switchComponent = getByRole('switch');
    fireEvent(switchComponent, 'valueChange', true);
    expect(mockToggleSwitch).toHaveBeenCalledWith(true);
  });
});
