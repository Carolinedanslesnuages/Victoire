# Dashboard Header Visual Mockup

## New Header Design - Duolingo Style

### Example 1: Active Streak with Default Budget
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   Mon Budget PACE  🔥 7                               ⚙️   ║
║   Cycle du 5 de chaque mois                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Elements:**
- Budget name: "Mon Budget PACE" (bold, white text)
- Streak badge: 🔥 7 (flame icon + number, semi-transparent white background)
- Settings icon: ⚙️ (right-aligned, touchable)
- Subtitle: "Cycle du 5 de chaque mois" (smaller, semi-transparent)
- Background: Primary blue color

---

### Example 2: Household Budget with Long Streak
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   Mon'Day Foyer - Famille Dupont  🔥 23              ⚙️   ║
║   Cycle du 1 de chaque mois                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Elements:**
- Budget name: "Mon'Day Foyer - Famille Dupont" (household indicator)
- Streak badge: 🔥 23 (showing 23 consecutive days)
- Settings icon: ⚙️ (same position)
- Subtitle: Cycle info
- Same color scheme

---

### Example 3: Custom Budget, No Active Streak
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   Budget Voyage 2024                                   ⚙️   ║
║   Cycle du 15 de chaque mois                                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Elements:**
- Budget name: "Budget Voyage 2024" (custom name)
- No streak badge (inactive streak or no transactions)
- Settings icon: ⚙️ (always visible)
- Subtitle: Cycle info
- Clean, minimalist appearance

---

### Example 4: Household Budget, No Custom Name
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   Mon'Day Foyer                                        ⚙️   ║
║   Cycle du 5 de chaque mois                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Elements:**
- Budget name: "Mon'Day Foyer" (default household prefix)
- No streak badge (not shown when streak is 0 or inactive)
- Settings icon: ⚙️
- Subtitle: Cycle info

---

## Color Scheme

```
╔═══════════════════════════════════════════════════════════╗
║  Header Background: #4A90E2 (Primary Blue)              ║
║  Text Color: #FFFFFF (White)                            ║
║  Streak Badge BG: rgba(255, 255, 255, 0.2) (20% White)  ║
║  Streak Badge Text: #FFFFFF (White, Bold)               ║
║  Subtitle Opacity: 0.8 (80% Opacity)                    ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Typography

```
╔═════════════════════════════════════════════════════════╗
║  Budget Name:    H3, Bold (20px)                       ║
║  Streak Number:  Body, Bold (16px)                     ║
║  Settings Icon:  24px                                  ║
║  Subtitle:       Body Small (14px)                     ║
╚═════════════════════════════════════════════════════════╝
```

---

## Layout Structure

```
╔════════════════════════════════════════════════════════════╗
║  Padding: 16px (top: 60px for status bar)                ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │  [Budget Name] [🔥 Streak]          [⚙️ Settings]  │ ║
║  │  ← Flexbox Row (space-between) →                   │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  [Cycle subtitle - full width]                           ║
║                                                           ║
╚════════════════════════════════════════════════════════════╝
```

---

## Interactive Elements

### Streak Badge
```
┌─────────────┐
│ 🔥 7        │  ← Pill-shaped badge
└─────────────┘
   ↓
   Rounded corners (borderRadius.full)
   Padding: 8px horizontal, 4px vertical
   Semi-transparent white background
```

### Settings Button
```
┌────┐
│ ⚙️ │  ← Touch target: 44x44 points
└────┘
   ↓
   Active opacity: 0.7
   Navigates to settings/config
```

---

## Responsive Behavior

**Long Budget Names:**
```
╔════════════════════════════════════════════════════════════╗
║  Mon Budget Personnel pour les Vacances d'Été  🔥 5   ⚙️ ║
║  ← flexShrink: 1 allows text to wrap or truncate →        ║
╚════════════════════════════════════════════════════════════╝
```

**Small Screens:**
- Budget name shrinks (flexShrink: 1)
- Streak badge maintains size
- Settings icon stays fixed on right
- Everything remains readable

---

## Comparison with Old Header

### OLD HEADER (Before)
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   Mon Budget PACE                                           ║
║   Cycle du 5 de chaque mois                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```
❌ Static, boring
❌ No gamification
❌ No settings access
❌ No context about budget type

### NEW HEADER (After)
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   Mon Budget PACE  🔥 7                               ⚙️   ║
║   Cycle du 5 de chaque mois                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```
✅ Dynamic, engaging
✅ Gamification (streak)
✅ Easy settings access
✅ Context-aware (household mode)

---

## Animation Potential (Future Enhancement)

The streak badge could include animations:
- **Fade in** when streak becomes active
- **Pulse** when streak increases
- **Celebrate** animation for milestone streaks (7, 30, 100 days)
- **Shake** animation when about to lose streak

---

## Accessibility

✅ **Color Contrast**: White text on blue background meets WCAG AA
✅ **Touch Targets**: Settings button is 44x44 points minimum
✅ **Icon + Text**: Streak uses both icon and number for clarity
✅ **Semantic Structure**: Logical reading order maintained

---

## Implementation Details

### Component Structure
```typescript
<View style={styles.header}>
  <View style={styles.headerContent}>
    <View style={styles.headerLeft}>
      <Text style={styles.headerTitle}>
        {getBudgetDisplayName()}
      </Text>
      {streakInfo.isActive && streakInfo.currentStreak > 0 && (
        <View style={styles.streakBadge}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakText}>
            {streakInfo.currentStreak}
          </Text>
        </View>
      )}
    </View>
    <TouchableOpacity
      style={styles.settingsButton}
      onPress={onReconfigure}
    >
      <Text style={styles.settingsIcon}>⚙️</Text>
    </TouchableOpacity>
  </View>
  <Text style={styles.headerSubtitle}>
    {i18n.t('dashboard.cycleSubtitle', { day: config.cycleStartDay })}
  </Text>
</View>
```

---

## User Experience Flow

1. **New User Opens App**
   - Sees clean header with budget name
   - No streak badge (none active yet)
   - Settings icon available

2. **User Adds First Expense**
   - Streak calculation runs
   - Streak badge appears: 🔥 1
   - User feels motivated to continue

3. **User Returns Next Day**
   - Adds another expense
   - Streak updates: 🔥 2
   - Positive reinforcement continues

4. **User Misses a Day**
   - Streak badge disappears
   - Next expense starts new streak at 🔥 1
   - Longest streak is preserved for motivation

---

This visual mockup demonstrates how the new header provides:
- **Clear hierarchy**: Budget name is most prominent
- **Motivation**: Streak badge encourages daily tracking
- **Convenience**: Settings always accessible
- **Context**: Budget type clearly indicated
- **Clean design**: Follows Duolingo's minimalist approach
