import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import DetailsScreen from '../src/screens/Home/DetailScreen'; // Adjust the path accordingly
import useViewModel from '../src/screens/Home/Home.viewmodel';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

jest.mock('../src/screens/Home/Home.viewmodel', () => ({
  __esModule: true,
  default: jest.fn(),
}));
// jest.mock('@react-navigation/native', () => ({
//   ...jest.requireActual('@react-navigation/native'),
//   useNavigation: jest.fn(),
// }));

describe('DetailsScreen', () => {
  const mockGoBack = jest.fn();
  const mockT = (key: string) => key;
  let mockNavigation: Partial<NativeStackNavigationProp<any>> = {};

  beforeEach(() => {
    jest.clearAllMocks();
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
      goBack: mockGoBack,
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
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    // Check if texts are rendered correctly
    expect(getByText('dashboard.detail.name:- Superhero')).toBeTruthy();
    expect(getByText('dashboard.detail.team:- Avengers')).toBeTruthy();
    expect(getByText('dashboard.detail.firstAppearance:- 1963')).toBeTruthy();
    expect(getByText('dashboard.detail.publisher:- Marvel')).toBeTruthy();
    expect(getByText('dashboard.detail.bio:- A superhero from Marvel Universe.')).toBeTruthy();

    // Check if the button is rendered
    expect(getByText('dashboard.button.title')).toBeTruthy();

    // Check if the image is rendered
    expect(getByLabelText('Character Image')).toBeTruthy();
  });

  test('calls goBack when button is pressed', () => {
    const {getByText} = render(
      <DetailsScreen
        route={mockRoute as any}
        navigation={mockNavigation as any}
      />,
    );

    const backButton = getByText('dashboard.button.title');
    fireEvent.press(backButton);

    expect(mockGoBack).toHaveBeenCalled();
  });
});
