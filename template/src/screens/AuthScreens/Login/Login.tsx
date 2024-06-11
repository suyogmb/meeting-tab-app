import React from 'react';
import {View, TextInput, Button, Image, TouchableOpacity} from 'react-native';
import useViewModel from './Login.viewmodel';
import {useStyles} from './Login.styles';
import Logo from '../../../assets/logosvg.svg';
import {useTheme} from '../../../contexts/ThemeContext';
import {Text} from '../../../components';

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
            <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 40}}>
                {themes.map((item, index) => (
                    <TouchableOpacity
                        key={index + 'asd'}
                        onPress={() => {
                            onPress(item);
                        }}
                    >
                        <Text>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{flexDirection: 'row'}}>
                <Image source={require('../../../assets/logo.png')} />

                <Logo
                    height={60}
                    width={60}
                />
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
