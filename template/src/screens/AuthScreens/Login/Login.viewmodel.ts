import {useNavigation} from '@react-navigation/native';
import {AUTH_STACK_NAVIGATOR} from 'navigators/routes';
import newRelic from 'newrelic-react-native-agent';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useStyles} from './Login.styles';
import {isEmptyOrNull, isValidEmail, isValidPassword} from '../../../utils/ValidationUtils';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type AuthStackParamList = {
  HOME: undefined;
  HOME_DETAILS: {data?: object};
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'HOME'>;

const useViewModel = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isUsernameSet, setIsUsernameSet] = useState<boolean>(false);
  const [isPasswordSet, setIsPasswordSet] = useState<boolean>(false);
  const [usernameErrorMsg, setUsernameErrorMsg] = useState<string>('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string>('');

  const navigation = useNavigation<NavigationProp>();

  const styles = useStyles();
  const {t} = useTranslation();

  const onSubmit = async () => {
    try {
      newRelic.recordCustomEvent('LoginAttempt', 'EventName', {
        username,
        timestamp: new Date().toISOString(),
      } as unknown as Map<string, any>);
      if (isEmptyOrNull(username)) {
        setIsUsernameSet(true);
        setUsernameErrorMsg('Email is required.');
        return;
      }

      if (!isValidEmail(username)) {
        setIsUsernameSet(true);
        setUsernameErrorMsg('Please enter a valid email address.');
        return;
      }
      if (isEmptyOrNull(password)) {
        setIsPasswordSet(true);
        setPasswordErrorMsg('password is required.');
        return;
      }

      if (!isValidPassword(password, 6)) {
        setIsPasswordSet(true);
        setPasswordErrorMsg('Password must be at least 6 characters.');
        return;
      }
      navigation.navigate(AUTH_STACK_NAVIGATOR.HOME);
    } catch (error) {
      console.log('ERR', error);
    }
  };

  const handlePasswordChange = (text: string) => {
    // Reset the isPasswordSet when the password is updated
    setIsPasswordSet(false); // Reset error state
    setPassword(text); // Update password state
  };

  const handleUserNameChange = (text: string) => {
    // Reset the isUsernameSet when the username is updated
    setIsUsernameSet(false); // Reset error state
    setUsername(text); // Update username state
  };

  return {
    username,
    password,
    isPasswordSet,
    isUsernameSet,
    usernameErrorMsg,
    passwordErrorMsg,
    handlePasswordChange,
    handleUserNameChange,
    setPassword,
    onSubmit,
    styles,
    t,
  };
};

export default useViewModel;
