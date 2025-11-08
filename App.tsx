import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import ConfigWizard from './components/ConfigWizard';
import MainTabNavigator from './navigation/MainTabNavigator';
import AddExpenseModal from './components/AddExpenseModal';
import { saveBudgetConfig, loadBudgetConfig, saveTransaction, loadUserPreferences, getTransactionsForCurrentCycle } from './utils/storage';
import { BudgetConfig, Transaction, UserPreferences } from './types';
import { colors } from './constants/theme';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { initializeNotifications, sendBudgetAlertNotification } from './utils/notifications';
import { calculateDailyBudget } from './utils/budgetCalculations';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig | null>(null);
  const [isAddExpenseVisible, setIsAddExpenseVisible] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    currency: 'EUR',
    customCategories: [],
  });

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
        
        if (dailyBudget < 0) {
          await sendBudgetAlertNotification(dailyBudget, userPreferences.currency);
        }
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
            </>
          ) : (
            <ConfigWizard onComplete={handleConfigComplete} />
          )}
          <StatusBar style="auto" />
        </View>
      </NavigationContainer>
    </SubscriptionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
