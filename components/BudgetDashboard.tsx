import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import BudgetRing from './BudgetRing';
import AddExpenseModal from './AddExpenseModal';
import SettingsScreen from './SettingsScreen';
import {
  calculateDailyBudget,
  getDaysRemainingInCycle,
  calculateBudgetStatus,
  calculateSpentPercentage,
} from '../utils/budgetCalculations';
import {
  saveTransaction,
  getTransactionsForCurrentCycle,
  deleteTransaction,
  loadUserPreferences,
} from '../utils/storage';
import { BudgetConfig, Transaction, UserPreferences } from '../types';
import { colors, typography, spacing, borderRadius, elevation, opacity } from '../constants/theme';
import i18n from '../utils/i18n';
import { formatCurrency as formatCurrencyUtil } from '../utils/currency';

interface BudgetDashboardProps {
  config: BudgetConfig;
  onReconfigure: () => void;
}

export default function BudgetDashboard({ config, onReconfigure }: BudgetDashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddExpenseVisible, setIsAddExpenseVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    currency: 'EUR',
    customCategories: [],
  });

  useEffect(() => {
    loadTransactions();
    loadPreferences();
  }, [config.cycleStartDay]);

  const loadPreferences = async () => {
    const prefs = await loadUserPreferences();
    setUserPreferences(prefs);
  };

  const loadTransactions = async () => {
    const txns = await getTransactionsForCurrentCycle(config.cycleStartDay);
    setTransactions(txns);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    await loadPreferences();
    setRefreshing(false);
  };

  const handleAddExpense = async (expense: Omit<Transaction, 'id'>) => {
    const success = await saveTransaction(expense);
    if (success) {
      await loadTransactions();
    }
  };

  const handleSettingsClose = async () => {
    setIsSettingsVisible(false);
    await loadPreferences();
  };

  const handleResetComplete = () => {
    // When reset is complete, trigger reconfigure to restart the app
    onReconfigure();
  };

  const handleDeleteExpense = (transaction: Transaction) => {
    Alert.alert(
      i18n.t('dashboard.deleteExpense.title'),
      i18n.t('dashboard.deleteExpense.message', { 
        amount: formatCurrency(transaction.amount), 
        description: transaction.description 
      }),
      [
        {
          text: i18n.t('dashboard.deleteExpense.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('dashboard.deleteExpense.confirm'),
          style: 'destructive',
          onPress: async () => {
            const success = await deleteTransaction(transaction.id);
            if (success) {
              await loadTransactions();
            }
          },
        },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    // Get current locale from i18n, default to 'fr-FR'
    const locale = i18n.locale.startsWith('en') ? 'en-US' : 'fr-FR';
    return formatCurrencyUtil(amount, userPreferences.currency, locale);
  };

  // Calculate values
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const resteAVivre = config.monthlyIncome - config.fixedCharges - config.savingsGoal;
  const dailyBudget = calculateDailyBudget(
    config.monthlyIncome,
    config.fixedCharges,
    config.savingsGoal,
    totalSpent,
    config.cycleStartDay
  );
  const daysRemaining = getDaysRemainingInCycle(config.cycleStartDay);
  const budgetStatus = calculateBudgetStatus(
    config.monthlyIncome,
    config.fixedCharges,
    config.savingsGoal,
    totalSpent,
    config.cycleStartDay
  );
  const spentPercentage = calculateSpentPercentage(
    config.monthlyIncome,
    config.fixedCharges,
    config.savingsGoal,
    totalSpent
  );

  const isDailyBudgetNegative = dailyBudget < 0;

  // Helper function for pluralization of "days remaining"
  const getDaysRemainingText = (days: number) => {
    if (days > 1) {
      return `${days} ${i18n.t('dashboard.monthlyHealth.daysRemainingPlural')} ${i18n.t('dashboard.monthlyHealth.remainingPlural')}`;
    }
    return `${days} ${i18n.t('dashboard.monthlyHealth.daysRemaining')} ${i18n.t('dashboard.monthlyHealth.remaining')}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{i18n.t('dashboard.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {i18n.t('dashboard.cycleSubtitle', { day: config.cycleStartDay })}
          </Text>
        </View>

        {/* Feature 2.1.1 & 2.1.2: Budget du Jour - Very Prominent Display */}
        <View
          style={[
            styles.dailyBudgetCard,
            isDailyBudgetNegative && styles.dailyBudgetCardNegative,
          ]}
        >
          <Text style={styles.dailyBudgetLabel}>{i18n.t('dashboard.dailyBudget.label')}</Text>
          <Text
            style={[
              styles.dailyBudgetAmount,
              isDailyBudgetNegative && styles.dailyBudgetAmountNegative,
            ]}
          >
            {formatCurrency(dailyBudget)}
          </Text>
          {isDailyBudgetNegative && (
            <Text style={styles.dailyBudgetWarning}>
              {i18n.t('dashboard.dailyBudget.warning')}
            </Text>
          )}
          <Text style={styles.dailyBudgetHint}>
            {i18n.t('dashboard.dailyBudget.hint')}
          </Text>
        </View>

        {/* Feature 2.2: Monthly Health Indicator */}
        <View style={styles.monthlyHealthCard}>
          <Text style={styles.cardTitle}>{i18n.t('dashboard.monthlyHealth.title')}</Text>

          {/* Feature 2.2.1: Days Remaining */}
          <View style={styles.daysRemainingContainer}>
            <Text style={styles.daysRemainingNumber}>{daysRemaining}</Text>
            <Text style={styles.daysRemainingLabel}>
              {getDaysRemainingText(daysRemaining)}
            </Text>
          </View>

          {/* Feature 2.2.2: Ring Chart */}
          <View style={styles.ringChartContainer}>
            <BudgetRing
              percentage={spentPercentage}
              size={160}
              strokeWidth={16}
              color={budgetStatus.color}
              backgroundColor="#E0E0E0"
            />
            <View style={styles.ringChartCenter}>
              <Text style={styles.ringChartPercentage}>
                {Math.round(spentPercentage)}%
              </Text>
              <Text style={styles.ringChartLabel}>{i18n.t('dashboard.monthlyHealth.spent')}</Text>
            </View>
          </View>

          <View style={styles.budgetSummary}>
            <View style={styles.budgetSummaryItem}>
              <Text style={styles.budgetSummaryLabel}>{i18n.t('dashboard.monthlyHealth.spentLabel')}</Text>
              <Text style={[styles.budgetSummaryAmount, { color: colors.error }]}>
                {formatCurrency(totalSpent)}
              </Text>
            </View>
            <View style={styles.budgetSummaryItem}>
              <Text style={styles.budgetSummaryLabel}>{i18n.t('dashboard.monthlyHealth.remainingLabel')}</Text>
              <Text style={[styles.budgetSummaryAmount, { color: colors.success }]}>
                {formatCurrency(Math.max(0, resteAVivre - totalSpent))}
              </Text>
            </View>
          </View>

          {/* Feature 2.2.3: Status Indicator */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: budgetStatus.color },
            ]}
          >
            <Text style={styles.statusBadgeText}>{budgetStatus.label}</Text>
          </View>
        </View>

        {/* Feature 3.2.1: Transaction History - All transactions for current cycle */}
        <View style={styles.transactionsCard}>
          <Text style={styles.cardTitle}>{i18n.t('dashboard.transactions.title')}</Text>
          {transactions.length === 0 ? (
            <Text style={styles.noTransactions}>
              {i18n.t('dashboard.transactions.noTransactions')}
            </Text>
          ) : (
            transactions.slice().reverse().map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  {transaction.category && (
                    <Text style={styles.transactionCategory}>
                      {transaction.category}
                    </Text>
                  )}
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleDateString(i18n.locale)}
                  </Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.transactionAmount}>
                    -{formatCurrency(transaction.amount)}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteExpense(transaction)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Settings Button */}
        <TouchableOpacity
          style={styles.configButton}
          onPress={() => setIsSettingsVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.configButtonText}>{i18n.t('dashboard.settingsButton')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reconfigButton}
          onPress={onReconfigure}
          activeOpacity={0.7}
        >
          <Text style={styles.reconfigButtonText}>{i18n.t('dashboard.configButton')}</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAddExpenseVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <AddExpenseModal
        visible={isAddExpenseVisible}
        onClose={() => setIsAddExpenseVisible(false)}
        onAddExpense={handleAddExpense}
        customCategories={userPreferences.customCategories}
      />

      {/* Settings Screen */}
      <SettingsScreen
        visible={isSettingsVisible}
        onClose={handleSettingsClose}
        onResetComplete={handleResetComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingTop: 60,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textInverse,
    opacity: opacity.active,
  },
  // Feature 2.1: Daily Budget Card - Flat design with minimal elevation
  dailyBudgetCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...elevation.low,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  dailyBudgetCardNegative: {
    borderLeftColor: colors.error,
    backgroundColor: colors.surface,
  },
  dailyBudgetLabel: {
    fontSize: typography.fontSize.h4,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  dailyBudgetAmount: {
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    marginBottom: spacing.sm,
  },
  dailyBudgetAmountNegative: {
    color: colors.error,
  },
  dailyBudgetWarning: {
    fontSize: typography.fontSize.body,
    color: colors.error,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  dailyBudgetHint: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Feature 2.2: Monthly Health Card - Minimalist flat card
  monthlyHealthCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...elevation.low,
  },
  cardTitle: {
    fontSize: typography.fontSize.h4,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  daysRemainingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  daysRemainingNumber: {
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  daysRemainingLabel: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
  },
  ringChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
    position: 'relative',
  },
  ringChartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringChartPercentage: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  ringChartLabel: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
  },
  budgetSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  budgetSummaryItem: {
    alignItems: 'center',
  },
  budgetSummaryLabel: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  budgetSummaryAmount: {
    fontSize: typography.fontSize.h4,
    fontWeight: typography.fontWeight.bold,
  },
  statusBadge: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  statusBadgeText: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
  },
  // Transactions - Minimalist card
  transactionsCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...elevation.low,
  },
  noTransactions: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: typography.fontSize.caption,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  transactionAmount: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  deleteButton: {
    padding: spacing.xs,
    marginTop: spacing.xs,
  },
  deleteButtonText: {
    fontSize: typography.fontSize.body,
  },
  // Buttons - Flat design with opacity feedback
  addButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.medium,
  },
  addButtonText: {
    fontSize: 36,
    color: colors.textInverse,
    fontWeight: typography.fontWeight.regular,
  },
  configButton: {
    backgroundColor: colors.primary,
    margin: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...elevation.low,
  },
  configButtonText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
  },
  reconfigButton: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  reconfigButtonText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.medium,
  },
});
