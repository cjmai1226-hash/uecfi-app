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
        if (v === 'facebook' || v === 'telegram' || v === 'expressive') {
          setBrandState(v as Brand);
        } else if (v) {
          // Fallback to telegram when deprecated brands are found
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
  // Spread brand-wide expressive tweaks to surfaces and borders when expressive is active
  if (brand === 'expressive') {
    const alpha = (hex: string, a: number) => {
      const c = hex.replace('#', '');
      const n = parseInt(
        c.length === 3
          ? c
              .split('')
              .map((ch) => ch + ch)
              .join('')
          : c,
        16
      );
      const r = (n >> 16) & 255,
        g = (n >> 8) & 255,
        b = n & 255;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };
    colors.surface = isDark ? alpha(colors.primary, 0.12) : alpha(colors.primary, 0.06);
    colors.card = isDark ? alpha(colors.primary, 0.16) : '#FFFFFF';
    colors.border = isDark ? alpha(colors.primary, 0.35) : alpha(colors.primary, 0.22);
    colors.divider = isDark ? alpha(colors.primary, 0.25) : alpha(colors.primary, 0.16);
    colors.backgrounds = {
      input: isDark ? alpha(colors.primary, 0.08) : '#F8F5FF',
      editInput: isDark ? alpha(colors.primary, 0.12) : '#FFFFFF',
    };
  }

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
export type Brand = 'facebook' | 'telegram' | 'expressive';

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
  expressive: {
    // Material 3 expressive-inspired purple tones
    primary: '#6750A4', // M3 primary 40
    primaryLight: '#EADDFF', // on primary container tint
    primaryDark: '#4F378B', // primary 30
    accent: '#7D5260', // tertiary 40-ish for accents
  },
};
