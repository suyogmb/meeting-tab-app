import {useNavigation} from '@react-navigation/native';
import {AUTH_STACK_NAVIGATOR} from 'navigators/routes';
import newRelic from 'newrelic-react-native-agent';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {useStyles} from './Login.styles';

const useViewModel = () => {
  const [username, setUsername] = useState<string>('jayesh');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation();

  const styles = useStyles();
  const {t} = useTranslation();
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
  return {username, password, setUsername, setPassword, onSubmit, styles, t};
};

export default useViewModel;
