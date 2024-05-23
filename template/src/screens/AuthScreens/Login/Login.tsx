import React from 'react';
import {View, Text, TextInput, Button, Image} from 'react-native';
import useViewModel from './Login.viewmodel';
import {useStyles} from './Login.styles';
import Logo from '../../../assets/logosvg.svg';

const Login = () => {
    const {username, password, setPassword, setUsername, onSubmit, t} = useViewModel();
    const styles = useStyles();
    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/logo.png')} />

            <Logo
                height={60}
                width={60}
            />

            <TextInput
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
            />
            <Button
                title={t('login.button.title')}
                onPress={onSubmit}
            />
        </View>
    );
};

export default Login;
