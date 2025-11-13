import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import i18n from '../utils/i18n';

interface ZeroSpendingModalProps {
  visible: boolean;
  onClose: () => void;
  currentDailyBudget: number;
  newDailyBudget: number;
  daysRemaining: number;
  formatCurrency: (amount: number) => string;
}

export default function ZeroSpendingModal({
  visible,
  onClose,
  currentDailyBudget,
  newDailyBudget,
  daysRemaining,
  formatCurrency,
}: ZeroSpendingModalProps) {
  const { colors } = useTheme();

  const getDaysRemainingText = () => {
    if (daysRemaining > 1) {
      return `${daysRemaining} ${i18n.t('dashboard.zeroSpending.remainingDays')}`;
    }
    return `${daysRemaining} ${i18n.t('dashboard.zeroSpending.remainingDay')}`;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          {/* Celebration Title */}
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
            {i18n.t('dashboard.zeroSpending.modalTitle')}
          </Text>

          {/* Today's Budget Info */}
          <View style={styles.infoSection}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {i18n.t('dashboard.zeroSpending.todayBudget')}
            </Text>
            <Text style={[styles.amountLarge, { color: colors.primary }]}>
              {formatCurrency(currentDailyBudget)}
            </Text>
          </View>

          {/* Redistribution Explanation */}
          <View style={styles.explanationSection}>
            <Text style={[styles.explanationText, { color: colors.textPrimary }]}>
              {i18n.t('dashboard.zeroSpending.redistributed')} {getDaysRemainingText()}.
            </Text>
          </View>

          {/* New Daily Budget */}
          <View style={[styles.highlightBox, { backgroundColor: colors.success + '20' }]}>
            <Text style={[styles.highlightLabel, { color: colors.textSecondary }]}>
              {i18n.t('dashboard.zeroSpending.newDailyBudget')}
            </Text>
            <Text style={[styles.amountHighlight, { color: colors.success }]}>
              {formatCurrency(newDailyBudget)}
            </Text>
          </View>

          {/* Savings Option */}
          <View style={[styles.savingsBox, { backgroundColor: colors.warning + '15' }]}>
            <Text style={[styles.savingsIcon]}>💎</Text>
            <Text style={[styles.savingsLabel, { color: colors.textSecondary }]}>
              {i18n.t('dashboard.zeroSpending.potentialSavings')}
            </Text>
            <Text style={[styles.savingsAmount, { color: colors.warning }]}>
              {formatCurrency(currentDailyBudget)}
            </Text>
            <Text style={[styles.savingsHint, { color: colors.textSecondary }]}>
              {i18n.t('dashboard.zeroSpending.orSave')}
            </Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.primary }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>
              {i18n.t('dashboard.zeroSpending.close')}
            </Text>
          </TouchableOpacity>
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
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  infoLabel: {
    fontSize: typography.fontSize.body,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  amountLarge: {
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.bold,
  },
  explanationSection: {
    marginBottom: spacing.lg,
  },
  explanationText: {
    fontSize: typography.fontSize.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  highlightBox: {
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  highlightLabel: {
    fontSize: typography.fontSize.bodySmall,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  amountHighlight: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
  },
  savingsBox: {
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  savingsIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  savingsLabel: {
    fontSize: typography.fontSize.bodySmall,
    marginBottom: spacing.xs,
  },
  savingsAmount: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  savingsHint: {
    fontSize: typography.fontSize.bodySmall,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  closeButton: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
  },
});
