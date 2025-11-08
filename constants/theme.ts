/**
 * Design System - Design Tokens
 * Modern, minimalist flat design with Teal primary color
 */

// Feature UI.1.1: Color Palette - Light Mode
export const lightColors = {
  // Primary colors
  primary: '#00897B', // Teal primary
  primaryLight: '#4DB6AC',
  primaryDark: '#00695C',

  // Neutral colors (warm gray palette)
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Semantic colors
  success: '#4CAF50',
  warning: '#FF9800', // Orange alert
  error: '#F44336', // Red alert
  info: '#2196F3',

  // Text colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  textInverse: '#FFFFFF',

  // Background colors
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Border colors
  border: '#E0E0E0',
  borderLight: '#F5F5F5',
  borderDark: '#BDBDBD',

  // Epic UI 3: Mascot color palette (L'Écureuil Économe)
  mascot: {
    orangeEcureuil: '#D46F4D',  // Accent Principal, Éléments Interactifs
    brunNoisette: '#9C5B3D',     // Textes Secondaires, Titres, Icônes
    roseKawaii: '#FFB0AD',       // Éléments Graphiques, Touches Décoratives
    vertSucces: '#47B28F',       // Zone Verte - Budget Confortable
    jauneVigilance: '#FFC759',   // Zone Jaune - Gestion Stricte
    rougeDanger: '#E55C5C',      // Zone Rouge - Budget Critique
  },

  // Dashboard background (from spec)
  dashboardBackground: '#E0F4E8',  // Fond Dashboard - Vert d'Eau Pâle
};

// Feature 11.1: Dark Mode Color Palette (desaturated teal to avoid eye strain)
export const darkColors = {
  // Primary colors - desaturated teal for dark mode
  primary: '#4DB6AC', // Lighter, less saturated teal
  primaryLight: '#80CBC4',
  primaryDark: '#26A69A',

  // Neutral colors (dark theme)
  gray50: '#121212',
  gray100: '#1E1E1E',
  gray200: '#2C2C2C',
  gray300: '#383838',
  gray400: '#4F4F4F',
  gray500: '#757575',
  gray600: '#9E9E9E',
  gray700: '#BDBDBD',
  gray800: '#E0E0E0',
  gray900: '#F5F5F5',

  // Semantic colors (adjusted for dark mode visibility)
  success: '#66BB6A',
  warning: '#FFA726',
  error: '#EF5350',
  info: '#42A5F5',

  // Text colors (inverted)
  textPrimary: '#E0E0E0',
  textSecondary: '#BDBDBD',
  textDisabled: '#757575',
  textInverse: '#121212',

  // Background colors
  background: '#121212',
  surface: '#1E1E1E',
  surfaceElevated: '#2C2C2C',

  // Border colors
  border: '#383838',
  borderLight: '#2C2C2C',
  borderDark: '#4F4F4F',

  // Epic UI 3: Mascot color palette (adjusted for dark mode)
  mascot: {
    orangeEcureuil: '#E89B7D',  // Lighter orange for dark mode
    brunNoisette: '#B8876D',     // Lighter brown for dark mode
    roseKawaii: '#FFCAC9',       // Lighter pink for dark mode
    vertSucces: '#66BB6A',       // Adjusted green for dark mode
    jauneVigilance: '#FFD97D',   // Lighter yellow for dark mode
    rougeDanger: '#EF8A8A',      // Lighter red for dark mode
  },

  // Dashboard background (dark mode variant)
  dashboardBackground: '#1A2E23',  // Dark green tint
};

// Default export for backward compatibility
export const colors = lightColors;

// Feature UI.1.2: Typography Scale
export const typography = {
  // Font families (native system fonts)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },

  // Font sizes
  fontSize: {
    h1: 48, // Budget du jour
    h2: 32,
    h3: 24,
    h4: 20,
    body: 16,
    bodySmall: 14,
    caption: 12,
  },

  // Font weights
  fontWeight: {
    regular: '400' as '400',
    medium: '500' as '500',
    semibold: '600' as '600',
    bold: '700' as '700',
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Feature UI.1.3: Spacing Constants
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius (for flat design with subtle rounding)
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Elevation (minimal for flat design)
export const elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  low: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  high: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Opacity values for interactions
export const opacity = {
  disabled: 0.38,
  inactive: 0.54,
  active: 0.87,
  pressed: 0.7,
};
