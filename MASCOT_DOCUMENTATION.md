# L'Écureuil Économe - Reactive Mascot Documentation

## Overview

This feature implements a reactive squirrel mascot that creates an emotional connection with users by displaying different moods based on their budget status. The mascot is called **L'Écureuil Économe** (The Thrifty Squirrel).

## Feature Details

### Epic UI 3: Identité & Mascotte
**Feature UI 3.1: La Mascotte Réactive**
**User Story UI 3.1.1**: As a user, I want to see a small mascot on the dashboard whose mood changes based on my "Reste à Vivre" (remaining budget) for the day.

## Implementation

### Files Created

1. **`utils/mascot.ts`** - Mascot utility functions
   - `calculateResteAVivrePercentage()` - Calculates remaining budget percentage
   - `getMascotMood()` - Determines mood based on percentage
   - `getMascotZone()` - Determines zone (green/yellow/red)
   - `getMascotState()` - Complete mascot state with mood, zone, and image

2. **`components/MascotDisplay.tsx`** - React Native component
   - Displays mascot image from GitHub URLs
   - Shows mood name and zone badge
   - Supports 3 sizes: small (80px), medium (120px), large (160px)
   - Uses theme colors for zone indicators

### Files Modified

1. **`constants/theme.ts`** - Added mascot color palette
2. **`locales/fr.json`** - French translations
3. **`locales/en.json`** - English translations
4. **`components/BudgetDashboard.tsx`** - Integrated mascot display

## Emotion States

The mascot has 10 distinct emotional states across 3 zones:

### 🟢 Zone Verte (Green Zone): Budget Confortable (> 50%)

| Percentage | Mood | French | English | Description |
|------------|------|--------|---------|-------------|
| > 75% | `serein` | Heureux & Serein | Happy & Serene | Totally relaxed, abundant reserves |
| 60-75% | `joyeux` | Content & Taquin | Content & Playful | Budget is doing well |
| 50-60% | `optimiste` | Soulagé & Optimiste | Relieved & Optimistic | Budget is holding |

### 🟡 Zone Jaune (Yellow Zone): Gestion Stricte (10-50%)

| Percentage | Mood | French | English | Description |
|------------|------|--------|---------|-------------|
| 40-50% | `determine` | Déterminé & Concentré | Determined & Focused | In management mode |
| 25-40% | `vigilant` | Concentré & Vigilant | Focused & Vigilant | Watch spending |
| 15-25% | `inquiet` | Légèrement Inquiet | Slightly Worried | Budget tightening |
| 10-15% | `nerveux` | Hésitant & Nerveux | Hesitant & Nervous | Critical zone |

### 🔴 Zone Rouge (Red Zone): Budget Critique (< 10%)

| Percentage | Mood | French | English | Description |
|------------|------|--------|---------|-------------|
| 5-10% | `fatigue` | Fatigué & Dépassé | Tired & Overwhelmed | Very tight budget |
| 0-5% | `panique` | Très Inquiet & Paniqué | Very Worried & Panicked | About to go negative |
| < 0% | `detresse` | En Détresse | In Distress | Budget in deficit |

## Color Palette

The mascot uses the following colors from the design specification:

```typescript
mascot: {
  orangeEcureuil: '#D46F4D',   // Orange Squirrel - Main accent
  brunNoisette: '#9C5B3D',     // Hazelnut Brown - Secondary text
  roseKawaii: '#FFB0AD',       // Kawaii Pink - Decorative elements
  vertSucces: '#47B28F',       // Success Green - Green zone
  jauneVigilance: '#FFC759',   // Vigilance Yellow - Yellow zone
  rougeDanger: '#E55C5C',      // Danger Red - Red zone
}
```

## Usage Example

```typescript
import { getMascotState } from '../utils/mascot';
import MascotDisplay from '../components/MascotDisplay';

// Calculate mascot state
const mascotState = getMascotState(
  monthlyIncome,    // e.g., 2500
  fixedCharges,     // e.g., 1200
  savingsGoal,      // e.g., 300
  totalSpent        // e.g., 500
);

// Display mascot
<MascotDisplay 
  mascotState={mascotState} 
  showDescription={true} 
  size="medium" 
/>
```

## Calculation Logic

The "Reste à Vivre" percentage is calculated as:

```
Reste à Vivre = Monthly Income - Fixed Charges - Savings Goal
Remaining = Reste à Vivre - Total Spent
Percentage = (Remaining / Reste à Vivre) × 100
```

### Example:
- Monthly Income: €2,500
- Fixed Charges: €1,200
- Savings Goal: €300
- **Reste à Vivre: €1,000**

If you've spent €300:
- Remaining: €700
- Percentage: 70%
- Mood: **Joyeux** (Content & Playful)
- Zone: **Green** 🟢

## Image URLs

The mascot images are hosted on GitHub and referenced by mood:

- **serein**: https://github.com/user-attachments/assets/921a9249-7427-4c14-a7f4-8f8345d63647
- **joyeux**: https://github.com/user-attachments/assets/9b8d55c7-94e5-47cc-862d-406591d56af8
- **optimiste**: https://github.com/user-attachments/assets/a3c76651-dbbc-406b-957c-93c1089d8f87
- **determine**: https://github.com/user-attachments/assets/2aa04abb-74ac-41b6-bb64-f698d5681694
- **vigilant**: https://github.com/user-attachments/assets/14f13e27-87ae-4438-ba6f-d7e0dffa47d7
- **inquiet**: https://github.com/user-attachments/assets/472e4b08-ff92-4c60-bd2d-f2e6ff547fa0
- **nerveux**: https://github.com/user-attachments/assets/203e4390-2269-4d7a-8967-4b8e54130d9e
- **fatigue**: (No image provided)
- **panique**: https://github.com/user-attachments/assets/2845e5ae-1d23-4b9b-8a04-0727c482b29d
- **detresse**: https://github.com/user-attachments/assets/8ad8d7f2-6675-4883-b581-e1b770fddd85

## Testing

The mascot logic has been verified through code inspection and manual testing scenarios. All 10 emotion states correctly map to their corresponding percentage ranges.

## Design Principles

1. **Emotional Connection**: The mascot creates an emotional bond with users
2. **Visual Feedback**: Clear visual indicators (colors, expressions) for budget status
3. **Progressive Warning**: Gradual mood changes provide early warnings
4. **Kawaii Style**: Warm, friendly design that reduces financial stress
5. **Culturally Aware**: Works in both French and English contexts

## Future Enhancements

Potential future improvements:
- Animated transitions between moods
- Sound effects or voice feedback
- Additional mascot variations
- Customizable mascot appearances
- Achievement/milestone celebrations
