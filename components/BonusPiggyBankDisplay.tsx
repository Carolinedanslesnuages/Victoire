import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, elevation } from '../constants/theme';
import i18n from '../utils/i18n';

interface BonusPiggyBankDisplayProps {
  amount: number;
  monthlyBonus: number;
  formatCurrency: (amount: number) => string;
  onPress: () => void;
}

export default function BonusPiggyBankDisplay({
  amount,
  monthlyBonus,
  formatCurrency,
  onPress,
}: BonusPiggyBankDisplayProps) {
  // Don't show if there's no bonus yet
  if (amount <= 0) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>🎉</Text>
          <Text style={styles.title}>
            {i18n.t('dashboard.bonusPiggyBank.title')}
          </Text>
        </View>

        <Text style={styles.amount}>
          {formatCurrency(amount)}
        </Text>

        <Text style={styles.description}>
          {i18n.t('dashboard.bonusPiggyBank.displayLabel', {
            amount: formatCurrency(monthlyBonus),
          })}
        </Text>

        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>
            {i18n.t('dashboard.bonusPiggyBank.breakButton')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...elevation.small,
    borderWidth: 2,
    borderColor: colors.success,
  },
  content: {
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  amount: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  buttonContainer: {
    backgroundColor: colors.success,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
});
