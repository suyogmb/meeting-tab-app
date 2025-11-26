/**
 * Simple Modal Component
 * A reusable modal component with card UI design
 */

import React, {ReactNode} from 'react';
import {View, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import Text from './Text';
import {scaleSize} from '../utils/SizeUtility';
import {fontFamily} from '../utils/FontUtils';

interface SimpleModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayPress?: boolean;
}

const SimpleModal: React.FC<SimpleModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnOverlayPress = true,
}) => {
  const {themeColors} = useTheme();
  const styles = createSimpleModalStyles(themeColors);

  const handleOverlayPress = () => {
    if (closeOnOverlayPress) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleOverlayPress}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={styles.modalContainer}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              {showCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  activeOpacity={0.7}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const createSimpleModalStyles = (themeColors: any) => {
  const isDark = themeColors.background === '#0a0a0f' || themeColors.background === '#000814';
  
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: scaleSize(24),
    },
    modalContainer: {
      width: '100%',
      maxWidth: scaleSize(900),
      backgroundColor: themeColors.background,
      borderRadius: scaleSize(32),
      borderWidth: 3,
      borderColor: '#38b8b3',
      overflow: 'hidden',
      elevation: 20,
      maxHeight: '90%',
      shadowColor: '#38b8b3',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.3,
      shadowRadius: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: scaleSize(32),
      paddingTop: scaleSize(28),
      paddingBottom: scaleSize(20),
      backgroundColor: isDark ? 'rgba(56, 184, 179, 0.1)' : 'rgba(56, 184, 179, 0.05)',
      borderBottomWidth: 2,
      borderBottomColor: '#38b8b3',
    },
    title: {
      fontSize: scaleSize(32),
      fontFamily: fontFamily.bold,
      color: '#38b8b3',
      letterSpacing: -0.5,
    },
    closeButton: {
      width: scaleSize(40),
      height: scaleSize(40),
      borderRadius: scaleSize(20),
      backgroundColor: isDark ? 'rgba(113, 51, 174, 0.2)' : 'rgba(113, 51, 174, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#7133ae',
    },
    closeButtonText: {
      fontSize: scaleSize(22),
      fontFamily: fontFamily.bold,
      color: '#7133ae',
    },
    content: {
      padding: scaleSize(32),
      backgroundColor: themeColors.background,
    },
  });
};

export default SimpleModal;

