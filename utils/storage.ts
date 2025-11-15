import AsyncStorage from '@react-native-async-storage/async-storage';
import { BudgetConfig, BudgetProfile, Transaction, UserPreferences, BonusPiggyBank } from '../types';
import { getDefaultNotificationSettings } from './notifications';

const BUDGET_CONFIG_KEY = '@pace_budget_config';
const TRANSACTIONS_KEY = '@pace_transactions';
const USER_PREFERENCES_KEY = '@pace_user_preferences';
const BUDGET_PROFILES_KEY = '@pace_budget_profiles';
const ACTIVE_BUDGET_ID_KEY = '@pace_active_budget_id';
const BONUS_PIGGY_BANK_KEY = '@pace_bonus_piggy_bank';

/**
 * Save budget configuration to local storage
 * @param config - Budget configuration object
 * @returns Success status
 */
export const saveBudgetConfig = async (config: BudgetConfig): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(config);
    await AsyncStorage.setItem(BUDGET_CONFIG_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving budget config:', error);
    return false;
  }
};

/**
 * Load budget configuration from local storage
 * @returns Budget configuration or null if not found
 */
export const loadBudgetConfig = async (): Promise<BudgetConfig | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(BUDGET_CONFIG_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading budget config:', error);
    return null;
  }
};

/**
 * Clear budget configuration from local storage
 * @returns Success status
 */
export const clearBudgetConfig = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(BUDGET_CONFIG_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing budget config:', error);
    return false;
  }
};

/**
 * Save a new transaction
 * @param transaction - Transaction object (without id)
 * @param budgetId - Optional budget ID (if not provided, uses active budget)
 * @returns Success status
 */
export const saveTransaction = async (
  transaction: Omit<Transaction, 'id'>,
  budgetId?: string
): Promise<boolean> => {
  try {
    const transactions = await loadTransactions();
    
    // If no budgetId provided, use the active budget
    let finalBudgetId = budgetId;
    if (!finalBudgetId) {
      finalBudgetId = await getActiveBudgetId() || undefined;
    }
    
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: transaction.date || new Date().toISOString(),
      budgetId: finalBudgetId,
    };
    transactions.push(newTransaction);
    const jsonValue = JSON.stringify(transactions);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving transaction:', error);
    return false;
  }
};

/**
 * Load all transactions from local storage
 * @returns Array of transactions
 */
export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

/**
 * Get transactions for current budget cycle
 * @param cycleStartDay - Day of month when cycle starts
 * @returns Array of transactions in current cycle
 */
export const getTransactionsForCurrentCycle = async (
  cycleStartDay: number
): Promise<Transaction[]> => {
  try {
    const transactions = await loadTransactions();
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    let cycleStart;
    if (day < cycleStartDay) {
      cycleStart = new Date(year, month - 1, cycleStartDay);
    } else {
      cycleStart = new Date(year, month, cycleStartDay);
    }

    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= cycleStart;
    });
  } catch (error) {
    console.error('Error getting transactions for cycle:', error);
    return [];
  }
};

/**
 * Delete a transaction by ID
 * @param id - Transaction ID
 * @returns Success status
 */
export const deleteTransaction = async (id: string): Promise<boolean> => {
  try {
    const transactions = await loadTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    const jsonValue = JSON.stringify(filtered);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return false;
  }
};

/**
 * Load user preferences from local storage
 * @returns User preferences or default values if not found
 */
export const loadUserPreferences = async (): Promise<UserPreferences> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
    if (jsonValue != null) {
      const prefs = JSON.parse(jsonValue);
      // Add default notification settings if not present
      if (!prefs.notificationSettings) {
        prefs.notificationSettings = getDefaultNotificationSettings();
      }
      return prefs;
    }
    // Return default preferences
    return {
      currency: 'EUR',
      customCategories: [],
      notificationSettings: getDefaultNotificationSettings(),
    };
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return {
      currency: 'EUR',
      customCategories: [],
      notificationSettings: getDefaultNotificationSettings(),
    };
  }
};

/**
 * Save user preferences to local storage
 * @param preferences - User preferences object
 * @returns Success status
 */
export const saveUserPreferences = async (preferences: UserPreferences): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(preferences);
    await AsyncStorage.setItem(USER_PREFERENCES_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return false;
  }
};

/**
 * Get transactions for previous budget cycle
 * @param cycleStartDay - Day of month when cycle starts
 * @returns Array of transactions in previous cycle
 */
export const getTransactionsForPreviousCycle = async (
  cycleStartDay: number
): Promise<Transaction[]> => {
  try {
    const transactions = await loadTransactions();
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    // Calculate current cycle start
    let currentCycleStart;
    if (day < cycleStartDay) {
      currentCycleStart = new Date(year, month - 1, cycleStartDay);
    } else {
      currentCycleStart = new Date(year, month, cycleStartDay);
    }

    // Calculate previous cycle start and end
    const previousCycleEnd = new Date(currentCycleStart.getTime() - 1); // One day before current cycle
    const previousCycleStart = new Date(
      currentCycleStart.getFullYear(),
      currentCycleStart.getMonth() - 1,
      cycleStartDay
    );

    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= previousCycleStart && transactionDate <= previousCycleEnd;
    });
  } catch (error) {
    console.error('Error getting transactions for previous cycle:', error);
    return [];
  }
};

/**
 * Get transactions up to same day in previous cycle (for comparison)
 * @param cycleStartDay - Day of month when cycle starts
 * @returns Array of transactions from previous cycle up to same relative day
 */
export const getTransactionsForPreviousCycleSameDay = async (
  cycleStartDay: number
): Promise<Transaction[]> => {
  try {
    const transactions = await loadTransactions();
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    // Calculate current cycle start
    let currentCycleStart;
    if (day < cycleStartDay) {
      currentCycleStart = new Date(year, month - 1, cycleStartDay);
    } else {
      currentCycleStart = new Date(year, month, cycleStartDay);
    }

    // Calculate days elapsed in current cycle
    const daysElapsed = Math.floor(
      (today.getTime() - currentCycleStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate previous cycle start
    const previousCycleStart = new Date(
      currentCycleStart.getFullYear(),
      currentCycleStart.getMonth() - 1,
      cycleStartDay
    );

    // Calculate end date for previous cycle (same number of days elapsed)
    const previousCycleEndDate = new Date(previousCycleStart);
    previousCycleEndDate.setDate(previousCycleEndDate.getDate() + daysElapsed);

    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= previousCycleStart && transactionDate <= previousCycleEndDate;
    });
  } catch (error) {
    console.error('Error getting transactions for previous cycle same day:', error);
    return [];
  }
};

/**
 * Reset all application data (complete factory reset)
 * Removes all keys starting with @pace_ prefix
 * @returns Success status
 */
export const resetAllData = async (): Promise<boolean> => {
  try {
    // Get all keys from AsyncStorage
    const allKeys = await AsyncStorage.getAllKeys();
    // Filter keys that start with @pace_ prefix
    const keysToRemove = allKeys.filter(key => key.startsWith('@pace_'));
    // Remove all application keys
    await AsyncStorage.multiRemove(keysToRemove);
    return true;
  } catch (error) {
    console.error('Error resetting all data:', error);
    return false;
  }
};

/**
 * Get all recurring transactions (templates)
 * @returns Array of recurring transactions
 */
export const getRecurringTransactions = async (): Promise<Transaction[]> => {
  try {
    const transactions = await loadTransactions();
    return transactions.filter(t => t.isRecurring);
  } catch (error) {
    console.error('Error getting recurring transactions:', error);
    return [];
  }
};

/**
 * Check and process recurring transactions for today
 * Creates new transactions for recurring expenses that are due today
 * @param cycleStartDay - Day of month when cycle starts
 * @returns Array of newly created transaction IDs
 */
export const processRecurringTransactions = async (
  cycleStartDay: number
): Promise<string[]> => {
  try {
    const today = new Date();
    const dayOfMonth = today.getDate();
    
    // Get all recurring transactions
    const recurringTemplates = await getRecurringTransactions();
    
    // Get transactions for current cycle to check if already processed today
    const currentTransactions = await getTransactionsForCurrentCycle(cycleStartDay);
    
    const newTransactionIds: string[] = [];
    
    for (const template of recurringTemplates) {
      // Check if this recurring transaction is due today
      if (template.recurringDay === dayOfMonth) {
        // Check if we've already created this transaction today
        const alreadyCreatedToday = currentTransactions.some(t => {
          const transactionDate = new Date(t.date);
          return (
            t.description === template.description &&
            t.amount === template.amount &&
            transactionDate.toDateString() === today.toDateString()
          );
        });
        
        if (!alreadyCreatedToday) {
          // Create a new transaction from this template
          const newTransaction: Omit<Transaction, 'id'> = {
            amount: template.amount,
            description: template.description,
            category: template.category,
            type: template.type || 'expense',
            date: today.toISOString(),
            isRecurring: false, // The created transaction is not itself recurring
          };
          
          const success = await saveTransaction(newTransaction);
          if (success) {
            newTransactionIds.push(`recurring-${template.id}-${today.toISOString()}`);
          }
        }
      }
    }
    
    return newTransactionIds;
  } catch (error) {
    console.error('Error processing recurring transactions:', error);
    return [];
  }
};

// =============================================================================
// Multi-Budget Profile Functions (Epic 25)
// =============================================================================

/**
 * Save all budget profiles to local storage
 * @param profiles - Array of budget profiles
 * @returns Success status
 */
export const saveBudgetProfiles = async (profiles: BudgetProfile[]): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(profiles);
    await AsyncStorage.setItem(BUDGET_PROFILES_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving budget profiles:', error);
    return false;
  }
};

/**
 * Load all budget profiles from local storage
 * @returns Array of budget profiles
 */
export const loadBudgetProfiles = async (): Promise<BudgetProfile[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(BUDGET_PROFILES_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    
    // Migration: Check if old budget config exists and convert it
    const oldConfig = await loadBudgetConfig();
    if (oldConfig) {
      const profile: BudgetProfile = {
        id: 'personal-default',
        type: 'personal',
        name: oldConfig.budgetName || 'Personnel',
        monthlyIncome: oldConfig.monthlyIncome,
        fixedCharges: oldConfig.fixedCharges,
        savingsGoal: oldConfig.savingsGoal,
        cycleStartDay: oldConfig.cycleStartDay,
        createdAt: new Date().toISOString(),
      };
      await saveBudgetProfiles([profile]);
      await setActiveBudgetId(profile.id);
      return [profile];
    }
    
    return [];
  } catch (error) {
    console.error('Error loading budget profiles:', error);
    return [];
  }
};

/**
 * Get a specific budget profile by ID
 * @param id - Budget profile ID
 * @returns Budget profile or null if not found
 */
export const getBudgetProfile = async (id: string): Promise<BudgetProfile | null> => {
  try {
    const profiles = await loadBudgetProfiles();
    return profiles.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error getting budget profile:', error);
    return null;
  }
};

/**
 * Create a new budget profile
 * @param profile - Budget profile to create (without id and createdAt)
 * @returns Created budget profile or null on error
 */
export const createBudgetProfile = async (
  profile: Omit<BudgetProfile, 'id' | 'createdAt'>
): Promise<BudgetProfile | null> => {
  try {
    const profiles = await loadBudgetProfiles();
    const newProfile: BudgetProfile = {
      ...profile,
      id: `${profile.type}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    profiles.push(newProfile);
    const success = await saveBudgetProfiles(profiles);
    
    if (success) {
      // Initialize bonus piggy bank to 0 for new profile
      // Use local date format to prevent timezone issues
      const today = new Date();
      const localDateStr = today.toLocaleDateString('en-CA'); // YYYY-MM-DD format
      
      await saveBonusPiggyBank({
        amount: 0,
        lastProcessedDate: localDateStr,
        monthlyHistory: [],
      }, newProfile.id);
    }
    
    return success ? newProfile : null;
  } catch (error) {
    console.error('Error creating budget profile:', error);
    return null;
  }
};

/**
 * Update an existing budget profile
 * @param id - Budget profile ID
 * @param updates - Partial budget profile updates
 * @returns Success status
 */
export const updateBudgetProfile = async (
  id: string,
  updates: Partial<Omit<BudgetProfile, 'id' | 'createdAt'>>
): Promise<boolean> => {
  try {
    const profiles = await loadBudgetProfiles();
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    profiles[index] = { ...profiles[index], ...updates };
    return await saveBudgetProfiles(profiles);
  } catch (error) {
    console.error('Error updating budget profile:', error);
    return false;
  }
};

/**
 * Delete a budget profile
 * @param id - Budget profile ID
 * @returns Success status
 */
export const deleteBudgetProfile = async (id: string): Promise<boolean> => {
  try {
    const profiles = await loadBudgetProfiles();
    const filtered = profiles.filter(p => p.id !== id);
    
    // Don't allow deleting the last profile
    if (filtered.length === 0) {
      console.warn('Cannot delete the last budget profile');
      return false;
    }
    
    // If deleting the active profile, switch to first remaining profile
    const activeId = await getActiveBudgetId();
    if (activeId === id && filtered.length > 0) {
      await setActiveBudgetId(filtered[0].id);
    }
    
    return await saveBudgetProfiles(filtered);
  } catch (error) {
    console.error('Error deleting budget profile:', error);
    return false;
  }
};

/**
 * Get the active budget profile ID
 * @returns Active budget ID or null if not set
 */
export const getActiveBudgetId = async (): Promise<string | null> => {
  try {
    const id = await AsyncStorage.getItem(ACTIVE_BUDGET_ID_KEY);
    
    // If no active budget is set, try to set the first one
    if (!id) {
      const profiles = await loadBudgetProfiles();
      if (profiles.length > 0) {
        await setActiveBudgetId(profiles[0].id);
        return profiles[0].id;
      }
    }
    
    return id;
  } catch (error) {
    console.error('Error getting active budget ID:', error);
    return null;
  }
};

/**
 * Set the active budget profile ID
 * @param id - Budget profile ID to set as active
 * @returns Success status
 */
export const setActiveBudgetId = async (id: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(ACTIVE_BUDGET_ID_KEY, id);
    return true;
  } catch (error) {
    console.error('Error setting active budget ID:', error);
    return false;
  }
};

/**
 * Get the active budget profile
 * @returns Active budget profile or null if not found
 */
export const getActiveBudgetProfile = async (): Promise<BudgetProfile | null> => {
  try {
    const activeId = await getActiveBudgetId();
    if (!activeId) return null;
    return await getBudgetProfile(activeId);
  } catch (error) {
    console.error('Error getting active budget profile:', error);
    return null;
  }
};

/**
 * Get transactions for a specific budget profile and cycle
 * @param budgetId - Budget profile ID
 * @param cycleStartDay - Day of month when cycle starts
 * @returns Array of transactions
 */
export const getTransactionsForBudget = async (
  budgetId: string,
  cycleStartDay: number
): Promise<Transaction[]> => {
  try {
    const transactions = await loadTransactions();
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    let cycleStart;
    if (day < cycleStartDay) {
      cycleStart = new Date(year, month - 1, cycleStartDay);
    } else {
      cycleStart = new Date(year, month, cycleStartDay);
    }

    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const matchesBudget = t.budgetId === budgetId || (!t.budgetId && budgetId === 'personal-default');
      return matchesBudget && transactionDate >= cycleStart;
    });
  } catch (error) {
    console.error('Error getting transactions for budget:', error);
    return [];
  }
};

// =============================================================================
// Bonus Piggy Bank Functions (Epic 10.4)
// =============================================================================

/**
 * Get the bonus piggy bank data for a specific budget
 * @param budgetId - Budget profile ID (optional, uses active if not provided)
 * @returns Bonus piggy bank data or default values
 */
export const getBonusPiggyBank = async (budgetId?: string): Promise<BonusPiggyBank> => {
  try {
    const finalBudgetId = budgetId || await getActiveBudgetId() || 'personal-default';
    const key = `${BONUS_PIGGY_BANK_KEY}_${finalBudgetId}`;
    const jsonValue = await AsyncStorage.getItem(key);
    
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    
    // Return default piggy bank
    return {
      amount: 0,
      lastProcessedDate: '',
      monthlyHistory: [],
    };
  } catch (error) {
    console.error('Error getting bonus piggy bank:', error);
    return {
      amount: 0,
      lastProcessedDate: '',
      monthlyHistory: [],
    };
  }
};

/**
 * Save the bonus piggy bank data for a specific budget
 * @param piggyBank - Bonus piggy bank data
 * @param budgetId - Budget profile ID (optional, uses active if not provided)
 * @returns Success status
 */
export const saveBonusPiggyBank = async (
  piggyBank: BonusPiggyBank,
  budgetId?: string
): Promise<boolean> => {
  try {
    const finalBudgetId = budgetId || await getActiveBudgetId() || 'personal-default';
    const key = `${BONUS_PIGGY_BANK_KEY}_${finalBudgetId}`;
    const jsonValue = JSON.stringify(piggyBank);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving bonus piggy bank:', error);
    return false;
  }
};

/**
 * Add amount to the bonus piggy bank
 * @param amount - Amount to add to the piggy bank
 * @param budgetId - Budget profile ID (optional, uses active if not provided)
 * @returns Updated piggy bank or null on error
 */
export const addToBonusPiggyBank = async (
  amount: number,
  budgetId?: string
): Promise<BonusPiggyBank | null> => {
  try {
    if (amount <= 0) return null;
    
    const piggyBank = await getBonusPiggyBank(budgetId);
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    // Update amount
    piggyBank.amount += amount;
    piggyBank.lastProcessedDate = today.toISOString();
    
    // Update monthly history
    const monthIndex = piggyBank.monthlyHistory.findIndex(h => h.month === currentMonth);
    if (monthIndex >= 0) {
      piggyBank.monthlyHistory[monthIndex].totalAccumulated += amount;
    } else {
      piggyBank.monthlyHistory.push({
        month: currentMonth,
        totalAccumulated: amount,
      });
    }
    
    const success = await saveBonusPiggyBank(piggyBank, budgetId);
    return success ? piggyBank : null;
  } catch (error) {
    console.error('Error adding to bonus piggy bank:', error);
    return null;
  }
};

/**
 * Break the piggy bank (reset to zero)
 * @param budgetId - Budget profile ID (optional, uses active if not provided)
 * @returns The amount that was in the piggy bank before breaking it
 */
export const breakBonusPiggyBank = async (budgetId?: string): Promise<number> => {
  try {
    const piggyBank = await getBonusPiggyBank(budgetId);
    const amount = piggyBank.amount;
    
    // Reset the piggy bank
    piggyBank.amount = 0;
    await saveBonusPiggyBank(piggyBank, budgetId);
    
    return amount;
  } catch (error) {
    console.error('Error breaking bonus piggy bank:', error);
    return 0;
  }
};

// =============================================================================
// Onboarding State Functions (Epic 19)
// =============================================================================

const ONBOARDING_CAROUSEL_KEY = '@pace_onboarding_carousel_completed';
const ONBOARDING_TOOLTIPS_KEY = '@pace_onboarding_tooltips_completed';

/**
 * Check if the user has completed the onboarding carousel
 * @returns True if carousel has been completed
 */
export const hasCompletedOnboardingCarousel = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_CAROUSEL_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding carousel status:', error);
    return false;
  }
};

/**
 * Mark the onboarding carousel as completed
 * @returns Success status
 */
export const markOnboardingCarouselCompleted = async (): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_CAROUSEL_KEY, 'true');
    return true;
  } catch (error) {
    console.error('Error marking onboarding carousel as completed:', error);
    return false;
  }
};

/**
 * Check if the user has completed the onboarding tooltips
 * @returns True if tooltips have been completed
 */
export const hasCompletedOnboardingTooltips = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_TOOLTIPS_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding tooltips status:', error);
    return false;
  }
};

/**
 * Mark the onboarding tooltips as completed
 * @returns Success status
 */
export const markOnboardingTooltipsCompleted = async (): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_TOOLTIPS_KEY, 'true');
    return true;
  } catch (error) {
    console.error('Error marking onboarding tooltips as completed:', error);
    return false;
  }
};
