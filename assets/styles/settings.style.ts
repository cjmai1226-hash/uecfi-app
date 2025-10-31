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
      marginTop: 16,
      marginBottom: 6,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.7,
      marginBottom: 8,
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
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: 'transparent',
    },
    rowDivider: {
      height: 1,
      backgroundColor: colors.divider,
      marginLeft: 72,
    },
    iconArea: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
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
  });
