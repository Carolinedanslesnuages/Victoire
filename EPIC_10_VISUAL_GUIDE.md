# Epic 10: Gamification UI Visual Guide

## 1. Dashboard Header - Streak Indicator

```
┌─────────────────────────────────────────────────────────┐
│ 🏠 Dashboard - Teal Header (#00897B)                    │
│                                                          │
│  Mon Budget PACE  [🔥 7]                         ⚙️      │
│  Cycle du 5 de chaque mois                               │
└─────────────────────────────────────────────────────────┘
```

**Streak Badge Details:**
- Background: `rgba(255, 255, 255, 0.2)` (glass morphism)
- Border radius: Full (pill shape)
- Padding: 8px horizontal, 4px vertical
- Emoji size: 18px
- Text: Bold, white, 16px

---

## 2. Streak Celebration Animation

### Initial State (t=0s)
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│                    [Dark Overlay]                        │
│                     opacity: 0%                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Animation Phase 1 (t=0-0.3s) - Scale Up + Fade In
```
┌─────────────────────────────────────────────────────────┐
│                 ████████████████                         │
│               ██                ██                       │
│             ██                    ██                     │
│            ██        🔥             ██                   │
│            ██      (100px)          ██                   │
│             ██                    ██                     │
│               ██                ██                       │
│                 ████████████████                         │
│                   (Teal circle)                          │
│                    scale: 0→1                            │
└─────────────────────────────────────────────────────────┘
```

### Animation Phase 2 (t=0.3-0.9s) - Rotation
```
┌─────────────────────────────────────────────────────────┐
│                 ████████████████                         │
│               ██                ██                       │
│             ██      🔥→🔥→        ██                      │
│            ██    ↗rotation↘       ██                    │
│            ██       360°           ██                    │
│             ██                    ██                     │
│               ██                ██                       │
│                 ████████████████                         │
│                                                          │
│                  Série Active!                           │
│                      【7】                                │
│                     jours                                │
└─────────────────────────────────────────────────────────┘
```

### Animation Phase 3 (t=0.9-1.7s) - Pulse
```
┌─────────────────────────────────────────────────────────┐
│                 ████████████████                         │
│               ██                ██                       │
│             ██                    ██                     │
│            ██        🔥             ██                   │
│            ██   scale: 1.0→1.1     ██                   │
│             ██      →1.0          ██                     │
│               ██    (2x)        ██                       │
│                 ████████████████                         │
│                                                          │
│                  Série Active!                           │
│                      【7】                                │
│                     jours                                │
└─────────────────────────────────────────────────────────┘
```

### Animation Phase 4 (t=1.7-2.0s) - Fade Out
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│                    [Dark Overlay]                        │
│                   opacity: 100%→0%                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Badge Unlock Modal

```
┌─────────────────────────────────────────────────────────┐
│                  [Dark Overlay 70%]                      │
│                                                          │
│         ┌────────────────────────────────┐              │
│         │  ✨ Badge Rare ✨               │              │
│         │                                │              │
│         │    🎉 Nouveau Badge !          │              │
│         │                                │              │
│         │      ┌──────────────┐          │              │
│         │      │              │          │              │
│         │      │              │          │              │
│         │      │      🏆       │          │              │
│         │      │              │          │              │
│         │      │              │          │              │
│         │      └──────────────┘          │              │
│         │     (120px circle)             │              │
│         │                                │              │
│         │    【30 Jours Zen】             │              │
│         │  30 jours consécutifs          │              │
│         │                                │              │
│         │     ┌──────────────┐           │              │
│         │     │    Super !   │           │              │
│         │     └──────────────┘           │              │
│         └────────────────────────────────┘              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Colors:**
- Rare badge banner: Orange (#FF9800)
- Badge circle: Orange for rare, Teal for common
- Button: Teal (#00897B)

---

## 4. Profile Screen Layout

```
┌─────────────────────────────────────────────────────────┐
│ Profil & Stats                                  (60px)  │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Votre Série 🔥                                    │   │
│ │                                                   │   │
│ │  ┌──────────────┐  │  ┌──────────────┐          │   │
│ │  │ Série Actuelle│  │  │ Meilleure    │          │   │
│ │  │      7        │  │  │ Série        │          │   │
│ │  │    jours      │  │  │     30       │          │   │
│ │  └──────────────┘  │  └─────jours─────┘          │   │
│ │                                                   │   │
│ │  ──────────────────────────────────────          │   │
│ │                                                   │   │
│ │  🧊 Gels de Série         ❤️ Jokers              │   │
│ │      Disponibles            Restants             │   │
│ │          2                      3                │   │
│ │                                                   │   │
│ │  ┌──────────────┐      ┌──────────────┐         │   │
│ │  │🧊 Utiliser   │      │❤️ Utiliser   │         │   │
│ │  │   un Gel     │      │  un Joker    │         │   │
│ │  └──────────────┘      └──────────────┘         │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Collection de Badges                              │   │
│ │ 4 badges débloqués                                │   │
│ │                                                   │   │
│ │  ┌──────┐  ┌──────┐  ┌──────┐                    │   │
│ │  │  🏅  │  │  🔥  │  │  🏆  │                    │   │
│ │  │Premier│  │ Week │  │ 30   │                    │   │
│ │  │  Pas  │  │Warr. │  │Jours │                    │   │
│ │  └──────┘  └──────┘  └──────┘                    │   │
│ │              Badge Rare ✨                         │   │
│ │                                                   │   │
│ │  ┌──────┐                                         │   │
│ │  │  🧊  │                                         │   │
│ │  │Protect│                                        │   │
│ │  │eur    │                                         │   │
│ │  └──────┘                                         │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Statistiques                                      │   │
│ │                                                   │   │
│ │  ┌──────────────┐  │  ┌──────────────┐          │   │
│ │  │ Cycles        │  │  │ Cycles       │          │   │
│ │  │ Terminés      │  │  │ Positifs     │          │   │
│ │  │      5        │  │  │      4       │          │   │
│ │  └──────────────┘  │  └──────────────┘          │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Spacing:**
- Section margins: 24px
- Card padding: 24px
- Badge grid gap: 16px
- Badge circle: 70px diameter

---

## 5. Color Palette

### Primary Colors
```
Teal Primary    ████ #00897B (Main actions, active elements)
Teal Light      ████ #4DB6AC (Hover states)
Teal Dark       ████ #00695C (Pressed states)
```

### Semantic Colors
```
Success Green   ████ #4CAF50 (Positive achievements)
Warning Orange  ████ #FF9800 (Rare badges, streak numbers)
Error Red       ████ #F44336 (Danger indicators)
Info Blue       ████ #2196F3 (Informational)
```

### Neutral Grays
```
Gray 50         ████ #FAFAFA (Background)
Gray 200        ████ #EEEEEE (Disabled buttons)
Gray 300        ████ #E0E0E0 (Borders)
Gray 600        ████ #757575 (Secondary text)
Gray 900        ████ #212121 (Primary text)
```

---

## 6. Typography Scale

```
H1: 48px  ═══════  Budget du Jour
H2: 32px  ══════   Profil & Stats
H3: 24px  ═════    Section Titles
H4: 20px  ════     Subsection Titles
Body: 16px ═══     Regular text
Small: 14px ══     Helper text
Caption: 12px ═    Timestamps
```

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

## 7. Badge Grid Layout

```
┌────────────────────────────────────────────┐
│ Collection de Badges                        │
│ 4 badges débloqués                          │
│                                             │
│  30%       30%       30%     (10% margins) │
│ ┌────┐   ┌────┐   ┌────┐                  │
│ │ 🏅 │   │ 🔥 │   │ 🏆 │                  │
│ │70px│   │70px│   │70px│                  │
│ └────┘   └────┘   └────┘                  │
│ Premier  Week W.  30 Jours                 │
│   Pas              ✨Rare                  │
│                                             │
│ ┌────┐   ┌────┐   ┌────┐                  │
│ │ 🧊 │   │ ❤️ │   │ 🎯 │                  │
│ └────┘   └────┘   └────┘                  │
│ Protect  Joker   Perfect                   │
│  eur     Ace     Balance                   │
└────────────────────────────────────────────┘
```

**Badge States:**
- Common: Teal circle (#00897B)
- Rare: Orange circle (#FF9800) + "✨Rare" label
- Emoji: 36px centered
- Name: 12px caption, centered, medium weight

---

## 8. Animation Timing

```
Streak Celebration Timeline:
┌────────────────────────────────────────────┐
│ 0.0s: Start (scale=0, opacity=0)          │
├────────────────────────────────────────────┤
│ 0.3s: Scale up complete (scale=1)         │
│       Fade in complete (opacity=1)         │
├────────────────────────────────────────────┤
│ 0.9s: Rotation complete (360°)            │
├────────────────────────────────────────────┤
│ 1.3s: First pulse (scale=1.1)             │
├────────────────────────────────────────────┤
│ 1.7s: Pulse complete (scale=1.0)          │
├────────────────────────────────────────────┤
│ 2.0s: Fade out complete (opacity=0)       │
│       onComplete() triggered               │
└────────────────────────────────────────────┘

Badge Unlock Timeline:
┌────────────────────────────────────────────┐
│ 0.0s: Start (scale=0)                     │
├────────────────────────────────────────────┤
│ 0.4s: Spring animation complete (scale=1) │
│       (friction=8, tension=40)             │
├────────────────────────────────────────────┤
│ User dismisses with button tap             │
└────────────────────────────────────────────┘
```

---

## 9. Notification Templates

### Evening Streak Reminder
```
┌────────────────────────────────────────────┐
│ 🔥 Sauvez votre série !                    │
│                                             │
│ Vous n'avez pas encore ouvert              │
│ l'application aujourd'hui. Ne perdez       │
│ pas votre série de 7 jours !               │
│                                             │
│ Il y a 2 heures                    [Ouvrir]│
└────────────────────────────────────────────┘
```

**Scheduling:**
- Time: 20:00 daily
- Condition: Active streak > 0
- Repeats: Daily

### Morning Budget (Existing - Enhanced)
```
┌────────────────────────────────────────────┐
│ 💰 Votre budget du jour                    │
│                                             │
│ Bonjour ! Aujourd'hui vous pouvez         │
│ dépenser 42.50 €                           │
│                                             │
│ Il y a 8 heures                    [Ouvrir]│
└────────────────────────────────────────────┘
```

---

## 10. Interaction States

### Button States
```
Normal State:
┌──────────────────┐
│ 🧊 Utiliser Gel │  Background: Teal
│                  │  Text: White
└──────────────────┘

Pressed State:
┌──────────────────┐
│ 🧊 Utiliser Gel │  Opacity: 70%
│                  │
└──────────────────┘

Disabled State:
┌──────────────────┐
│ 🧊 Utiliser Gel │  Background: Gray 200
│                  │  Opacity: 50%
└──────────────────┘
```

### Badge Hover (Web)
```
┌────┐           ┌────┐
│ 🏅 │  ──────>  │ 🏅 │  Scale: 1.0 → 1.05
└────┘           └────┘  Shadow: increase
Premier          Premier
  Pas              Pas
```

---

## 11. Responsive Breakpoints

```
Small Phone (< 360px):
- Badge size: 60px
- Emoji size: 32px
- H1: 40px (scaled down)

Regular Phone (360-400px):
- Badge size: 70px (default)
- Emoji size: 36px
- H1: 48px

Large Phone (> 400px):
- Badge size: 80px
- Emoji size: 40px
- H1: 48px
```

---

## 12. Accessibility

### Color Contrast Ratios
```
✅ Teal on White: 4.6:1 (AA compliant)
✅ Gray 900 on White: 16:1 (AAA compliant)
✅ White on Teal: 4.6:1 (AA compliant)
✅ Gray 600 on White: 4.5:1 (AA compliant)
```

### Touch Targets
```
Minimum: 44x44px
─────────────────
Button height: 48px ✅
Badge size: 70px ✅
Settings icon: 44px ✅
```

### Screen Reader Labels
- Streak badge: "Série active, 7 jours consécutifs"
- Badge: "Badge Premier Pas, débloqué le 5 janvier"
- Freeze button: "Utiliser un gel de série, 2 disponibles"
- Joker button: "Utiliser un joker, 3 restants ce mois"

---

## Summary

This visual guide provides a complete reference for implementing and understanding the Epic 10 gamification UI. All measurements, colors, and animations are production-ready and follow Material Design and iOS Human Interface Guidelines principles.
