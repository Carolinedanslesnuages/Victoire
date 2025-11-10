# Epic 8: Widgets & Quick Actions - Visual Guide

## Widget Display Mockups

### iOS Widget - Positive Budget (Teal)

```
┌─────────────────────────────┐
│                             │
│       Reste à Vivre         │
│                             │
│        25.50 €              │
│                             │
│          /jour              │
│                             │
└─────────────────────────────┘
Background: #008080 (Teal)
Text: #FFFFFF (White)
```

**Display:**
- Title: "Reste à Vivre" (small, medium weight)
- Amount: "25.50 €" (large, bold, 36sp)
- Subtitle: "/jour" (extra small)
- Teal background indicates positive budget

### iOS Widget - Negative Budget (Red)

```
┌─────────────────────────────┐
│                             │
│       Reste à Vivre         │
│                             │
│        12.30 €              │
│                             │
│          /jour              │
│                             │
└─────────────────────────────┘
Background: #FF3B30 (Red)
Text: #FFFFFF (White)
```

**Display:**
- Title: "Reste à Vivre" (small, medium weight)
- Amount: "12.30 €" (large, bold, 36sp)
- Subtitle: "/jour" (extra small)
- Red background indicates negative/overspent budget

### iOS Widget - Empty State

```
┌─────────────────────────────┐
│                             │
│           📊                │
│                             │
│      Ouvrez l'app           │
│                             │
└─────────────────────────────┘
Background: #008080 (Teal)
Text: #FFFFFF (White)
```

**Display:**
- Icon: Chart emoji 📊
- Message: "Ouvrez l'app" (small)
- Shown when no budget is configured

## Android Widget - Visual Layout

### Positive Budget (Teal)

```
┌─────────────────────────────┐
│   ╔═══════════════════╗     │
│   ║  Reste à Vivre    ║     │
│   ║                   ║     │
│   ║    25.50 €        ║     │
│   ║                   ║     │
│   ║     /jour         ║     │
│   ╚═══════════════════╝     │
└─────────────────────────────┘
Background: #008080 (Teal)
```

### Negative Budget (Red)

```
┌─────────────────────────────┐
│   ╔═══════════════════╗     │
│   ║  Reste à Vivre    ║     │
│   ║                   ║     │
│   ║    12.30 €        ║     │
│   ║                   ║     │
│   ║     /jour         ║     │
│   ╚═══════════════════╝     │
└─────────────────────────────┘
Background: #FF3B30 (Red)
```

## Quick Actions Visual

### iOS (3D Touch / Haptic Touch)

```
App Icon
   │
   └─ Long Press
       │
       └─ ┌────────────────────────┐
          │  📱 PACE                │
          ├────────────────────────┤
          │  ➕ Ajouter une        │
          │     Dépense            │
          │     Enregistrer        │
          │     rapidement         │
          └────────────────────────┘
```

### Android (Long Press)

```
App Icon
   │
   └─ Long Press
       │
       └─ ┌────────────────────────┐
          │  PACE                   │
          ├────────────────────────┤
          │  [+] Ajouter une       │
          │      Dépense           │
          │      Enregistrer       │
          │      rapidement        │
          └────────────────────────┘
```

## Widget Sizes

### iOS
- **Small Widget** (2x2): Displays daily budget
- **Medium Widget** (4x2): Displays daily budget (larger text)

### Android
- **Minimum Size**: 2x2 cells (110dp x 110dp)
- **Resizable**: Horizontal and vertical

## Color Specifications

### Positive Budget (Teal)
- **Background**: #008080 (rgb(0, 128, 128))
- **Text**: #FFFFFF (rgb(255, 255, 255))
- **Meaning**: User has available budget

### Negative Budget (Red)
- **Background**: #FF3B30 (rgb(255, 59, 48))
- **Text**: #FFFFFF (rgb(255, 255, 255))
- **Meaning**: User has overspent

## Typography

### Widget Title "Reste à Vivre"
- **iOS**: SF Pro, 12pt, Medium
- **Android**: Sans-serif Medium, 12sp
- **Color**: White at 90% opacity

### Budget Amount
- **iOS**: SF Pro Rounded, 36pt, Bold
- **Android**: Sans-serif Condensed, 32sp, Bold
- **Color**: White at 100% opacity

### Subtitle "/jour"
- **iOS**: SF Pro, 10pt, Regular
- **Android**: Sans-serif, 10sp, Regular
- **Color**: White at 80% opacity

## User Interaction

### Widget Tap Behavior
1. User taps widget
2. App opens to home screen (BudgetDashboard)
3. Widget data refreshes

### Quick Action Behavior
1. User long presses app icon
2. Quick actions menu appears
3. User taps "Ajouter une Dépense"
4. App opens directly to AddExpenseModal

## Update Frequency

### iOS
- **Automatic**: Every 15 minutes (system-managed)
- **Manual**: When app opens or transaction added
- **Background**: Via App Groups shared storage

### Android
- **Automatic**: Every 15 minutes (900,000ms)
- **Manual**: When app opens or transaction added
- **Background**: Via SharedPreferences

## Accessibility

### iOS
- VoiceOver support: "Budget widget, current daily budget: 25 euros 50, positive"
- Dynamic Type support: Text scales with system settings

### Android
- TalkBack support: "PACE Budget widget, daily budget 25.50 euros, positive"
- Font scaling: Respects system font size settings

## Example Scenarios

### Scenario 1: Morning Check
```
User wakes up → Checks home screen → Sees widget showing "45.20 €" (Teal)
Decision: Good budget, can buy coffee ☕
```

### Scenario 2: Quick Expense Entry
```
User makes purchase → Long press app icon → Tap "Add Expense"
→ App opens to expense form → Enter amount → Save
→ Widget updates to show new daily budget
```

### Scenario 3: Budget Alert
```
User adds large expense → Budget goes negative → Widget turns RED
Visual: "Reste à Vivre: -5.30 €" (Red background)
User immediately sees budget is overspent without opening app
```

## Localization

### French (fr)
- Title: "Reste à Vivre"
- Subtitle: "/jour"
- Empty: "Ouvrez l'app"
- Quick Action: "Ajouter une Dépense"

### English (en)
- Title: "Daily Budget"
- Subtitle: "/day"
- Empty: "Open the app"
- Quick Action: "Add Expense"

## Platform-Specific Features

### iOS Only
- 3D Touch support (iPhone 6s - iPhone X)
- Haptic Touch support (iPhone XR+)
- App Groups for secure data sharing
- WidgetKit Timeline provider

### Android Only
- Long press anywhere on icon
- Widget preview in widget picker
- Resizable widget dimensions
- Home screen widget placement options

## Future Enhancements (Out of Scope)

- Interactive widgets (add expense directly from widget)
- Multiple widget sizes (large, extra large)
- Widget configuration options
- Live Activities (iOS 16+)
- Dynamic Island integration (iPhone 14 Pro+)
- Complication support (Apple Watch)
- Wear OS widget support
