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
