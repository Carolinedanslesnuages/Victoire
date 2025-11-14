/**
 * @jest-environment node
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  getBonusPiggyBank, 
  saveBonusPiggyBank, 
  addToBonusPiggyBank,
  breakBonusPiggyBank,
} from '../storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
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
});
