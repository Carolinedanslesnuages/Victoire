# Cagnotte Bonus (Bonus Piggy Bank) Feature

## Overview

The Bonus Piggy Bank feature (Epic 10.4) transforms PACE from a restrictive budgeting tool into a gamified accumulation experience. Users are now excited about saving rather than frustrated about unspent budget.

## User Stories

### US 10.4.1: Automatic Transfer of Unspent Budget
Each euro not spent at the end of the day (at midnight) is automatically transferred from the daily budget to a separate "Cagnotte Bonus" (Bonus Piggy Bank).

### US 10.4.2: Dashboard Display
The accumulated bonus is prominently displayed on the dashboard with a celebratory message (e.g., "🎉 12€ de bonus ce mois-ci!").

### US 10.4.3: Break the Piggy Bank
Users can "break" the piggy bank at any time for a pleasure purchase (coffee, cinema, etc.), which resets the amount to zero without impacting the base budget.

## Technical Implementation

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       BudgetDashboard                        │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │       BonusPiggyBankDisplay (if amount > 0)         │   │
│  │  Shows: Current amount + Monthly accumulated bonus  │   │
│  │  Action: Opens BonusPiggyBankModal on click        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          BonusPiggyBankModal                         │   │
│  │  Allows: Breaking the piggy bank for pleasure       │   │
│  │  purchase, with explanation of how it works         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ uses
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   utils/bonusPiggyBank.ts                    │
│                                                               │
│  • processUnspentDailyBudget(): Checks yesterday for        │
│    unspent budget and adds to piggy bank                    │
│  • getCurrentMonthBonus(): Returns monthly accumulated      │
│    bonus for display                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ stores data via
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      utils/storage.ts                        │
│                                                               │
│  • getBonusPiggyBank(): Load piggy bank for budget          │
│  • saveBonusPiggyBank(): Persist piggy bank data            │
│  • addToBonusPiggyBank(): Add amount to piggy bank          │
│  • breakBonusPiggyBank(): Reset piggy bank to zero          │
└─────────────────────────────────────────────────────────────┘
```

### Data Structure

```typescript
interface BonusPiggyBank {
  amount: number;                    // Current accumulated bonus
  lastProcessedDate: string;         // ISO date of last processing
  monthlyHistory: {
    month: string;                   // Format: YYYY-MM
    totalAccumulated: number;        // Total bonus for this month
  }[];
}
```

### Processing Logic

1. **On Dashboard Load**: `processUnspentDailyBudget()` is called
2. **Check Last Processing**: If yesterday was already processed, skip
3. **Check Yesterday's Spending**: 
   - If user spent anything (type !== 'income'), no bonus
   - If user spent nothing, calculate daily budget from yesterday
4. **Add to Piggy Bank**: Transfer calculated amount to piggy bank
5. **Update History**: Track monthly accumulation for statistics

### Storage

- Piggy bank data is stored per-budget using AsyncStorage
- Key format: `@pace_bonus_piggy_bank_{budgetId}`
- Supports multiple budgets (personal, household)
- Monthly history is preserved for future analytics

## UI/UX

### Display Component (`BonusPiggyBankDisplay`)
- Shows only when amount > 0
- Prominent card with success color border
- Displays total accumulated amount
- Shows monthly bonus message
- Click to open break modal

### Break Modal (`BonusPiggyBankModal`)
- Explains the feature with "How it works" section
- Shows accumulated amount
- Confirmation button: "Yes, use the pot"
- Cancel button to keep accumulating
- Success alert after breaking

## Translations

Available in French and English:
- Dashboard labels
- Modal titles and messages
- Button text
- "How it works" explanations

## Testing

### Unit Tests (15 tests, all passing)

#### Storage Tests (`bonusPiggyBank.test.ts`)
- Get piggy bank (default and saved)
- Save piggy bank (success and error)
- Add to piggy bank (with/without history)
- Break piggy bank (with amount and empty)

#### Processing Tests (`bonusPiggyBankProcessing.test.ts`)
- Process when user didn't spend yesterday
- Don't process when user spent yesterday
- Don't process if already processed
- Ignore income transactions
- Get current month bonus
- Handle missing monthly data

## Security

- CodeQL scan: 0 alerts ✅
- No sensitive data stored
- All data persisted locally only
- Per-budget isolation maintained

## Future Enhancements

Potential improvements for future versions:
1. Push notifications when piggy bank reaches milestones (50€, 100€, etc.)
2. Statistics page showing accumulation trends
3. Option to auto-transfer piggy bank to savings goal
4. Badges for piggy bank achievements
5. Share accumulated bonus on social media

## Implementation Status

✅ Complete and tested
- All user stories implemented
- 15 unit tests passing
- TypeScript compilation successful
- Security scan clean
- Ready for manual testing and integration
