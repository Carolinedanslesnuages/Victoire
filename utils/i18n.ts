import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

// Create i18n instance
const i18n = new I18n({
  en,
  fr,
});

// Set the locale once at the beginning of your app
i18n.locale = Localization.locale;

// Enable fallback to English if translation is missing
i18n.enableFallback = true;
i18n.defaultLocale = 'fr';

export default i18n;
