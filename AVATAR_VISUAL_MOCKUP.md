# Avatar Feature - Visual Mockup & User Flow

## 📱 Visual Mockups

### 1. Onboarding - Avatar Selection Screen

```
┌─────────────────────────────────────┐
│                                     │
│   Personnalisez votre profil       │
│   Choisissez un avatar qui         │
│   vous représente                  │
│                                     │
│   ┌──────────┐  ┌──────────┐      │
│   │   🦊     │  │   🐱     │      │
│   │          │  │          │      │
│   │  Renard  │  │   Chat   │      │
│   │    ✓     │  │          │      │
│   └──────────┘  └──────────┘      │
│                                     │
│   ┌──────────┐  ┌──────────┐      │
│   │   🐶     │  │   🐻     │      │
│   │          │  │          │      │
│   │  Chien   │  │   Ours   │      │
│   └──────────┘  └──────────┘      │
│                                     │
│   ┌──────────┐  ┌──────────┐      │
│   │   🐷     │  │   🚀     │      │
│   │          │  │          │      │
│   │ Tirelire │  │  Fusée   │      │
│   └──────────┘  └──────────┘      │
│                                     │
│   ┌──────────┐  ┌──────────┐      │
│   │   ⭐     │  │   💎     │      │
│   │          │  │          │      │
│   │  Étoile  │  │ Diamant  │      │
│   └──────────┘  └──────────┘      │
│                                     │
│   ┌───────────────────────┐        │
│   │     Continuer         │        │
│   └───────────────────────┘        │
│                                     │
└─────────────────────────────────────┘
```

**Notes**:
- Selected avatar (Fox) has checkmark (✓)
- Border color changes for selected item
- Large, touchable cards for easy selection
- 2-column grid layout

---

### 2. Dashboard Header - With Avatar

#### Before (without avatar):
```
┌─────────────────────────────────────────┐
│                                         │
│  Mon Budget PACE 🔥 7            ⚙️    │
│  Cycle du 5 de chaque mois              │
│                                         │
└─────────────────────────────────────────┘
```

#### After (with avatar):
```
┌─────────────────────────────────────────┐
│                                         │
│  [🦊] Mon Budget PACE 🔥 7       ⚙️    │
│       Cycle du 5 de chaque mois         │
│                                         │
└─────────────────────────────────────────┘
```

**Visual Details**:
- Avatar in circular container: `[🦊]`
- Container: 48x48px circle
- Background: rgba(255, 255, 255, 0.3)
- Emoji: 32px font size
- Position: Left side, before budget name

---

### 3. Settings Screen - Avatar Option

```
┌─────────────────────────────────────────┐
│  Paramètres                       ✕     │
└─────────────────────────────────────────┘
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Personnalisation                │  │
│  │                                  │  │
│  │  Avatar                          │  │
│  │  ┌──────────────────────────┐   │  │
│  │  │  🦊                    › │   │  │
│  │  └──────────────────────────┘   │  │
│  │                                  │  │
│  │  Devise                          │  │
│  │  ┌──────────────────────────┐   │  │
│  │  │  € Euro (EUR)          › │   │  │
│  │  └──────────────────────────┘   │  │
│  └──────────────────────────────────┘  │
│                                         │
```

**Notes**:
- Avatar shown with emoji in box
- Tap anywhere on box to open selector
- Arrow (›) indicates it's tappable
- Current selection always visible

---

### 4. Settings - Avatar Selector Modal

```
┌─────────────────────────────────────────┐
│  Modifier l'avatar                ✕     │
└─────────────────────────────────────────┘
│  Changez votre identité visuelle        │
│  à tout moment                           │
│                                          │
│   ┌──────────┐  ┌──────────┐           │
│   │   🦊     │  │   🐱     │           │
│   │  Renard  │  │   Chat   │           │
│   │    ✓     │  │          │           │
│   └──────────┘  └──────────┘           │
│                                          │
│   ┌──────────┐  ┌──────────┐           │
│   │   🐶     │  │   🐻     │           │
│   │  Chien   │  │   Ours   │           │
│   └──────────┘  └──────────┘           │
│                                          │
│   [More avatars below...]                │
│                                          │
└──────────────────────────────────────────┘
```

**Notes**:
- Full-screen modal
- Immediate selection (no save button needed)
- Auto-closes after selection
- Shows success message

---

## 🎨 Color Specifications

### Avatar Container (Dashboard Header)
- **Background**: `rgba(255, 255, 255, 0.3)` - Semi-transparent white
- **Border Radius**: `24px` (perfect circle)
- **Size**: `48x48px`
- **Emoji Size**: `32px`

### Avatar Card (Selector)
- **Background**: `colors.surface` (white in light mode)
- **Border**: `2px solid colors.border` (default)
- **Border Selected**: `3px solid colors.primary` (blue)
- **Background Selected**: `colors.primaryLight` (light blue)
- **Border Radius**: `12px`
- **Padding**: `16px`
- **Width**: `47%` of container (for 2-column grid)

### Selected Badge
- **Background**: `colors.primary` (blue)
- **Color**: White
- **Size**: `24x24px` circle
- **Position**: Top-right corner of card
- **Icon**: ✓ (checkmark)

---

## 🔄 User Flows

### Flow 1: New User Onboarding

```
Start App (First Time)
    ↓
┌─────────────────────┐
│ Budget Setup        │
│ - Monthly Income    │
│ - Fixed Charges     │
│ - Savings Goal      │
│ - Cycle Start Day   │
└─────────────────────┘
    ↓ [User clicks "Enregistrer"]
    ↓
┌─────────────────────┐
│ Avatar Selection    │ ← NEW STEP
│ - Choose from 8     │
│ - Fox pre-selected  │
│ - Grid display      │
└─────────────────────┘
    ↓ [User clicks "Continuer"]
    ↓
┌─────────────────────┐
│ Dashboard           │
│ Shows selected      │
│ avatar in header    │
└─────────────────────┘
```

**Estimated Time**: +30 seconds to onboarding

---

### Flow 2: Changing Avatar in Settings

```
Dashboard
    ↓ [User taps ⚙️ Settings icon]
    ↓
┌─────────────────────┐
│ Settings Screen     │
│ - Scroll to         │
│   Personnalisation  │
└─────────────────────┘
    ↓ [User taps Avatar row]
    ↓
┌─────────────────────┐
│ Avatar Selector     │
│ Modal (full screen) │
│ - Current selected  │
│ - Shows checkmark   │
└─────────────────────┘
    ↓ [User taps new avatar]
    ↓
┌─────────────────────┐
│ Auto-save           │
│ Modal closes        │
│ Success message     │
└─────────────────────┘
    ↓ [Returns to Settings]
    ↓
Avatar updated in
Settings and Dashboard
```

**Estimated Time**: 5-10 seconds

---

### Flow 3: Existing User (First Login After Update)

```
App Update Installed
    ↓
User Opens App
    ↓
┌─────────────────────┐
│ Load Preferences    │
│ - No avatarId found │
│ - Use default (Fox) │
└─────────────────────┘
    ↓
┌─────────────────────┐
│ Dashboard           │
│ Shows 🦊 Fox        │
│ (default avatar)    │
└─────────────────────┘
    ↓
User can change anytime
in Settings
```

**Note**: Seamless upgrade, no action required

---

## 📐 Responsive Design

### Mobile (Portrait)
- 2-column grid for avatars
- Cards: ~47% width each
- Gap: 16px between cards
- Padding: 16px left/right

### Mobile (Landscape)
- Same 2-column layout
- Scrollable if needed
- Maintains aspect ratio

### Tablet
- Could expand to 3-4 columns
- (Not currently implemented, but flexible design supports it)

---

## 🎭 Animation & Interaction

### Avatar Card Selection
1. **Tap**: Scale down slightly (0.98)
2. **Release**: Scale back to 1.0
3. **Selected State**: 
   - Border color changes (gray → blue)
   - Border width increases (2px → 3px)
   - Background tint (white → light blue)
   - Checkmark appears (fade in)

### Modal Transitions
- **Open**: Slide up from bottom
- **Close**: Slide down
- **Duration**: 300ms
- **Easing**: ease-in-out

### Success Feedback
- Toast message: "Avatar mis à jour !"
- Duration: 2 seconds
- Position: Center
- Background: Semi-transparent

---

## 🌐 Cross-Platform Consistency

### Emoji Rendering
All avatars use standard Unicode emojis:
- ✅ iOS: Native Apple emoji
- ✅ Android: Native Google emoji  
- ✅ Web: System default emoji

**Advantage**: No custom assets needed, works everywhere

### Platform Differences
- **iOS**: Emojis appear more colorful
- **Android**: Slightly different emoji style
- **Web**: Depends on OS/browser

**Result**: Minor visual differences are acceptable and expected

---

## 📊 Accessibility

### Touch Targets
- ✅ Minimum 44x44px (WCAG AAA)
- Avatar cards: ~170x150px (well above minimum)
- Settings row: Full width, 60px height

### Visual Indicators
- ✅ Clear selection state (not just color)
- ✅ Checkmark icon for screen readers
- ✅ Text labels for all avatars

### Screen Reader Support
- Avatar cards: "Renard, sélectionné" or "Chat"
- Settings: "Avatar, Renard sélectionné, modifier"
- Modal: "Modifier l'avatar"

---

## 💡 Design Decisions

### Why Emojis?
1. **Cross-platform**: Work on all devices
2. **No assets**: No need for image files
3. **Scalable**: Vector-based, any size
4. **Familiar**: Users understand emojis
5. **Fast**: No loading time
6. **Accessible**: Built-in screen reader support

### Why 8 Avatars?
1. **Variety**: Enough choice without overwhelming
2. **Grid**: Perfect 4x2 layout
3. **Performance**: Lightweight
4. **Manageable**: Easy to maintain

### Avatar Selection
- Animals: Universal appeal
- Objects: Relate to finance (piggy bank)
- Symbols: Abstract but meaningful
- Mix: Something for everyone

---

## 🎯 Success Metrics

### User Engagement
- **Avatar selection rate**: >90% during onboarding
- **Avatar change frequency**: ~2-3 times/user/lifetime
- **Time to select**: <10 seconds average

### Technical Performance
- **Load time**: <100ms (emojis are instant)
- **Storage**: <50 bytes per user (just ID)
- **Memory**: Negligible impact

### User Satisfaction
- **Personalization**: Users feel ownership
- **Identity**: Visual representation
- **Fun factor**: Adds personality to app

---

## 🔮 Future Enhancements

### Phase 2 (Optional)
1. **Seasonal Avatars**: 🎃🎄🌸 Special occasions
2. **Achievement Avatars**: Unlock via badges
3. **Premium Avatars**: Exclusive for subscribers
4. **Avatar Packs**: Themed collections

### Phase 3 (Advanced)
1. **Avatar Editor**: Simple customization
2. **Animated Avatars**: Subtle motion
3. **Photo Upload**: User's own picture
4. **Avatar Reactions**: Based on budget status

**Note**: Current implementation provides solid foundation for all future enhancements

---

**Created**: November 8, 2024  
**Version**: 1.0  
**Status**: Final Implementation
