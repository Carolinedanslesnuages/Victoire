# Epic 24: Voice Commands - Visual Guide

## 📱 User Interface Screens

### 1. Settings Screen - Voice Commands Entry Point

```
┌─────────────────────────────────────┐
│ ← Paramètres                        │
├─────────────────────────────────────┤
│                                     │
│ ┌─ Personnalisation ──────────────┐│
│ │ 👤 Avatar              Écureuil ││
│ │ 💱 Devise              EUR €    ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─ 🎤 Commandes Vocales ──────────┐│
│ │                                 ││
│ │ Configurez des phrases          ││
│ │ personnalisées pour Siri et     ││
│ │ Google Assistant                ││
│ │                                 ││
│ │ ⚙️ Phrases Personnalisées    › ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─ Catégories personnalisées ────┐│
│ │ [Ajouter une catégorie...]   + ││
│ └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

### 2. Voice Commands Settings Screen (Empty State)

```
┌─────────────────────────────────────┐
│ Commandes Vocales         Annuler  │
├─────────────────────────────────────┤
│                                     │
│ Configurez des phrases              │
│ personnalisées pour Siri et Google  │
│ Assistant                           │
│                                     │
│ ┌─────────────────────────────────┐│
│ │ Activer les commandes      [ON] ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ ℹ️ Instructions de configuration ││
│ └─────────────────────────────────┘│
│                                     │
│ ┏━ Phrases Personnalisées ━━━━━━━┓│
│ ┃                                 ┃│
│ ┃ [+ Ajouter une phrase]          ┃│
│ ┃                                 ┃│
│ ┃ ┌─────────────────────────────┐ ┃│
│ ┃ │ Aucune phrase configurée.   │ ┃│
│ ┃ │ Ajoutez votre première      │ ┃│
│ ┃ │ phrase !                    │ ┃│
│ ┃ └─────────────────────────────┘ ┃│
│ ┃                                 ┃│
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛│
│                                     │
└─────────────────────────────────────┘
```

### 3. Setup Instructions (Expanded)

```
┌─────────────────────────────────────┐
│ ℹ️ Instructions de configuration    │
├─────────────────────────────────────┤
│                                     │
│ Pour iOS (Siri Shortcuts)           │
│                                     │
│ 1. Ouvrez l'app Raccourcis sur     │
│    votre iPhone                     │
│                                     │
│ 2. Créez un nouveau raccourci       │
│                                     │
│ 3. Ajoutez l'action "Ouvrir l'app" │
│                                     │
│ 4. Sélectionnez PACE dans la liste │
│                                     │
│ 5. Personnalisez la phrase          │
│    d'activation                     │
│                                     │
│ 6. Testez avec "Dis Siri,          │
│    [votre phrase]"                  │
│                                     │
│ 💡 Exemple:                         │
│ "Dis Siri, ajoute 15 euros à       │
│  mon budget"                        │
│                                     │
└─────────────────────────────────────┘
```

### 4. Add New Phrase Modal

```
┌─────────────────────────────────────┐
│        Ajouter une phrase           │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐│
│ │ J'ai acheté du pain             ││
│ └─────────────────────────────────┘│
│ Ex: "J'ai acheté du pain"           │
│                                     │
│ ┌─────────────────────────────────┐│
│ │ 3.50                            ││
│ └─────────────────────────────────┘│
│ Montant                             │
│                                     │
│ ┌─────────────────────────────────┐│
│ │ Boulangerie                     ││
│ └─────────────────────────────────┘│
│ Description                         │
│                                     │
│ ┌─────────────────────────────────┐│
│ │ Alimentation                    ││
│ └─────────────────────────────────┘│
│ Catégorie (optionnel)               │
│                                     │
│ ┌────────────┐  ┌────────────────┐│
│ │  Annuler   │  │  Enregistrer   ││
│ └────────────┘  └────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

### 5. Voice Commands Screen (With Phrases)

```
┌─────────────────────────────────────┐
│ Commandes Vocales         Annuler  │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐│
│ │ Activer les commandes      [ON] ││
│ └─────────────────────────────────┘│
│                                     │
│ ┏━ Phrases Personnalisées ━━━━━━━┓│
│ ┃                 [+ Ajouter]     ┃│
│ ┃                                 ┃│
│ ┃ ┌─────────────────────────────┐ ┃│
│ ┃ │ "J'ai acheté du pain"       │ ┃│
│ ┃ │ 3.50€ • Boulangerie  ✏️ 🗑️ │ ┃│
│ ┃ └─────────────────────────────┘ ┃│
│ ┃                                 ┃│
│ ┃ ┌─────────────────────────────┐ ┃│
│ ┃ │ "Plein d'essence"           │ ┃│
│ ┃ │ 60.00€ • Carburant    ✏️ 🗑️ │ ┃│
│ ┃ └─────────────────────────────┘ ┃│
│ ┃                                 ┃│
│ ┃ ┌─────────────────────────────┐ ┃│
│ ┃ │ "Café du matin"             │ ┃│
│ ┃ │ 2.00€ • Restaurant    ✏️ 🗑️ │ ┃│
│ ┃ └─────────────────────────────┘ ┃│
│ ┃                                 ┃│
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛│
│                                     │
└─────────────────────────────────────┘
```

## 🎬 User Flow Diagrams

### Complete User Journey

```
┌─────────────┐
│   START     │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Open PACE App       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Go to Settings      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────────┐
│ Tap "Voice Commands"    │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Tap "+ Add Phrase"      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Fill Form:              │
│ - Phrase: "Pain"        │
│ - Amount: 3.50          │
│ - Desc: "Boulangerie"   │
│ - Category: "Food"      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Tap "Save"              │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Open iOS Shortcuts App  │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Create New Shortcut     │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Add "Open App" Action   │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Select PACE             │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Set Phrase:             │
│ "Pain acheté"           │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Save Shortcut           │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Say:                    │
│ "Dis Siri, Pain acheté" │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ PACE Opens              │
│ Expense Added: 3.50€    │
└──────┬──────────────────┘
       │
       ▼
┌─────────────┐
│     END     │
└─────────────┘
```

## 📊 Data Flow Diagram

```
┌──────────────────────┐
│    User Voice        │
│   "Pain acheté"      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    Siri Engine       │
│  (iOS System)        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  iOS Shortcuts App   │
│   Opens PACE         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   PACE App.tsx       │
│ registerSiriShortcuts│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  siriShortcuts.ts    │
│ handleSiriShortcut() │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  voiceCommands.ts    │
│ findVoiceCommand()   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   AsyncStorage       │
│ Load Phrase Data     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Match Found:         │
│ "Pain" = 3.50€       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Transaction        │
│  Created & Saved     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Dashboard Updated   │
│  Budget Recalculated │
└──────────────────────┘
```

## 🎨 Dark Mode Support

### Voice Commands Screen (Dark Mode)

```
┌─────────────────────────────────────┐
│░Commandes Vocales░░░░░░░░░░Annuler░░│
├─────────────────────────────────────┤
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░┌───────────────────────────────┐░░│
│░│░Activer les commandes░░░░[ON]░│░░│
│░└───────────────────────────────┘░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░┏━━Phrases Personnalisées━━━━━━━┓░░│
│░┃░░░░░░░░░░░░░░░░░░[+░Ajouter]░░┃░░│
│░┃░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░┃░░│
│░┃░┌───────────────────────────┐░┃░░│
│░┃░│░"J'ai░acheté░du░pain"░░░░░│░┃░░│
│░┃░│░3.50€░•░Boulangerie░✏️░🗑️░│░┃░░│
│░┃░└───────────────────────────┘░┃░░│
│░┃░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░┃░░│
│░┃░┌───────────────────────────┐░┃░░│
│░┃░│░"Plein░d'essence"░░░░░░░░░│░┃░░│
│░┃░│░60.00€░•░Carburant░░✏️░🗑️░│░┃░░│
│░┃░└───────────────────────────┘░┃░░│
│░┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────────────┘
```

## 🎯 Real-World Usage Scenarios

### Scenario 1: Morning Coffee Run
```
🏃 User at café counter
🎤 "Dis Siri, Café du matin"
📱 PACE opens, adds 2.00€ expense
✅ Transaction recorded in < 3 seconds
```

### Scenario 2: Gas Station Fill-up
```
🚗 User pumping gas
🎤 "Dis Siri, Plein d'essence"
📱 PACE opens, adds 60.00€ expense
✅ Hands-free, no need to take out phone
```

### Scenario 3: Quick Grocery Stop
```
🛒 User exiting store with bags
🎤 "Dis Siri, J'ai acheté du pain"
📱 PACE opens, adds 3.50€ expense
✅ Perfect when hands are full
```

## 🔄 Before vs After Comparison

### Before (Manual Entry)
```
1. 🔓 Unlock phone (2s)
2. 🔍 Find PACE app (3s)
3. 👆 Tap to open (1s)
4. ➕ Tap "Add Expense" (1s)
5. ⌨️ Type amount (5s)
6. ⌨️ Type description (10s)
7. 📂 Select category (3s)
8. ✅ Tap "Save" (1s)

Total Time: ~26 seconds
Requires: Full attention, both hands
```

### After (Voice Command)
```
1. 🎤 "Dis Siri, [phrase]" (2s)
2. 📱 App opens automatically (1s)
3. ✅ Expense added (1s)

Total Time: ~4 seconds
Requires: Voice only, no hands!
```

**Time Saved: 22 seconds per expense**  
**Convenience: Hands-free!**

## 📱 iOS Shortcuts Integration

### Shortcut Configuration Example

```
┌─────────────────────────────────────┐
│ iOS Shortcuts App                   │
├─────────────────────────────────────┤
│                                     │
│ Nouveau Raccourci                   │
│                                     │
│ ┌─ Actions ─────────────────────┐  │
│ │                               │  │
│ │  1️⃣ Ouvrir l'app              │  │
│ │     App: PACE                 │  │
│ │                               │  │
│ └───────────────────────────────┘  │
│                                     │
│ ⚙️ Paramètres du raccourci          │
│                                     │
│ Phrase:                             │
│ ┌─────────────────────────────────┐│
│ │ J'ai acheté du pain             ││
│ └─────────────────────────────────┘│
│                                     │
│ Afficher dans le widget: ✓          │
│ Partager la feuille: ✗              │
│                                     │
│         [Tester le raccourci]       │
│                                     │
└─────────────────────────────────────┘
```

## ✨ Visual Benefits

### Accessibility
- ✅ Large, touch-friendly buttons
- ✅ High contrast text
- ✅ Clear visual hierarchy
- ✅ Theme support (light/dark)
- ✅ Emoji icons for quick recognition

### User Feedback
- ✅ Toast notifications on save
- ✅ Loading states
- ✅ Error messages
- ✅ Confirmation dialogs
- ✅ Visual indicators

### Polish
- ✅ Smooth animations
- ✅ Consistent spacing
- ✅ Professional typography
- ✅ Modern, flat design
- ✅ Platform-appropriate UI

---

*This visual guide demonstrates the complete user experience of Epic 24's voice commands feature, showing how users can effortlessly track expenses hands-free using Siri Shortcuts.*
