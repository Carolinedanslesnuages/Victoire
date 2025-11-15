/**
 * @jest-environment node
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  getBonusPiggyBank, 
  saveBonusPiggyBank, 
  addToBonusPiggyBank,
  breakBonusPiggyBank,
  createBudgetProfile,
  resetAllData,
} from '../storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
  getAllKeys: jest.fn(),
}));

describe('Bonus Piggy Bank Storage Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBonusPiggyBank', () => {
    it('should return default piggy bank when none exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const result = await getBonusPiggyBank('test-budget');
      
      expect(result).toEqual({
        amount: 0,
        lastProcessedDate: '',
        monthlyHistory: [],
      });
    });

    it('should return saved piggy bank data', async () => {
      const savedData = {
        amount: 50,
        lastProcessedDate: '2024-01-15T00:00:00.000Z',
        monthlyHistory: [
          { month: '2024-01', totalAccumulated: 50 },
        ],
      };
      
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(savedData));
      
      const result = await getBonusPiggyBank('test-budget');
      
      expect(result).toEqual(savedData);
    });
  });

  describe('saveBonusPiggyBank', () => {
    it('should save piggy bank data successfully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      
      const piggyBank = {
        amount: 100,
        lastProcessedDate: '2024-01-15T00:00:00.000Z',
        monthlyHistory: [
          { month: '2024-01', totalAccumulated: 100 },
        ],
      };
      
      const result = await saveBonusPiggyBank(piggyBank, 'test-budget');
      
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@pace_bonus_piggy_bank_test-budget',
        JSON.stringify(piggyBank)
      );
    });

    it('should return false on error', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));
      
      const piggyBank = {
        amount: 100,
        lastProcessedDate: '2024-01-15T00:00:00.000Z',
        monthlyHistory: [],
      };
      
      const result = await saveBonusPiggyBank(piggyBank, 'test-budget');
      
      expect(result).toBe(false);
    });
  });

  describe('addToBonusPiggyBank', () => {
    it('should add amount to existing piggy bank', async () => {
      const today = new Date();
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      
      const existingPiggyBank = {
        amount: 50,
        lastProcessedDate: '2024-01-10T00:00:00.000Z',
        monthlyHistory: [
          { month: currentMonth, totalAccumulated: 50 },
        ],
      };
      
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingPiggyBank));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      
      const result = await addToBonusPiggyBank(25, 'test-budget');
      
      expect(result).not.toBeNull();
      expect(result?.amount).toBe(75);
      expect(result?.monthlyHistory[0].totalAccumulated).toBe(75);
    });

    it('should create new monthly history entry if needed', async () => {
      const existingPiggyBank = {
        amount: 50,
        lastProcessedDate: '2024-01-10T00:00:00.000Z',
        monthlyHistory: [
          { month: '2023-12', totalAccumulated: 50 },
        ],
      };
      
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingPiggyBank));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      
      const result = await addToBonusPiggyBank(30, 'test-budget');
      
      expect(result).not.toBeNull();
      expect(result?.amount).toBe(80);
      expect(result?.monthlyHistory.length).toBe(2);
    });

    it('should return null for zero or negative amounts', async () => {
      const result = await addToBonusPiggyBank(0, 'test-budget');
      expect(result).toBeNull();
      
      const result2 = await addToBonusPiggyBank(-10, 'test-budget');
      expect(result2).toBeNull();
    });
  });

  describe('breakBonusPiggyBank', () => {
    it('should reset piggy bank to zero and return amount', async () => {
      const existingPiggyBank = {
        amount: 150,
        lastProcessedDate: '2024-01-15T00:00:00.000Z',
        monthlyHistory: [
          { month: '2024-01', totalAccumulated: 150 },
        ],
      };
      
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingPiggyBank));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      
      const amount = await breakBonusPiggyBank('test-budget');
      
      expect(amount).toBe(150);
      
      // Verify that save was called with amount = 0
      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData.amount).toBe(0);
      expect(savedData.monthlyHistory).toEqual(existingPiggyBank.monthlyHistory);
    });

    it('should return 0 when piggy bank is empty', async () => {
      const existingPiggyBank = {
        amount: 0,
        lastProcessedDate: '2024-01-15T00:00:00.000Z',
        monthlyHistory: [],
      };
      
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existingPiggyBank));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      
      const amount = await breakBonusPiggyBank('test-budget');
      
      expect(amount).toBe(0);
    });
  });

  describe('Bonus Piggy Bank Initialization on Profile Creation', () => {
    beforeEach(() => {
      // Mock Date for consistent testing
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should initialize bonus piggy bank to 0 when creating a new profile', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const newProfile = {
        type: 'personal' as const,
        name: 'Test Budget',
        monthlyIncome: 3000,
        fixedCharges: 1000,
        savingsGoal: 500,
        cycleStartDay: 1,
      };

      const result = await createBudgetProfile(newProfile);

      expect(result).toBeTruthy();
      
      // Verify that saveBonusPiggyBank was called with proper initialization
      const piggyBankCalls = (AsyncStorage.setItem as jest.Mock).mock.calls.filter(
        call => call[0].includes('@pace_bonus_piggy_bank')
      );
      
      expect(piggyBankCalls.length).toBeGreaterThan(0);
      
      const savedPiggyBank = JSON.parse(piggyBankCalls[0][1]);
      expect(savedPiggyBank.amount).toBe(0);
      expect(savedPiggyBank.lastProcessedDate).toBe('2024-01-15'); // Local date format
      expect(savedPiggyBank.monthlyHistory).toEqual([]);
    });

    it('should use local date format (YYYY-MM-DD) to prevent timezone issues', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const newProfile = {
        type: 'personal' as const,
        name: 'Test Budget',
        monthlyIncome: 3000,
        fixedCharges: 1000,
        savingsGoal: 500,
        cycleStartDay: 1,
      };

      await createBudgetProfile(newProfile);

      const piggyBankCalls = (AsyncStorage.setItem as jest.Mock).mock.calls.filter(
        call => call[0].includes('@pace_bonus_piggy_bank')
      );
      
      const savedPiggyBank = JSON.parse(piggyBankCalls[0][1]);
      
      // Verify date format is YYYY-MM-DD (not ISO with time)
      expect(savedPiggyBank.lastProcessedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(savedPiggyBank.lastProcessedDate).not.toContain('T');
    });
  });

  describe('Bonus Piggy Bank Reset', () => {
    it('should remove all bonus piggy bank keys during reset', async () => {
      const allKeys = [
        '@pace_budget_profiles',
        '@pace_bonus_piggy_bank_personal-default',
        '@pace_bonus_piggy_bank_household-123456',
        '@pace_transactions',
        '@pace_user_preferences',
        '@other_app_key', // Should not be removed
      ];

      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue(allKeys);
      (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

      const result = await resetAllData();

      expect(result).toBe(true);
      expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@pace_budget_profiles',
        '@pace_bonus_piggy_bank_personal-default',
        '@pace_bonus_piggy_bank_household-123456',
        '@pace_transactions',
        '@pace_user_preferences',
      ]);
    });

    it('should not remove keys from other apps', async () => {
      const allKeys = [
        '@pace_bonus_piggy_bank_test',
        '@other_app_bonus_piggy_bank',
        '@another_app_key',
      ];

      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue(allKeys);
      (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

      await resetAllData();

      const removedKeys = (AsyncStorage.multiRemove as jest.Mock).mock.calls[0][0];
      expect(removedKeys).toEqual(['@pace_bonus_piggy_bank_test']);
      expect(removedKeys).not.toContain('@other_app_bonus_piggy_bank');
      expect(removedKeys).not.toContain('@another_app_key');
    });
  });
});
