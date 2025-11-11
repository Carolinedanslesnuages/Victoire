import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import ConfigWizard from './components/ConfigWizard';
import MainTabNavigator from './navigation/MainTabNavigator';
import AddExpenseModal from './components/AddExpenseModal';
import StreakCelebration from './components/StreakCelebration';
import { 
  saveBudgetConfig, 
  loadBudgetConfig, 
  saveTransaction, 
  loadUserPreferences, 
  processRecurringTransactions,
  loadBudgetProfiles,
  getActiveBudgetProfile,
  createBudgetProfile,
  updateBudgetProfile,
  getTransactionsForBudget
} from './utils/storage';
import { BudgetConfig, BudgetProfile, Transaction, UserPreferences } from './types';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { initializeNotifications, sendBudgetAlertNotification } from './utils/notifications';
import { calculateDailyBudget } from './utils/budgetCalculations';
import { updateStreakAfterActivity } from './utils/streaks';
import { triggerSuccessHaptic, triggerWarningHaptic } from './utils/haptics';
import { updateWidgetData } from './utils/widgetData';
import { setupQuickActions } from './utils/quickActions';

function AppContent() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [budgetProfile, setBudgetProfile] = useState<BudgetProfile | null>(null);
  const [isAddExpenseVisible, setIsAddExpenseVisible] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    currency: 'EUR',
    customCategories: [],
  });
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<BudgetProfile | null>(null);

  useEffect(() => {
    loadProfile();
    loadPreferences();
    initializeNotifications();
    processRecurringTransactionsOnLoad();
    setupQuickActions(handleQuickAction);
  }, []);

  const loadProfile = async () => {
    // Try to load the active budget profile
    const profile = await getActiveBudgetProfile();
    
    if (profile) {
      setBudgetProfile(profile);
      // Update widget data when profile loads
      await updateWidgetData();
    } else {
      // Check if there's an old config to migrate
      const oldConfig = await loadBudgetConfig();
      if (oldConfig) {
        // Migration already handled in loadBudgetProfiles
        const profiles = await loadBudgetProfiles();
        if (profiles.length > 0) {
          setBudgetProfile(profiles[0]);
          await updateWidgetData();
        }
      }
    }
    
    setIsLoading(false);
  };

  const loadPreferences = async () => {
    const prefs = await loadUserPreferences();
    setUserPreferences(prefs);
  };

  const processRecurringTransactionsOnLoad = async () => {
    const profile = await getActiveBudgetProfile();
    if (profile) {
      await processRecurringTransactions(profile.cycleStartDay);
    }
  };

  const handleConfigComplete = async (config: BudgetConfig) => {
    // Check if we're updating an existing profile
    if ((config as any).profileId) {
      const profileId = (config as any).profileId;
      const success = await updateBudgetProfile(profileId, {
        monthlyIncome: config.monthlyIncome,
        fixedCharges: config.fixedCharges,
        savingsGoal: config.savingsGoal,
        cycleStartDay: config.cycleStartDay,
      });
      
      if (success) {
        // Reload the updated profile
        const updatedProfile = await getActiveBudgetProfile();
        setBudgetProfile(updatedProfile);
        setIsEditMode(false);
        setProfileToEdit(null);
        await updateWidgetData();
        setRefreshKey(prev => prev + 1);
      }
    } else {
      // Create a new personal budget profile from the config
      const profile = await createBudgetProfile({
        type: 'personal',
        name: config.budgetName || 'Personnel',
        monthlyIncome: config.monthlyIncome,
        fixedCharges: config.fixedCharges,
        savingsGoal: config.savingsGoal,
        cycleStartDay: config.cycleStartDay,
      });
      
      if (profile) {
        setBudgetProfile(profile);
        // Also save to old format for backward compatibility
        await saveBudgetConfig(config);
      }
    }
  };

  const handleReconfigure = () => {
    // Store the current profile for editing
    setProfileToEdit(budgetProfile);
    setIsEditMode(true);
    setBudgetProfile(null);
  };

  const handleCancelEdit = () => {
    // Restore the profile without changes
    if (profileToEdit) {
      setBudgetProfile(profileToEdit);
      setProfileToEdit(null);
      setIsEditMode(false);
    }
  };

  const handleBudgetChange = async () => {
    // Reload the active budget profile
    const profile = await getActiveBudgetProfile();
    setBudgetProfile(profile);
    // Update widget data when budget changes
    await updateWidgetData();
    // Force refresh of all components
    setRefreshKey(prev => prev + 1);
  };

  const handleQuickAction = (actionType: string) => {
    if (actionType === 'add_expense') {
      setIsAddExpenseVisible(true);
    }
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
      if (budgetProfile) {
        const transactions = await getTransactionsForBudget(
          budgetProfile.id,
          budgetProfile.cycleStartDay
        );
        const totalSpent = transactions.reduce((sum, t) => {
          return t.type === 'income' ? sum : sum + t.amount;
        }, 0);
        const totalIncome = transactions.reduce((sum, t) => {
          return t.type === 'income' ? sum + t.amount : sum;
        }, 0);
        const dailyBudget = calculateDailyBudget(
          budgetProfile.monthlyIncome,
          budgetProfile.fixedCharges,
          budgetProfile.savingsGoal,
          totalSpent,
          budgetProfile.cycleStartDay,
          totalIncome
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
        // Success haptic if no budget profile
        await triggerSuccessHaptic();
      }
      
      // Update widget data after transaction
      await updateWidgetData();
      
      // Force refresh
      setRefreshKey(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SubscriptionProvider>
      <NavigationContainer>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {budgetProfile ? (
            <>
              <MainTabNavigator
                budgetProfile={budgetProfile}
                onReconfigure={handleReconfigure}
                onAddExpense={() => setIsAddExpenseVisible(true)}
                onBudgetChange={handleBudgetChange}
                refreshKey={refreshKey}
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
            <ConfigWizard 
              onComplete={handleConfigComplete} 
              mode={isEditMode ? 'edit' : 'create'}
              existingProfile={profileToEdit || undefined}
              onCancel={isEditMode ? handleCancelEdit : undefined}
            />
          )}
          <StatusBar style={colors.textPrimary === '#212121' ? 'dark' : 'light'} />
        </View>
      </NavigationContainer>
    </SubscriptionProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
