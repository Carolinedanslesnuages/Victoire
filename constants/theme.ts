/**
 * Design System - Design Tokens
 * Modern, minimalist flat design with Teal primary color
 */

// Feature UI.1.1: Color Palette
export const colors = {
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
};

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
};

// Opacity values for interactions
export const opacity = {
  disabled: 0.38,
  inactive: 0.54,
  active: 0.87,
  pressed: 0.7,
};
