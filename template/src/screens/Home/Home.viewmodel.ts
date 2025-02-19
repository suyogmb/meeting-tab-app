import {useTranslation} from 'react-i18next';
import {useStyles} from './Home.styles';
import {useState} from 'react';
import {ThemeOptions, useTheme} from '../../contexts/ThemeContext';

const useViewModel = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme, setTheme} = useTheme();
  const [isEnabled, setIsEnabled] = useState<boolean>(ThemeOptions.dark === theme ? true : false);

  const toggleSwitch = (newState: boolean) => {
    setIsEnabled(newState);
    setTheme(newState ? ThemeOptions.dark : ThemeOptions.light);
  };

  return {
    styles,
    t,
    isEnabled,
    toggleSwitch,
  };
};

export default useViewModel;
