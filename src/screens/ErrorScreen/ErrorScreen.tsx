import React from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import Text from '../../components/Text';
import {RootStackParamList, Routes} from '../../types/navigation';
import {useStyles} from './ErrorScreen.styles';
import useErrorScreenViewModel from './ErrorScreen.viewmodel';

type ErrorScreenProps = {
  route?: RouteProp<RootStackParamList, Routes.ERROR_SCREEN>;
  error?: unknown;
};

const ErrorScreen: React.FC<ErrorScreenProps> = ({route, error}) => {
  const styles = useStyles();
  const {errorMessage} = useErrorScreenViewModel({
    routeError: route?.params?.error,
    fallbackError: error,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{errorMessage}</Text>
    </View>
  );
};

export default ErrorScreen;
