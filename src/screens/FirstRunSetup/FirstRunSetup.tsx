/**
 * First Run Setup Screen
 * Handles initial device configuration: room setup and admin password
 */

import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStyles} from './FirstRunSetup.styles';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import ReusableButton from '../../components/ReusableButton';
import useFirstRunSetupViewModel from './FirstRunSetup.viewmodel';

const FirstRunSetup: React.FC = () => {
  const styles = useStyles();
  const {
    t,
    roomId,
    roomName,
    adminPassword,
    confirmPassword,
    errors,
    isLoading,
    currentStep,
    totalSteps,
    isStepOne,
    onChangeRoomId,
    onChangeRoomName,
    onChangeAdminPassword,
    onChangeConfirmPassword,
    goToNextStep,
    goToPreviousStep,
    handleSetup,
  } = useFirstRunSetupViewModel();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
        enabled>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="none"
              showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                
                <Text style={styles.subheading}>
                  {t('firstRun.welcomeSubtitle')}
                </Text>
              </View>

              <Text style={styles.stepIndicator}>
                {t('firstRun.stepIndicator', {
                  current: currentStep,
                  total: totalSteps,
                })}
              </Text>

              <Text style={styles.sectionTitle}>
                {isStepOne
                  ? t('firstRun.section.roomInformation')
                  : t('firstRun.section.adminPassword')}
              </Text>

           

              {isStepOne ? (
                <>
                  <TextInput
                    value={roomId}
                    onChangeText={onChangeRoomId}
                    placeholder={t('firstRun.placeholder.roomId')}
                    style={styles.input}
                    isError={!!errors.roomId}
                    errorMsg={errors.roomId}
                  />

                  <TextInput
                    value={roomName}
                    onChangeText={onChangeRoomName}
                    placeholder={t('firstRun.placeholder.roomName')}
                    style={styles.input}
                    isError={!!errors.roomName}
                    errorMsg={errors.roomName}
                  />
                </>
              ) : (
                <>
                  {(roomName.trim() || roomId.trim()) && (
                    <View style={styles.summaryContainer}>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>
                          {t('firstRun.summary.roomName')}
                        </Text>
                        <Text style={styles.summaryValue}>
                          {roomName || t('roomInfo.defaultName')}
                        </Text>
                      </View>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>
                          {t('firstRun.summary.roomId')}
                        </Text>
                        <Text style={styles.summaryValue}>
                          {roomId || t('firstRun.placeholder.roomId')}
                        </Text>
                      </View>
                    </View>
                  )}
                  <TextInput
                    value={adminPassword}
                    onChangeText={onChangeAdminPassword}
                    placeholder={t('firstRun.placeholder.adminPassword')}
                    secureTextEntry
                    style={styles.input}
                    isError={!!errors.adminPassword}
                    errorMsg={errors.adminPassword}
                  />

                  <TextInput
                    value={confirmPassword}
                    onChangeText={onChangeConfirmPassword}
                    placeholder={t('firstRun.placeholder.confirmPassword')}
                    secureTextEntry
                    style={styles.input}
                    isError={!!errors.confirmPassword}
                    errorMsg={errors.confirmPassword}
                  />
                </>
              )}

              <View style={styles.buttonRow}>
                {!isStepOne && (
                  <View style={styles.buttonSpacing}>
                    <ReusableButton
                      title={t('common.back')}
                      onPress={goToPreviousStep}
                      style={[styles.button, styles.secondaryButton]}
                      textStyle={styles.secondaryButtonText}
                    />
                  </View>
                )}
                {isStepOne ? (
                  <ReusableButton
                    title={t('common.next')}
                    onPress={goToNextStep}
                    disabled={!roomId.trim() || !roomName.trim()}
                    style={styles.button}
                    textStyle={styles.buttonText}
                  />
                ) : (
                  <ReusableButton
                    title={t('firstRun.button.completeSetup')}
                    onPress={handleSetup}
                    disabled={isLoading}
                    style={styles.button}
                    textStyle={styles.buttonText}
                  />
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FirstRunSetup;

