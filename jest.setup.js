// Jest matchers are now built into @testing-library/react-native
// No need to import extend-expect for v12.4+

// Mock global expo runtime
global.__ExpoImportMetaRegistry = {};

// Polyfill structuredClone if not available
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}));

// Mock Expo modules
jest.mock('expo-localization', () => ({
  locale: 'fr-FR',
  locales: ['fr-FR'],
  getLocales: jest.fn(() => [{ languageTag: 'fr-FR', languageCode: 'fr', regionCode: 'FR' }]),
}));

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
}));

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(),
}));

// Mock React Native modules - skip if not available
try {
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
} catch (e) {
  // Module not available, skip mock
}
