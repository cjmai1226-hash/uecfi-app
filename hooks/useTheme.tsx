import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ColorScheme, themes } from './theme';

interface ThemeContextType {
  theme: Theme;
  colors: ColorScheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  brand: Brand;
  setBrand: (brand: Brand) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>(() => {
    // Initialize with system preference, fallback to light
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  });
  const [brand, setBrandState] = useState<Brand>('telegram');

  // Update theme when system preference changes
  useEffect(() => {
    if (systemColorScheme) {
      setThemeState(systemColorScheme);
    }
  }, [systemColorScheme]);

  // Load persisted brand on mount
  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(BRAND_KEY);
        if (v === 'facebook' || v === 'telegram') {
          setBrandState(v as Brand);
        } else if (v === 'expressive') {
          // Migrate deprecated value to telegram
          setBrandState('telegram');
          await AsyncStorage.setItem(BRAND_KEY, 'telegram');
        }
      } catch {}
    })();
  }, []);

  const base = themes[theme];
  const palette = brandPalettes[brand];
  const isDark = theme === 'dark';
  const colors: ColorScheme = {
    ...base,
    primary: palette.primary,
    primaryLight: palette.primaryLight ?? base.primaryLight,
    primaryDark: palette.primaryDark ?? base.primaryDark,
    headerText: palette.primary,
    tabActive: palette.primary,
    info: palette.primary,
    accent: palette.accent ?? base.accent,
    highlight: base.highlight,
  };

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setBrand = (newBrand: Brand) => {
    setBrandState(newBrand);
    AsyncStorage.setItem(BRAND_KEY, newBrand).catch(() => {});
  };

  const contextValue: ThemeContextType = {
    theme,
    colors,
    isDark,
    toggleTheme,
    setTheme,
    brand,
    setBrand,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Re-export types for convenience
export type { ColorScheme } from './theme';

// Brand palette support
export type Brand = 'facebook' | 'telegram';

const BRAND_KEY = 'uecfi.theme.brand';

const brandPalettes: Record<
  Brand,
  { primary: string; primaryLight?: string; primaryDark?: string; accent?: string }
> = {
  facebook: {
    primary: '#1877F2',
    primaryLight: '#3b5998',
    primaryDark: '#1456b8',
    accent: '#F7B928',
  },
  telegram: {
    primary: '#229ED9',
    primaryLight: '#2AABEE',
    primaryDark: '#1B8FC5',
    accent: '#60C3EE',
  },
};
