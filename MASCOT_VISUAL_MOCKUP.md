# Mascot Integration - Visual Mockup

## Dashboard Layout with Mascot

The mascot is integrated into the BudgetDashboard component and appears prominently after the header, before the daily budget card.

```
╔═══════════════════════════════════════════════════════════════╗
║                     PACE Dashboard                             ║
║               Mon Budget PACE 🔥 3                             ║
║                Cycle du 5 de chaque mois                       ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌─────────────────────────────────────────────────────┐      ║
║  │         🐿️  L'Écureuil Économe                      │      ║
║  │                                                      │      ║
║  │              [MASCOT IMAGE]                          │      ║
║  │            (120px × 120px)                           │      ║
║  │                                                      │      ║
║  │          Content & Taquin                            │      ║
║  │        ┌──────────────────┐                          │      ║
║  │        │ Budget Confortable│                         │      ║
║  │        └──────────────────┘                          │      ║
║  │                                                      │      ║
║  │   Votre budget se porte bien,                        │      ║
║  │   gardez le cap ! 😊                                │      ║
║  └─────────────────────────────────────────────────────┘      ║
║                                                                ║
║  ┌─────────────────────────────────────────────────────┐      ║
║  │              Budget du Jour                          │      ║
║  │                                                      │      ║
║  │                €42.50                                │      ║
║  │                                                      │      ║
║  │    Ce que vous pouvez dépenser aujourd'hui          │      ║
║  └─────────────────────────────────────────────────────┘      ║
║                                                                ║
║  ┌─────────────────────────────────────────────────────┐      ║
║  │           Santé du Mois                              │      ║
║  │                                                      │      ║
║  │              12 jours restants                       │      ║
║  │                                                      │      ║
║  │              [RING CHART]                            │      ║
║  │                 65%                                  │      ║
║  │               dépensé                                │      ║
║  │                                                      │      ║
║  │    Dépensé: €650    Restant: €350                   │      ║
║  │                                                      │      ║
║  │        ┌──────────────┐                              │      ║
║  │        │  En Avance   │                              │      ║
║  │        └──────────────┘                              │      ║
║  └─────────────────────────────────────────────────────┘      ║
║                                                                ║
║           [Rest of dashboard content...]                       ║
╚═══════════════════════════════════════════════════════════════╝
```

## Mascot Card Breakdown

### Structure
```typescript
<View style={styles.mascotCard}>
  <MascotDisplay 
    mascotState={mascotState} 
    showDescription={true} 
    size="medium" 
  />
  <Text style={styles.mascotDescription}>
    {i18n.t(`mascot.descriptions.${mascotState.mood}`)}
  </Text>
</View>
```

### Visual Elements

1. **Card Container**
   - White background (`#FFFFFF`)
   - Rounded corners (12px border radius)
   - Subtle shadow (elevation.low)
   - Margin: 16px all sides
   - Padding: 24px

2. **Mascot Image Container**
   - Circular background with zone color (20% opacity)
   - Border: 3px solid zone color
   - Size: 160px × 160px (medium + padding)
   - Image: 120px × 120px
   - Centered

3. **Mood Name**
   - Size: 20px (h4)
   - Font weight: Bold
   - Color: Zone color (green/yellow/red)
   - Center aligned

4. **Zone Badge**
   - Background: Zone color (full opacity)
   - Text: White
   - Padding: 4px horizontal, 8px vertical
   - Border radius: Full (pill shape)
   - Font size: 14px
   - Font weight: Semibold

5. **Description Text**
   - Size: 16px (body)
   - Color: Secondary gray (`#757575`)
   - Center aligned
   - Margin top: 16px
   - Padding horizontal: 16px

## Color Zones Visualization

### Green Zone Example (>50% remaining)
```
┌────────────────────────────────┐
│   Background: #47B28F20        │
│   Border: #47B28F              │
│                                │
│   🐿️ [Happy Squirrel]         │
│                                │
│   "Content & Taquin"           │
│   Color: #47B28F               │
│                                │
│  ┌──────────────────────┐     │
│  │ Budget Confortable   │     │
│  │ Background: #47B28F  │     │
│  └──────────────────────┘     │
└────────────────────────────────┘
```

### Yellow Zone Example (10-50% remaining)
```
┌────────────────────────────────┐
│   Background: #FFC75920        │
│   Border: #FFC759              │
│                                │
│   🐿️ [Worried Squirrel]       │
│                                │
│   "Concentré & Vigilant"       │
│   Color: #FFC759               │
│                                │
│  ┌──────────────────────┐     │
│  │  Gestion Stricte     │     │
│  │ Background: #FFC759  │     │
│  └──────────────────────┘     │
└────────────────────────────────┘
```

### Red Zone Example (<10% remaining)
```
┌────────────────────────────────┐
│   Background: #E55C5C20        │
│   Border: #E55C5C              │
│                                │
│   🐿️ [Panicked Squirrel]      │
│                                │
│   "Très Inquiet & Paniqué"     │
│   Color: #E55C5C               │
│                                │
│  ┌──────────────────────┐     │
│  │  Budget Critique     │     │
│  │ Background: #E55C5C  │     │
│  └──────────────────────┘     │
└────────────────────────────────┘
```

## Responsive Behavior

### Size Variants
The component supports 3 sizes:

- **Small** (80px): For compact displays or secondary views
- **Medium** (120px): Default dashboard size ✓ Used
- **Large** (160px): For emphasis or dedicated mascot pages

### Description Toggle
```typescript
<MascotDisplay 
  mascotState={mascotState} 
  showDescription={false}  // Hides description
  size="small" 
/>
```

## Animation Opportunities (Future Enhancement)

While not implemented in this version, the structure supports future animations:

1. **Mood Transitions**: Smooth fade between mood states
2. **Hover Effects**: Mascot bounces or blinks on interaction
3. **Celebration**: Sparkles when reaching positive milestones
4. **Alert Pulse**: Gentle pulse animation in red zone

## Accessibility

- **Image Alt Text**: Mood name serves as accessible description
- **Color + Text**: Zone information conveyed through both color AND text
- **High Contrast**: Zone colors meet WCAG AA standards
- **Touch Target**: Minimum 48px touch target for interactions

## Integration Points

The mascot integrates seamlessly with existing features:

1. **Budget Updates**: Recalculates on every transaction
2. **Refresh**: Updates when user pulls to refresh
3. **Cycle Changes**: Resets at start of new budget cycle
4. **Multi-language**: Adapts text to user's locale
5. **Theme**: Uses app's color system

## User Experience Flow

```
User opens app
    ↓
Dashboard loads
    ↓
Mascot calculates current budget state
    ↓
Displays appropriate mood/zone
    ↓
User sees emotional feedback instantly
    ↓
User adds expense
    ↓
Mascot updates in real-time
    ↓
User gets immediate feedback on impact
```

This creates a **continuous feedback loop** that makes budget management more engaging and intuitive.
