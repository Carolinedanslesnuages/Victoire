# Epic 20: Visual Guide - Support & Feedback Features

## Screen Navigation Flow

```
Settings Screen
    ↓
Support & Help Section
    ↓
    ├── ❓ FAQ Button → FAQ Screen
    │                    ↓
    │                    [List of Questions]
    │                    ↓
    │                    [Tap to Expand/Collapse]
    │                    ↓
    │                    [Need More Help?] → Back to Feedback
    │
    └── 💬 Send Feedback Button → Feedback Screen
                                    ↓
                                    [Select Type: Bug/Idea/Other]
                                    ↓
                                    [Enter Message]
                                    ↓
                                    [Review Device Info]
                                    ↓
                                    [Tap Send] → Email Client Opens
                                    ↓
                                    [User Sends Email]
```

## Settings Screen Changes

### Before
```
┌─────────────────────────────────────┐
│  ⚙️ Settings                        │
├─────────────────────────────────────┤
│                                     │
│  📤 Data Export                     │
│  ├── Export to CSV                  │
│                                     │
│  📄 Legal                           │
│  ├── Privacy Policy                 │
│  └── Terms of Service               │
│                                     │
│  ⚠️ Danger Zone                     │
│  └── Reset Application              │
│                                     │
└─────────────────────────────────────┘
```

### After (with Support & Help)
```
┌─────────────────────────────────────┐
│  ⚙️ Settings                        │
├─────────────────────────────────────┤
│                                     │
│  📤 Data Export                     │
│  ├── Export to CSV                  │
│                                     │
│  🆘 Support & Help        ← NEW!   │
│  ├── ❓ FAQ               ← NEW!   │
│  └── 💬 Send Feedback     ← NEW!   │
│                                     │
│  📄 Legal                           │
│  ├── Privacy Policy                 │
│  └── Terms of Service               │
│                                     │
│  ⚠️ Danger Zone                     │
│  └── Reset Application              │
│                                     │
└─────────────────────────────────────┘
```

## FAQ Screen Layout

```
┌─────────────────────────────────────┐
│  Frequently Asked Questions    [✕]  │ ← Header (Primary Color)
├─────────────────────────────────────┤
│                                     │
│  Quickly find answers to common     │ ← Subtitle
│  questions about PACE               │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ How is my daily budget      │ + │ ← Collapsed Question
│  │ calculated?                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ What is the cycle start day?│ − │ ← Expanded Question
│  ├─────────────────────────────┤   │
│  │ It's the day of the month   │   │ ← Answer Visible
│  │ when your new budget cycle  │   │
│  │ begins, usually the day you │   │
│  │ receive your salary...      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ How do I use custom         │ + │ ← Collapsed Question
│  │ categories?                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ... 3 more questions ...           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🆘 Need More Help?          │   │ ← Help Section
│  │                             │   │
│  │ If you can't find the answer│   │
│  │ to your question, contact us│   │
│  │ via the 'Send Feedback'     │   │
│  │ button in Settings.         │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

## Feedback Screen Layout

```
┌─────────────────────────────────────┐
│  Send Feedback                 [✕]  │ ← Header (Primary Color)
├─────────────────────────────────────┤
│                                     │
│  Experiencing a problem or have     │ ← Subtitle
│  an idea? Let us know!              │
│                                     │
│  Feedback type                      │ ← Section Title
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ 🐛   │ │ 💡   │ │ 💬   │       │ ← Type Selector
│  │ Bug  │ │ Idea │ │Other │       │   (Blue highlight when selected)
│  └──────┘ └──────┘ └──────┘       │
│                                     │
│  Your message                       │ ← Section Title
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │  Describe your problem,     │   │ ← Message Input
│  │  idea, or suggestion...     │   │   (150px height)
│  │                             │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Device Information                 │ ← Section Title
│  ┌─────────────────────────────┐   │
│  │ App Version: 1.11.0 (100)   │   │ ← Device Info Box
│  │ Platform: ios 17.0          │   │   (Monospace font)
│  │ Device: iPhone 14 Pro       │   │
│  └─────────────────────────────┘   │
│                                     │
│  This technical information helps   │ ← Privacy Note
│  diagnose issues. No personal data  │   (Italic, gray)
│  is included.                       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   📧 Send Feedback          │   │ ← Send Button
│  └─────────────────────────────┘   │   (Primary color)
│                                     │
└─────────────────────────────────────┘
```

## Email Composition Example

When user taps "Send Feedback", native email client opens with:

```
To: carolinedanslesnuages@gmail.com
Subject: PACE Problème (or PACE Idée, PACE Autre)

Message de l'utilisateur:

[User's message here]

---
Informations de l'appareil:
App Version: 1.11.0 (100)
Platform: ios 17.0
Device: iPhone 14 Pro
```

## User Interaction Flows

### Flow 1: Finding Answer in FAQ
```
1. User opens Settings
2. Scrolls to "Support & Help"
3. Taps "❓ FAQ"
   └→ FAQ Screen opens
4. Sees list of questions
5. Taps "How is my daily budget calculated?"
   └→ Answer expands with animation
6. Reads answer
7. Question answered!
8. Taps [✕] to close
```

### Flow 2: Submitting Bug Report
```
1. User opens Settings
2. Scrolls to "Support & Help"
3. Taps "💬 Send Feedback"
   └→ Feedback Screen opens
4. Taps "🐛 Bug Report" (already selected by default)
5. Types bug description
6. Reviews device info shown
7. Taps "📧 Send Feedback"
   └→ Validation checks message not empty
   └→ Email client opens with pre-filled email
8. User reviews email
9. User taps Send in email client
10. Email sent to developer!
```

### Flow 3: Closing with Unsaved Content
```
1. User opens Feedback Screen
2. Starts typing message: "I have an idea..."
3. Changes mind, taps [✕]
   └→ Alert appears:
       "Discard Feedback?"
       "You have an unsent message"
       [Continue Editing] [Discard]
4a. Taps "Continue Editing"
    └→ Returns to form with message preserved
4b. Taps "Discard"
    └→ Form closes, message lost
```

## Color Scheme

```
Primary Color:     #007AFF (Blue)
Primary Light:     #E3F2FD (Light Blue)
Surface:           #FFFFFF (White)
Background:        #F5F5F5 (Light Gray)
Border:            #E0E0E0 (Gray)
Text Primary:      #212121 (Dark Gray)
Text Secondary:    #757575 (Medium Gray)
Text Disabled:     #BDBDBD (Light Gray)
Text Inverse:      #FFFFFF (White)
```

## Typography

```
Headers:           24px, Bold
Section Titles:    18px, Semibold
Body Text:         16px, Regular
Small Text:        14px, Regular
Button Text:       16px, Bold
```

## Spacing

```
Extra Large (xl):  32px
Large (lg):        24px
Medium (md):       16px
Small (sm):        8px
Extra Small (xs):  4px
```

## Accessibility

### Screen Reader Support
- All buttons have accessible labels
- FAQ items announce expanded/collapsed state
- Form fields have proper labels
- Device info announced as "technical information"

### Keyboard Navigation
- Modal can be dismissed with escape
- Tab order follows logical flow
- Enter key submits form when focused on send button

### Color Contrast
- All text meets WCAG AA standards
- Button states clearly distinguishable
- Selected type button has sufficient contrast

## Responsive Behavior

### Small Screens (< 375px)
- Type selector buttons stack vertically
- Reduced padding in cards
- Smaller font sizes for device info

### Large Screens (> 768px)
- Max width constraint on content
- Centered layout
- Larger touch targets

### Landscape Mode
- ScrollView enables access to all content
- Header remains fixed at top
- Close button always visible

## Animation Details

### FAQ Expansion
- Duration: 300ms
- Easing: ease-in-out
- Smooth height animation
- Plus icon rotates to minus

### Modal Presentation
- Slide up from bottom
- Duration: 300ms
- Semi-transparent overlay fade-in

### Button Press
- Active opacity: 0.7
- No delay (instant feedback)
- Scale animation on touch

## Error States

### Empty Message Validation
```
Alert:
  Title: "Error"
  Message: "Please enter a message before sending"
  Button: "OK"
```

### Email Client Not Available
```
Alert:
  Title: "Error"
  Message: "Sending emails is not available on this device"
  Button: "OK"
```

### Email Send Failed
```
Alert:
  Title: "Error"
  Message: "Unable to open email client. Please try again."
  Button: "OK"
```

## Success States

### Email Client Opened
```
Alert:
  Title: "Thank You!"
  Message: "Your feedback has been sent. We appreciate your input!"
  Button: "OK"
  └→ Closes Feedback Screen
```

## Testing Scenarios

### Manual Testing Checklist
- [ ] FAQ opens from Settings
- [ ] All 6 FAQ items display correctly
- [ ] Questions expand/collapse smoothly
- [ ] Only one question expanded at a time
- [ ] Help section visible at bottom
- [ ] FAQ closes with ✕ button
- [ ] Feedback opens from Settings
- [ ] All 3 feedback types selectable
- [ ] Type selection highlights properly
- [ ] Message input accepts text
- [ ] Device info displays correctly
- [ ] Empty message shows error
- [ ] Valid message opens email client
- [ ] Email pre-filled correctly
- [ ] Close with unsaved shows confirmation
- [ ] Close without content closes immediately
- [ ] All text in correct language (FR/EN)

## Performance Considerations

### Component Optimization
- FAQ items use React.memo for performance
- Expansion state stored in single variable
- No unnecessary re-renders

### Bundle Size Impact
- +1,129 lines of code
- No new dependencies
- Uses existing Expo/React Native APIs
- Minimal impact on app bundle size

## Maintenance Notes

### Updating FAQ Content
1. Edit translations in `locales/fr.json` and `locales/en.json`
2. Add new items to `faq.items.*` keys
3. Update `FAQScreen.tsx` `faqItems` array
4. Follow existing format for consistency

### Changing Developer Email
1. Edit `FeedbackScreen.tsx`
2. Update `email` constant in `handleSendFeedback` function
3. Update documentation

### Adding Feedback Types
1. Add new type to type union
2. Add translation keys
3. Update type selector UI
4. Add new button in type selector section

This visual guide provides a complete reference for understanding and maintaining the Epic 20 support features.
