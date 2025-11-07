import AsyncStorage from '@react-native-async-storage/async-storage';

const BUDGET_CONFIG_KEY = '@pace_budget_config';
const TRANSACTIONS_KEY = '@pace_transactions';

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

/**
 * Save a new transaction
 * @param {Object} transaction - Transaction object
 * @param {number} transaction.amount - Transaction amount
 * @param {string} transaction.description - Transaction description
 * @param {Date} transaction.date - Transaction date
 * @returns {boolean} Success status
 */
export const saveTransaction = async (transaction) => {
  try {
    const transactions = await loadTransactions();
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: transaction.date || new Date().toISOString(),
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
 * @returns {Array} Array of transactions
 */
export const loadTransactions = async () => {
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
 * @param {number} cycleStartDay - Day of month when cycle starts
 * @returns {Array} Array of transactions in current cycle
 */
export const getTransactionsForCurrentCycle = async (cycleStartDay) => {
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
 * @param {string} id - Transaction ID
 * @returns {boolean} Success status
 */
export const deleteTransaction = async (id) => {
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
