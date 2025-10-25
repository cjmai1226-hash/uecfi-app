// Export all theme-related hooks and utilities
export { useTheme, ThemeProvider } from './useTheme';
export { lightTheme, darkTheme, themes } from './theme';
export type { Theme, ThemeColors, ColorScheme } from './theme';

// Export search-related hooks and utilities
export { useSearch, SearchProvider } from './useSearch';

// Export font size-related hooks and utilities
export { useFontSize, FontSizeProvider } from './useFontSize';
export type { FontSizeOption } from './useFontSize';

// Export language-related hooks and utilities
export { useLanguage, LanguageProvider } from './useLanguage';
export type { LanguageOption } from './useLanguage';

// Auth removed: do not export auth hooks/provider
