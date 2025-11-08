# Integration Examples for Epic UI 4

This document provides code examples for integrating the new header features.

## Basic Usage

The new header features work automatically with existing code. No changes are required for basic usage.

```typescript
// Existing code continues to work
const config: BudgetConfig = {
  monthlyIncome: 3000,
  fixedCharges: 1500,
  savingsGoal: 300,
  cycleStartDay: 5,
};
// Header will show: "Mon Budget PACE"
```

## Custom Budget Name

To set a custom budget name:

```typescript
const config: BudgetConfig = {
  monthlyIncome: 3000,
  fixedCharges: 1500,
  savingsGoal: 300,
  cycleStartDay: 5,
  budgetName: "Budget Voyage 2024", // Custom name
};
// Header will show: "Budget Voyage 2024"
```

## Household Budget

To create a household budget:

```typescript
const config: BudgetConfig = {
  monthlyIncome: 5000,
  fixedCharges: 2500,
  savingsGoal: 500,
  cycleStartDay: 1,
  isHouseholdBudget: true, // Enable household mode
};
// Header will show: "Mon'Day Foyer" (French) or "Mon'Day Household" (English)
```

## Household Budget with Custom Name

To add a custom household name:

```typescript
const config: BudgetConfig = {
  monthlyIncome: 5000,
  fixedCharges: 2500,
  savingsGoal: 500,
  cycleStartDay: 1,
  isHouseholdBudget: true,
  householdName: "Famille Dupont", // Custom household name
};
// Header will show: "Mon'Day Foyer - Famille Dupont"
```

## Streak Tracking

Streaks are automatically calculated from transactions. No manual intervention needed.

```typescript
// When user adds an expense
await saveTransaction({
  amount: 25.50,
  description: "Groceries",
  category: "Food",
  date: new Date().toISOString(),
});

// Streak is automatically recalculated on next dashboard refresh
// If user has tracked expenses on consecutive days, streak badge appears
```

### Manual Streak Calculation

If you need to manually recalculate the streak:

```typescript
import { calculateStreak } from '../utils/streaks';

const streak = await calculateStreak();
console.log('Current streak:', streak.currentStreak);
console.log('Longest streak:', streak.longestStreak);
console.log('Is active:', streak.isActive);
```

## Updating Existing Budgets

Existing budgets can be updated to add new features:

```typescript
import { loadBudgetConfig, saveBudgetConfig } from '../utils/storage';

// Load existing budget
const existingConfig = await loadBudgetConfig();

if (existingConfig) {
  // Add custom name
  const updatedConfig = {
    ...existingConfig,
    budgetName: "Mon Budget Pro",
  };
  
  await saveBudgetConfig(updatedConfig);
}
```

## Future Settings Screen Integration

Example of how to add budget name configuration in Settings:

```typescript
// In SettingsScreen.tsx or similar
const [budgetName, setBudgetName] = useState('');
const [isHousehold, setIsHousehold] = useState(false);
const [householdName, setHouseholdName] = useState('');

const handleUpdateBudgetInfo = async () => {
  const config = await loadBudgetConfig();
  if (config) {
    const updatedConfig = {
      ...config,
      budgetName: budgetName.trim() || undefined,
      isHouseholdBudget: isHousehold,
      householdName: isHousehold ? householdName.trim() || undefined : undefined,
    };
    await saveBudgetConfig(updatedConfig);
    // Trigger app refresh
  }
};
```

## ConfigWizard Enhancement Example

If you want to add budget name to ConfigWizard:

```typescript
// Add state
const [budgetName, setBudgetName] = useState('');

// Add input field
<TextInput
  style={styles.input}
  placeholder={i18n.t('configWizard.budgetNamePlaceholder')}
  value={budgetName}
  onChangeText={setBudgetName}
/>

// Update handleSubmit
const handleSubmit = () => {
  // ... existing validation
  
  const config: BudgetConfig = {
    monthlyIncome: income,
    fixedCharges: charges,
    savingsGoal: savings,
    cycleStartDay: startDay,
    budgetName: budgetName.trim() || undefined, // Add this
  };
  
  onComplete(config);
};
```

## Localization

Add these keys to your localization files if extending ConfigWizard:

```json
// In locales/fr.json
{
  "configWizard": {
    "budgetName": "Nom du budget (optionnel)",
    "budgetNamePlaceholder": "Ex: Budget Vacances",
    "isHouseholdBudget": "Budget familial",
    "householdName": "Nom du foyer (optionnel)",
    "householdNamePlaceholder": "Ex: Famille Dupont"
  }
}

// In locales/en.json
{
  "configWizard": {
    "budgetName": "Budget name (optional)",
    "budgetNamePlaceholder": "E.g.: Vacation Budget",
    "isHouseholdBudget": "Household budget",
    "householdName": "Household name (optional)",
    "householdNamePlaceholder": "E.g.: Smith Family"
  }
}
```

## Testing the Header

### Test Case 1: Default Header
```typescript
// No custom fields set
expect(header).toContain('Mon Budget PACE');
expect(streakBadge).toBeVisible(false);
```

### Test Case 2: With Streak
```typescript
// User has 5-day streak
expect(header).toContain('🔥');
expect(header).toContain('5');
```

### Test Case 3: Household Mode
```typescript
// isHouseholdBudget = true
expect(header).toContain("Mon'Day Foyer");
```

### Test Case 4: Custom Budget Name
```typescript
// budgetName = "Budget Pro"
expect(header).toContain('Budget Pro');
expect(header).not.toContain('Mon Budget PACE');
```

## Streak Mechanics

### How Streaks Work

1. **Activity Definition**: Any day with at least one transaction counts as an active day
2. **Consecutive Days**: Days must be consecutive (no gaps allowed)
3. **Streak Active**: Streak is active if user has activity today OR yesterday
4. **Streak Reset**: Missing a day resets current streak to 0, but keeps longest streak

### Streak Calculation Example

```typescript
Day 1: Add expense → Streak = 1
Day 2: Add expense → Streak = 2
Day 3: Add expense → Streak = 3
Day 4: No expense → Streak becomes inactive
Day 5: Still inactive → Streak = 0
Day 6: Add expense → Streak = 1 (starts over)
```

### Grace Period

There's a one-day grace period:
- If you added expense yesterday, streak is still active today
- This gives users flexibility without breaking their streak

## Performance Considerations

### Streak Calculation
- Cached in AsyncStorage
- Only recalculated when transactions change
- Efficient date comparisons using ISO strings

### Header Rendering
- Minimal re-renders
- Uses flexbox for responsive layout
- Streak badge only renders when active

## Migration Notes

### Existing Users
- No data migration needed
- Optional fields have sensible defaults
- Header works with old budget configs
- Streak starts from 0 for existing users

### Data Format
```typescript
// Old format (still supported)
{
  "monthlyIncome": 3000,
  "fixedCharges": 1500,
  "savingsGoal": 300,
  "cycleStartDay": 5
}

// New format (backward compatible)
{
  "monthlyIncome": 3000,
  "fixedCharges": 1500,
  "savingsGoal": 300,
  "cycleStartDay": 5,
  "budgetName": "Mon Budget",
  "isHouseholdBudget": false,
  "householdName": null
}
```

## Troubleshooting

### Streak Not Updating
- Check that transactions have valid dates
- Verify calculateStreak() is being called after adding transactions
- Ensure Dashboard.loadStreak() is in the refresh handler

### Header Not Showing Custom Name
- Verify budgetName is set in BudgetConfig
- Check that config is being passed to BudgetDashboard
- Ensure getBudgetDisplayName() logic is correct

### Settings Button Not Working
- Verify onReconfigure prop is passed correctly
- Check that navigation is set up properly
- Test TouchableOpacity activeOpacity

## Next Steps

This implementation provides the foundation for:

1. **Epic 10**: Full streak features with achievements and rewards
2. **Epic 25**: Multiple household budgets with switching
3. **Settings Enhancement**: UI to configure budget names and household mode
4. **Gamification**: Additional gamification elements (badges, levels, etc.)

## Support

For questions or issues with this implementation:
1. Check the EPIC_UI_4_IMPLEMENTATION.md for technical details
2. Review HEADER_VISUAL_GUIDE.md for design specifications
3. Consult this file for integration examples
4. Open an issue on GitHub if problems persist
