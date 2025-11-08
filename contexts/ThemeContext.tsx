/**
 * Theme Context
 * Manages theme state (light/dark mode) across the application
 * Epic 11.1: Dark Mode Support
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '../constants/theme';

type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  colorScheme: ColorScheme;
  colors: typeof lightColors;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // US 11.1.1: Automatically respect system theme
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(systemColorScheme === 'dark' ? 'dark' : 'light');

  // Update theme when system theme changes
  useEffect(() => {
    if (systemColorScheme) {
      setColorScheme(systemColorScheme);
    }
  }, [systemColorScheme]);

  // US 11.1.2: Select appropriate color palette based on theme
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const isDarkMode = colorScheme === 'dark';

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        colors,
        isDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
