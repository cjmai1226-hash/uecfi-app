import { StyleSheet } from 'react-native';
import type { ColorScheme } from '../../hooks/useTheme';

// Dedicated styles for BottomSheet-based forms and content.
// Keeps visuals independent from modal/screen styles.
export const createBottomSheetStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Card-like group container tailored for sheets
    groupCard: {
      marginTop: 12,
      borderRadius: 18,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      // softer shadow for sheets
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
      overflow: 'hidden',
    },

    // Row within groupCard
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 14,
      backgroundColor: 'transparent',
    },

    // Divider inside groupCard rows
    rowDivider: {
      height: 1,
      backgroundColor: colors.divider,
      marginLeft: 0,
    },

    // General text helpers
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    subtitle: {
      fontSize: 13,
      color: colors.textMuted,
    },
  });
