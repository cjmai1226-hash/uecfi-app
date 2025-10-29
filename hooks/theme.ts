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
  // Telegram-inspired light theme
  primary: '#229ED9', // Telegram blue
  primaryLight: '#2AABEE', // lighter Telegram blue
  primaryDark: '#1B8FC5', // darker Telegram blue
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
  secondary: '#34C759', // success green accent
  secondaryLight: '#E8F6FD', // light blue background
  secondaryDark: '#1B8FC5',

  // Background colors (slightly darker than pure white for softer contrast)
  background: '#F4F8FB',
  surface: '#F4F8FB', // light, airy surface
  card: '#FFFFFF',

  // Background variants
  backgrounds: {
    input: '#EEF3F7',
    editInput: '#FFFFFF',
  },

  // Text colors
  text: '#1E2A35',
  textSecondary: '#5B7083',
  textMuted: '#9AA7B2',

  // Border and divider colors
  border: '#E3EDF3',
  divider: '#D9E2EA',
  shadow: '#000000', // Black for shadows

  // Status colors
  success: '#34C759',
  warning: '#F5A623',
  error: '#FF3B30',
  info: '#229ED9',

  // Interactive colors
  accent: '#FFD166',
  highlight: '#E8F6FD',

  // Header/Navigation colors
  headerBackground: '#FFFFFF',
  headerText: '#229ED9',
  tabActive: '#229ED9',
  tabInactive: '#5B7083',

  // Status bar style (dark text on light background)
  statusBarStyle: 'dark-content',

  // Item text color for detail pages
  itemText: '#1A237E',

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
