import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {fireEvent, render} from '@testing-library/react-native';
import {AuthStackParamList} from 'navigators/AuthStackNavigator';
import {DetailsScreen} from 'screens'; // Adjust the path accordingly
import useViewModel from '../src/screens/Home/Home.viewmodel';

type DetailsScreenRouteProp = RouteProp<AuthStackParamList, 'HOME_DETAILS'>;
type DetailsScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'HOME_DETAILS'>;

jest.mock('../src/screens/Home/Home.viewmodel', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Return the key itself
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

describe('DetailsScreen', () => {
  const mockGoBack = jest.fn(); // Ensure mock function is globally defined
  const mockT = (key: string) => key;
  let mockNavigation: Partial<NativeStackNavigationProp<AuthStackParamList>> = {};

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useViewModel with mockGoBack
    (useViewModel as jest.Mock).mockReturnValue({
      styles: {
        mainView: {},
        safeView: {},
        mainSubView: {},
        detailsPageImage: {},
        detailTextView: {},
        subText: {},
        btnStyle: {},
      },
      t: mockT,
      onBack: mockGoBack, // <-- Explicitly linking goBack function
    });
  });

  const mockRoute = {
    params: {
      data: {
        imageurl: 'https://example.com/image.jpg',
        name: 'Superhero',
        team: 'Avengers',
        firstappearance: '1963',
        publisher: 'Marvel',
        bio: 'A superhero from Marvel Universe.',
      },
    },
  };

  test('renders DetailsScreen correctly', () => {
    const {getByText, getByLabelText} = render(
      <DetailsScreen
        route={mockRoute as DetailsScreenRouteProp}
        navigation={mockNavigation as DetailsScreenNavigationProp}
      />,
    );

    expect(getByText('dashboard.detail.name:- Superhero')).toBeTruthy();
    expect(getByText('dashboard.detail.team:- Avengers')).toBeTruthy();
    expect(getByText('dashboard.detail.firstAppearance:- 1963')).toBeTruthy();
    expect(getByText('dashboard.detail.publisher:- Marvel')).toBeTruthy();
    expect(getByText('dashboard.detail.bio:- A superhero from Marvel Universe.')).toBeTruthy();
    expect(getByText('dashboard.button.title')).toBeTruthy();
    expect(getByLabelText('Character Image')).toBeTruthy();
  });

  test('calls goBack when button is pressed', () => {
    const {getByText} = render(
      <DetailsScreen
        route={mockRoute as DetailsScreenRouteProp}
        navigation={mockNavigation as DetailsScreenNavigationProp}
      />,
    );

    const backButton = getByText('dashboard.button.title');
    fireEvent.press(backButton);
  });
});
