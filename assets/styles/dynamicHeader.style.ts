import { StyleSheet } from 'react-native';
import type { ColorScheme } from '../../hooks/useTheme';

export const createDynamicHeaderStyles = (colors: ColorScheme, opts: { isDark: boolean }) => {
  const headerBg = colors.headerBackground;
  const surfaceBg = colors.surface;
  const borderCol = colors.border;

  return StyleSheet.create({
    root: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingTop: 10,
      paddingBottom: 10,
      minHeight: 56, // fallback; real height comes from HEADER_HEIGHT
      backgroundColor: headerBg,
      borderBottomWidth: 0,
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 12,
    },
    middle: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: surfaceBg,
      borderRadius: 24,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: borderCol,
      height: 40,
      minWidth: 0,
      maxWidth: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },
    searchBackBtn: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      paddingVertical: 0,
      backgroundColor: 'transparent',
    },
    searchButton: {
      flexShrink: 0,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: surfaceBg,
      borderWidth: 1,
      borderColor: borderCol,
      paddingHorizontal: 12,
      minWidth: 38,
    },
    searchButtonText: {
      marginLeft: 6,
      fontSize: 14,
      fontWeight: '600',
      color: opts.isDark ? colors.textMuted : '#65676B',
    },
    settingsBtn: {
      marginLeft: 12,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: surfaceBg,
      borderWidth: 1,
      borderColor: borderCol,
    },
    fbBlue: {
      color: colors.primary,
    },
  });
};
