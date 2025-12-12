/**
 * Voice Commands utilities
 * Manages custom voice command phrases for Siri Shortcuts and Google Assistant
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { VoiceCommandPhrase, VoiceCommandSettings } from '../types';

const VOICE_COMMANDS_KEY = '@pace_voice_commands';

/**
 * Get default voice command settings
 */
export const getDefaultVoiceCommandSettings = (): VoiceCommandSettings => ({
  enabled: true,
  customPhrases: [],
});

/**
 * Load voice command settings from storage
 */
export const loadVoiceCommandSettings = async (): Promise<VoiceCommandSettings> => {
  try {
    const jsonValue = await AsyncStorage.getItem(VOICE_COMMANDS_KEY);
    if (jsonValue) {
      return JSON.parse(jsonValue);
    }
    return getDefaultVoiceCommandSettings();
  } catch (error) {
    console.error('Error loading voice command settings:', error);
    return getDefaultVoiceCommandSettings();
  }
};

/**
 * Save voice command settings to storage
 */
export const saveVoiceCommandSettings = async (
  settings: VoiceCommandSettings
): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(VOICE_COMMANDS_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving voice command settings:', error);
    return false;
  }
};

/**
 * Add a new custom voice command phrase
 */
export const addVoiceCommandPhrase = async (
  phrase: Omit<VoiceCommandPhrase, 'id' | 'createdAt'>
): Promise<VoiceCommandPhrase | null> => {
  try {
    const settings = await loadVoiceCommandSettings();
    
    const newPhrase: VoiceCommandPhrase = {
      ...phrase,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    settings.customPhrases.push(newPhrase);
    const success = await saveVoiceCommandSettings(settings);
    
    return success ? newPhrase : null;
  } catch (error) {
    console.error('Error adding voice command phrase:', error);
    return null;
  }
};

/**
 * Update an existing voice command phrase
 */
export const updateVoiceCommandPhrase = async (
  id: string,
  updates: Partial<Omit<VoiceCommandPhrase, 'id' | 'createdAt'>>
): Promise<boolean> => {
  try {
    const settings = await loadVoiceCommandSettings();
    const phraseIndex = settings.customPhrases.findIndex((p) => p.id === id);
    
    if (phraseIndex === -1) {
      return false;
    }
    
    settings.customPhrases[phraseIndex] = {
      ...settings.customPhrases[phraseIndex],
      ...updates,
    };
    
    return await saveVoiceCommandSettings(settings);
  } catch (error) {
    console.error('Error updating voice command phrase:', error);
    return false;
  }
};

/**
 * Delete a voice command phrase
 */
export const deleteVoiceCommandPhrase = async (id: string): Promise<boolean> => {
  try {
    const settings = await loadVoiceCommandSettings();
    settings.customPhrases = settings.customPhrases.filter((p) => p.id !== id);
    return await saveVoiceCommandSettings(settings);
  } catch (error) {
    console.error('Error deleting voice command phrase:', error);
    return false;
  }
};


/**
 * Find a voice command phrase by matching text
 */
export const findVoiceCommandPhrase = async (
  text: string
): Promise<VoiceCommandPhrase | null> => {
  try {
    const settings = await loadVoiceCommandSettings();
    const normalizedText = text.toLowerCase().trim();
    
    return (
      settings.customPhrases.find(
        (p) => p.phrase.toLowerCase().trim() === normalizedText
      ) || null
    );
  } catch (error) {
    console.error('Error finding voice command phrase:', error);
    return null;
  }
};

/**
 * Parse a voice command to extract amount and action
 * Example: "ajoute 15 euros" -> { action: 'add', amount: 15, currency: 'euros' }
 */
export const parseVoiceCommand = (
  command: string
): { action: string; amount?: number; currency?: string } | null => {
  try {
    const normalizedCommand = command.toLowerCase().trim();
    
    // Pattern for "ajoute X euros/dollars"
    const addPattern = /(?:ajoute|ajouter|add)\s+(\d+(?:[.,]\d{1,2})?)\s*(?:euros?|€|dollars?|\$)?/i;
    const addMatch = normalizedCommand.match(addPattern);
    
    if (addMatch) {
      const amount = parseFloat(addMatch[1].replace(',', '.'));
      return {
        action: 'add',
        amount,
        currency: 'EUR',
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing voice command:', error);
    return null;
  }
};


