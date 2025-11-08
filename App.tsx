import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import ConfigWizard from './components/ConfigWizard';
import MainTabNavigator from './navigation/MainTabNavigator';
import AddExpenseModal from './components/AddExpenseModal';
import StreakCelebration from './components/StreakCelebration';
import { saveBudgetConfig, loadBudgetConfig, saveTransaction, loadUserPreferences, getTransactionsForCurrentCycle } from './utils/storage';
import { BudgetConfig, Transaction, UserPreferences } from './types';
import { colors } from './constants/theme';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { initializeNotifications, sendBudgetAlertNotification } from './utils/notifications';
import { calculateDailyBudget } from './utils/budgetCalculations';
import { updateStreakAfterActivity } from './utils/streaks';
import { triggerSuccessHaptic, triggerWarningHaptic } from './utils/haptics';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig | null>(null);
  const [isAddExpenseVisible, setIsAddExpenseVisible] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    currency: 'EUR',
    customCategories: [],
  });
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    loadConfig();
    loadPreferences();
    initializeNotifications();
  }, []);

  const loadConfig = async () => {
    const config = await loadBudgetConfig();
    setBudgetConfig(config);
    setIsLoading(false);
  };

  const loadPreferences = async () => {
    const prefs = await loadUserPreferences();
    setUserPreferences(prefs);
  };

  const handleConfigComplete = async (config: BudgetConfig) => {
    const success = await saveBudgetConfig(config);
    if (success) {
      setBudgetConfig(config);
    }
  };

  const handleReconfigure = () => {
    setBudgetConfig(null);
  };

  const handleAddExpense = async (expense: Omit<Transaction, 'id'>) => {
    const success = await saveTransaction(expense);
    if (success) {
      setIsAddExpenseVisible(false);
      
      // Update streak and show celebration
      const streakInfo = await updateStreakAfterActivity();
      if (streakInfo.isActive && streakInfo.currentStreak > 0) {
        setCurrentStreak(streakInfo.currentStreak);
        setShowStreakCelebration(true);
      }
      
      // Check if budget went negative and send alert
      if (budgetConfig) {
        const transactions = await getTransactionsForCurrentCycle(budgetConfig.cycleStartDay);
        const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
        const dailyBudget = calculateDailyBudget(
          budgetConfig.monthlyIncome,
          budgetConfig.fixedCharges,
          budgetConfig.savingsGoal,
          totalSpent,
          budgetConfig.cycleStartDay
        );
        
        // US 11.2.1: Haptic feedback based on budget state
        if (dailyBudget < 0) {
          await sendBudgetAlertNotification(dailyBudget, userPreferences.currency);
          // Warning haptic when budget goes into the red
          await triggerWarningHaptic();
        } else {
          // Success haptic for normal expense addition
          await triggerSuccessHaptic();
        }
      } else {
        // Success haptic if no budget config
        await triggerSuccessHaptic();
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <SubscriptionProvider>
        <NavigationContainer>
          <View style={styles.container}>
            {budgetConfig ? (
              <>
                <MainTabNavigator
                  budgetConfig={budgetConfig}
                  onReconfigure={handleReconfigure}
                  onAddExpense={() => setIsAddExpenseVisible(true)}
                />
                <AddExpenseModal
                  visible={isAddExpenseVisible}
                  onClose={() => setIsAddExpenseVisible(false)}
                  onAddExpense={handleAddExpense}
                  customCategories={userPreferences.customCategories}
                />
                <StreakCelebration
                  visible={showStreakCelebration}
                  streakCount={currentStreak}
                  onComplete={() => setShowStreakCelebration(false)}
                />
              </>
            ) : (
              <ConfigWizard onComplete={handleConfigComplete} />
            )}
            <StatusBar style="auto" />
          </View>
        </NavigationContainer>
      </SubscriptionProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
