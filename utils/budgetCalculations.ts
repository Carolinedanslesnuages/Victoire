/**
 * Budget calculation utilities for the PACE app
 */

import { BudgetCycle, BudgetStatus } from '../types';
import { colors } from '../constants/theme';
import i18n from './i18n';

/**
 * Get the current budget cycle dates
 * @param cycleStartDay - Day of month when cycle starts (1-31)
 * @returns Object with cycleStart and cycleEnd dates
 */
export const getCurrentCycle = (cycleStartDay: number): BudgetCycle => {
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
 * @param cycleStartDay - Day of month when cycle starts (1-31)
 * @returns Number of days remaining in cycle
 */
export const getDaysRemainingInCycle = (cycleStartDay: number): number => {
  const today = new Date();
  const { cycleEnd } = getCurrentCycle(cycleStartDay);
  
  const diffTime = cycleEnd.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

/**
 * Calculate days elapsed in current cycle
 * @param cycleStartDay - Day of month when cycle starts (1-31)
 * @returns Number of days elapsed in cycle
 */
export const getDaysElapsedInCycle = (cycleStartDay: number): number => {
  const { cycleStart, cycleEnd } = getCurrentCycle(cycleStartDay);
  
  const totalDays = Math.ceil((cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const daysRemaining = getDaysRemainingInCycle(cycleStartDay);
  
  return totalDays - daysRemaining;
};

/**
 * Calculate total days in current cycle
 * @param cycleStartDay - Day of month when cycle starts (1-31)
 * @returns Total number of days in cycle
 */
export const getTotalDaysInCycle = (cycleStartDay: number): number => {
  const { cycleStart, cycleEnd } = getCurrentCycle(cycleStartDay);
  return Math.ceil((cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Calculate daily budget based on remaining budget and days
 * @param monthlyIncome - Monthly income
 * @param fixedCharges - Fixed charges
 * @param savingsGoal - Savings goal
 * @param totalSpent - Total amount spent in current cycle
 * @param cycleStartDay - Day of month when cycle starts
 * @param totalIncome - Total income received in current cycle (optional)
 * @returns Daily budget for today
 */
export const calculateDailyBudget = (
  monthlyIncome: number,
  fixedCharges: number,
  savingsGoal: number,
  totalSpent: number,
  cycleStartDay: number,
  totalIncome: number = 0
): number => {
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
 * @param monthlyIncome - Monthly income
 * @param fixedCharges - Fixed charges
 * @param savingsGoal - Savings goal
 * @param totalSpent - Total amount spent in current cycle
 * @param cycleStartDay - Day of month when cycle starts
 * @param totalIncome - Total income received in current cycle (optional)
 * @returns Status object with type and label
 */
export const calculateBudgetStatus = (
  monthlyIncome: number,
  fixedCharges: number,
  savingsGoal: number,
  totalSpent: number,
  cycleStartDay: number,
  totalIncome: number = 0
): BudgetStatus => {
  const resteAVivre = monthlyIncome - fixedCharges - savingsGoal;
  const daysElapsed = getDaysElapsedInCycle(cycleStartDay);
  const totalDays = getTotalDaysInCycle(cycleStartDay);
  
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
 * @param monthlyIncome - Monthly income
 * @param fixedCharges - Fixed charges
 * @param savingsGoal - Savings goal
 * @param totalSpent - Total amount spent in current cycle
 * @param totalIncome - Total income received in current cycle (optional)
 * @returns Percentage of budget spent (0-100)
 */
export const calculateSpentPercentage = (
  monthlyIncome: number,
  fixedCharges: number,
  savingsGoal: number,
  totalSpent: number,
  totalIncome: number = 0
): number => {
  const resteAVivre = monthlyIncome - fixedCharges - savingsGoal;
  if (resteAVivre === 0) return 0;
  // Net spending: expenses minus income
  const netSpending = totalSpent - totalIncome;
  return Math.min(100, Math.max(0, (netSpending / resteAVivre) * 100));
};
