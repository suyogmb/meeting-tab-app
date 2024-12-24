import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {login} from 'redux/actions';
import {useStyles} from './Login.styles';

const useViewModel = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const styles = useStyles();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const onSubmit = async () => {
    try {
      dispatch(login());
    } catch (error) {
      console.log('ERR', error);
    }
  };
  return {username, password, setUsername, setPassword, onSubmit, styles, t};
};

export default useViewModel;
