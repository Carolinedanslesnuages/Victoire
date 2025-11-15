/**
 * Budget calculation utilities for the PACE app
 */

import { BudgetCycle, BudgetStatus } from '../types';
import { colors } from '../constants/theme';
import i18n from './i18n';

/**
 * Get the current budget cycle dates
 * @param cycleStartDay - Day of month when cycle starts (1-31) - used in monthly mode
 * @param cycleMode - 'monthly' or 'custom' mode
 * @param customStartDate - ISO date string for custom period start
 * @param customEndDate - ISO date string for custom period end
 * @returns Object with cycleStart and cycleEnd dates
 */
export const getCurrentCycle = (
  cycleStartDay: number,
  cycleMode: 'monthly' | 'custom' = 'monthly',
  customStartDate?: string,
  customEndDate?: string
): BudgetCycle => {
  // Custom mode: use provided dates
  if (cycleMode === 'custom' && customStartDate && customEndDate) {
    return {
      cycleStart: new Date(customStartDate),
      cycleEnd: new Date(customEndDate),
    };
  }

  // Monthly mode: calculate based on cycle start day
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  let cycleStart, cycleEnd;

  // If today is before cycle start day, cycle started last month
  if (day < cycleStartDay) {
    cycleStart = new Date(year, month - 1, cycleStartDay);
    cycleEnd = new Date(year, month, cycleStartDay - 1);
  } else {
    cycleStart = new Date(year, month, cycleStartDay);
    cycleEnd = new Date(year, month + 1, cycleStartDay - 1);
  }

  return { cycleStart, cycleEnd };
};

/**
 * Calculate days remaining in current cycle
 * @param cycleStartDay - Day of month when cycle starts (1-31) - used in monthly mode
 * @param cycleMode - 'monthly' or 'custom' mode
 * @param customStartDate - ISO date string for custom period start
 * @param customEndDate - ISO date string for custom period end
 * @returns Number of days remaining in cycle
 */
export const getDaysRemainingInCycle = (
  cycleStartDay: number,
  cycleMode: 'monthly' | 'custom' = 'monthly',
  customStartDate?: string,
  customEndDate?: string
): number => {
  const today = new Date();
  const { cycleEnd } = getCurrentCycle(cycleStartDay, cycleMode, customStartDate, customEndDate);
  
  const diffTime = cycleEnd.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

/**
 * Calculate days elapsed in current cycle
 * @param cycleStartDay - Day of month when cycle starts (1-31) - used in monthly mode
 * @param cycleMode - 'monthly' or 'custom' mode
 * @param customStartDate - ISO date string for custom period start
 * @param customEndDate - ISO date string for custom period end
 * @returns Number of days elapsed in cycle
 */
export const getDaysElapsedInCycle = (
  cycleStartDay: number,
  cycleMode: 'monthly' | 'custom' = 'monthly',
  customStartDate?: string,
  customEndDate?: string
): number => {
  const { cycleStart, cycleEnd } = getCurrentCycle(cycleStartDay, cycleMode, customStartDate, customEndDate);
  
  const totalDays = Math.ceil((cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const daysRemaining = getDaysRemainingInCycle(cycleStartDay, cycleMode, customStartDate, customEndDate);
  
  return totalDays - daysRemaining;
};

/**
 * Calculate total days in current cycle
 * @param cycleStartDay - Day of month when cycle starts (1-31) - used in monthly mode
 * @param cycleMode - 'monthly' or 'custom' mode
 * @param customStartDate - ISO date string for custom period start
 * @param customEndDate - ISO date string for custom period end
 * @returns Total number of days in cycle
 */
export const getTotalDaysInCycle = (
  cycleStartDay: number,
  cycleMode: 'monthly' | 'custom' = 'monthly',
  customStartDate?: string,
  customEndDate?: string
): number => {
  const { cycleStart, cycleEnd } = getCurrentCycle(cycleStartDay, cycleMode, customStartDate, customEndDate);
  return Math.ceil((cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Calculate daily budget based on remaining budget and days
 * @param monthlyIncome - Monthly income (or budget available for custom period)
 * @param fixedCharges - Fixed charges (not used in custom mode)
 * @param savingsGoal - Savings goal (not used in custom mode)
 * @param totalSpent - Total amount spent in current cycle
 * @param cycleStartDay - Day of month when cycle starts
 * @param totalIncome - Total income received in current cycle (optional)
 * @param midCycleOnboarding - Mid-cycle onboarding data (optional)
 * @param cycleMode - 'monthly' or 'custom' mode
 * @param customStartDate - ISO date string for custom period start
 * @param customEndDate - ISO date string for custom period end
 * @returns Daily budget for today
 */
export const calculateDailyBudget = (
  monthlyIncome: number,
  fixedCharges: number,
  savingsGoal: number,
  totalSpent: number,
  cycleStartDay: number,
  totalIncome: number = 0,
  midCycleOnboarding?: { remainingAmount: number; cycleEndDate: string },
  cycleMode: 'monthly' | 'custom' = 'monthly',
  customStartDate?: string,
  customEndDate?: string
): number => {
  // Custom mode: use monthlyIncome as total budget available (no charges/savings deductions)
  if (cycleMode === 'custom') {
    const totalBudget = monthlyIncome; // In custom mode, this is the "Budget Available for Period"
    const remainingBudget = totalBudget - totalSpent + totalIncome;
    const daysRemaining = getDaysRemainingInCycle(cycleStartDay, cycleMode, customStartDate, customEndDate);
    
    // Avoid division by zero
    if (daysRemaining === 0) {
      return remainingBudget;
    }
    
    return remainingBudget / daysRemaining;
  }

  // US 1.5.3: If we have mid-cycle onboarding data and we're still in the first incomplete cycle
  if (midCycleOnboarding) {
    const today = new Date();
    const cycleEndDate = new Date(midCycleOnboarding.cycleEndDate);
    
    // Check if we're still in the first incomplete cycle
    if (today <= cycleEndDate) {
      // Use the remaining amount provided during onboarding, adjusted for spending
      const adjustedRemaining = midCycleOnboarding.remainingAmount - totalSpent + totalIncome;
      const daysRemaining = getDaysRemainingInCycle(cycleStartDay);
      
      // Avoid division by zero
      if (daysRemaining === 0) {
        return adjustedRemaining;
      }
      
      return adjustedRemaining / daysRemaining;
    }
    // If we've passed the first cycle, fall through to normal calculation
  }
  
  // Normal calculation for complete cycles (monthly mode)
  const resteAVivre = monthlyIncome - fixedCharges - savingsGoal;
  // Income increases the budget, expenses decrease it
  const remainingBudget = resteAVivre - totalSpent + totalIncome;
  const daysRemaining = getDaysRemainingInCycle(cycleStartDay);
  
  // Avoid division by zero, if no days remaining, show the remaining budget
  if (daysRemaining === 0) {
    return remainingBudget;
  }
  
  return remainingBudget / daysRemaining;
};

/**
 * Calculate budget status based on spending pace
 * @param monthlyIncome - Monthly income (or budget available for custom period)
 * @param fixedCharges - Fixed charges (not used in custom mode)
 * @param savingsGoal - Savings goal (not used in custom mode)
 * @param totalSpent - Total amount spent in current cycle
 * @param cycleStartDay - Day of month when cycle starts
 * @param totalIncome - Total income received in current cycle (optional)
 * @param cycleMode - 'monthly' or 'custom' mode
 * @param customStartDate - ISO date string for custom period start
 * @param customEndDate - ISO date string for custom period end
 * @returns Status object with type and label
 */
export const calculateBudgetStatus = (
  monthlyIncome: number,
  fixedCharges: number,
  savingsGoal: number,
  totalSpent: number,
  cycleStartDay: number,
  totalIncome: number = 0,
  cycleMode: 'monthly' | 'custom' = 'monthly',
  customStartDate?: string,
  customEndDate?: string
): BudgetStatus => {
  // Determine reste à vivre based on mode
  const resteAVivre = cycleMode === 'custom' 
    ? monthlyIncome // In custom mode, use full budget
    : monthlyIncome - fixedCharges - savingsGoal; // In monthly mode, deduct charges/savings
    
  const daysElapsed = getDaysElapsedInCycle(cycleStartDay, cycleMode, customStartDate, customEndDate);
  const totalDays = getTotalDaysInCycle(cycleStartDay, cycleMode, customStartDate, customEndDate);
  
  // Calculate percentage of time elapsed vs percentage of budget spent
  const timeElapsedPercent = (daysElapsed / totalDays) * 100;
  // Net spending: expenses minus income
  const netSpending = totalSpent - totalIncome;
  const budgetSpentPercent = (netSpending / resteAVivre) * 100;
  
  // If spending less than time elapsed, user is ahead
  if (budgetSpentPercent < timeElapsedPercent - 10) {
    return {
      type: 'ahead',
      label: i18n.t('dashboard.budgetStatus.ahead'),
      color: colors.success,
    };
  }
  
  // If spending more than time elapsed + 10%, user is behind
  if (budgetSpentPercent > timeElapsedPercent + 10) {
    return {
      type: 'behind',
      label: i18n.t('dashboard.budgetStatus.behind'),
      color: colors.error,
    };
  }
  
  // Otherwise, user is on track but needs attention
  return {
    type: 'attention',
    label: i18n.t('dashboard.budgetStatus.attention'),
    color: colors.warning,
  };
};

/**
 * Calculate percentage of budget spent
 * @param monthlyIncome - Monthly income (or budget available for custom period)
 * @param fixedCharges - Fixed charges (not used in custom mode)
 * @param savingsGoal - Savings goal (not used in custom mode)
 * @param totalSpent - Total amount spent in current cycle
 * @param totalIncome - Total income received in current cycle (optional)
 * @param cycleMode - 'monthly' or 'custom' mode
 * @returns Percentage of budget spent (0-100)
 */
export const calculateSpentPercentage = (
  monthlyIncome: number,
  fixedCharges: number,
  savingsGoal: number,
  totalSpent: number,
  totalIncome: number = 0,
  cycleMode: 'monthly' | 'custom' = 'monthly'
): number => {
  // Determine reste à vivre based on mode
  const resteAVivre = cycleMode === 'custom'
    ? monthlyIncome // In custom mode, use full budget
    : monthlyIncome - fixedCharges - savingsGoal; // In monthly mode, deduct charges/savings
  
  if (resteAVivre === 0) return 0;
  // Net spending: expenses minus income
  const netSpending = totalSpent - totalIncome;
  return Math.min(100, Math.max(0, (netSpending / resteAVivre) * 100));
};
