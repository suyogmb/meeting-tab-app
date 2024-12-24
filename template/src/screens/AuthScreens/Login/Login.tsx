import React from 'react';
import {View, TextInput, Button, TouchableOpacity} from 'react-native';
import useViewModel from './Login.viewmodel';
import {useStyles} from './Login.styles';
import Logo from 'assets/logosvg.svg';
import Image from 'components/Image';
import {useTheme} from 'contexts/ThemeContext';
import {Text} from 'components';

const themes = ['dark', 'light', 'other'];

const Login = () => {
  const {username, password, setPassword, setUsername, onSubmit, t} = useViewModel();
  const styles = useStyles();
  const {setTheme} = useTheme();
  const onPress = (value) => {
    setTheme(value);
  };
  return (
    <View style={styles.container}>
      <Button
        title={t('login.button.title')}
        onPress={onSubmit}
      />
    </View>
  );
};

export default Login;
