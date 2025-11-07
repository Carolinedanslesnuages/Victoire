# Internationalization (i18n)

This directory contains translation files for the PACE budget app.

## Supported Languages

- **French (fr)**: `fr.json` - Default language
- **English (en)**: `en.json`

## How It Works

The app automatically detects the device's language setting using `expo-localization` and displays the appropriate translations.

### Language Detection

1. The app reads the device's locale using `expo-localization.getLocales()`
2. If the device is set to English (`en-*`), the app displays in English
3. Otherwise, the app defaults to French

### Translation Structure

Translations are organized by feature/component:

```json
{
  "configWizard": {
    "title": "...",
    "errors": {
      "title": "..."
    }
  },
  "dashboard": {
    "title": "...",
    "dailyBudget": {
      "label": "..."
    }
  }
}
```

## Adding New Translations

When adding new text to the app:

1. Add the translation key to both `fr.json` and `en.json`
2. Use `i18n.t('key.path')` in your component
3. For dynamic text, use interpolation: `i18n.t('key', { variable: value })`

### Example

```typescript
import i18n from '../utils/i18n';

// Simple translation
<Text>{i18n.t('dashboard.title')}</Text>

// With interpolation
<Text>{i18n.t('dashboard.cycleSubtitle', { day: 15 })}</Text>
```

## Testing Translations

To test the app in different languages:

1. **iOS Simulator**: Settings → General → Language & Region → iPhone Language
2. **Android Emulator**: Settings → System → Languages & input → Languages
3. **Physical Device**: Change your device's language settings

## Translation Guidelines

- Keep translations concise and user-friendly
- Maintain consistent terminology across both languages
- Test all translations in the app UI to ensure they fit properly
- Use placeholder syntax `{{variable}}` for interpolated values
