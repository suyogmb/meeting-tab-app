import {useNavigation} from '@react-navigation/native';
import {AUTH_STACK_NAVIGATOR} from 'navigators/routes';
import newRelic from 'newrelic-react-native-agent';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {login} from 'redux/actions';

const useViewModel = () => {
  const [username, setUsername] = useState<string>('jayesh');
  const [password, setPassword] = useState<string>('');

  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onSubmit = async () => {
    try {
      newRelic.recordCustomEvent('LoginAttempt', {
        username,
        timestamp: new Date().toISOString(),
      });

      navigation.navigate(AUTH_STACK_NAVIGATOR.HOME);
    } catch (error) {
      console.log('ERR', error);
    }
  };
  return {username, password, setUsername, setPassword, onSubmit, t};
};

export default useViewModel;
