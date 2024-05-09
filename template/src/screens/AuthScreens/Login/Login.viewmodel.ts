import {useState} from 'react';
import {useTranslation} from 'react-i18next';

const useViewModel = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {t} = useTranslation();

  const onSubmit = () => {};
  return {username, password, setUsername, setPassword, onSubmit, t};
};

export default useViewModel;
