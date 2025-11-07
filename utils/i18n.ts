import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

// Create i18n instance
const i18n = new I18n({
  en,
  fr,
});

// Set the locale once at the beginning of your app
// getLocales returns an array, we use the first locale's language tag
const deviceLocale = getLocales()[0]?.languageTag || 'fr-FR';
i18n.locale = deviceLocale;

// Enable fallback to French if translation is missing
i18n.enableFallback = true;
i18n.defaultLocale = 'fr';

export default i18n;
