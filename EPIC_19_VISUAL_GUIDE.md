# Epic 19: Onboarding Pédagogique - Visual Guide

## OnboardingCarousel Component

### Slide 1: Core Philosophy
```
┌─────────────────────────────────────────┐
│                                   Skip  │
│                                         │
│                   🧭                    │
│                                         │
│       Ne regardez plus votre           │
│       compte en banque                  │
│                                         │
│   Découvrez votre Reste à Vivre        │
│   Quotidien : la seule chose dont      │
│   vous avez besoin pour maîtriser      │
│   votre budget sans stress.            │
│                                         │
│              ● ○ ○                      │
│                                         │
│         ┌─────────────┐                │
│         │   Suivant   │                │
│         └─────────────┘                │
└─────────────────────────────────────────┘
```

### Slide 2: How It Works
```
┌─────────────────────────────────────────┐
│                                   Skip  │
│                                         │
│                   💡                    │
│                                         │
│       Une boussole financière          │
│            simple                       │
│                                         │
│   Chaque matin, PACE calcule ce que    │
│   vous pouvez dépenser aujourd'hui.    │
│   Plus besoin de vous inquiéter du     │
│   reste du mois.                        │
│                                         │
│              ○ ● ○                      │
│                                         │
│         ┌─────────────┐                │
│         │   Suivant   │                │
│         └─────────────┘                │
└─────────────────────────────────────────┘
```

### Slide 3: Benefits
```
┌─────────────────────────────────────────┐
│                                   Skip  │
│                                         │
│                   🎯                    │
│                                         │
│       Gardez le cap jour               │
│         après jour                      │
│                                         │
│   Enregistrez vos dépenses, suivez     │
│   votre progression, et atteignez      │
│   vos objectifs d'épargne sans         │
│   effort.                               │
│                                         │
│              ○ ○ ●                      │
│                                         │
│         ┌─────────────┐                │
│         │  Commencer  │                │
│         └─────────────┘                │
└─────────────────────────────────────────┘
```

## TooltipOverlay Component

### Tooltip 1: Daily Budget
```
┌─────────────────────────────────────────┐
│                                         │
│    ┌─ Budget Dashboard ────────────┐   │
│    │                                │   │
│    │   [Avatar]    Budget du Jour  │   │
│    │                                │   │
│    │         ╭───────────╮          │   │
│    │         │   45.20€  │◀─────┐   │   │
│    │         ╰───────────╯      │   │   │
│    │                            │   │   │
│    │    ┌────────────────────┐ │   │   │
│    │    │ Votre boussole du  │ │   │   │
│    │    │ jour 🧭            │ │   │   │
│    │    │                    │─┘   │   │
│    │    │ C'est le montant   │     │   │
│    │    │ que vous pouvez    │     │   │
│    │    │ dépenser aujourd'  │     │   │
│    │    │ hui sans compro-   │     │   │
│    │    │ mettre votre       │     │   │
│    │    │ budget mensuel.    │     │   │
│    │    │                    │     │   │
│    │    │      ● ○ ○         │     │   │
│    │    │                    │     │   │
│    │    │ Passer    Suivant  │     │   │
│    │    └────────────────────┘     │   │
│    │                                │   │
│    └────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Tooltip 2: Add Expense Button
```
┌─────────────────────────────────────────┐
│                                         │
│    ┌─ Budget Dashboard ────────────┐   │
│    │                                │   │
│    │         Budget: 45.20€         │   │
│    │                                │   │
│    │    ┌────────────────────┐     │   │
│    │    │ Enregistrez vos    │     │   │
│    │    │ dépenses           │     │   │
│    │    │                    │     │   │
│    │    │ Appuyez sur le     │     │   │
│    │    │ bouton '+' pour    │     │   │
│    │    │ noter rapidement   │     │   │
│    │    │ chaque dépense et  │     │   │
│    │    │ garder votre       │     │   │
│    │    │ budget à jour.     │     │   │
│    │    │                    │     │   │
│    │    │      ○ ● ○         │     │   │
│    │    │                    │     │   │
│    │    │ Passer    Suivant  │     │   │
│    │    └────────────────────┘     │   │
│    │               ▲                │   │
│    │               │                │   │
│    │         ┌─────┴──────┐         │   │
│    │         │     +      │         │   │
│    │         └────────────┘         │   │
│    └────────────────────────────────┘   │
│                                         │
│    [Home] [History] [Profile]          │
└─────────────────────────────────────────┘
```

### Tooltip 3: History Tab
```
┌─────────────────────────────────────────┐
│                                         │
│    ┌─ Budget Dashboard ────────────┐   │
│    │                                │   │
│    │         Budget: 45.20€         │   │
│    │                                │   │
│    │         [Add Button]           │   │
│    │                                │   │
│    └────────────────────────────────┘   │
│                                         │
│    ┌────────────────────┐              │
│    │ Suivez votre       │              │
│    │ progression        │              │
│    │                    │              │
│    │ Consultez          │              │
│    │ l'historique de    │              │
│    │ vos transactions   │              │
│    │ et vos statistiques│              │
│    │ pour voir comment  │              │
│    │ vous gérez votre   │              │
│    │ budget.            │              │
│    │                    │              │
│    │      ○ ○ ●         │              │
│    │                    │              │
│    │ Passer    Compris! │              │
│    └────────────────────┘              │
│           ▲                             │
│           │                             │
│    ┌──────┴─────┬──────────┬─────────┐ │
│    │   Home     │ History  │ Profile │ │
│    └────────────┴──────────┴─────────┘ │
└─────────────────────────────────────────┘
```

## UI Flow Diagram

```
┌────────────────┐
│  App Launch    │
│  (First Time)  │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│  OnboardingCarousel │
│  (3 Slides)         │
│                     │
│  - Philosophy       │
│  - How It Works     │
│  - Benefits         │
└────────┬────────────┘
         │
         ▼
┌────────────────┐
│  ConfigWizard  │
│                │
│  - Income      │
│  - Expenses    │
│  - Savings     │
│  - Cycle Day   │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ BudgetDashboard│
│                │
│  (1s delay)    │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ TooltipOverlay │
│ (3 Tooltips)   │
│                │
│  - Daily Budget│
│  - Add Expense │
│  - History Tab │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Regular Usage  │
│ (No Onboarding)│
└────────────────┘
```

## Component State Flow

### OnboardingCarousel State

```
Initial State:
{
  currentPage: 0,
  showCarousel: true
}

User Actions:
┌─────────────┐
│ Skip Button │ → onComplete() → markOnboardingCarouselCompleted()
└─────────────┘

┌─────────────┐
│ Next Button │ → currentPage++
└─────────────┘

┌──────────────┐
│ Start Button │ → onComplete() → markOnboardingCarouselCompleted()
│ (Last Slide) │
└──────────────┘

AsyncStorage:
@pace_onboarding_carousel_completed = "true"
```

### TooltipOverlay State

```
Initial State:
{
  currentStep: 0,
  showTooltips: true
}

User Actions:
┌─────────────┐
│ Skip Button │ → onComplete() → markOnboardingTooltipsCompleted()
└─────────────┘

┌─────────────┐
│ Next Button │ → currentStep++
└─────────────┘

┌──────────────┐
│ Done Button  │ → onComplete() → markOnboardingTooltipsCompleted()
│ (Last Step)  │
└──────────────┘

┌─────────────┐
│ Tap Backdrop│ → onComplete() → markOnboardingTooltipsCompleted()
└─────────────┘

AsyncStorage:
@pace_onboarding_tooltips_completed = "true"
```

## Design Tokens Used

### Colors
- Primary: `#00897B` (Teal)
- Background: `#FAFAFA`
- Surface: `#FFFFFF`
- Text Primary: `#212121`
- Text Secondary: `#757575`
- Text Disabled: `#BDBDBD`
- Text Inverse: `#FFFFFF`

### Typography
- H2 (Titles): 32px, Bold
- Body (Descriptions): 16px, Regular
- Button Text: 16px, Semibold

### Spacing
- Extra Large: 32px (margins)
- Large: 24px (padding)
- Medium: 16px (content spacing)
- Small: 8px (tight spacing)

### Border Radius
- Large: 12px (cards)
- Medium: 8px (buttons)

### Elevation
- Medium: Shadow opacity 0.08, radius 4px (tooltips)

## Accessibility Features

1. **Clear Visual Hierarchy**
   - Large emoji icons for visual appeal
   - Bold titles for main messages
   - Secondary text for details

2. **Progress Indicators**
   - Pagination dots show current position
   - Active dot is wider and primary color

3. **Skip Options**
   - Always available escape route
   - Respects user's time and preferences

4. **Semantic Colors**
   - Primary color for actions
   - Consistent with app theme

5. **Touch Targets**
   - All buttons are adequately sized
   - Adequate spacing between interactive elements

## Localization Support

All text is fully localized in:
- 🇫🇷 French (Primary language)
- 🇬🇧 English (Secondary language)

Translation keys follow i18n best practices:
- `onboarding.slideX.title`
- `onboarding.slideX.description`
- `tooltips.elementName.title`
- `tooltips.elementName.description`

## Responsive Design

Components adapt to different screen sizes:
- Uses `Dimensions.get('window')` for screen width
- Flexible layouts with percentage widths
- ScrollView for content that may overflow
- Safe area considerations for different devices

## Animation & Transitions

1. **Carousel**
   - Smooth horizontal scrolling
   - Animated pagination dot transitions
   - Native scroll physics

2. **Tooltips**
   - Fade-in animation via Modal
   - Semi-transparent backdrop
   - Smooth step transitions

3. **Buttons**
   - activeOpacity={0.7} for press feedback
   - Instant visual response

## Performance Considerations

1. **Lazy Rendering**
   - Components only rendered when needed
   - Conditional rendering based on state

2. **Minimal Re-renders**
   - Optimized state updates
   - Memoized callbacks where appropriate

3. **Lightweight Storage**
   - Simple boolean flags in AsyncStorage
   - No heavy data persistence

4. **No External Dependencies**
   - Uses React Native built-in components
   - Leverages existing project dependencies
