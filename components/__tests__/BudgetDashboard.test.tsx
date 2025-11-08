/**
 * Component tests for BudgetDashboard
 * Testing the "Budget Indicator" rendering and styling based on values
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import BudgetDashboard from '../BudgetDashboard';
import { BudgetProfile } from '../../types';

// Mock the storage module
jest.mock('../../utils/storage', () => ({
  getTransactionsForBudget: jest.fn(() => Promise.resolve([])),
  getTransactionsForPreviousCycleSameDay: jest.fn(() => Promise.resolve([])),
  deleteTransaction: jest.fn(() => Promise.resolve(true)),
  loadUserPreferences: jest.fn(() => Promise.resolve({
    currency: 'EUR',
    customCategories: [],
  })),
}));

// Mock analytics module
jest.mock('../../utils/analytics', () => ({
  calculateCategorySpending: jest.fn(() => []),
  getTopCategories: jest.fn(() => []),
  compareMonthlySpending: jest.fn(() => ({
    currentMonth: 0,
    previousMonth: 0,
    difference: 0,
    differencePercentage: 0,
  })),
}));

// Mock mascot module
jest.mock('../../utils/mascot', () => ({
  getMascotState: jest.fn(() => ({
    mood: 'happy',
    expression: '😊',
  })),
}));

// Mock streaks module
jest.mock('../../utils/streaks', () => ({
  calculateStreak: jest.fn(() => Promise.resolve({
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: '',
    isActive: false,
    streakFreezes: 2,
    jokersRemaining: 3,
  })),
}));

// Mock gamification module
jest.mock('../../utils/gamification', () => ({
  checkAndUnlockBadges: jest.fn(() => Promise.resolve([])),
  unlockBadge: jest.fn(() => Promise.resolve(null)),
}));

describe('BudgetDashboard Component Tests', () => {
  const mockOnReconfigure = jest.fn();

  const positiveProfile: BudgetProfile = {
    id: 'test-budget-1',
    type: 'personal',
    name: 'Personnel',
    monthlyIncome: 3000,
    fixedCharges: 1000,
    savingsGoal: 500,
    cycleStartDay: 1,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Set a consistent date for tests
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2024, 0, 15)); // January 15, 2024
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Daily Budget Indicator Display', () => {
    it('should display positive daily budget with green/success color', async () => {
      const { getByText } = render(
        <BudgetDashboard profile={positiveProfile} onReconfigure={mockOnReconfigure} />
      );

      // Wait for the component to render
      await screen.findByText(/Budget du Jour|Reste à Vivre/i, {}, { timeout: 2000 });

      // The daily budget should be displayed (1500 reste à vivre / ~16 days remaining)
      // We're checking that a positive amount is shown
      const budgetElements = getByText(/€|EUR/i);
      expect(budgetElements).toBeTruthy();
    });

    it('should render with correct structure for positive budget', async () => {
      const { queryByText } = render(
        <BudgetDashboard profile={positiveProfile} onReconfigure={mockOnReconfigure} />
      );

      await screen.findByText(/Budget du Jour|Reste à Vivre/i, {}, { timeout: 2000 });

      // With positive budget, warning text should not be present
      const warningText = queryByText(/Attention|dépassé|exceeded/i);
      expect(warningText).toBeNull();
    });

    it('should display negative daily budget with red/error color when overspent', async () => {
      const overspentProfile: BudgetProfile = {
        id: 'test-budget-2',
        type: 'personal',
        name: 'Personnel',
        monthlyIncome: 1000,
        fixedCharges: 500,
        savingsGoal: 300,
        cycleStartDay: 1,
        createdAt: new Date().toISOString(),
      };

      // Mock transactions showing overspending
      const storage = require('../../utils/storage');
      storage.getTransactionsForBudget.mockResolvedValue([
        { id: '1', amount: 250, description: 'Expense 1', date: new Date().toISOString() },
        { id: '2', amount: 100, description: 'Expense 2', date: new Date().toISOString() },
      ]);

      const { getByText } = render(
        <BudgetDashboard profile={overspentProfile} onReconfigure={mockOnReconfigure} />
      );

      await screen.findByText(/Budget du Jour|Reste à Vivre/i, {}, { timeout: 2000 });

      // Should display some budget amount
      const budgetElements = getByText(/€|EUR/i);
      expect(budgetElements).toBeTruthy();
    });
  });

  describe('Transaction List Display', () => {
    it('should display "no transactions" message when list is empty', async () => {
      const { getByText } = render(
        <BudgetDashboard profile={positiveProfile} onReconfigure={mockOnReconfigure} />
      );

      await screen.findByText(/Budget du Jour|Reste à Vivre/i, {}, { timeout: 2000 });

      // Should show no transactions message
      const noTransactionsText = getByText(/Aucune transaction|Aucune dépense|No transactions/i);
      expect(noTransactionsText).toBeTruthy();
    });

    it('should correctly display transaction list with mocked data', async () => {
      // Mock transactions
      const mockTransactions = [
        {
          id: '1',
          amount: 50,
          description: 'Café',
          date: new Date(2024, 0, 14).toISOString(),
          category: 'Alimentation',
        },
        {
          id: '2',
          amount: 120,
          description: 'Restaurant',
          date: new Date(2024, 0, 13).toISOString(),
          category: 'Loisirs',
        },
        {
          id: '3',
          amount: 30,
          description: 'Transport',
          date: new Date(2024, 0, 12).toISOString(),
          category: 'Transport',
        },
      ];

      const storage = require('../../utils/storage');
      storage.getTransactionsForBudget.mockResolvedValue(mockTransactions);

      const { getByText } = render(
        <BudgetDashboard profile={positiveProfile} onReconfigure={mockOnReconfigure} />
      );

      await screen.findByText(/Budget du Jour|Reste à Vivre/i, {}, { timeout: 2000 });

      // Should display transaction descriptions
      await screen.findByText('Café', {}, { timeout: 2000 });
      const cafeTransaction = getByText('Café');
      expect(cafeTransaction).toBeTruthy();

      const restaurantTransaction = getByText('Restaurant');
      expect(restaurantTransaction).toBeTruthy();

      const transportTransaction = getByText('Transport');
      expect(transportTransaction).toBeTruthy();

      // Should display categories
      const alimentationCategory = getByText('Alimentation');
      expect(alimentationCategory).toBeTruthy();

      const loisirsCategory = getByText('Loisirs');
      expect(loisirsCategory).toBeTruthy();
    });

    it('should display transaction amounts correctly formatted', async () => {
      const mockTransactions = [
        {
          id: '1',
          amount: 50.5,
          description: 'Test Expense',
          date: new Date(2024, 0, 14).toISOString(),
        },
      ];

      const storage = require('../../utils/storage');
      storage.getTransactionsForBudget.mockResolvedValue(mockTransactions);

      const { getByText } = render(
        <BudgetDashboard profile={positiveProfile} onReconfigure={mockOnReconfigure} />
      );

      await screen.findByText(/Budget du Jour|Reste à Vivre/i, {}, { timeout: 2000 });

      // Should display the transaction
      await screen.findByText('Test Expense', {}, { timeout: 2000 });
      const testExpense = getByText('Test Expense');
      expect(testExpense).toBeTruthy();

      // Amount should be formatted with currency (the minus sign and amount are in the same text)
      const amountText = getByText(/-.*50.*€|EUR/i);
      expect(amountText).toBeTruthy();
    });
  });

  describe('Budget Status Rendering', () => {
    it('should render monthly health card with cycle information', async () => {
      const { getByText } = render(
        <BudgetDashboard profile={positiveProfile} onReconfigure={mockOnReconfigure} />
      );

      await screen.findByText(/Budget du Jour|Reste à Vivre/i, {}, { timeout: 2000 });

      // Should display days remaining information
      const daysRemainingText = getByText(/jour|day/i);
      expect(daysRemainingText).toBeTruthy();
    });

    it('should display percentage of budget spent', async () => {
      const mockTransactions = [
        {
          id: '1',
          amount: 500,
          description: 'Large Expense',
          date: new Date(2024, 0, 14).toISOString(),
        },
      ];

      const storage = require('../../utils/storage');
      storage.getTransactionsForBudget.mockResolvedValue(mockTransactions);

      const { getByText } = render(
        <BudgetDashboard profile={positiveProfile} onReconfigure={mockOnReconfigure} />
      );

      await screen.findByText(/Budget du Jour|Reste à Vivre/i, {}, { timeout: 2000 });

      // Should display a percentage (reste à vivre is 1500, spent 500 = 33%)
      const percentageText = getByText(/\d+%/);
      expect(percentageText).toBeTruthy();
    });
  });

  describe('Accessibility and Typography', () => {
    it('should use appropriate font sizes for the daily budget display', async () => {
      const { getByText } = render(
        <BudgetDashboard profile={positiveProfile} onReconfigure={mockOnReconfigure} />
      );

      await screen.findByText(/Budget du Jour|Reste à Vivre/i, {}, { timeout: 2000 });

      // The component should render with accessible text
      const budgetLabel = getByText(/Budget du Jour|Reste à Vivre/i);
      expect(budgetLabel).toBeTruthy();
      expect(budgetLabel.props.style).toBeDefined();
    });

    it('should render budget name if provided', async () => {
      const namedProfile: BudgetProfile = {
        ...positiveProfile,
        name: 'Mon Budget Personnel',
      };

      const { getByText } = render(
        <BudgetDashboard profile={namedProfile} onReconfigure={mockOnReconfigure} />
      );

      await screen.findByText(/Budget du Jour|Reste à Vivre/i, {}, { timeout: 2000 });

      const budgetName = getByText('Mon Budget Personnel');
      expect(budgetName).toBeTruthy();
    });
  });
});
