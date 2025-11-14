/**
 * Type definitions for the PACE budget app
 */

import { AvatarId } from '../constants/avatars';

/**
 * Budget profile type - personal or household
 */
export type BudgetProfileType = 'personal' | 'household';

/**
 * Budget profile interface - represents a single budget (personal or household)
 */
export interface BudgetProfile {
  id: string; // Unique identifier for the budget
  type: BudgetProfileType; // Type of budget
  name: string; // Display name (e.g., "Personnel", "Foyer")
  monthlyIncome: number;
  fixedCharges: number;
  savingsGoal: number;
  cycleStartDay: number;
  createdAt: string; // ISO date string
}

/**
 * Budget configuration interface (legacy - for backward compatibility)
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
 * Transaction type - either expense or income
 */
export type TransactionType = 'expense' | 'income';

/**
 * Transaction interface
 */
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
  type?: TransactionType; // Type of transaction (default: 'expense')
  isRecurring?: boolean; // Whether this is a recurring transaction
  recurringDay?: number; // Day of month when recurring transaction should be created (1-31)
  budgetId?: string; // ID of the budget this transaction belongs to (optional for backward compatibility)
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
  avatarId?: AvatarId; // Selected avatar for user profile
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
  streakFreezes: number; // Number of streak freezes available
  jokersRemaining: number; // Number of jokers remaining this month
  lastJokerResetDate?: string; // Last date when jokers were reset
}

/**
 * Badge types for achievements
 */
export type BadgeType = 
  | 'first_step' // 🏅 Premier Pas - First expense tracked
  | 'streak_7' // 🔥 Week Warrior - 7 day streak
  | 'streak_30' // 🏆 30 Jours Zen - 30 day streak
  | 'streak_100' // 💎 Centurion - 100 day streak
  | 'perfect_balance' // 🎯 Pile Poil à 0€ - End cycle with exactly 0€
  | 'budget_master' // 💰 Maître du Budget - End 3 cycles with positive balance
  | 'early_bird' // 🌅 Lève-tôt - Log expense before 8 AM
  | 'night_owl' // 🦉 Noctambule - Log expense after 10 PM
  | 'frugal_month' // 🌱 Mois Frugal - Spend less than 50% of budget
  | 'saver' // 💎 Épargnant - Save more than planned for 3 months
  | 'streak_saver' // 🧊 Protecteur de Série - Use a streak freeze
  | 'joker_user'; // ❤️ As du Joker - Use a joker successfully

/**
 * Badge interface
 */
export interface Badge {
  type: BadgeType;
  unlockedAt: string; // ISO date string when unlocked
  isRare?: boolean; // True for rare badges (100+ day streak, etc.)
}

/**
 * Gamification data interface
 */
export interface GamificationData {
  badges: Badge[]; // Array of unlocked badges
  streakInfo: StreakInfo; // Streak tracking information
  monthlyStats: {
    cyclesWithPositiveBalance: number; // Number of cycles ending with positive balance
    totalCyclesCompleted: number; // Total number of completed cycles
  };
}

/**
 * Bonus Piggy Bank interface - accumulates unspent daily budget
 */
export interface BonusPiggyBank {
  amount: number; // Current accumulated bonus amount
  lastProcessedDate: string; // ISO date string of last day processed (to avoid double-processing)
  monthlyHistory: {
    month: string; // Format: YYYY-MM
    totalAccumulated: number; // Total bonus accumulated in this month
  }[];
}
