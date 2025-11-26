/**
 * LED Test Panel Component
 * Test interface for controlling Philips display LED colors
 */

import React, {useState} from 'react';
import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
import Text from '../Text';
import {useStyles} from './LedTestPanel.styles';
import PhilipsLedService from '../../services/philips/PhilipsLedService';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';

interface LedTestPanelProps {
  onBack: () => void;
}

const LedTestPanel: React.FC<LedTestPanelProps> = ({onBack}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [loading, setLoading] = useState<string | null>(null);

  const handleLedCommand = async (
    command: 'off' | 'red' | 'blue' | 'yellow',
  ) => {
    if (loading) {
      return; // Prevent multiple simultaneous requests
    }

    setLoading(command);

    try {
      let success = false;

      switch (command) {
        case 'off':
          success = await PhilipsLedService.setLedOff();
          break;
        case 'red':
          success = await PhilipsLedService.setLedRed();
          break;
        case 'blue':
          success = await PhilipsLedService.setLedBlue();
          break;
        case 'yellow':
          success = await PhilipsLedService.setLedYellow();
          break;
      }

      if (success) {
        Toast.show({
          type: 'success',
          text1: t('adminSettings.ledTest.successTitle'),
          text2: t('adminSettings.ledTest.successMessage', {
            color: t(`adminSettings.ledTest.colors.${command}`),
          }),
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      Toast.show({
        type: 'error',
        text1: t('adminSettings.ledTest.errorTitle'),
        text2: errorMessage,
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('adminSettings.ledTest.title')}</Text>
      <Text style={styles.subtitle}>
        {t('adminSettings.ledTest.description')}
      </Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          {t('adminSettings.ledTest.info')}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {/* LED OFF Button */}
        <TouchableOpacity
          style={[styles.ledButton, styles.ledButtonOff]}
          onPress={() => handleLedCommand('off')}
          disabled={loading !== null}
          activeOpacity={0.7}>
          {loading === 'off' ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.ledButtonText}>
              {t('adminSettings.ledTest.colors.off')}
            </Text>
          )}
        </TouchableOpacity>

        {/* LED RED Button */}
        <TouchableOpacity
          style={[styles.ledButton, styles.ledButtonRed]}
          onPress={() => handleLedCommand('red')}
          disabled={loading !== null}
          activeOpacity={0.7}>
          {loading === 'red' ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.ledButtonText}>
              {t('adminSettings.ledTest.colors.red')}
            </Text>
          )}
        </TouchableOpacity>

        {/* LED BLUE Button */}
        <TouchableOpacity
          style={[styles.ledButton, styles.ledButtonBlue]}
          onPress={() => handleLedCommand('blue')}
          disabled={loading !== null}
          activeOpacity={0.7}>
          {loading === 'blue' ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.ledButtonText}>
              {t('adminSettings.ledTest.colors.blue')}
            </Text>
          )}
        </TouchableOpacity>

        {/* LED YELLOW Button */}
        <TouchableOpacity
          style={[styles.ledButton, styles.ledButtonYellow]}
          onPress={() => handleLedCommand('yellow')}
          disabled={loading !== null}
          activeOpacity={0.7}>
          {loading === 'yellow' ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.ledButtonText}>
              {t('adminSettings.ledTest.colors.yellow')}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}>
        <Text style={styles.backButtonText}>{t('common.back')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LedTestPanel;

