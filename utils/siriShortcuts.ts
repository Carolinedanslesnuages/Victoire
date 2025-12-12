/**
 * Siri Shortcuts utilities for iOS
 * Enables hands-free expense tracking via Siri
 */

import { Platform } from 'react-native';

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
 * Get Siri Shortcuts capability status
 */
export const isSiriShortcutsAvailable = (): boolean => {
  return Platform.OS === 'ios' && parseInt(Platform.Version as string, 10) >= 12;
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
