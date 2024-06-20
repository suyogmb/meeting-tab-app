import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {login} from 'redux/actions';

const useViewModel = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onSubmit = async () => {
    try {
      dispatch(login());
    } catch (error) {
      console.log('ERR', error);
    }
  };
  return {username, password, setUsername, setPassword, onSubmit, t};
};

export default useViewModel;
