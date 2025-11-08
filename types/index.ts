/**
 * Type definitions for the PACE budget app
 */

/**
 * Budget configuration interface
 */
export interface BudgetConfig {
  monthlyIncome: number;
  fixedCharges: number;
  savingsGoal: number;
  cycleStartDay: number;
  budgetName?: string; // Optional custom budget name
  isHouseholdBudget?: boolean; // True if this is a household/family budget
  householdName?: string; // Optional household name (e.g., "Foyer Dupont")
}

/**
 * Transaction interface
 */
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
}

/**
 * Budget cycle interface
 */
export interface BudgetCycle {
  cycleStart: Date;
  cycleEnd: Date;
}

/**
 * Budget status interface
 */
export interface BudgetStatus {
  type: 'ahead' | 'behind' | 'attention';
  label: string;
  color: string;
}

/**
 * User preferences interface
 */
export interface UserPreferences {
  currency: string;
  customCategories: string[];
  notificationSettings?: NotificationSettings;
}

/**
 * Notification settings interface
 */
export interface NotificationSettings {
  eveningReminderEnabled: boolean;
  eveningReminderTime: string; // Format: "HH:mm" (24-hour format)
  morningBudgetEnabled: boolean;
  morningBudgetTime: string; // Format: "HH:mm" (24-hour format)
  budgetAlertEnabled: boolean;
}

/**
 * Currency option interface
 */
export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

/**
 * Subscription status type
 */
export type SubscriptionStatus = 'free' | 'premium';

/**
 * Subscription plan type
 */
export type SubscriptionPlan = 'monthly' | 'annual';

/**
 * Subscription info interface
 */
export interface SubscriptionInfo {
  status: SubscriptionStatus;
  plan?: SubscriptionPlan;
  expirationDate?: string;
  isActive: boolean;
}

/**
 * Streak info interface for daily tracking
 */
export interface StreakInfo {
  currentStreak: number; // Number of consecutive days with tracking activity
  longestStreak: number; // Best streak ever achieved
  lastActivityDate: string; // ISO date string of last activity
  isActive: boolean; // True if streak is currently active (activity today or yesterday)
}
