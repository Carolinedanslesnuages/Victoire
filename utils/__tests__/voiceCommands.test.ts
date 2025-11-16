/**
 * Voice Commands Utilities Tests
 */

import {
  addVoiceCommandPhrase,
  deleteVoiceCommandPhrase,
  findVoiceCommandPhrase,
  loadVoiceCommandSettings,
  parseVoiceCommand,
  getDefaultVoiceCommandSettings,
} from '../voiceCommands';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Voice Commands Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDefaultVoiceCommandSettings', () => {
    it('should return default settings with enabled true and empty phrases', () => {
      const settings = getDefaultVoiceCommandSettings();
      expect(settings.enabled).toBe(true);
      expect(settings.customPhrases).toEqual([]);
    });
  });

  describe('parseVoiceCommand', () => {
    it('should parse "ajoute 15 euros" correctly', () => {
      const result = parseVoiceCommand('ajoute 15 euros');
      expect(result).not.toBeNull();
      expect(result?.action).toBe('add');
      expect(result?.amount).toBe(15);
      expect(result?.currency).toBe('EUR');
    });

    it('should parse "add 20.50 euros" correctly', () => {
      const result = parseVoiceCommand('add 20.50 euros');
      expect(result).not.toBeNull();
      expect(result?.action).toBe('add');
      expect(result?.amount).toBe(20.5);
    });

    it('should parse "ajouter 10.99 €" correctly', () => {
      const result = parseVoiceCommand('ajouter 10.99 €');
      expect(result).not.toBeNull();
      expect(result?.action).toBe('add');
      expect(result?.amount).toBe(10.99);
    });

    it('should return null for invalid commands', () => {
      const result = parseVoiceCommand('hello world');
      expect(result).toBeNull();
    });

    it('should handle decimal amounts with comma', () => {
      const result = parseVoiceCommand('ajoute 15,50 euros');
      expect(result).not.toBeNull();
      expect(result?.amount).toBe(15.5);
    });
  });

  describe('Voice Command Phrase Management', () => {
    it('should create a phrase with proper structure', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify({
        enabled: true,
        customPhrases: [],
      }));
      AsyncStorage.setItem.mockResolvedValue(undefined);

      const phrase = await addVoiceCommandPhrase({
        phrase: 'J\'ai acheté du pain',
        amount: 3.50,
        description: 'Boulangerie',
        category: 'Alimentation',
      });

      expect(phrase).not.toBeNull();
      expect(phrase?.phrase).toBe('J\'ai acheté du pain');
      expect(phrase?.amount).toBe(3.50);
      expect(phrase?.description).toBe('Boulangerie');
      expect(phrase?.category).toBe('Alimentation');
      expect(phrase?.id).toBeDefined();
      expect(phrase?.createdAt).toBeDefined();
    });

    it('should load voice command settings from storage', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      const mockSettings = {
        enabled: true,
        customPhrases: [
          {
            id: '1',
            phrase: 'Test phrase',
            amount: 10,
            description: 'Test',
            createdAt: new Date().toISOString(),
          },
        ],
      };
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockSettings));

      const settings = await loadVoiceCommandSettings();
      expect(settings.enabled).toBe(true);
      expect(settings.customPhrases).toHaveLength(1);
      expect(settings.customPhrases[0].phrase).toBe('Test phrase');
    });
  });

  describe('findVoiceCommandPhrase', () => {
    it('should find a matching phrase case-insensitively', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      const mockSettings = {
        enabled: true,
        customPhrases: [
          {
            id: '1',
            phrase: 'J\'ai acheté du pain',
            amount: 3.50,
            description: 'Boulangerie',
            createdAt: new Date().toISOString(),
          },
        ],
      };
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockSettings));

      const phrase = await findVoiceCommandPhrase('j\'ai acheté du pain');
      expect(phrase).not.toBeNull();
      expect(phrase?.amount).toBe(3.50);
    });

    it('should return null when no phrase matches', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify({
        enabled: true,
        customPhrases: [],
      }));

      const phrase = await findVoiceCommandPhrase('nonexistent phrase');
      expect(phrase).toBeNull();
    });
  });
});
