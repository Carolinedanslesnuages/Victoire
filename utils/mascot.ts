/**
 * Mascot utilities for L'Écureuil Économe
 * Determines mascot mood based on "Reste à Vivre" percentage
 */

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
  imageUrl: string;
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

/**
 * Get mascot state including mood, zone, image URL and description
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
  
  // Map mood to image URLs (from GitHub issue)
  const imageUrls: Record<MascotMood, string> = {
    serein: 'https://github.com/user-attachments/assets/921a9249-7427-4c14-a7f4-8f8345d63647',
    joyeux: 'https://github.com/user-attachments/assets/9b8d55c7-94e5-47cc-862d-406591d56af8',
    optimiste: 'https://github.com/user-attachments/assets/a3c76651-dbbc-406b-957c-93c1089d8f87',
    determine: 'https://github.com/user-attachments/assets/2aa04abb-74ac-41b6-bb64-f698d5681694',
    vigilant: 'https://github.com/user-attachments/assets/14f13e27-87ae-4438-ba6f-d7e0dffa47d7',
    inquiet: 'https://github.com/user-attachments/assets/472e4b08-ff92-4c60-bd2d-f2e6ff547fa0',
    nerveux: 'https://github.com/user-attachments/assets/203e4390-2269-4d7a-8967-4b8e54130d9e',
    fatigue: '', // No image provided in issue
    panique: 'https://github.com/user-attachments/assets/2845e5ae-1d23-4b9b-8a04-0727c482b29d',
    detresse: 'https://github.com/user-attachments/assets/8ad8d7f2-6675-4883-b581-e1b770fddd85',
  };
  
  return {
    mood,
    zone,
    imageUrl: imageUrls[mood],
    description: `mascot.moods.${mood}`,
  };
};
