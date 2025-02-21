import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Login} from 'screens';
import useViewModel from 'screens/AuthScreens/Login/Login.viewmodel';

// Mock the ViewModel hook
jest.mock('screens/AuthScreens/Login/Login.viewmodel', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Login Screen', () => {
  let mockHandleUsernameChange: jest.Mock;
  let mockHandlePasswordChange: jest.Mock;
  let mockOnSubmit: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Initialize mock functions correctly
    mockHandleUsernameChange = jest.fn();
    mockHandlePasswordChange = jest.fn();
    mockOnSubmit = jest.fn();

    // Mock ViewModel return values
    (useViewModel as jest.Mock).mockReturnValue({
      username: '',
      password: '',
      isPasswordSet: false,
      isUsernameSet: false,
      usernameErrorMsg: '',
      passwordErrorMsg: '',
      handleUserNameChange: mockHandleUsernameChange,
      handlePasswordChange: mockHandlePasswordChange,
      onSubmit: mockOnSubmit,
      styles: {
        container: {},
        safeArea: {},
        logo: {},
        subContainer: {},
        input: {},
        btnStyle: {},
      },
      t: (key: string): string => key, // Mock translation function
    });
  });

  test('renders login screen correctly', () => {
    const {getByPlaceholderText, getByText} = render(<Login />);
    expect(getByPlaceholderText('login.input.email.placeholder')).toBeTruthy();
    expect(getByPlaceholderText('login.input.password.placeholder')).toBeTruthy();
    expect(getByText('login.button.title')).toBeTruthy();
  });

  test('allows user to enter username and password', () => {
    const {getByPlaceholderText} = render(<Login />);
    fireEvent.changeText(getByPlaceholderText('login.input.email.placeholder'), 'l1@yopmail.com');
    fireEvent.changeText(getByPlaceholderText('login.input.password.placeholder'), 'test@123');
    expect(mockHandleUsernameChange).toHaveBeenCalledWith('l1@yopmail.com');
    expect(mockHandlePasswordChange).toHaveBeenCalledWith('test@123');
  });

  test('triggers login button press', () => {
    const {getByText} = render(<Login />);
    fireEvent.press(getByText('login.button.title'));
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
