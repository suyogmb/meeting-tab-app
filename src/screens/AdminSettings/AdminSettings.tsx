/**
 * Admin Settings Screen
 * Settings menu screen shown after authentication
 */

import React, {useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import Text from '../../components/Text';
import {useStyles} from './AdminSettings.styles';
import useAdminSettingsViewModel from './AdminSettings.viewmodel';
import EpicoLogo from '../../assets/SVGs/EPICO-Scheduler.svg';
import LedTestPanel from '../../components/admin/LedTestPanel';
import {scaleSize} from '../../utils/SizeUtility';

const AdminSettings: React.FC = () => {
  const styles = useStyles();
  const {t, handleResetRoom, handleGoBack, handleRefreshData} = useAdminSettingsViewModel();
  const [showLedTest, setShowLedTest] = useState(false);



  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.logoContainer,
            showLedTest && styles.logoContainerReduced,
          ]}>
          <EpicoLogo width={scaleSize(220)} height={scaleSize(110)} />
        </View>

        {showLedTest ? (
          <LedTestPanel onBack={() => setShowLedTest(false)} />
        ) : (
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowLedTest(true)}
              activeOpacity={0.7}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuItemTextContainer}>
                  <Text style={styles.menuItemTitle}>
                    {t('adminSettings.ledTest.title')}
                  </Text>
                  <Text style={styles.menuItemSubtitle}>
                    {t('adminSettings.ledTest.menuSubtitle')}
                  </Text>
                </View>
                <Text style={styles.menuItemArrow}>›</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleRefreshData}
              activeOpacity={0.7}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuItemTextContainer}>
                  <Text style={styles.menuItemTitle}>
                    Refresh Data
                  </Text>
                  <Text style={styles.menuItemSubtitle}>
                    Sync meetings and room details from server
                  </Text>
                </View>
                <Text style={styles.menuItemArrow}>›</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
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

        {/* Cancel Button - only show when menu is visible */}
        {!showLedTest && (
          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleGoBack}
              activeOpacity={0.7}>
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminSettings;

