/**
 * Mascot utilities for L'Écureuil Économe
 * Determines mascot mood based on "Reste à Vivre" percentage
 */

import { ImageSourcePropType } from 'react-native';

export type MascotMood = 
  | 'serein'      // >75% - Zone Verte
  | 'joyeux'      // 60-75% - Zone Verte
  | 'optimiste'   // 50-60% - Zone Verte
  | 'determine'   // 40-50% - Zone Jaune
  | 'vigilant'    // 25-40% - Zone Jaune
  | 'inquiet'     // 15-25% - Zone Jaune
  | 'nerveux'     // 10-15% - Zone Jaune
  | 'fatigue'     // 5-10% - Zone Rouge
  | 'panique'     // 0-5% - Zone Rouge
  | 'detresse';   // <0% - Zone Rouge

export interface MascotState {
  mood: MascotMood;
  zone: 'green' | 'yellow' | 'red';
  imageSource: ImageSourcePropType;
  description: string;
}

/**
 * Calculate the "Reste à Vivre" percentage
 * @param monthlyIncome - Monthly income
 * @param fixedCharges - Fixed charges
 * @param savingsGoal - Savings goal
 * @param totalSpent - Total amount spent in current cycle
 * @param totalIncome - Total income received in current cycle (optional)
 * @returns Percentage of remaining budget (can be negative)
 */
export const calculateResteAVivrePercentage = (
  monthlyIncome: number,
  fixedCharges: number,
  savingsGoal: number,
  totalSpent: number,
  totalIncome: number = 0
): number => {
  const resteAVivre = monthlyIncome - fixedCharges - savingsGoal;
  if (resteAVivre === 0) return 0;
  
  // Income increases the remaining budget
  const remaining = resteAVivre - totalSpent + totalIncome;
  return (remaining / resteAVivre) * 100;
};

/**
 * Get mascot mood based on "Reste à Vivre" percentage
 * @param percentage - Reste à Vivre percentage
 * @returns Mascot mood
 */
export const getMascotMood = (percentage: number): MascotMood => {
  if (percentage > 75) return 'serein';
  if (percentage > 60) return 'joyeux';
  if (percentage > 50) return 'optimiste';
  if (percentage > 40) return 'determine';
  if (percentage > 25) return 'vigilant';
  if (percentage > 15) return 'inquiet';
  if (percentage > 10) return 'nerveux';
  if (percentage > 5) return 'fatigue';
  if (percentage > 0) return 'panique';
  return 'detresse';
};

/**
 * Get mascot zone color based on percentage
 * @param percentage - Reste à Vivre percentage
 * @returns Zone color
 */
export const getMascotZone = (percentage: number): 'green' | 'yellow' | 'red' => {
  if (percentage > 50) return 'green';
  if (percentage > 10) return 'yellow';
  return 'red';
};

// Local mascot mood images
const MASCOT_IMAGES: Record<MascotMood, ImageSourcePropType> = {
  serein: require('../assets/mascotMood/serein.png'),
  joyeux: require('../assets/mascotMood/joyeux.png'),
  optimiste: require('../assets/mascotMood/optimiste.png'),
  determine: require('../assets/mascotMood/determine.png'),
  vigilant: require('../assets/mascotMood/vigilant.png'),
  inquiet: require('../assets/mascotMood/inquiet.png'),
  nerveux: require('../assets/mascotMood/nerveux.png'),
  fatigue: require('../assets/mascotMood/fatigue.png'),
  panique: require('../assets/mascotMood/panique.png'),
  detresse: require('../assets/mascotMood/detresse.png'),
};

/**
 * Get mascot state including mood, zone, image source and description
 * @param monthlyIncome - Monthly income
 * @param fixedCharges - Fixed charges
 * @param savingsGoal - Savings goal
 * @param totalSpent - Total amount spent in current cycle
 * @param totalIncome - Total income received in current cycle (optional)
 * @returns Complete mascot state
 */
export const getMascotState = (
  monthlyIncome: number,
  fixedCharges: number,
  savingsGoal: number,
  totalSpent: number,
  totalIncome: number = 0
): MascotState => {
  const percentage = calculateResteAVivrePercentage(
    monthlyIncome,
    fixedCharges,
    savingsGoal,
    totalSpent,
    totalIncome
  );
  
  const mood = getMascotMood(percentage);
  const zone = getMascotZone(percentage);
  
  return {
    mood,
    zone,
    imageSource: MASCOT_IMAGES[mood],
    description: `mascot.moods.${mood}`,
  };
};
