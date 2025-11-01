import { StyleSheet } from 'react-native';
import type { ColorScheme } from '../../hooks/useTheme';

// Profile styles removed

// Preferences styles
export const createPreferencesStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 32,
      paddingBottom: 8,
      paddingHorizontal: 24,
      backgroundColor: colors.background,
    },
    headerText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      letterSpacing: 0.2,
    },
    section: {
      marginTop: 10,
      marginBottom: 0,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      // iOS 16+ Settings removed visible section titles; keep style for reuse if needed.
      display: 'none',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderRadius: 16,
      marginHorizontal: 16,
      marginVertical: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
      transitionProperty: 'background-color',
      transitionDuration: '150ms',
    },
    groupCard: {
      marginTop: 6,
      marginHorizontal: 16,
      borderRadius: 16,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.divider,
      // iOS Settings-like: very subtle elevation; rely mostly on contrast
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: 'transparent',
    },
    rowDivider: {
      height: 1,
      backgroundColor: colors.divider,
      // Indent to align with text when an icon pill is present (32 + 12 + 16)
      marginLeft: 60,
    },
    iconArea: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      backgroundColor: colors.surface,
    },
    itemTextArea: {
      flex: 1,
      justifyContent: 'center',
    },
    itemTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    itemSubtitle: {
      fontSize: 14,
      color: colors.textMuted,
    },
    rowTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    rowSubtitle: {
      fontSize: 13,
      color: colors.textMuted,
    },
    chevron: {
      marginLeft: 8,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: 'transparent',
    },
    profileAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surface,
      marginRight: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    profileName: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
    },
    profileSubtitle: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 2,
    },
    // Floating search styles removed; no search on Settings
  });
