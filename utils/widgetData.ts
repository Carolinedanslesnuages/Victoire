/**
 * Widget data sharing utilities
 * Manages data sharing between the React Native app and native widgets (iOS/Android)
 */

import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getActiveBudgetProfile, getTransactionsForBudget } from './storage';
import { calculateDailyBudget } from './budgetCalculations';

const { WidgetDataBridge } = NativeModules;

export interface WidgetData {
  dailyBudget: number;
  currency: string;
  isPositive: boolean;
  lastUpdated: string;
  hasData: boolean;
}

const WIDGET_DATA_KEY = '@pace_widget_data';
// iOS App Group identifier (used in native iOS code)
// const WIDGET_SHARED_GROUP = 'group.com.carolinedanslesnuages.pace';

/**
 * Update widget data that will be displayed in the home screen widget
 * This should be called whenever budget data changes
 */
export async function updateWidgetData(): Promise<void> {
  try {
    const profile = await getActiveBudgetProfile();
    
    if (!profile) {
      // No profile configured, store empty state
      const emptyData: WidgetData = {
        dailyBudget: 0,
        currency: 'EUR',
        isPositive: false,
        lastUpdated: new Date().toISOString(),
        hasData: false,
      };
      await AsyncStorage.setItem(WIDGET_DATA_KEY, JSON.stringify(emptyData));
      return;
    }

    // Get transactions for current cycle
    const transactions = await getTransactionsForBudget(
      profile.id,
      profile.cycleStartDay
    );

    // Calculate total spent and income
    const totalSpent = transactions.reduce((sum, t) => {
      return t.type === 'income' ? sum : sum + t.amount;
    }, 0);
    const totalIncome = transactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum;
    }, 0);

    // Calculate daily budget (Reste à Vivre)
    const dailyBudget = calculateDailyBudget(
      profile.monthlyIncome,
      profile.fixedCharges,
      profile.savingsGoal,
      totalSpent,
      profile.cycleStartDay,
      totalIncome
    );

    // Get user's preferred currency
    const prefsData = await AsyncStorage.getItem('@pace_user_preferences');
    const currency = prefsData ? JSON.parse(prefsData).currency || 'EUR' : 'EUR';

    const widgetData: WidgetData = {
      dailyBudget: Math.round(dailyBudget * 100) / 100, // Round to 2 decimals
      currency,
      isPositive: dailyBudget >= 0,
      lastUpdated: new Date().toISOString(),
      hasData: true,
    };

    // Store in AsyncStorage (for Android widgets)
    await AsyncStorage.setItem(WIDGET_DATA_KEY, JSON.stringify(widgetData));

    // For iOS, write to App Group shared storage via native module
    if (Platform.OS === 'ios' && WidgetDataBridge) {
      try {
        WidgetDataBridge.saveWidgetData(JSON.stringify(widgetData));
      } catch (error) {
        console.log('iOS widget bridge not available (development build required)');
      }
    }
    
  } catch (error) {
    console.error('Error updating widget data:', error);
  }
}

/**
 * Get the current widget data
 */
export async function getWidgetData(): Promise<WidgetData | null> {
  try {
    const data = await AsyncStorage.getItem(WIDGET_DATA_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error getting widget data:', error);
    return null;
  }
}

/**
 * Format currency for display in widget
 */
export function formatWidgetCurrency(amount: number, currency: string): string {
  const currencySymbols: { [key: string]: string } = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    CHF: 'CHF',
    CAD: 'CA$',
    AUD: 'A$',
  };
  
  const symbol = currencySymbols[currency] || currency;
  const formattedAmount = Math.abs(amount).toFixed(2);
  
  // Different formats based on currency
  if (currency === 'EUR' || currency === 'CHF') {
    return `${formattedAmount} ${symbol}`;
  } else {
    return `${symbol}${formattedAmount}`;
  }
}

/**
 * Get the widget color based on budget state
 * Returns color hex string for iOS/Android
 */
export function getWidgetColor(isPositive: boolean): { background: string; text: string } {
  if (isPositive) {
    return {
      background: '#008080', // Teal
      text: '#FFFFFF',
    };
  } else {
    return {
      background: '#FF3B30', // Red
      text: '#FFFFFF',
    };
  }
}
