/**
 * Dashboard Screen
 * Main screen displaying meeting information in landscape split-screen layout
 */

import React from 'react';
import {View, ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStyles} from './Dashboard.styles';
import TimeDisplay from '../../components/dashboard/TimeDisplay';
import RoomInfo from '../../components/dashboard/RoomInfo';
import StatusCard from '../../components/dashboard/StatusCard';
import MeetingCard from '../../components/dashboard/MeetingCard';
import SettingsButton from '../../components/dashboard/SettingsButton';
import UpcomingMeetingsCarousel from '../../components/dashboard/UpcomingMeetingsCarousel';
import Text from '../../components/Text';
import AdminAccessModal from '../../components/AdminAccessModal';
import AdminSettingsModal from '../../components/AdminSettingsModal';
import {useTranslation} from 'react-i18next';
import useDashboardViewModel from './Dashboard.viewmodel';

const Dashboard: React.FC = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {
    isLoading,
    error,
    currentMeeting,
    nextMeeting,
    upcomingMeetings,
    showAdminAccess,
    showAdminSettings,
    openAdminAccess,
    closeAdminAccess,
    closeAdminSettings,
    handleAdminAuthenticated,
  } = useDashboardViewModel();

  // Show loading state initially or while loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('loading.dashboard')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error only if we're not loading and there's an error
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorSubtext}>
            {t('dashboard.errorRoomConfiguration')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1762236096060-964c4acb6700?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
        }}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.content}>
          {/* Left Pane (50%): Time/Date + Room Info */}
          <View style={styles.leftPane}>
            <View style={styles.leftPaneContent}>
              <TimeDisplay />
              <RoomInfo />
            </View>
          </View>

          {/* Right Pane (50%): Meetings - Ongoing Card + Upcoming List */}
          <View style={styles.rightPane}>
          {/* Ongoing Meeting Card */}
          {currentMeeting ? (
            <View style={styles.ongoingCardContainer}>
              <MeetingCard
                meeting={currentMeeting}
                displayState="current"
              />
            </View>
          ) : (
            <View style={styles.ongoingCardContainer}>
              <StatusCard
                currentMeeting={null}
                nextMeeting={nextMeeting}
              />
            </View>
          )}

          {/* Upcoming Meetings - Carousel */}
          <View style={styles.upcomingListContainer}>
            {upcomingMeetings.length > 0 ? (
              <UpcomingMeetingsCarousel meetings={upcomingMeetings} />
            ) : (
              <View style={styles.emptyUpcoming}>
                <Text style={styles.emptyUpcomingText}>
                  {t('dashboard.noUpcomingMeetings')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Settings button in bottom-left corner */}
        <View style={styles.settingsButtonContainer}>
          <SettingsButton onPress={openAdminAccess} />
        </View>

        {/* Admin Access Modal */}
        <AdminAccessModal
          visible={showAdminAccess}
          onClose={closeAdminAccess}
          onAuthenticated={handleAdminAuthenticated}
        />

        {/* Admin Settings Modal */}
        <AdminSettingsModal
          visible={showAdminSettings}
          onClose={closeAdminSettings}
        />
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Dashboard;

