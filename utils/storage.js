import AsyncStorage from '@react-native-async-storage/async-storage';

const BUDGET_CONFIG_KEY = '@pace_budget_config';

/**
 * Save budget configuration to local storage
 * @param {Object} config - Budget configuration object
 * @param {number} config.monthlyIncome - Monthly net income
 * @param {number} config.fixedCharges - Total fixed charges
 * @param {number} config.savingsGoal - Savings goal
 * @param {number} config.cycleStartDay - Day of month when budget cycle starts (1-31)
 */
export const saveBudgetConfig = async (config) => {
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
 * @returns {Object|null} Budget configuration or null if not found
 */
export const loadBudgetConfig = async () => {
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
 */
export const clearBudgetConfig = async () => {
  try {
    await AsyncStorage.removeItem(BUDGET_CONFIG_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing budget config:', error);
    return false;
  }
};
