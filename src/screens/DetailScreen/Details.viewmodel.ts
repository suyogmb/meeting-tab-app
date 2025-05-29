import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useStyles} from './Details.styles';

const useViewModel = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const navigation = useNavigation();

  const onBack = () => {
    navigation.goBack();
  };

  return {
    styles,
    t,
    onBack,
  };
};

export default useViewModel;
