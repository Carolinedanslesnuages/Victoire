# Epic 8: Widgets & Quick Access

## Overview

This implementation adds home screen widgets and quick actions to the PACE app, allowing users to see their budget without opening the app.

## Features Implemented

### Feature 8.1: Home Screen Widget

**User Story 8.1.1**: As a user, I want to add a widget on my home screen that displays my "Reste à Vivre" (daily budget) prominently.

**User Story 8.1.2**: As a user, I want the widget to change color (Teal/Red) based on my budget state.

The widget displays:
- Daily budget amount in large, bold numbers
- Currency symbol
- "Reste à Vivre" label
- "/jour" (per day) indicator
- Background color:
  - **Teal (#008080)**: When budget is positive (≥ 0)
  - **Red (#FF3B30)**: When budget is negative (< 0)

### Feature 8.2: Quick Actions (Shortcuts)

**User Story 8.2.1**: As a user, I want to long-press on the app icon to see an "Add Expense" shortcut that opens the expense form directly.

Quick actions available:
- **Add Expense**: Opens the add expense modal directly

## Technical Implementation

### Packages Used

- `expo-quick-actions@6.0.0`: For app shortcuts
- `react-native-widget-extension@0.2.0`: For iOS and Android widgets

### Architecture

#### Widget Data Flow

1. **Data Collection**: `utils/widgetData.ts`
   - Retrieves active budget profile
   - Calculates daily budget (Reste à Vivre)
   - Formats data for widget consumption

2. **Data Storage**:
   - **iOS**: Uses App Groups (`group.com.carolinedanslesnuages.pace`) to share data between app and widget
   - **Android**: Uses SharedPreferences (AsyncStorage) accessible to widget

3. **Widget Updates**:
   - Automatically updated when:
     - Budget profile loads
     - Transaction is added
     - Budget configuration changes

#### iOS Widget (WidgetKit)

Files created:
- `ios/BudgetWidget/BudgetWidget.swift`: Widget implementation
- `ios/BudgetWidget/Info.plist`: Widget metadata
- `ios/WidgetDataBridge/WidgetDataBridge.swift`: Native module for data sharing
- `ios/WidgetDataBridge/WidgetDataBridge.m`: Objective-C bridge

Features:
- Small and Medium widget sizes supported
- Updates every 15 minutes
- SwiftUI implementation
- App Groups for data sharing

#### Android Widget (AppWidget)

Files created:
- `android/app/src/main/java/com/carolinedanslesnuages/pace/widget/BudgetWidgetProvider.java`
- `android/app/src/main/res/layout/widget_budget.xml`
- `android/app/src/main/res/xml/budget_widget_info.xml`
- `android/app/src/main/res/values/strings.xml`

Features:
- Configurable size (2x2 cells minimum)
- Updates every 15 minutes
- SharedPreferences for data sharing

#### Quick Actions

Implementation in `utils/quickActions.ts`:
- Sets up "Add Expense" shortcut
- Listens for quick action events
- Triggers appropriate action in app

Configuration in `app.json`:
- iOS: Uses SF Symbols (`plus.circle.fill`)
- Android: Uses app icon

### Translations

Added to both `locales/fr.json` and `locales/en.json`:

```json
{
  "widget": {
    "title": "PACE Budget",
    "description": "Votre budget du jour en un coup d'œil",
    "resteAVivre": "Reste à Vivre",
    "perDay": "/jour",
    "noData": "Ouvrez l'app pour configurer votre budget",
    "loading": "Chargement..."
  },
  "quickActions": {
    "addExpense": {
      "title": "Ajouter une Dépense",
      "subtitle": "Enregistrer rapidement"
    }
  }
}
```

## Setup Instructions

### Prerequisites

**Important**: Widgets and quick actions require a **development build**. They will NOT work in Expo Go.

### Building for iOS

1. Configure App Groups in Apple Developer Portal:
   - Add App Group: `group.com.carolinedanslesnuages.pace`
   - Enable App Groups capability for main app
   - Enable App Groups capability for widget extension

2. Build development build:
   ```bash
   npx eas build --profile development --platform ios
   ```

3. Install on device or simulator

4. Add widget:
   - Long press on home screen
   - Tap "+" button
   - Search for "PACE"
   - Select widget size
   - Tap "Add Widget"

### Building for Android

1. Build development build:
   ```bash
   npx eas build --profile development --platform android
   ```

2. Install on device or emulator

3. Add widget:
   - Long press on home screen
   - Tap "Widgets"
   - Find "PACE Budget"
   - Drag to home screen

### Testing Quick Actions

#### iOS
- iPhone 6s and later: 3D Touch (press firmly)
- iPhone XR and later: Haptic Touch (long press)

#### Android
- Long press on app icon
- Select "Add Expense"

## Widget Behavior

### Data Updates

The widget data is updated:
1. When the app is opened
2. After adding a transaction
3. After budget configuration changes
4. Every 15 minutes automatically (system-initiated)

### Empty State

When no budget is configured:
- Shows icon and "Ouvrez l'app" message
- Teal background color
- Tapping opens the app to configuration wizard

### Budget Display

When budget is configured:
- Shows daily budget amount
- Shows currency
- Background color indicates budget health:
  - Teal: Positive budget (you have money to spend)
  - Red: Negative budget (overspent)

## Configuration

### App.json Configuration

```json
{
  "plugins": [
    [
      "expo-quick-actions",
      {
        "androidIcons": {
          "add_expense": {
            "foregroundImage": "./assets/icon.png"
          }
        },
        "iosIcons": {
          "add_expense": "plus.circle.fill"
        }
      }
    ],
    [
      "react-native-widget-extension",
      {
        "frequentUpdates": true,
        "widgets": [
          {
            "name": "BudgetWidget",
            "displayName": "PACE Budget",
            "description": "See your daily budget at a glance",
            "platforms": ["ios", "android"]
          }
        ]
      }
    ]
  ]
}
```

## Utilities

### `utils/widgetData.ts`

Functions:
- `updateWidgetData()`: Update widget with current budget data
- `getWidgetData()`: Retrieve current widget data
- `formatWidgetCurrency()`: Format currency for display
- `getWidgetColor()`: Get colors based on budget state

### `utils/quickActions.ts`

Functions:
- `setupQuickActions(onAction)`: Initialize quick actions
- `clearQuickActions()`: Remove all quick actions

## Testing

### Manual Testing

1. **Widget Display**:
   - Add widget to home screen
   - Verify daily budget is displayed
   - Verify color changes based on budget state

2. **Widget Updates**:
   - Open app and add expense
   - Wait or force refresh
   - Verify widget shows updated amount

3. **Quick Actions**:
   - Long press app icon
   - Select "Add Expense"
   - Verify expense modal opens

### Limitations

- Widgets require development build (not available in Expo Go)
- iOS widgets update at most every 15 minutes
- Android widgets update every 15 minutes
- Manual refresh not available (system limitation)

## Troubleshooting

### Widget Not Showing Data

1. Open the app to trigger data update
2. Add a transaction to force update
3. Wait 15 minutes for system update
4. Check that budget profile is configured

### Quick Actions Not Working

1. Ensure you're using a development build
2. Try closing and reopening the app
3. Check device supports feature (iOS 9+, Android 7.1+)

### iOS Widget Not Updating

1. Verify App Groups are configured correctly
2. Check bundle identifier matches
3. Rebuild with correct provisioning profile

## Future Enhancements

Potential improvements:
- Interactive widgets (add expense from widget)
- Live Activities for iOS
- Multiple widget sizes
- Configurable widget appearance
- Widget configuration options

## References

- [Expo Quick Actions Documentation](https://www.npmjs.com/package/expo-quick-actions)
- [React Native Widget Extension](https://www.npmjs.com/package/react-native-widget-extension)
- [iOS WidgetKit](https://developer.apple.com/documentation/widgetkit)
- [Android App Widgets](https://developer.android.com/develop/ui/views/appwidgets)
