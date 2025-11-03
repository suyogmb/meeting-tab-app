import React from 'react';
import {SafeAreaView, View} from 'react-native';
import Image from 'components/Image';
import ReusableButton from 'components/ReusableButton';
import TextInputComponent from 'components/TextInput';
import useViewModel from './Login.viewmodel';
import ImageConstants from '../../../utils/ImageConstants';

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
    onEmailBlur,
    onPasswordBlur,
  } = useViewModel();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logo}>
          <Image
            source={ImageConstants.LogoPng}
            style={styles.imageStyle}
            resizeMode="contain"
          />
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
            onBlur={onEmailBlur}
          />
          <TextInputComponent
            style={styles.input}
            placeholder={t('login.input.password.placeholder')}
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            isError={isPasswordSet}
            errorMsg={passwordErrorMsg}
            onBlur={onPasswordBlur}
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
