/**
 * First Run Setup Screen
 * Handles initial device configuration: room setup and admin password
 */

import React from 'react';
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStyles} from './FirstRunSetup.styles';
import Text from '../../components/Text';
import TextInputComponent from '../../components/TextInput';
import ReusableButton from '../../components/ReusableButton';
import useFirstRunSetupViewModel from './FirstRunSetup.viewmodel';
import EpicoLogo from '../../assets/SVGs/EPICO-Scheduler.svg';
import {scaleSize} from '../../utils/SizeUtility';

const FirstRunSetup: React.FC = () => {
  const styles = useStyles();
  const {
    t,
    roomId,
    adminPassword,
    confirmPassword,
    isLoading,
    onChangeRoomId,
    onChangeAdminPassword,
    onChangeConfirmPassword,
    handleSetup,
  } = useFirstRunSetupViewModel();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        enabled>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <EpicoLogo width={scaleSize(220)} height={scaleSize(110)} />
          </View>
          <Text style={styles.subtitle}>{t('firstRun.subtitle')}</Text>
          <View style={styles.inputContainer}>
            <TextInputComponent
              placeholder={t('firstRun.placeholder.roomNumberOrId')}
              value={roomId}
              onChangeText={onChangeRoomId}
              style={styles.input}
            />
            <TextInputComponent
              placeholder={t('firstRun.placeholder.enterAdminPassword')}
              value={adminPassword}
              onChangeText={onChangeAdminPassword}
              secureTextEntry
              style={styles.input}
              eyeIconBottom={15}
            />
            <TextInputComponent
              placeholder={t('firstRun.placeholder.confirmAdminPassword')}
              value={confirmPassword}
              onChangeText={onChangeConfirmPassword}
              secureTextEntry
              style={styles.input}
              eyeIconBottom={15}
            />
          </View>
          <ReusableButton
            title={
              isLoading
                ? t('firstRun.button.saving')
                : t('firstRun.button.saveConfiguration')
            }
            onPress={handleSetup}
            disabled={isLoading}
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FirstRunSetup;

