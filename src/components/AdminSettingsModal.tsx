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
} from 'react-native';

import Text from './Text';
import StorageService from '../utils/StorageService';
import DatabaseService from '../database/DatabaseService';
import Toast from 'react-native-toast-message';
import {logger} from '../utils/SecureLogger';
import {useStyles} from './AdminSettingsModalStyles';
import {useTranslation} from 'react-i18next';

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
  const [activeSection, setActiveSection] = useState<'menu' | 'reset-room'>(
    'menu',
  );

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

  const handleClose = () => {
    setActiveSection('menu');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
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
      </View>
    </Modal>
  );
};

export default AdminSettingsModal;

