import { ColorScheme } from '../../hooks/useTheme';
import { StyleSheet } from 'react-native';

// Unified list styles for both Prayers and Bookmarks
export const createItemStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    // Layout
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 24,
      paddingVertical: 20,
    },
    title: {
      fontSize: colors.fontSizes.xxl,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: colors.fontSizes.large,
      color: colors.textMuted,
      marginBottom: 20,
    },

    // List container
    list: {
      flex: 1,
      paddingHorizontal: 24,
    },

    // Item card
    itemCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    itemTitle: {
      fontSize: colors.fontSizes.large,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 10,
    },
    itemText: {
      fontSize: colors.fontSizes.medium,
      color: colors.text,
      lineHeight: 22,
      marginBottom: 10,
    },
    itemCategory: {
      fontSize: colors.fontSizes.small,
      color: colors.textMuted,
      fontStyle: 'italic',
      textTransform: 'capitalize',
    },

    // Optional badge style (used by prayers list)
    categoryBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginBottom: 8,
    },
    categoryText: {
      color: '#FFFFFF',
      fontSize: colors.fontSizes.small,
      fontWeight: '600',
    },

    // Empty state
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyText: {
      fontSize: colors.fontSizes.xl,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    emptySubtext: {
      fontSize: colors.fontSizes.large,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  return styles;
};
