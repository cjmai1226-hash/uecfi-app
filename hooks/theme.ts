// Theme colors definition for light and dark modes
export interface ColorScheme {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Background colors
  background: string;
  surface: string;
  card: string;

  // Background variants
  backgrounds: {
    input: string;
    editInput: string;
  };

  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;

  // Border and divider colors
  border: string;
  divider: string;
  shadow: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Interactive colors
  accent: string;
  highlight: string;

  // Header/Navigation colors
  headerBackground: string;
  headerText: string;
  tabActive: string;
  tabInactive: string;

  // Status bar style
  statusBarStyle: 'light-content' | 'dark-content' | 'default';

  // Item text color for detail pages
  itemText?: string;

  // Font sizes
  fontSizes: {
    small: number;
    medium: number;
    large: number;
    xl: number;
    xxl: number;
  };
  // Title style for screens
  titleStyle?: {
    fontSize: number;
    fontWeight: string;
    color: string;
    textAlign?: string;
    paddingHorizontal?: number;
    paddingTop?: number;
    paddingBottom?: number;
  };
}

// Keep ThemeColors as an alias for backward compatibility
export type ThemeColors = ColorScheme;

export const lightTheme: ThemeColors = {
  // Refined light theme with improved contrast and clearer layering
  primary: '#229ED9', // brand blue
  primaryLight: '#2AABEE', // lighter brand blue
  primaryDark: '#1B8FC5', // darker brand blue
  titleStyle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#050505',
    textAlign: 'left',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },

  // Secondary colors
  secondary: '#34C759',
  secondaryLight: '#EAF6FF',
  secondaryDark: '#1B8FC5',

  // Background colors
  // Use a very light neutral background with white surfaces/cards for clear elevation cues
  background: '#F7FAFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // Background variants
  backgrounds: {
    input: '#F1F5F9', // slate-100
    editInput: '#FFFFFF',
  },

  // Text colors
  text: '#0F172A', // slate-900
  textSecondary: '#334155', // slate-700
  textMuted: '#64748B', // slate-500

  // Border and divider colors
  border: '#E2E8F0', // slate-200
  divider: '#E5E7EB', // gray-200
  shadow: '#000000', // Black for shadows

  // Status colors
  success: '#34C759',
  warning: '#F5A623',
  error: '#FF3B30',
  info: '#229ED9',

  // Interactive colors
  accent: '#FFD166',
  highlight: '#EFF6FF',

  // Header/Navigation colors
  headerBackground: '#FFFFFF',
  headerText: '#229ED9',
  tabActive: '#229ED9',
  tabInactive: '#94A3B8', // slate-400

  // Status bar style (dark text on light background)
  statusBarStyle: 'dark-content',

  // Item text color for detail pages
  itemText: '#1F2937', // gray-800

  // Font sizes
  fontSizes: {
    small: 12,
    medium: 14,
    large: 16,
    xl: 20,
    xxl: 28,
  },
};

export const darkTheme: ThemeColors = {
  // Telegram-inspired dark theme
  primary: '#2AABEE',
  primaryLight: '#3BB8F3',
  primaryDark: '#229ED9',
  titleStyle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E4E6EB',
    textAlign: 'left',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },

  // Secondary colors
  secondary: '#34C759',
  secondaryLight: '#1E2B36',
  secondaryDark: '#229ED9',

  // Background colors
  background: '#0E1621',
  surface: '#17212B',
  card: '#1C2733',

  // Background variants
  backgrounds: {
    input: '#1E2B36',
    editInput: '#17212B',
  },

  // Text colors
  text: '#E6EEF5',
  textSecondary: '#A0B3C6',
  textMuted: '#6E8599',

  // Border and divider colors
  border: '#243140',
  divider: '#1A2530',
  shadow: '#000000', // Black for shadows

  // Status colors
  success: '#34C759',
  warning: '#F5A623',
  error: '#FF6B6B',
  info: '#2AABEE',

  // Interactive colors
  accent: '#FFD166',
  highlight: '#1E2B36',

  // Header/Navigation colors
  headerBackground: '#17212B',
  headerText: '#E6EEF5',
  tabActive: '#2AABEE',
  tabInactive: '#A0B3C6',

  // Status bar style (light text on dark background)
  statusBarStyle: 'light-content',

  itemText: '#E4E6EB',

  // Font sizes
  fontSizes: {
    small: 12,
    medium: 14,
    large: 16,
    xl: 20,
    xxl: 28,
  },
};

export type Theme = 'light' | 'dark';

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
