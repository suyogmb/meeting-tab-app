/**
 * Admin Settings Modal
 * Settings menu modal shown after authentication
 */

import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
  Platform,
  BackHandler,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import Text from './Text';
import StorageService from '../utils/StorageService';
import DatabaseService from '../database/DatabaseService';
import KioskService from '../services/kiosk/KioskService';
import Toast from 'react-native-toast-message';
import {logger} from '../utils/SecureLogger';
import {useStyles} from './AdminSettingsModalStyles';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {RootStackNavigationProp, Routes} from '../types/navigation';

interface AdminSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp>();
  const [activeSection, setActiveSection] = useState<
    'menu' | 'reset-room' | 'exit-kiosk'
  >('menu');

  const handleResetRoom = () => {
    Alert.alert(
      t('adminSettings.reset.title'),
      t('adminSettings.reset.description'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.reset'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear room information
              await StorageService.removeItem(
                StorageService.storageKeys.roomInfo,
                false,
              );

              // Clear first run flag to trigger setup again
              await StorageService.removeItem(
                StorageService.storageKeys.isFirstRunComplete,
                false,
              );

              // Clear database - delete and reinitialize
              try {
                await DatabaseService.deleteDatabase();
                await DatabaseService.initialize();
              } catch (dbError) {
                logger.warn('Database reset failed, continuing anyway', {error: dbError});
              }

              Toast.show({
                type: 'success',
                text1: t('adminSettings.reset.toastSuccessTitle'),
                text2: t('adminSettings.reset.toastSuccessMessage'),
              });

              logger.info('Room configuration reset');

              // Close modal and navigate will be handled by parent
              onClose();
              navigation.reset({
                index: 0,
                routes: [{name: Routes.FIRST_RUN_SETUP}],
              });
            } catch (error) {
              logger.error('Failed to reset room configuration', {error});
              Toast.show({
                type: 'error',
                text1: t('common.error'),
                text2: t('adminSettings.reset.toastErrorMessage'),
              });
            }
          },
        },
      ],
    );
  };

  const handleExitKiosk = () => {
    Alert.alert(
      'Exit Kiosk Mode',
      'This will stop kiosk mode and allow you to close the app. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Exit Kiosk',
          style: 'destructive',
          onPress: async () => {
            try {
              // Stop kiosk mode
              KioskService.stopKiosk();
              
              // Disable boot auto-start
              KioskService.enableBootAutoStart(false);
              
              Toast.show({
                type: 'success',
                text1: 'Kiosk Mode Exited',
                text2: 'You can now close the app',
              });

              logger.info('Kiosk mode exited by admin');

              // Close modal
              onClose();

              // On Android, exit the app after a short delay
              if (Platform.OS === 'android') {
                setTimeout(() => {
                  BackHandler.exitApp();
                }, 500);
              }
            } catch (error) {
              logger.error('Failed to exit kiosk mode', {error});
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to exit kiosk mode',
              });
            }
          },
        },
      ],
    );
  };

  const handleClose = () => {
    setActiveSection('menu');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      onRequestClose={handleClose}>
      <SafeAreaView style={styles.modalOverlay} edges={['top', 'bottom']}>
        <View style={styles.modalCardContainer}>
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}>
              <View style={styles.titleContainer}>
                <Text style={styles.title} allowFontScaling={false}>
                  {t('adminSettings.title')}
                </Text>
              </View>

            {activeSection === 'menu' && (
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={[styles.menuItem]}
                  onPress={handleExitKiosk}
                  activeOpacity={0.7}>
                  <View style={styles.menuItemContent}>
                    <View style={styles.menuItemTextContainer}>
                      <Text style={[styles.menuItemTitle, styles.dangerText]}>
                        Exit Kiosk Mode
                      </Text>
                      <Text style={styles.menuItemSubtitle}>
                        Stop kiosk mode and close the app
                      </Text>
                    </View>
                    <Text style={[styles.menuItemArrow, styles.dangerText]}>
                      ›
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuItem]}
                  onPress={handleResetRoom}
                  activeOpacity={0.7}>
                  <View style={styles.menuItemContent}>
                    <View style={styles.menuItemTextContainer}>
                      <Text style={[styles.menuItemTitle, styles.dangerText]}>
                        {t('adminSettings.reset.title')}
                      </Text>
                      <Text style={styles.menuItemSubtitle}>
                        {t('adminSettings.reset.menuSubtitle')}
                      </Text>
                    </View>
                    <Text style={[styles.menuItemArrow, styles.dangerText]}>
                      ›
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AdminSettingsModal;

