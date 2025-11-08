# Epic UI 4: Duolingo-Style Dashboard Header

## Overview
This document describes the implementation of the Duolingo-style Dashboard header with gamification features.

## Features Implemented

### Feature UI 4.1: Structure & Key Information

#### US UI 4.1.1: Visual Status Indicator
The header now displays a dynamic budget name instead of a simple static title:
- Shows custom budget name if configured (e.g., "Mon Budget Personnel")
- Displays household budget prefix when in household mode (e.g., "Mon'Day Foyer - Famille Dupont")
- Includes a flame icon 🔥 next to the name when the user has an active streak
- Makes the header more engaging and informative

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  Mon Budget PACE 🔥 7        ⚙️        │
│  Cycle du 5 de chaque mois              │
└─────────────────────────────────────────┘
```

#### US UI 4.1.2: Settings Icon
- Settings icon (⚙️) is now displayed prominently in the top-right corner of the header
- Provides easy access to configuration without scrolling
- Follows Duolingo's pattern of having important actions in the header

### Feature UI 4.2: Streak/Status Indicator

#### US UI 4.2.1: Daily Tracking Streak
The streak indicator motivates users to maintain consistent budget tracking:
- Displays 🔥 icon + number of consecutive days (e.g., "🔥 7")
- Only shows when streak is active (user has tracked expenses today or yesterday)
- Tracks the longest streak achieved for user motivation
- Automatically updates when new expenses are added

**Streak Logic:**
- A streak is active if the user has recorded at least one expense today or yesterday
- Consecutive days are calculated based on transaction dates
- If a day is missed, the streak resets to 0 (but longest streak is preserved)

#### US UI 4.2.2: Household Budget Mode
When configured in household/family mode:
- Displays "Mon'Day Foyer" prefix (French) or "Mon'Day Household" (English)
- Can show custom household name (e.g., "Mon'Day Foyer - Famille Dupont")
- Helps users identify which budget they're viewing
- Prepares for future multi-budget feature (Epic 25)

## Technical Implementation

### New Types Added

#### BudgetConfig Extension
```typescript
export interface BudgetConfig {
  // ... existing fields
  budgetName?: string;           // Optional custom budget name
  isHouseholdBudget?: boolean;   // True if household/family budget
  householdName?: string;        // Optional household name
}
```

#### StreakInfo Interface
```typescript
export interface StreakInfo {
  currentStreak: number;         // Number of consecutive days
  longestStreak: number;         // Best streak ever achieved
  lastActivityDate: string;      // ISO date string of last activity
  isActive: boolean;             // True if streak is currently active
}
```

### New Utility Functions

#### Streak Tracking (`utils/streaks.ts`)
- `loadStreakInfo()`: Load streak info from storage
- `saveStreakInfo()`: Save streak info to storage
- `calculateStreak()`: Calculate current streak based on transactions
- `updateStreakAfterActivity()`: Update streak after new transaction

### Localization Updates

Added new translation keys:
- `dashboard.header.defaultBudgetName`: Default budget name
- `dashboard.header.householdBudgetPrefix`: Household budget prefix
- `dashboard.header.streak`: Streak display format
- `dashboard.header.streakTooltip`: Streak tooltip text

Available in both French and English.

### Component Changes

Updated `BudgetDashboard.tsx`:
1. Added streak state management
2. Implemented `getBudgetDisplayName()` helper function
3. Redesigned header layout with flexbox
4. Added streak badge component
5. Positioned settings button in header
6. Updated styles for Duolingo-inspired design

## Usage

### For Standard Budget
No changes needed - the header will automatically display "Mon Budget PACE" or "My PACE Budget" based on the user's language.

### For Custom Budget Name
When saving budget configuration, include `budgetName`:
```typescript
const config: BudgetConfig = {
  monthlyIncome: 3000,
  fixedCharges: 1500,
  savingsGoal: 300,
  cycleStartDay: 5,
  budgetName: "Mon Budget Personnel" // Custom name
};
```

### For Household Budget
When saving budget configuration, set `isHouseholdBudget` and optionally `householdName`:
```typescript
const config: BudgetConfig = {
  monthlyIncome: 5000,
  fixedCharges: 2500,
  savingsGoal: 500,
  cycleStartDay: 1,
  isHouseholdBudget: true,
  householdName: "Famille Dupont" // Optional
};
```

### Streak Tracking
Streaks are automatically calculated based on transaction dates:
- Add at least one expense per day to maintain the streak
- The streak badge only appears when the streak is active
- Missing a day will reset the current streak (but keep the longest streak record)

## Design Principles

Following Duolingo's gamification approach:
1. **Visual Motivation**: Flame icon 🔥 provides positive reinforcement
2. **Progress Visibility**: Current streak count is always visible
3. **Easy Access**: Important actions (settings) are in the header
4. **Contextual Information**: Budget name helps identify the active budget
5. **Clean Layout**: Minimalist design with clear visual hierarchy

## Future Enhancements

This implementation prepares for:
- **Epic 10**: Full daily control streak features with rewards
- **Epic 25**: Multiple household budgets with switching
- Advanced streak statistics and achievements
- Social features (compare streaks with friends/family)

## Backward Compatibility

All changes are backward compatible:
- New optional fields in `BudgetConfig` have sensible defaults
- Existing budgets will display default name
- Streak starts at 0 for new users
- No database migration required
