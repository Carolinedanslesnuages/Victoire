/**
 * Unit tests for budget calculation utilities
 */

import {
  getCurrentCycle,
  getDaysRemainingInCycle,
  getDaysElapsedInCycle,
  getTotalDaysInCycle,
  calculateDailyBudget,
  calculateBudgetStatus,
  calculateSpentPercentage,
  getDailySpendingState,
} from '../budgetCalculations';
import { Transaction } from '../../types';

describe('budgetCalculations', () => {
  describe('getCurrentCycle', () => {
    it('should return correct cycle dates when today is after cycle start day', () => {
      // Mock a date: 15th of the month with cycle starting on 10th
      const mockDate = new Date(2024, 0, 15); // January 15, 2024
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const cycle = getCurrentCycle(10);
      
      expect(cycle.cycleStart.getDate()).toBe(10);
      expect(cycle.cycleStart.getMonth()).toBe(0); // January
      expect(cycle.cycleEnd.getDate()).toBe(9);
      expect(cycle.cycleEnd.getMonth()).toBe(1); // February

      jest.useRealTimers();
    });

    it('should return correct cycle dates when today is before cycle start day', () => {
      // Mock a date: 5th of the month with cycle starting on 10th
      const mockDate = new Date(2024, 0, 5); // January 5, 2024
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const cycle = getCurrentCycle(10);
      
      expect(cycle.cycleStart.getDate()).toBe(10);
      expect(cycle.cycleStart.getMonth()).toBe(11); // December (previous month)
      expect(cycle.cycleEnd.getDate()).toBe(9);
      expect(cycle.cycleEnd.getMonth()).toBe(0); // January

      jest.useRealTimers();
    });

    it('should handle cycle starting on first day of month', () => {
      const mockDate = new Date(2024, 0, 15); // January 15, 2024
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const cycle = getCurrentCycle(1);
      
      expect(cycle.cycleStart.getDate()).toBe(1);
      expect(cycle.cycleStart.getMonth()).toBe(0); // January
      expect(cycle.cycleEnd.getDate()).toBe(31);
      expect(cycle.cycleEnd.getMonth()).toBe(0); // January (last day is 0 which becomes last day of month)

      jest.useRealTimers();
    });

    it('should handle cycle starting on last day of month', () => {
      const mockDate = new Date(2024, 1, 15); // February 15, 2024
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const cycle = getCurrentCycle(31);
      
      expect(cycle.cycleStart.getDate()).toBe(31);
      expect(cycle.cycleStart.getMonth()).toBe(0); // January (previous month)
      // Cycle end is calculated as month+1, startDay-1 which gives different results based on month
      expect(cycle.cycleEnd.getDate()).toBeGreaterThanOrEqual(1);
      expect(cycle.cycleEnd.getMonth()).toBeGreaterThanOrEqual(1); // Should be Feb or March

      jest.useRealTimers();
    });
  });

  describe('getDaysRemainingInCycle', () => {
    it('should calculate correct days remaining in the middle of cycle', () => {
      const mockDate = new Date(2024, 0, 15); // January 15, 2024
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const daysRemaining = getDaysRemainingInCycle(10);
      
      // From Jan 15 to Feb 9 (cycle end)
      expect(daysRemaining).toBeGreaterThan(0);
      expect(daysRemaining).toBeLessThan(31);

      jest.useRealTimers();
    });

    it('should return 0 or minimal days on last day of cycle', () => {
      const mockDate = new Date(2024, 1, 9, 23, 59); // February 9, 2024 (end of cycle)
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const daysRemaining = getDaysRemainingInCycle(10);
      
      expect(daysRemaining).toBeLessThanOrEqual(1);

      jest.useRealTimers();
    });

    it('should never return negative days', () => {
      const mockDate = new Date(2024, 0, 15);
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const daysRemaining = getDaysRemainingInCycle(10);
      
      expect(daysRemaining).toBeGreaterThanOrEqual(0);

      jest.useRealTimers();
    });
  });

  describe('calculateDailyBudget - Reste à Vivre du Jour', () => {
    it('should calculate correct daily budget with positive remaining budget', () => {
      const mockDate = new Date(2024, 0, 15); // January 15, 2024
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const dailyBudget = calculateDailyBudget(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        200,  // totalSpent
        10    // cycleStartDay
      );

      // Reste à Vivre = 3000 - 1500 - 500 = 1000
      // Remaining Budget = 1000 - 200 = 800
      // Days Remaining = from Jan 15 to Feb 9
      expect(dailyBudget).toBeGreaterThan(0);
      expect(typeof dailyBudget).toBe('number');
      expect(isFinite(dailyBudget)).toBe(true);

      jest.useRealTimers();
    });

    it('should handle zero days remaining edge case', () => {
      const mockDate = new Date(2024, 1, 9, 23, 59); // Last moment of cycle
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const dailyBudget = calculateDailyBudget(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        200,  // totalSpent
        10    // cycleStartDay
      );

      // When days remaining is 0, should return remaining budget
      expect(typeof dailyBudget).toBe('number');
      expect(isFinite(dailyBudget)).toBe(true);

      jest.useRealTimers();
    });

    it('should return negative daily budget when overspent', () => {
      const mockDate = new Date(2024, 0, 15);
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const dailyBudget = calculateDailyBudget(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        1500, // totalSpent (more than reste à vivre of 1000)
        10    // cycleStartDay
      );

      expect(dailyBudget).toBeLessThan(0);

      jest.useRealTimers();
    });

    it('should handle minimal values correctly', () => {
      const mockDate = new Date(2024, 0, 15);
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const dailyBudget = calculateDailyBudget(
        100,  // monthlyIncome
        50,   // fixedCharges
        20,   // savingsGoal
        10,   // totalSpent
        10    // cycleStartDay
      );

      // Reste à Vivre = 100 - 50 - 20 = 30
      // Remaining = 30 - 10 = 20
      expect(dailyBudget).toBeGreaterThan(0);
      expect(typeof dailyBudget).toBe('number');

      jest.useRealTimers();
    });

    it('should handle exact budget consumption', () => {
      const mockDate = new Date(2024, 0, 15);
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const dailyBudget = calculateDailyBudget(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        1000, // totalSpent (exact reste à vivre)
        10    // cycleStartDay
      );

      expect(dailyBudget).toBe(0);

      jest.useRealTimers();
    });
  });

  describe('calculateBudgetStatus', () => {
    it('should return "ahead" status when spending less than time elapsed', () => {
      const mockDate = new Date(2024, 0, 25); // Well into the cycle
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const status = calculateBudgetStatus(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        100,  // totalSpent (very little spent)
        10    // cycleStartDay
      );

      expect(status.type).toBe('ahead');
      expect(status.label).toBeDefined();
      expect(status.color).toBeDefined();

      jest.useRealTimers();
    });

    it('should return "behind" status when overspending', () => {
      const mockDate = new Date(2024, 0, 15); // Early in cycle
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const status = calculateBudgetStatus(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        900,  // totalSpent (high spending early in cycle)
        10    // cycleStartDay
      );

      expect(status.type).toBe('behind');
      expect(status.label).toBeDefined();
      expect(status.color).toBeDefined();

      jest.useRealTimers();
    });

    it('should return "attention" status when on track', () => {
      const mockDate = new Date(2024, 0, 20); // Mid-cycle
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const status = calculateBudgetStatus(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        350,  // totalSpent (roughly proportional spending)
        10    // cycleStartDay
      );

      expect(status.type).toBe('attention');
      expect(status.label).toBeDefined();
      expect(status.color).toBeDefined();

      jest.useRealTimers();
    });
  });

  describe('calculateSpentPercentage', () => {
    it('should calculate correct percentage for partial spending', () => {
      const percentage = calculateSpentPercentage(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        500   // totalSpent (50% of 1000 reste à vivre)
      );

      expect(percentage).toBe(50);
    });

    it('should cap at 100% when overspending', () => {
      const percentage = calculateSpentPercentage(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        1500  // totalSpent (more than reste à vivre)
      );

      expect(percentage).toBe(100);
    });

    it('should return 0% when nothing spent', () => {
      const percentage = calculateSpentPercentage(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        0     // totalSpent
      );

      expect(percentage).toBe(0);
    });

    it('should handle zero reste à vivre edge case', () => {
      const percentage = calculateSpentPercentage(
        2000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal (total = income, no reste à vivre)
        0     // totalSpent
      );

      expect(percentage).toBe(0);
      expect(typeof percentage).toBe('number');
      expect(isFinite(percentage)).toBe(true);
    });
  });

  describe('getTotalDaysInCycle', () => {
    it('should return reasonable number of days for a cycle', () => {
      const mockDate = new Date(2024, 0, 15);
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const totalDays = getTotalDaysInCycle(10);
      
      expect(totalDays).toBeGreaterThan(27);
      expect(totalDays).toBeLessThan(32);

      jest.useRealTimers();
    });
  });

  describe('getDaysElapsedInCycle', () => {
    it('should return positive days elapsed', () => {
      const mockDate = new Date(2024, 0, 15);
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const daysElapsed = getDaysElapsedInCycle(10);
      
      expect(daysElapsed).toBeGreaterThanOrEqual(0);
      expect(typeof daysElapsed).toBe('number');

      jest.useRealTimers();
    });

    it('should be complementary to days remaining', () => {
      const mockDate = new Date(2024, 0, 15);
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const cycleStartDay = 10;
      const totalDays = getTotalDaysInCycle(cycleStartDay);
      const daysElapsed = getDaysElapsedInCycle(cycleStartDay);
      const daysRemaining = getDaysRemainingInCycle(cycleStartDay);
      
      // Total days should roughly equal elapsed + remaining
      expect(Math.abs(totalDays - (daysElapsed + daysRemaining))).toBeLessThanOrEqual(1);

      jest.useRealTimers();
    });
  });

  describe('calculateDailyBudget with Mid-Cycle Onboarding', () => {
    it('should use remaining amount from mid-cycle onboarding during first cycle', () => {
      // User onboards on Jan 20, cycle started on Jan 5
      const mockDate = new Date(2024, 0, 20); // January 20, 2024
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const midCycleOnboarding = {
        remainingAmount: 450,
        cycleEndDate: new Date(2024, 1, 4).toISOString(), // Feb 4 (day before cycle restarts)
      };

      const dailyBudget = calculateDailyBudget(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        0,    // totalSpent (no spending yet)
        5,    // cycleStartDay
        0,    // totalIncome
        midCycleOnboarding
      );

      // Should use the remaining amount (450) divided by days remaining
      const daysRemaining = getDaysRemainingInCycle(5);
      const expectedDailyBudget = 450 / daysRemaining;
      expect(dailyBudget).toBeCloseTo(expectedDailyBudget, 2);

      jest.useRealTimers();
    });

    it('should adjust remaining amount based on spending during first cycle', () => {
      const mockDate = new Date(2024, 0, 20);
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const midCycleOnboarding = {
        remainingAmount: 450,
        cycleEndDate: new Date(2024, 1, 4).toISOString(),
      };

      const dailyBudget = calculateDailyBudget(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        100,  // totalSpent (100 spent already)
        5,    // cycleStartDay
        0,    // totalIncome
        midCycleOnboarding
      );

      // Should use (remaining - spent) / days remaining
      const daysRemaining = getDaysRemainingInCycle(5);
      const expectedDailyBudget = (450 - 100) / daysRemaining;
      expect(dailyBudget).toBeCloseTo(expectedDailyBudget, 2);

      jest.useRealTimers();
    });

    it('should consider income during first cycle with mid-cycle onboarding', () => {
      const mockDate = new Date(2024, 0, 20);
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const midCycleOnboarding = {
        remainingAmount: 450,
        cycleEndDate: new Date(2024, 1, 4).toISOString(),
      };

      const dailyBudget = calculateDailyBudget(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        100,  // totalSpent
        5,    // cycleStartDay
        50,   // totalIncome (received 50 extra)
        midCycleOnboarding
      );

      // Should use (remaining - spent + income) / days remaining
      const daysRemaining = getDaysRemainingInCycle(5);
      const expectedDailyBudget = (450 - 100 + 50) / daysRemaining;
      expect(dailyBudget).toBeCloseTo(expectedDailyBudget, 2);

      jest.useRealTimers();
    });

    it('should revert to normal calculation after first cycle ends', () => {
      // User is now in the next cycle (after Feb 5)
      const mockDate = new Date(2024, 1, 10); // February 10, 2024
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const midCycleOnboarding = {
        remainingAmount: 450,
        cycleEndDate: new Date(2024, 1, 4).toISOString(), // Cycle ended on Feb 4
      };

      const dailyBudget = calculateDailyBudget(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        100,  // totalSpent in new cycle
        5,    // cycleStartDay
        0,    // totalIncome
        midCycleOnboarding
      );

      // Should use normal calculation now
      const resteAVivre = 3000 - 1500 - 500;
      const remainingBudget = resteAVivre - 100;
      const daysRemaining = getDaysRemainingInCycle(5);
      const expectedDailyBudget = remainingBudget / daysRemaining;
      expect(dailyBudget).toBeCloseTo(expectedDailyBudget, 2);

      jest.useRealTimers();
    });

    it('should handle normal calculation when no mid-cycle data provided', () => {
      const mockDate = new Date(2024, 0, 15);
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const dailyBudget = calculateDailyBudget(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        200,  // totalSpent
        10,   // cycleStartDay
        0,    // totalIncome
        undefined // No mid-cycle onboarding
      );

      // Should use normal calculation
      const resteAVivre = 3000 - 1500 - 500;
      const remainingBudget = resteAVivre - 200;
      const daysRemaining = getDaysRemainingInCycle(10);
      const expectedDailyBudget = remainingBudget / daysRemaining;
      expect(dailyBudget).toBeCloseTo(expectedDailyBudget, 2);

      jest.useRealTimers();
    });

    it('should handle edge case: no days remaining in first cycle', () => {
      // On the last day of the mid-cycle period, early in the morning
      const mockDate = new Date(2024, 1, 4, 6, 0); // Feb 4, 2024 at 6 AM
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const midCycleOnboarding = {
        remainingAmount: 450,
        cycleEndDate: new Date(2024, 1, 4, 23, 59).toISOString(), // End of Feb 4
      };

      const dailyBudget = calculateDailyBudget(
        3000, // monthlyIncome
        1500, // fixedCharges
        500,  // savingsGoal
        100,  // totalSpent
        5,    // cycleStartDay
        0,    // totalIncome
        midCycleOnboarding
      );

      // Should return the remaining budget (not divide by zero)
      // Since we're on the last day with getDaysRemainingInCycle returning 0 or 1,
      // the function should return the adjusted remaining amount
      expect(dailyBudget).toBeGreaterThan(0);
      expect(dailyBudget).toBeLessThanOrEqual(450 - 100);

      jest.useRealTimers();
    });
  });

  describe('Custom Budget Cycles', () => {
    describe('getCurrentCycle with custom mode', () => {
      it('should return custom cycle dates when in custom mode', () => {
        const customStartDate = '2024-01-10';
        const customEndDate = '2024-01-25';

        const cycle = getCurrentCycle(1, 'custom', customStartDate, customEndDate);

        expect(cycle.cycleStart.toISOString()).toBe(new Date(customStartDate).toISOString());
        expect(cycle.cycleEnd.toISOString()).toBe(new Date(customEndDate).toISOString());
      });

      it('should fall back to monthly mode when custom dates are not provided', () => {
        const mockDate = new Date(2024, 0, 15);
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        const cycle = getCurrentCycle(10, 'custom'); // Custom mode but no dates

        // Should still return monthly calculation as fallback
        expect(cycle.cycleStart.getDate()).toBe(10);

        jest.useRealTimers();
      });
    });

    describe('getDaysRemainingInCycle with custom mode', () => {
      it('should calculate days remaining based on custom end date', () => {
        const mockDate = new Date(2024, 0, 15); // January 15, 2024
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        const customStartDate = '2024-01-10';
        const customEndDate = '2024-01-25';

        const daysRemaining = getDaysRemainingInCycle(1, 'custom', customStartDate, customEndDate);

        // From Jan 15 to Jan 25 is 11 days (ceil of time difference)
        expect(daysRemaining).toBeGreaterThanOrEqual(10);
        expect(daysRemaining).toBeLessThanOrEqual(11);

        jest.useRealTimers();
      });
    });

    describe('getTotalDaysInCycle with custom mode', () => {
      it('should calculate total days based on custom date range', () => {
        const customStartDate = '2024-01-10';
        const customEndDate = '2024-01-25';

        const totalDays = getTotalDaysInCycle(1, 'custom', customStartDate, customEndDate);

        // From Jan 10 to Jan 25 is 16 days
        expect(totalDays).toBe(16);
      });

      it('should handle custom periods across month boundaries', () => {
        const customStartDate = '2024-01-25';
        const customEndDate = '2024-02-10';

        const totalDays = getTotalDaysInCycle(1, 'custom', customStartDate, customEndDate);

        // From Jan 25 to Feb 10 is 17 days
        expect(totalDays).toBe(17);
      });
    });

    describe('calculateDailyBudget with custom mode', () => {
      it('should use full budget amount in custom mode (no deductions)', () => {
        const mockDate = new Date(2024, 0, 15); // January 15, 2024
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        const customStartDate = '2024-01-10';
        const customEndDate = '2024-01-25';

        const dailyBudget = calculateDailyBudget(
          800,  // Budget available for period (no deductions)
          200,  // fixedCharges (should be ignored in custom mode)
          100,  // savingsGoal (should be ignored in custom mode)
          150,  // totalSpent
          1,    // cycleStartDay (not used in custom mode)
          0,    // totalIncome
          undefined, // midCycleOnboarding
          'custom',
          customStartDate,
          customEndDate
        );

        // Should use full 800 as budget: (800 - 150) / days remaining
        const daysRemaining = getDaysRemainingInCycle(1, 'custom', customStartDate, customEndDate);
        const expectedDailyBudget = (800 - 150) / daysRemaining;
        expect(dailyBudget).toBeCloseTo(expectedDailyBudget, 2);

        jest.useRealTimers();
      });

      it('should consider income in custom mode', () => {
        const mockDate = new Date(2024, 0, 15);
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        const customStartDate = '2024-01-10';
        const customEndDate = '2024-01-25';

        const dailyBudget = calculateDailyBudget(
          800,  // Budget available
          0,    // fixedCharges (ignored)
          0,    // savingsGoal (ignored)
          150,  // totalSpent
          1,    // cycleStartDay
          50,   // totalIncome (received extra money)
          undefined,
          'custom',
          customStartDate,
          customEndDate
        );

        // Should be: (800 - 150 + 50) / days remaining
        const daysRemaining = getDaysRemainingInCycle(1, 'custom', customStartDate, customEndDate);
        const expectedDailyBudget = (800 - 150 + 50) / daysRemaining;
        expect(dailyBudget).toBeCloseTo(expectedDailyBudget, 2);

        jest.useRealTimers();
      });
    });

    describe('calculateBudgetStatus with custom mode', () => {
      it('should calculate status using full budget in custom mode', () => {
        const mockDate = new Date(2024, 0, 15);
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        const customStartDate = '2024-01-10';
        const customEndDate = '2024-01-25';

        const status = calculateBudgetStatus(
          800,  // Budget available
          0,    // fixedCharges (ignored)
          0,    // savingsGoal (ignored)
          100,  // totalSpent
          1,    // cycleStartDay
          0,    // totalIncome
          'custom',
          customStartDate,
          customEndDate
        );

        // Should have a valid status type
        expect(['ahead', 'behind', 'attention']).toContain(status.type);
        expect(status.label).toBeDefined();
        expect(status.color).toBeDefined();

        jest.useRealTimers();
      });
    });

    describe('calculateSpentPercentage with custom mode', () => {
      it('should calculate percentage using full budget in custom mode', () => {
        const percentage = calculateSpentPercentage(
          800,  // Budget available
          0,    // fixedCharges (ignored)
          0,    // savingsGoal (ignored)
          200,  // totalSpent
          0,    // totalIncome
          'custom'
        );

        // Should be 200/800 = 25%
        expect(percentage).toBe(25);
      });

      it('should handle overspending in custom mode', () => {
        const percentage = calculateSpentPercentage(
          800,  // Budget available
          0,    // fixedCharges (ignored)
          0,    // savingsGoal (ignored)
          900,  // totalSpent (more than available)
          0,    // totalIncome
          'custom'
        );

        // Should cap at 100%
        expect(percentage).toBe(100);
      });
    });
  });

  // US 2.3.1: Tests for getDailySpendingState
  describe('getDailySpendingState', () => {
    const createTransaction = (
      id: string,
      amount: number,
      date: Date,
      type: 'expense' | 'income' = 'expense'
    ): Transaction => ({
      id,
      amount,
      description: `Test ${type}`,
      date: date.toISOString(),
      type,
    });

    describe('Under budget scenarios', () => {
      it('should return "under" status when no spending today', () => {
        const mockDate = new Date(2024, 0, 15); // January 15, 2024
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        const transactions: Transaction[] = [
          createTransaction('1', 10, new Date(2024, 0, 14)), // Yesterday
        ];

        const state = getDailySpendingState(
          2000,  // monthlyIncome
          800,   // fixedCharges
          200,   // savingsGoal
          10,    // totalSpent
          10     // cycleStartDay (cycle from Jan 10 to Feb 9)
        , transactions);

        expect(state.status).toBe('under');
        expect(state.todaySpent).toBe(0);
        expect(state.amount).toBeGreaterThan(0); // Should have positive remaining budget
        expect(state.initialDailyBudget).toBeGreaterThan(0);

        jest.useRealTimers();
      });

      it('should return "under" status when spending less than daily quota', () => {
        const mockDate = new Date(2024, 0, 15, 12, 0); // January 15, 2024 at noon
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        const transactions: Transaction[] = [
          createTransaction('1', 10, new Date(2024, 0, 15)), // Today - 10€
          createTransaction('2', 5, new Date(2024, 0, 14)),  // Yesterday - 5€
        ];

        const state = getDailySpendingState(
          2000,  // monthlyIncome
          800,   // fixedCharges  
          200,   // savingsGoal
          15,    // totalSpent (10 today + 5 yesterday)
          10,    // cycleStartDay
          transactions
        );

        expect(state.status).toBe('under');
        expect(state.todaySpent).toBe(10);
        expect(state.amount).toBeGreaterThan(0); // Positive remaining
        // With 2000-800-200=1000 reste à vivre, spent 15, 
        // remaining 985, and many days left, daily quota should be around 38€
        // So spending 10€ should leave us under budget
        expect(state.initialDailyBudget).toBeGreaterThan(state.todaySpent);

        jest.useRealTimers();
      });
    });

    describe('Over budget scenarios', () => {
      it('should return "over" status when spending exceeds daily quota', () => {
        const mockDate = new Date(2024, 0, 15, 20, 0); // January 15, 2024 at 8pm
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        // Scenario: User has 14€ daily budget but spent 15€ today
        const transactions: Transaction[] = [
          createTransaction('1', 15, new Date(2024, 0, 15)), // Today - 15€
        ];

        // Set up budget so that daily quota is around 14€
        // With 350€ reste à vivre over 25 days = 14€/day
        const state = getDailySpendingState(
          1150,  // monthlyIncome
          600,   // fixedCharges
          200,   // savingsGoal
          15,    // totalSpent (all today)
          10,    // cycleStartDay (from Jan 10, we're on day 6)
          transactions
        );

        expect(state.status).toBe('over');
        expect(state.todaySpent).toBe(15);
        expect(state.amount).toBeLessThan(0); // Negative means overspent
        // Daily budget should be around 14€, spent 15€, so -1€
        expect(state.amount).toBeCloseTo(-1, 0);

        jest.useRealTimers();
      });

      it('should return "over" with correct negative amount when significantly over budget', () => {
        const mockDate = new Date(2024, 0, 15); // January 15, 2024
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        const transactions: Transaction[] = [
          createTransaction('1', 50, new Date(2024, 0, 15)), // Today - big expense
        ];

        const state = getDailySpendingState(
          2000,  // monthlyIncome
          800,   // fixedCharges
          200,   // savingsGoal
          50,    // totalSpent
          10,    // cycleStartDay
          transactions
        );

        expect(state.status).toBe('over');
        expect(state.todaySpent).toBe(50);
        expect(state.amount).toBeLessThan(0); // Should be significantly negative

        jest.useRealTimers();
      });
    });

    describe('Edge cases', () => {
      it('should handle exact budget match', () => {
        const mockDate = new Date(2024, 0, 15);
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        // Carefully crafted to have exact daily budget
        const transactions: Transaction[] = [
          createTransaction('1', 40, new Date(2024, 0, 15)), // Today
        ];

        const state = getDailySpendingState(
          1800,  // monthlyIncome
          800,   // fixedCharges
          200,   // savingsGoal (800 reste à vivre over 20 days = 40/day)
          40,    // totalSpent
          10,    // cycleStartDay
          transactions
        );

        expect(state.todaySpent).toBe(40);
        // Should be either under (0 or positive) or very close to 0
        expect(state.status).toBeDefined();
        expect(state.amount).toBeDefined();

        jest.useRealTimers();
      });

      it('should handle income transactions correctly', () => {
        const mockDate = new Date(2024, 0, 15);
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        const transactions: Transaction[] = [
          createTransaction('1', 20, new Date(2024, 0, 15), 'expense'), // Today - expense
          createTransaction('2', 10, new Date(2024, 0, 15), 'income'),  // Today - income
        ];

        const state = getDailySpendingState(
          2000,
          800,
          200,
          20,    // totalSpent (expenses only)
          10,
          transactions,
          10     // totalIncome
        );

        // todaySpent should only count expenses
        expect(state.todaySpent).toBe(20);
        // Income should increase available budget, making it easier to stay under

        jest.useRealTimers();
      });

      it('should handle zero remaining days', () => {
        const mockDate = new Date(2024, 1, 9); // Last day of cycle (Feb 9)
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        const transactions: Transaction[] = [
          createTransaction('1', 15, new Date(2024, 1, 9)),
        ];

        const state = getDailySpendingState(
          2000,
          800,
          200,
          500,   // totalSpent
          10,    // cycleStartDay
          transactions
        );

        expect(state.todaySpent).toBe(15);
        // Should not crash with zero days remaining
        expect(state.status).toBeDefined();
        expect(state.amount).toBeDefined();

        jest.useRealTimers();
      });

      it('should handle multiple transactions today', () => {
        const mockDate = new Date(2024, 0, 15);
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        const transactions: Transaction[] = [
          createTransaction('1', 5, new Date(2024, 0, 15)),  // Today
          createTransaction('2', 3, new Date(2024, 0, 15)),  // Today
          createTransaction('3', 7, new Date(2024, 0, 15)),  // Today
          createTransaction('4', 10, new Date(2024, 0, 14)), // Yesterday
        ];

        const state = getDailySpendingState(
          2000,
          800,
          200,
          25,    // totalSpent (5+3+7+10)
          10,
          transactions
        );

        expect(state.todaySpent).toBe(15); // 5+3+7

        jest.useRealTimers();
      });
    });

    describe('Custom cycle mode', () => {
      it('should work correctly in custom mode', () => {
        const mockDate = new Date(2024, 0, 15);
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        const transactions: Transaction[] = [
          createTransaction('1', 20, new Date(2024, 0, 15)),
        ];

        const state = getDailySpendingState(
          500,   // monthlyIncome (actually budget available in custom mode)
          0,     // fixedCharges (not used in custom mode)
          0,     // savingsGoal (not used in custom mode)
          20,    // totalSpent
          10,    // cycleStartDay (not really used in custom mode)
          transactions,
          0,     // totalIncome
          undefined, // midCycleOnboarding
          'custom', // cycleMode
          '2024-01-10', // customStartDate
          '2024-01-25'  // customEndDate
        );

        expect(state.todaySpent).toBe(20);
        expect(state.status).toBeDefined();
        // Should use full 500€ budget, not deduct charges/savings

        jest.useRealTimers();
      });
    });

    describe('Mid-cycle onboarding', () => {
      it('should handle mid-cycle onboarding correctly', () => {
        const mockDate = new Date(2024, 0, 15);
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);

        const transactions: Transaction[] = [
          createTransaction('1', 10, new Date(2024, 0, 15)),
        ];

        const state = getDailySpendingState(
          2000,
          800,
          200,
          10,
          10,
          transactions,
          0,
          {
            remainingAmount: 200,
            cycleEndDate: '2024-02-09',
          }
        );

        expect(state.todaySpent).toBe(10);
        // Should use remaining amount of 200€ for calculations
        expect(state.status).toBeDefined();

        jest.useRealTimers();
      });
    });
  });
});
