# Epic 11: Visual Guide - Dark Mode & Haptic Feedback

This guide demonstrates the visual and interactive improvements made in Epic 11.

## Dark Mode (Feature 11.1)

### Light Mode (Default)
```
┌─────────────────────────────────────┐
│  ⚙️  My Budget                 🔥 7 │  ← Teal header (#00897B)
│  Starting on day 1 of the month    │
├─────────────────────────────────────┤
│                                     │
│  🐿️  L'Écureuil Économe            │  ← Light background
│  "You're doing great!"              │     (#FAFAFA)
│                                     │
├─────────────────────────────────────┤
│                                     │
│        Daily Budget                 │
│                                     │
│         €45.50                      │  ← Success color
│                                     │     (#4CAF50)
│  You can spend this amount today    │
│                                     │
└─────────────────────────────────────┘
```

### Dark Mode (Automatic)
```
┌─────────────────────────────────────┐
│  ⚙️  My Budget                 🔥 7 │  ← Desaturated Teal
│  Starting on day 1 of the month    │     (#4DB6AC)
├─────────────────────────────────────┤
│                                     │
│  🐿️  L'Écureuil Économe            │  ← Dark background
│  "You're doing great!"              │     (#121212)
│                                     │
├─────────────────────────────────────┤
│                                     │
│        Daily Budget                 │
│                                     │
│         €45.50                      │  ← Adjusted green
│                                     │     (#66BB6A)
│  You can spend this amount today    │
│                                     │
└─────────────────────────────────────┘
```

### Key Visual Differences

| Element | Light Mode | Dark Mode | Reason |
|---------|-----------|-----------|---------|
| Primary Color | #00897B (Teal) | #4DB6AC (Light Teal) | Less saturated to prevent eye strain |
| Background | #FAFAFA (Off-white) | #121212 (True Black) | OLED-friendly, reduces blue light |
| Surface | #FFFFFF (White) | #1E1E1E (Dark Gray) | Cards/modals stand out |
| Text Primary | #212121 (Black) | #E0E0E0 (Light Gray) | High contrast for readability |
| Success Color | #4CAF50 (Green) | #66BB6A (Light Green) | Better visibility on dark |

### Add Expense Modal - Theme Comparison

**Light Mode:**
```
┌─────────────────────────────────────┐
│                                     │  ← White surface
│     Add an Expense                  │     (#FFFFFF)
│                                     │
│  Amount                             │
│  ┌───────────────────────────────┐ │
│  │ 15.50                         │ │  ← Light input
│  └───────────────────────────────┘ │     (#F5F5F5)
│                                     │
│  Description                        │
│  ┌───────────────────────────────┐ │
│  │ Coffee                        │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Cancel]        [Add Expense]     │  ← Teal button
│                                     │
└─────────────────────────────────────┘
```

**Dark Mode:**
```
┌─────────────────────────────────────┐
│                                     │  ← Dark surface
│     Add an Expense                  │     (#1E1E1E)
│                                     │
│  Amount                             │
│  ┌───────────────────────────────┐ │
│  │ 15.50                         │ │  ← Dark input
│  └───────────────────────────────┘ │     (#121212)
│                                     │
│  Description                        │
│  ┌───────────────────────────────┐ │
│  │ Coffee                        │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Cancel]    [Add Expense]         │  ← Light teal button
│                                     │     (#4DB6AC)
└─────────────────────────────────────┘
```

## Haptic Feedback (Feature 11.2)

### Visual Representation of Haptic Patterns

**Success Haptic (Budget Positive)**
```
Phone: ┌─────────┐
       │  €45.50 │ ← Budget remains positive
       │    ↓    │
       │   ~~~   │ ← Light, subtle vibration
       │         │    (Success notification)
       └─────────┘
       
Pattern: Short, gentle pulse
Duration: ~20ms
Feeling: "Confirmed! ✓"
```

**Warning Haptic (Budget Negative)**
```
Phone: ┌─────────┐
       │ -€12.30 │ ← Budget went into red!
       │    ↓    │
       │  ~~~~~  │ ← Stronger, more noticeable
       │  ~~~~~  │    (Warning notification)
       └─────────┘
       
Pattern: Medium-strong pulse
Duration: ~50ms
Feeling: "Alert! ⚠️"
```

### User Flow with Haptic Feedback

1. **User adds expense (€15.50)**
   ```
   Current Budget: €45.50
   After expense: €30.00 (still positive)
   → Triggers: Success Haptic (light)
   → User feels: Subtle confirmation
   ```

2. **User adds large expense (€50.00)**
   ```
   Current Budget: €30.00
   After expense: -€20.00 (negative!)
   → Triggers: Warning Haptic (strong)
   → User feels: Alert that budget is exceeded
   → Also shows: Budget alert notification
   ```

### Implementation Details

**Haptic Functions:**
```typescript
// Success: Light confirmation
triggerSuccessHaptic()
  → Haptics.NotificationFeedbackType.Success
  → Feels like: Gentle tap

// Warning: Alert feedback  
triggerWarningHaptic()
  → Haptics.NotificationFeedbackType.Warning
  → Feels like: Firm pulse
```

**When They Trigger:**
- ✅ Success: Budget ≥ 0 after expense
- ⚠️ Warning: Budget < 0 after expense
- 📱 Platform: Works on iOS/Android physical devices only

## Automatic Theme Switching

The app automatically detects and switches themes:

```
System Settings Change:
Light Mode → Dark Mode
        ↓
   ThemeContext detects via useColorScheme()
        ↓
   All components re-render with dark colors
        ↓
   User sees: Instant theme switch
```

**User Experience:**
1. User changes device theme in system settings
2. App immediately updates (no restart needed)
3. All screens reflect the new theme
4. StatusBar icon colors adjust automatically

## Testing Checklist

### Dark Mode Testing
- [ ] Open app in light mode - verify teal colors (#00897B)
- [ ] Switch device to dark mode
- [ ] Verify background is dark (#121212)
- [ ] Verify primary color is desaturated (#4DB6AC)
- [ ] Open Add Expense modal - verify dark styling
- [ ] Check text is readable (high contrast)
- [ ] Verify StatusBar icons are appropriate color

### Haptic Feedback Testing (Physical Device Only)
- [ ] Add expense with positive remaining budget
  - [ ] Feel light success vibration
- [ ] Add expense that makes budget negative
  - [ ] Feel stronger warning vibration
  - [ ] See budget alert notification
- [ ] Verify haptic doesn't crash on web/simulator

## Premium Feel Indicators

✨ **What makes it feel "premium":**

1. **Thoughtful Dark Mode**
   - Desaturated colors prevent eye fatigue
   - True black background saves battery on OLED
   - Proper contrast ratios (WCAG AA compliant)

2. **Contextual Haptic Feedback**
   - Different feedback for different states
   - Subtle but noticeable
   - Reinforces user actions with tactile response

3. **Automatic Theme Detection**
   - Respects user's system preferences
   - No manual toggle needed (seamless)
   - Works across all screens

4. **Polish & Attention to Detail**
   - StatusBar adapts to theme
   - Consistent color application
   - Smooth transitions
