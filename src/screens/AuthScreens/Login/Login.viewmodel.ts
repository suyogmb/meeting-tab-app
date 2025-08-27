import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AUTH_STACK_NAVIGATOR} from 'navigators/routes';
import newRelic from 'newrelic-react-native-agent';
import {useTranslation} from 'react-i18next';
import StorageService from 'utils/StorageService';
import {useStyles} from './Login.styles';
import {loginSchema, validateData, validateField} from '../../../utils/ValidationSchemas';

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
      } as unknown as Map<string, string>);

      // Validate login data using Yup schema
      const validationResult = await validateData(
        {
          email: username,
          password: password,
        },
        loginSchema,
      );

      if (!validationResult.isValid) {
        // Set error states based on validation results
        if (validationResult.errors.email) {
          setIsUsernameSet(true);
          setUsernameErrorMsg(validationResult.errors.email);
        }
        if (validationResult.errors.password) {
          setIsPasswordSet(true);
          setPasswordErrorMsg(validationResult.errors.password);
        }
        return;
      }

      // Clear any existing error states
      setIsUsernameSet(false);
      setIsPasswordSet(false);
      setUsernameErrorMsg('');
      setPasswordErrorMsg('');

      StorageService.storeItem(StorageService.storageKeys.isLoggedIn, true);
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

  const onEmailBlur = async () => {
    const emailValidation = await validateField('email', username, loginSchema);
    if (!emailValidation.isValid) {
      setIsUsernameSet(true);
      setUsernameErrorMsg(emailValidation.error);
    }
  };

  const onPasswordBlur = async () => {
    const passwordValidation = await validateField('password', password, loginSchema);
    if (!passwordValidation.isValid) {
      setIsPasswordSet(true);
      setPasswordErrorMsg(passwordValidation.error);
    }
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
    onEmailBlur,
    onPasswordBlur,
  };
};

export default useViewModel;
