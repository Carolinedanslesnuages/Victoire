/**
 * Siri Shortcuts utilities for iOS
 * Enables hands-free expense tracking via Siri
 */

import { Platform } from 'react-native';
import { Transaction } from '../types';
import { parseVoiceCommand, findVoiceCommandPhrase } from './voiceCommands';

/**
 * Siri Shortcut action types
 */
export type SiriShortcutAction = 'addExpense' | 'viewBudget' | 'customPhrase';

/**
 * Siri Shortcut data interface
 */
export interface SiriShortcutData {
  action: SiriShortcutAction;
  amount?: number;
  description?: string;
  category?: string;
  phraseId?: string;
}

/**
 * Donate a Siri Shortcut to iOS
 * This makes the shortcut available for Siri to learn and suggest
 * 
 * Note: In a production app, this would use NSUserActivity or Intents API
 * For Expo/React Native without native modules, we configure this in app.json
 */
export const donateSiriShortcut = async (
  activityType: string,
  title: string,
  userInfo?: Record<string, any>
): Promise<boolean> => {
  try {
    if (Platform.OS !== 'ios') {
      return false;
    }
    
    // In a full native implementation, we would use:
    // const activity = new NSUserActivity(activityType);
    // activity.title = title;
    // activity.userInfo = userInfo;
    // activity.isEligibleForPrediction = true;
    // activity.becomeCurrent();
    
    // For Expo, shortcuts are configured via app.json and Quick Actions
    console.log('Siri shortcut donation requested:', { activityType, title, userInfo });
    return true;
  } catch (error) {
    console.error('Error donating Siri shortcut:', error);
    return false;
  }
};

/**
 * Handle an incoming Siri Shortcut intent
 * This is called when the app is opened via a Siri Shortcut
 */
export const handleSiriShortcut = async (
  intent: string,
  parameters?: Record<string, any>
): Promise<Transaction | null> => {
  try {
    if (Platform.OS !== 'ios') {
      return null;
    }
    
    // Parse the intent
    switch (intent) {
      case 'addExpense':
        return await handleAddExpenseIntent(parameters);
      case 'customPhrase':
        return await handleCustomPhraseIntent(parameters);
      default:
        console.warn('Unknown Siri intent:', intent);
        return null;
    }
  } catch (error) {
    console.error('Error handling Siri shortcut:', error);
    return null;
  }
};

/**
 * Handle "Add Expense" Siri intent
 */
const handleAddExpenseIntent = async (
  parameters?: Record<string, any>
): Promise<Transaction | null> => {
  try {
    if (!parameters) {
      return null;
    }
    
    const { amount, description, category } = parameters;
    
    if (!amount || isNaN(parseFloat(amount))) {
      return null;
    }
    
    // Return a transaction object without ID (will be added when saved)
    return {
      id: '', // Will be set by saveTransaction
      amount: parseFloat(amount),
      description: description || 'Dépense via Siri',
      category: category || undefined,
      date: new Date().toISOString(),
      type: 'expense',
    };
  } catch (error) {
    console.error('Error handling add expense intent:', error);
    return null;
  }
};

/**
 * Handle "Custom Phrase" Siri intent
 */
const handleCustomPhraseIntent = async (
  parameters?: Record<string, any>
): Promise<Transaction | null> => {
  try {
    if (!parameters || !parameters.phraseText) {
      return null;
    }
    
    const { phraseText } = parameters;
    
    // Try to find a matching custom phrase
    const phrase = await findVoiceCommandPhrase(phraseText);
    
    if (phrase) {
      return {
        id: '', // Will be set by saveTransaction
        amount: phrase.amount,
        description: phrase.description,
        category: phrase.category,
        date: new Date().toISOString(),
        type: 'expense',
      };
    }
    
    // If no custom phrase found, try to parse as a command
    const parsed = parseVoiceCommand(phraseText);
    if (parsed && parsed.amount) {
      return {
        id: '',
        amount: parsed.amount,
        description: 'Dépense vocale',
        date: new Date().toISOString(),
        type: 'expense',
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error handling custom phrase intent:', error);
    return null;
  }
};

/**
 * Register common Siri Shortcuts for the app
 * This should be called when the app starts and when user configures shortcuts
 */
export const registerSiriShortcuts = async (): Promise<boolean> => {
  try {
    if (Platform.OS !== 'ios') {
      return false;
    }
    
    // Donate the "Add Expense" shortcut
    await donateSiriShortcut(
      'com.carolinedanslesnuages.pace.addExpense',
      'Ajouter une dépense',
      { action: 'addExpense' }
    );
    
    console.log('Siri shortcuts registered successfully');
    return true;
  } catch (error) {
    console.error('Error registering Siri shortcuts:', error);
    return false;
  }
};

/**
 * Create a user-specific Siri Shortcut for a custom phrase
 */
export const createCustomPhraseSiriShortcut = async (
  phraseId: string,
  phraseText: string
): Promise<boolean> => {
  try {
    if (Platform.OS !== 'ios') {
      return false;
    }
    
    await donateSiriShortcut(
      `com.carolinedanslesnuages.pace.customPhrase.${phraseId}`,
      phraseText,
      {
        action: 'customPhrase',
        phraseId,
        phraseText,
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error creating custom phrase Siri shortcut:', error);
    return false;
  }
};

/**
 * Get Siri Shortcuts capability status
 */
export const isSiriShortcutsAvailable = (): boolean => {
  return Platform.OS === 'ios' && parseInt(Platform.Version as string, 10) >= 12;
};

/**
 * Format a voice command example for display
 */
export const getVoiceCommandExample = (phrase: string): string => {
  return `"Dis Siri, ${phrase}"`;
};

/**
 * Get localized instructions for setting up Siri Shortcuts
 */
export const getSiriSetupInstructions = (): string[] => {
  return [
    'Ouvrez l\'app Raccourcis sur votre iPhone',
    'Créez un nouveau raccourci',
    'Ajoutez l\'action "Ouvrir l\'app"',
    'Sélectionnez PACE dans la liste',
    'Personnalisez la phrase d\'activation',
    'Enregistrez et testez avec "Dis Siri, [votre phrase]"',
  ];
};
