# E2E Tests for PACE

This directory contains End-to-End (E2E) tests using Detox for the PACE budget tracking application.

## Overview

The E2E tests cover the two most critical user journeys:

1. **Onboarding Flow** (`onboarding.e2e.js`)
   - Initial configuration wizard
   - Input validation
   - Dashboard display after setup

2. **Transaction Flow** (`transaction.e2e.js`)
   - Adding expenses
   - Updating the dashboard
   - Transaction list display
   - Transaction deletion

## Prerequisites

### iOS Testing
- macOS with Xcode installed
- Xcode Command Line Tools
- iOS Simulator

### Android Testing
- Android SDK
- Android Emulator

## Setup

### 1. Install Dependencies

The required dependencies should already be installed via `npm install`, but if needed:

```bash
npm install --save-dev detox detox-expo-helpers jest-circus
```

### 2. Build the App for Testing

#### iOS
```bash
# Build the debug app
npx detox build --configuration ios.sim.debug
```

#### Android
```bash
# Build the debug APK
npx detox build --configuration android.emu.debug
```

## Running Tests

### iOS Simulator
```bash
# Run all E2E tests on iOS simulator
npx detox test --configuration ios.sim.debug

# Run specific test file
npx detox test --configuration ios.sim.debug e2e/onboarding.e2e.js
```

### Android Emulator
```bash
# Run all E2E tests on Android emulator
npx detox test --configuration android.emu.debug

# Run specific test file
npx detox test --configuration android.emu.debug e2e/transaction.e2e.js
```

### Options

```bash
# Run in debug mode (keeps app open after tests)
npx detox test --configuration ios.sim.debug --debug-synchronization

# Run with video recording
npx detox test --configuration ios.sim.debug --record-videos all

# Run specific test by name
npx detox test --configuration ios.sim.debug -testNamePattern="should add a transaction"
```

## Test Structure

### Onboarding Tests

**Test 1: Complete initial configuration**
- Fill in all required fields (income, charges, savings, cycle day)
- Submit the configuration
- Verify dashboard is displayed with correct values

**Test 2: Validate input fields**
- Test empty form submission
- Test invalid income (zero or negative)
- Test invalid cycle day (out of range)

**Test 3: Edge cases**
- Test cycle start day validation (1-31)
- Test boundary values

### Transaction Tests

**Test 1: Add single transaction**
- Open expense modal
- Fill in amount, description, and category
- Submit transaction
- Verify it appears in the transaction list
- Verify dashboard updates

**Test 2: Add multiple transactions**
- Add multiple expenses in sequence
- Verify all appear in the list
- Verify total spent increases

**Test 3: Input validation**
- Test empty transaction submission
- Test zero amount
- Test missing description

**Test 4: Delete transaction**
- Add a transaction
- Delete it
- Verify it's removed from the list
- Verify dashboard updates

## Troubleshooting

### Common Issues

**1. Build fails**
```bash
# Clean build
cd ios && xcodebuild clean && cd ..
# or
cd android && ./gradlew clean && cd ..
```

**2. Tests timeout**
- Increase timeout in `.detoxrc.js`
- Check that the simulator/emulator is running
- Verify app builds successfully

**3. Element not found**
- Use `--debug-synchronization` flag to see what's happening
- Check if elements have correct `testID` props
- Verify text matches exactly (case-sensitive)

**4. App doesn't launch**
- Make sure the simulator/emulator is running before tests
- Check that the app binary path in `.detoxrc.js` is correct
- Try `device.launchApp({ newInstance: true })`

### Adding Test IDs to Components

For better test reliability, add `testID` props to interactive elements:

```jsx
<TextInput
  testID="monthlyIncome"
  placeholder="Ex: 3000"
  // ...
/>

<TouchableOpacity
  testID="addExpenseButton"
  onPress={handleAddExpense}
>
  <Text>+</Text>
</TouchableOpacity>
```

## Test Coverage

These E2E tests verify:

- ✅ User can complete onboarding successfully
- ✅ Input validation works correctly
- ✅ Dashboard displays calculated budget
- ✅ User can add transactions
- ✅ Transactions appear in the list with correct data
- ✅ Dashboard updates after transaction changes
- ✅ User can delete transactions
- ✅ Budget recalculates after transactions

## Notes

- E2E tests run on a fresh app instance each time
- Tests use device-specific simulators/emulators (configured in `.detoxrc.js`)
- Test data doesn't persist between test runs
- Each test is independent and can run in isolation

## Further Reading

- [Detox Documentation](https://wix.github.io/Detox/)
- [React Native Testing Guide](https://reactnative.dev/docs/testing-overview)
- [Expo and Detox](https://docs.expo.dev/build-reference/e2e-tests/)
