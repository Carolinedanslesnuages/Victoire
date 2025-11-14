import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, typography, spacing, borderRadius, elevation } from '../constants/theme';
import i18n from '../utils/i18n';

interface BonusPiggyBankModalProps {
  visible: boolean;
  amount: number;
  formatCurrency: (amount: number) => string;
  onBreak: () => void;
  onClose: () => void;
}

export default function BonusPiggyBankModal({
  visible,
  amount,
  formatCurrency,
  onBreak,
  onClose,
}: BonusPiggyBankModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>
              {i18n.t('dashboard.bonusPiggyBank.breakModalTitle')}
            </Text>

            <Text style={styles.modalMessage}>
              {i18n.t('dashboard.bonusPiggyBank.breakModalMessage', {
                amount: formatCurrency(amount),
              })}
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>
                💡 {i18n.t('dashboard.bonusPiggyBank.howItWorks')}
              </Text>
              <Text style={styles.infoText}>
                {i18n.t('dashboard.bonusPiggyBank.howItWorksText')}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.breakButton]}
                onPress={onBreak}
              >
                <Text style={styles.breakButtonText}>
                  {i18n.t('dashboard.bonusPiggyBank.breakConfirm')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>
                  {i18n.t('dashboard.bonusPiggyBank.breakCancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    ...elevation.medium,
  },
  modalTitle: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 24,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  breakButton: {
    backgroundColor: colors.success,
  },
  breakButtonText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.medium,
  },
});
