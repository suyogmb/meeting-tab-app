/**
 * Dummy Dashboard Screen
 * Static UI-only version for previewing the dashboard design
 */

import React from 'react';
import {View, ImageBackground, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useStyles} from './DummyDashboard.styles';
import TimeDisplay from '../../components/dashboard/TimeDisplay';
import MeetingCard from '../../components/dashboard/MeetingCard';
import StatusCard from '../../components/dashboard/StatusCard';
import SettingsButton from '../../components/dashboard/SettingsButton';
import Text from '../../components/Text';
import useDummyDashboardViewModel from './DummyDashboard.viewmodel';

const DummyDashboard: React.FC = () => {
  const styles = useStyles();
  const {
    currentMeeting,
    upcomingMeetings,
    showAvailableStatus,
    handleSettingsPress,
  } = useDummyDashboardViewModel();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ImageBackground
        source={{
          uri: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg',
        }}
        style={styles.backgroundImage}
        resizeMode="cover">
        {/* Gradient overlay for text legibility */}
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.4)']}
          locations={[0, 0.5, 1]}
          style={styles.gradientOverlay}
        />
        <View style={styles.content}>
          {/* Left Pane (50%): Time/Date + Room Info */}
          <View style={styles.leftPane}>
            <View style={styles.leftPaneContent}>
              <TimeDisplay />
              {/* Static Room Info */}
              <View style={styles.roomInfoContainer}>
                <View style={styles.roomInfo}>
                  <Text style={styles.roomName}>Conference Room A</Text>
                  <Text style={styles.roomId} includeFontPadding={false}>
                    ROOM-001
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right Pane (50%): Meetings - Ongoing Card + Upcoming List */}
          <View style={styles.rightPane}>
            {/* Ongoing Meeting Card or Available Status */}
            <View style={styles.ongoingCardContainer}>
              {showAvailableStatus ? (
                <StatusCard
                  currentMeeting={null}
                  nextMeeting={upcomingMeetings[0] || null}
                />
              ) : (
                <MeetingCard
                  meeting={currentMeeting}
                  displayState="current"
                />
              )}
            </View>

            {/* Upcoming Meetings - ScrollView List */}
            <View style={styles.upcomingListContainer}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}>
                {upcomingMeetings.map((meeting) => (
                  <View key={meeting.id} style={styles.upcomingMeetingItem}>
                    <Text style={styles.upcomingMeetingTitle}>{meeting.title}</Text>
                    <Text style={styles.upcomingMeetingTime}>
                      {new Date(meeting.startTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                      {' - '}
                      {new Date(meeting.endTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Settings button in bottom-left corner */}
          <View style={styles.settingsButtonContainer}>
            <SettingsButton onPress={handleSettingsPress} />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default DummyDashboard;

