import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius, elevation } from '../constants/theme';
import i18n from '../utils/i18n';
import * as Application from 'expo-application';
import Constants from 'expo-constants';

interface FeedbackScreenProps {
  visible: boolean;
  onClose: () => void;
}

export default function FeedbackScreen({ visible, onClose }: FeedbackScreenProps) {
  const [feedbackType, setFeedbackType] = useState<'bug' | 'idea' | 'other'>('bug');
  const [message, setMessage] = useState('');
  const [deviceInfo, setDeviceInfo] = useState('');

  useEffect(() => {
    if (visible) {
      loadDeviceInfo();
    }
  }, [visible]);

  const loadDeviceInfo = async () => {
    try {
      const appVersion = Application.nativeApplicationVersion || Constants.expoConfig?.version || 'Unknown';
      const buildNumber = Application.nativeBuildVersion || 'Unknown';
      const osVersion = Platform.Version;
      const platform = Platform.OS;
      const deviceName = Constants.deviceName || 'Unknown';

      const info = `
App Version: ${appVersion} (${buildNumber})
Platform: ${platform} ${osVersion}
Device: ${deviceName}
      `.trim();

      setDeviceInfo(info);
    } catch (error) {
      console.error('Error loading device info:', error);
      setDeviceInfo('Device info unavailable');
    }
  };

  const handleSendFeedback = async () => {
    if (!message.trim()) {
      Alert.alert(
        i18n.t('feedback.errors.title'),
        i18n.t('feedback.errors.emptyMessage')
      );
      return;
    }

    const typeLabel = i18n.t(`feedback.types.${feedbackType}`);
    const subject = `PACE ${typeLabel}`;
    const body = `
${i18n.t('feedback.emailBody')}

${message}

---
${i18n.t('feedback.deviceInfoLabel')}
${deviceInfo}
    `.trim();

    const email = 'carolinedanslesnuages@gmail.com';
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      const supported = await Linking.canOpenURL(mailto);
      if (supported) {
        await Linking.openURL(mailto);
        // Clear form and close after sending
        setMessage('');
        setFeedbackType('bug');
        Alert.alert(
          i18n.t('feedback.success.title'),
          i18n.t('feedback.success.message'),
          [{ text: 'OK', onPress: onClose }]
        );
      } else {
        Alert.alert(
          i18n.t('feedback.errors.title'),
          i18n.t('feedback.errors.emailNotSupported')
        );
      }
    } catch (error) {
      console.error('Error opening email client:', error);
      Alert.alert(
        i18n.t('feedback.errors.title'),
        i18n.t('feedback.errors.sendFailed')
      );
    }
  };

  const handleClose = () => {
    // Ask for confirmation if there's unsaved content
    if (message.trim()) {
      Alert.alert(
        i18n.t('feedback.confirmClose.title'),
        i18n.t('feedback.confirmClose.message'),
        [
          {
            text: i18n.t('feedback.confirmClose.cancel'),
            style: 'cancel',
          },
          {
            text: i18n.t('feedback.confirmClose.confirm'),
            onPress: () => {
              setMessage('');
              setFeedbackType('bug');
              onClose();
            },
            style: 'destructive',
          },
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{i18n.t('feedback.title')}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.subtitle}>{i18n.t('feedback.subtitle')}</Text>

            {/* Feedback Type Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{i18n.t('feedback.typeLabel')}</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    feedbackType === 'bug' && styles.typeButtonActive,
                  ]}
                  onPress={() => setFeedbackType('bug')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      feedbackType === 'bug' && styles.typeButtonTextActive,
                    ]}
                  >
                    🐛 {i18n.t('feedback.types.bug')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    feedbackType === 'idea' && styles.typeButtonActive,
                  ]}
                  onPress={() => setFeedbackType('idea')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      feedbackType === 'idea' && styles.typeButtonTextActive,
                    ]}
                  >
                    💡 {i18n.t('feedback.types.idea')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    feedbackType === 'other' && styles.typeButtonActive,
                  ]}
                  onPress={() => setFeedbackType('other')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      feedbackType === 'other' && styles.typeButtonTextActive,
                    ]}
                  >
                    💬 {i18n.t('feedback.types.other')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Message Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{i18n.t('feedback.messageLabel')}</Text>
              <TextInput
                style={styles.messageInput}
                placeholder={i18n.t('feedback.messagePlaceholder')}
                placeholderTextColor={colors.textDisabled}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>

            {/* Device Info Preview */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{i18n.t('feedback.deviceInfoLabel')}</Text>
              <View style={styles.deviceInfoBox}>
                <Text style={styles.deviceInfoText}>{deviceInfo}</Text>
              </View>
              <Text style={styles.privacyNote}>{i18n.t('feedback.privacyNote')}</Text>
            </View>

            {/* Send Button */}
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendFeedback}
              activeOpacity={0.7}
            >
              <Text style={styles.sendButtonText}>{i18n.t('feedback.sendButton')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: 60,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeButtonText: {
    fontSize: 28,
    color: colors.textInverse,
    fontWeight: typography.fontWeight.regular,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  subtitle: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.h4,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  typeButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  typeButtonTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  messageInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    minHeight: 150,
    ...elevation.low,
  },
  deviceInfoBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deviceInfoText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 18,
  },
  privacyNote: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textDisabled,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
    ...elevation.medium,
  },
  sendButtonText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
  },
});
