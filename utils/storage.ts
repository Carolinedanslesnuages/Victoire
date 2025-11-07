import AsyncStorage from '@react-native-async-storage/async-storage';
import { BudgetConfig, Transaction } from '../types';

const BUDGET_CONFIG_KEY = '@pace_budget_config';
const TRANSACTIONS_KEY = '@pace_transactions';

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
 * @returns Success status
 */
export const saveTransaction = async (
  transaction: Omit<Transaction, 'id'>
): Promise<boolean> => {
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
