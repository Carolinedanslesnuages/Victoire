import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import BudgetRing from './BudgetRing';
import PieChart from './PieChart';
import MascotDisplay from './MascotDisplay';
import BadgeUnlockModal from './BadgeUnlockModal';
import ZeroSpendingModal from './ZeroSpendingModal';
import BudgetSwitcher from './BudgetSwitcher';
import BonusPiggyBankDisplay from './BonusPiggyBankDisplay';
import BonusPiggyBankModal from './BonusPiggyBankModal';
import TooltipOverlay from './TooltipOverlay';
import {
  calculateDailyBudget,
  getDaysRemainingInCycle,
  calculateBudgetStatus,
  calculateSpentPercentage,
} from '../utils/budgetCalculations';
import {
  getTransactionsForPreviousCycleSameDay,
  deleteTransaction,
  loadUserPreferences,
  getTransactionsForBudget,
  getBonusPiggyBank,
  breakBonusPiggyBank,
  hasCompletedOnboardingTooltips,
  markOnboardingTooltipsCompleted,
} from '../utils/storage';
import {
  calculateCategorySpending,
  getTopCategories,
  compareMonthlySpending,
} from '../utils/analytics';
import { getMascotState } from '../utils/mascot';
import { BudgetProfile, Transaction, UserPreferences, StreakInfo, Badge, BonusPiggyBank } from '../types';
import { colors, typography, spacing, borderRadius, elevation, opacity } from '../constants/theme';
import i18n from '../utils/i18n';
import { formatCurrency as formatCurrencyUtil } from '../utils/currency';
import { calculateStreak } from '../utils/streaks';
import { checkAndUnlockBadges, unlockBadge } from '../utils/gamification';
import { getAvatarEmoji } from '../constants/avatars';
import { processUnspentDailyBudget, getCurrentMonthBonus } from '../utils/bonusPiggyBank';

interface BudgetDashboardProps {
  profile: BudgetProfile;
  onReconfigure: () => void;
  refreshKey?: number;
  onBudgetChange?: () => void;
}

export default function BudgetDashboard({ profile, onReconfigure, refreshKey, onBudgetChange }: BudgetDashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [previousTransactions, setPreviousTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    currency: 'EUR',
    customCategories: [],
  });
  const [streakInfo, setStreakInfo] = useState<StreakInfo>({
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: '',
    isActive: false,
    streakFreezes: 2,
    jokersRemaining: 3,
  });
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showZeroSpendingModal, setShowZeroSpendingModal] = useState(false);
  const [showBudgetSwitcher, setShowBudgetSwitcher] = useState(false);
  const [bonusPiggyBank, setBonusPiggyBank] = useState<BonusPiggyBank>({
    amount: 0,
    lastProcessedDate: '',
    monthlyHistory: [],
  });
  const [showBonusPiggyBankModal, setShowBonusPiggyBankModal] = useState(false);
  const [monthlyBonus, setMonthlyBonus] = useState(0);
  const [showTooltips, setShowTooltips] = useState(false);

  useEffect(() => {
    loadTransactions();
    loadPreferences();
    loadStreak();
    loadBonusPiggyBank();
    checkTooltips();
  }, [profile.id, profile.cycleStartDay, refreshKey]);

  const checkTooltips = async () => {
    const tooltipsCompleted = await hasCompletedOnboardingTooltips();
    if (!tooltipsCompleted) {
      // Small delay to let the dashboard render first
      setTimeout(() => {
        setShowTooltips(true);
      }, 1000);
    }
  };

  const handleTooltipsComplete = async () => {
    await markOnboardingTooltipsCompleted();
    setShowTooltips(false);
  };

  const loadPreferences = async () => {
    const prefs = await loadUserPreferences();
    setUserPreferences(prefs);
  };

  const loadStreak = async () => {
    const streak = await calculateStreak();
    setStreakInfo(streak);
    
    // Check for newly unlocked badges
    const newBadges = await checkAndUnlockBadges();
    if (newBadges.length > 0) {
      // Show the first badge that was unlocked
      setUnlockedBadge(newBadges[0]);
      setShowBadgeModal(true);
    }
  };

  const loadBonusPiggyBank = async () => {
    // Process any unspent budget from yesterday
    await processUnspentDailyBudget(profile);
    
    // Load the current piggy bank state
    const piggyBank = await getBonusPiggyBank(profile.id);
    setBonusPiggyBank(piggyBank);
    
    // Load current month's bonus
    const currentBonus = await getCurrentMonthBonus(profile.id);
    setMonthlyBonus(currentBonus);
  };

  const loadTransactions = async () => {
    const txns = await getTransactionsForBudget(profile.id, profile.cycleStartDay);
    setTransactions(txns);
    
    // Check for first step badge on first transaction
    if (txns.length === 1) {
      const badge = await unlockBadge('first_step', false);
      if (badge) {
        setUnlockedBadge(badge);
        setShowBadgeModal(true);
      }
    }
    
    // Load previous month transactions for comparison
    const prevTxns = await getTransactionsForPreviousCycleSameDay(profile.cycleStartDay);
    setPreviousTransactions(prevTxns);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    await loadPreferences();
    await loadStreak();
    await loadBonusPiggyBank();
    setRefreshing(false);
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
  // Separate expenses and income
  const totalSpent = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum : sum + t.amount;
  }, 0);
  const totalIncome = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum;
  }, 0);
  
  const resteAVivre = profile.monthlyIncome - profile.fixedCharges - profile.savingsGoal;
  const dailyBudget = calculateDailyBudget(
    profile.monthlyIncome,
    profile.fixedCharges,
    profile.savingsGoal,
    totalSpent,
    profile.cycleStartDay,
    totalIncome,
    profile.midCycleOnboarding
  );
  const daysRemaining = getDaysRemainingInCycle(profile.cycleStartDay);
  const budgetStatus = calculateBudgetStatus(
    profile.monthlyIncome,
    profile.fixedCharges,
    profile.savingsGoal,
    totalSpent,
    profile.cycleStartDay,
    totalIncome
  );
  const spentPercentage = calculateSpentPercentage(
    profile.monthlyIncome,
    profile.fixedCharges,
    profile.savingsGoal,
    totalSpent,
    totalIncome
  );

  const isDailyBudgetNegative = dailyBudget < 0;

  // Epic UI 3: Calculate mascot state based on "Reste à Vivre"
  const mascotState = getMascotState(
    profile.monthlyIncome,
    profile.fixedCharges,
    profile.savingsGoal,
    totalSpent,
    totalIncome
  );

  // Analytics calculations for Epic 6
  const categorySpending = calculateCategorySpending(transactions);
  const topCategories = getTopCategories(categorySpending, 3);
  const monthlyComparison = compareMonthlySpending(transactions, previousTransactions);

  // Helper function for pluralization of "days remaining"
  const getDaysRemainingText = (days: number) => {
    if (days > 1) {
      return `${days} ${i18n.t('dashboard.monthlyHealth.daysRemainingPlural')} ${i18n.t('dashboard.monthlyHealth.remainingPlural')}`;
    }
    return `${days} ${i18n.t('dashboard.monthlyHealth.daysRemaining')} ${i18n.t('dashboard.monthlyHealth.remaining')}`;
  };

  // Handler for zero spending modal
  const handleZeroSpendingClick = () => {
    setShowZeroSpendingModal(true);
  };

  // Handler for bonus piggy bank
  const handleBonusPiggyBankClick = () => {
    if (bonusPiggyBank.amount > 0) {
      setShowBonusPiggyBankModal(true);
    }
  };

  const handleBreakPiggyBank = async () => {
    const amount = await breakBonusPiggyBank(profile.id);
    setShowBonusPiggyBankModal(false);
    
    if (amount > 0) {
      Alert.alert(
        '🎉',
        i18n.t('dashboard.bonusPiggyBank.breakSuccess'),
        [{ text: 'OK' }]
      );
      
      // Reload piggy bank state
      await loadBonusPiggyBank();
    }
  };

  // Check if user has spent anything today
  const hasSpentToday = () => {
    const today = new Date().toDateString();
    return transactions.some(t => 
      new Date(t.date).toDateString() === today && t.type !== 'income'
    );
  };

  // Get budget display name
  const getBudgetDisplayName = () => {
    return profile.name;
  };

  return (
    <View style={styles.container}>
      {/* Badge Unlock Modal */}
      <BadgeUnlockModal
        visible={showBadgeModal}
        badge={unlockedBadge}
        onClose={() => {
          setShowBadgeModal(false);
          setUnlockedBadge(null);
        }}
      />

      {/* Zero Spending Modal */}
      <ZeroSpendingModal
        visible={showZeroSpendingModal}
        onClose={() => setShowZeroSpendingModal(false)}
        currentDailyBudget={dailyBudget}
        newDailyBudget={dailyBudget}
        daysRemaining={daysRemaining}
        formatCurrency={formatCurrency}
      />

      {/* Bonus Piggy Bank Modal */}
      <BonusPiggyBankModal
        visible={showBonusPiggyBankModal}
        amount={bonusPiggyBank.amount}
        formatCurrency={formatCurrency}
        onBreak={handleBreakPiggyBank}
        onClose={() => setShowBonusPiggyBankModal(false)}
      />

      {/* Budget Switcher Modal - shown when avatar is clicked */}
      <BudgetSwitcher
        visible={showBudgetSwitcher}
        onClose={() => setShowBudgetSwitcher(false)}
        onBudgetChange={() => {
          setShowBudgetSwitcher(false);
          if (onBudgetChange) {
            onBudgetChange();
          }
        }}
      />

      {/* Onboarding Tooltips Overlay */}
      <TooltipOverlay
        visible={showTooltips}
        onComplete={handleTooltipsComplete}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Epic UI 4: Duolingo-style Header with Gamification */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {/* Avatar display - clickable to open BudgetSwitcher */}
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={() => setShowBudgetSwitcher(true)}
              activeOpacity={0.7}
              testID="avatar-button"
            >
              <Text style={styles.avatarEmoji}>{getAvatarEmoji(userPreferences.avatarId)}</Text>
            </TouchableOpacity>
            {/* Feature UI 4.1.1 & UI 4.2: Budget name with streak indicator */}
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>{getBudgetDisplayName()}</Text>
              {/* Feature UI 4.2.1: Streak indicator if active */}
              {streakInfo.isActive && streakInfo.currentStreak > 0 && (
                <View style={styles.streakBadge}>
                  <Text style={styles.streakIcon}>🔥</Text>
                  <Text style={styles.streakText}>
                    {streakInfo.currentStreak}
                  </Text>
                </View>
              )}
            </View>
            {/* Feature UI 4.1.2: Settings button on the right */}
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={onReconfigure}
              activeOpacity={0.7}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>
            {i18n.t('dashboard.cycleSubtitle', { day: profile.cycleStartDay })}
          </Text>
        </View>

        {/* Epic UI 3: Feature UI 3.1.1 - Reactive Mascot Display */}
        <View style={styles.mascotCard}>
          <MascotDisplay mascotState={mascotState} showDescription={true} size="medium" />
          <Text style={styles.mascotDescription}>
            {i18n.t(`mascot.descriptions.${mascotState.mood}`)}
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

        {/* Zero Spending Button - Show only if user hasn't spent today and budget is positive */}
        {!hasSpentToday() && dailyBudget > 0 && daysRemaining > 0 && (
          <TouchableOpacity
            style={styles.zeroSpendingButton}
            onPress={handleZeroSpendingClick}
            activeOpacity={0.8}
          >
            <Text style={styles.zeroSpendingButtonText}>
              {i18n.t('dashboard.zeroSpending.button')}
            </Text>
          </TouchableOpacity>
        )}

        {/* Bonus Piggy Bank Display - Show if there's accumulated bonus */}
        <BonusPiggyBankDisplay
          amount={bonusPiggyBank.amount}
          monthlyBonus={monthlyBonus}
          formatCurrency={formatCurrency}
          onPress={handleBonusPiggyBankClick}
        />

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

        {/* Epic 6: Analyse & Insights */}
        {transactions.length > 0 && (
          <>
            {/* Feature 6.1: Category Breakdown */}
            <View style={styles.insightsCard}>
              <Text style={styles.cardTitle}>{i18n.t('dashboard.insights.categoryBreakdown.title')}</Text>
              
              {categorySpending.length > 0 ? (
                <>
                  {/* US 6.1.1: Pie Chart */}
                  <View style={styles.pieChartContainer}>
                    <PieChart data={categorySpending} size={200} />
                  </View>

                  {/* US 6.1.2: Top 3 Categories */}
                  <View style={styles.topCategoriesContainer}>
                    <Text style={styles.topCategoriesTitle}>
                      {i18n.t('dashboard.insights.categoryBreakdown.topCategories')}
                    </Text>
                    {topCategories.map((item) => (
                      <View key={item.category} style={styles.categoryItem}>
                        <View style={styles.categoryLeft}>
                          <View
                            style={[
                              styles.categoryColorDot,
                              { backgroundColor: item.color },
                            ]}
                          />
                          <Text style={styles.categoryName}>{item.category}</Text>
                        </View>
                        <View style={styles.categoryRight}>
                          <Text style={styles.categoryAmount}>
                            {formatCurrency(item.amount)}
                          </Text>
                          <Text style={styles.categoryPercentage}>
                            {item.percentage.toFixed(0)}%
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <Text style={styles.noData}>
                  {i18n.t('dashboard.insights.categoryBreakdown.noData')}
                </Text>
              )}
            </View>

            {/* Feature 6.2: Trends - Monthly Comparison */}
            {previousTransactions.length > 0 && (
              <View style={styles.insightsCard}>
                <Text style={styles.cardTitle}>{i18n.t('dashboard.insights.trends.title')}</Text>
                <Text style={styles.insightsSubtitle}>
                  {i18n.t('dashboard.insights.trends.comparison')}
                </Text>

                {/* US 6.2.1: Comparison Chart */}
                <View style={styles.comparisonContainer}>
                  <View style={styles.comparisonItem}>
                    <Text style={styles.comparisonLabel}>
                      {i18n.t('dashboard.insights.trends.currentMonth')}
                    </Text>
                    <Text style={styles.comparisonSubLabel}>
                      {i18n.t('dashboard.insights.trends.sameDate')}
                    </Text>
                    <Text style={[styles.comparisonAmount, { color: colors.primary }]}>
                      {formatCurrency(monthlyComparison.currentMonth)}
                    </Text>
                  </View>

                  <View style={styles.comparisonDivider} />

                  <View style={styles.comparisonItem}>
                    <Text style={styles.comparisonLabel}>
                      {i18n.t('dashboard.insights.trends.previousMonth')}
                    </Text>
                    <Text style={styles.comparisonSubLabel}>
                      {i18n.t('dashboard.insights.trends.sameDate')}
                    </Text>
                    <Text style={[styles.comparisonAmount, { color: colors.textSecondary }]}>
                      {formatCurrency(monthlyComparison.previousMonth)}
                    </Text>
                  </View>
                </View>

                {/* Comparison indicator */}
                <View
                  style={[
                    styles.comparisonBadge,
                    {
                      backgroundColor:
                        monthlyComparison.difference < 0
                          ? colors.success
                          : monthlyComparison.difference > 0
                          ? colors.warning
                          : colors.info,
                    },
                  ]}
                >
                  <Text style={styles.comparisonBadgeText}>
                    {monthlyComparison.difference < 0
                      ? `${i18n.t('dashboard.insights.trends.better')} ${formatCurrency(
                          Math.abs(monthlyComparison.difference)
                        )} (${Math.abs(monthlyComparison.differencePercentage).toFixed(0)}%)`
                      : monthlyComparison.difference > 0
                      ? `${i18n.t('dashboard.insights.trends.worse')} +${formatCurrency(
                          monthlyComparison.difference
                        )} (+${monthlyComparison.differencePercentage.toFixed(0)}%)`
                      : i18n.t('dashboard.insights.trends.equal')}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}

        {/* Feature 3.2.1: Transaction History - All transactions for current cycle */}
        <View style={styles.transactionsCard}>
          <Text style={styles.cardTitle}>{i18n.t('dashboard.transactions.title')}</Text>
          {transactions.length === 0 ? (
            <Text style={styles.noTransactions}>
              {i18n.t('dashboard.transactions.noTransactions')}
            </Text>
          ) : (
            transactions.slice().reverse().map((transaction) => {
              const isIncome = transaction.type === 'income';
              return (
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
                    {transaction.isRecurring && (
                      <Text style={styles.transactionRecurring}>
                        🔄 {i18n.t('dashboard.transactions.recurring')}
                      </Text>
                    )}
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={[
                      styles.transactionAmount,
                      isIncome && styles.transactionAmountIncome
                    ]}>
                      {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
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
              );
            })
          )}
        </View>

        {/* Settings Button */}
        <TouchableOpacity
          style={styles.reconfigButton}
          onPress={onReconfigure}
          activeOpacity={0.7}
        >
          <Text style={styles.reconfigButtonText}>{i18n.t('dashboard.configButton')}</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Epic UI 4: Duolingo-style header styles
  header: {
    padding: spacing.lg,
    paddingTop: 60,
    backgroundColor: colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
    marginRight: spacing.sm,
    flexShrink: 1,
  },
  // Feature UI 4.2.1: Streak badge styles
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  streakIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  streakText: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
  },
  // Feature UI 4.1.2: Settings button styles
  settingsButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  settingsIcon: {
    fontSize: 24,
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
  transactionAmountIncome: {
    color: colors.success, // Green color for income
  },
  transactionRecurring: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  deleteButton: {
    padding: spacing.xs,
    marginTop: spacing.xs,
  },
  deleteButtonText: {
    fontSize: typography.fontSize.body,
  },
  // Epic 6: Insights - Flat design cards
  insightsCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...elevation.low,
  },
  insightsSubtitle: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  noData: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  // Feature 6.1: Category Breakdown
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  topCategoriesContainer: {
    marginTop: spacing.md,
  },
  topCategoriesTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  categoryName: {
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  categoryRight: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  categoryAmount: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
  },
  // Feature 6.2: Trends
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.md,
  },
  comparisonItem: {
    alignItems: 'center',
    flex: 1,
  },
  comparisonLabel: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  comparisonSubLabel: {
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  comparisonAmount: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
  },
  comparisonDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  comparisonBadge: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  comparisonBadgeText: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textInverse,
    textAlign: 'center',
  },
  // Buttons - Flat design with opacity feedback
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
  // Epic UI 3: Mascot card styles
  mascotCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...elevation.low,
  },
  mascotDescription: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  // Zero Spending Button
  zeroSpendingButton: {
    backgroundColor: colors.success,
    margin: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...elevation.medium,
  },
  zeroSpendingButtonText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
  },
});
