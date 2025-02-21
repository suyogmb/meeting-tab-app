import React from 'react';
import {SafeAreaView, View} from 'react-native';
import useViewModel from './Login.viewmodel';
import Image from 'components/Image';
import ReusableButton from 'components/ReusableButton';
import TextInputComponent from 'components/TextInput';

const Login = () => {
  const {
    username,
    password,
    isPasswordSet,
    isUsernameSet,
    usernameErrorMsg,
    passwordErrorMsg,
    handleUserNameChange,
    handlePasswordChange,
    onSubmit,
    styles,
    t,
  } = useViewModel();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logo}>
          <Image source={require('../../../assets/logo.png')} />
        </View>
        <View style={styles.subContainer}>
          <TextInputComponent
            style={styles.input}
            placeholder={t('login.input.email.placeholder')}
            value={username}
            onChangeText={handleUserNameChange}
            keyboardType="email-address"
            autoCapitalize="none"
            isError={isUsernameSet}
            errorMsg={usernameErrorMsg}
          />
          <TextInputComponent
            style={styles.input}
            placeholder={t('login.input.password.placeholder')}
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            isError={isPasswordSet}
            errorMsg={passwordErrorMsg}
          />
          <ReusableButton
            title={t('login.button.title')}
            onPress={onSubmit}
            style={styles.btnStyle}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Login;
