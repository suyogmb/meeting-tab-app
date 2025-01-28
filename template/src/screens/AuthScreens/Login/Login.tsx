import React from 'react';
import {View, TextInput, Button} from 'react-native';
import useViewModel from './Login.viewmodel';
import Logo from 'assets/logosvg.svg';
import Image from 'components/Image';

const Login = () => {
  const {username, password, setPassword, setUsername, onSubmit, styles, t} = useViewModel();

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Image source={require('../../../assets/logo.png')} />
        {/* SVG EXAMPLE****** */}
        <Image source={Logo} />
      </View>
      <TextInput
        style={styles.input}
        placeholder={t('login.input.email.placeholder')}
        value={username}
        onChangeText={setUsername}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={t('login.input.password.placeholder')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={t('login.button.title')}
        onPress={onSubmit}
      />
    </View>
  );
};

export default Login;
