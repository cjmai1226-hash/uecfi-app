import { ColorScheme } from '../../hooks/useTheme';
import { StyleSheet } from 'react-native';

export const createHomeStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    floatingHeaderCard: {
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 12,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    safeArea: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 20,
      fontSize: 18,
      fontWeight: '500',
      color: colors.text,
    },
    header: {
      paddingHorizontal: 24,
      paddingVertical: 32,
      paddingBottom: 3,
    },
    headerarea: {
      paddingTop: 8, // Space for transparent header
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 0.5,
      backgroundColor: colors.background,
      borderBottomColor: colors.border,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    titleTextContainer: {
      flex: 1,
    },
    title: {
      fontSize: colors.fontSizes.xxl,
      fontWeight: '700',
      letterSpacing: -1,
      marginBottom: 3,
      color: colors.text,
    },
    title2: {
      fontSize: colors.fontSizes.xxl,
      fontWeight: '500',
      letterSpacing: -1,
      marginBottom: 3,
      color: colors.text,
    },
    subtitle: {
      fontSize: colors.fontSizes.large,
      fontWeight: '400',
      color: colors.text,
      textAlign: 'justify',
    },
    category: {
      color: colors.textMuted,
      textAlign: 'left',
      fontStyle: 'italic',
      marginTop: 0.5,
      paddingBottom: 10,
    },
    progressContainer: {
      marginTop: 8,
    },
    progressBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    progressBar: {
      flex: 1,
      height: 12,
      borderRadius: 6,
      overflow: 'hidden',
      backgroundColor: colors.border,
    },
    progressFill: {
      height: '100%',
      borderRadius: 6,
    },
    progressText: {
      fontSize: colors.fontSizes.medium,
      fontWeight: '700',
      minWidth: 40,
      textAlign: 'right',
      color: colors.success,
    },
    inputSection: {
      paddingHorizontal: 24,
      paddingBottom: 12,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 16,
    },
    input: {
      flex: 1,
      borderWidth: 2,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 16,
      fontSize: colors.fontSizes.large,
      maxHeight: 120,
      fontWeight: '500',
      backgroundColor: colors.backgrounds.input,
      borderColor: colors.border,
      color: colors.text,
    },
    inputFocused: {
      borderColor: colors.primary,
    },
    addButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButtonDisabled: {
      opacity: 0.5,
    },
    todoList: {
      flex: 1,
    },
    todoListContent: {
      paddingHorizontal: 12,
      paddingBottom: 10,
    },
    emptyListContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    todoItemWrapper: {
      marginVertical: 12,
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 20,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    checkbox: {
      marginRight: 16,
      marginTop: 2,
    },
    checkboxInner: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    todoTextContainer: {
      flex: 1,
    },
    todoText: {
      fontSize: colors.fontSizes.large,
      lineHeight: 24,
      fontWeight: '500',
      marginBottom: 5,
      color: colors.text,
    },
    todoActions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editContainer: {
      flex: 1,
    },
    editInput: {
      borderWidth: 2,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: colors.fontSizes.large,
      fontWeight: '500',
      marginBottom: 16,
      backgroundColor: colors.backgrounds.editInput,
      borderColor: colors.primary,
      color: colors.text,
    },
    editButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
    },
    editButtonText: {
      color: '#ffffff',
      fontSize: colors.fontSizes.small,
      fontWeight: '600',
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 80,
    },
    emptyIconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    emptyText: {
      fontSize: colors.fontSizes.xl,
      fontWeight: '700',
      marginBottom: 8,
      color: colors.text,
    },
    emptySubtext: {
      fontSize: colors.fontSizes.large,
      textAlign: 'center',
      paddingHorizontal: 40,
      lineHeight: 24,
      color: colors.textMuted,
    },
    // Search and input styles
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      marginHorizontal: 16,
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: 40,
      color: colors.text,
      fontSize: colors.fontSizes.medium,
    },
    // Floating Action Button
    fab: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    section: {
      borderRadius: 20,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8, // elevation is used to create a shadow on the section, in android
    },
  });

  return styles;
};

// Combined: Item styles moved here to consolidate style modules
export const createItemStyles = (
  colors: ColorScheme,
  isDark: boolean,
  brand: 'facebook' | 'telegram' = 'facebook'
) =>
  StyleSheet.create({
    card: {
      // Dark tinted glass look for list items
      backgroundColor: (() => {
        if (isDark) return 'rgba(13, 17, 23, 0.55)'; // translucent dark
        return colors.card;
      })(),
      borderRadius: 16,
      marginHorizontal: 8,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: (() => {
        if (isDark) return 'rgba(255,255,255,0.12)'; // subtle light inner border on dark glass
        return colors.border;
      })(),
      overflow: 'hidden', // required to clip BlurView
      position: 'relative',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.2 : 0.08,
      shadowRadius: isDark ? 12 : 8,
      elevation: isDark ? 8 : 4,
    },
    cardInner: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: (() => {
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
        if (brand === 'facebook') return isDark ? '#23272B' : colors.surface;
        return alpha(colors.primary, isDark ? 0.22 : 0.16);
      })(),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      borderWidth: 1,
      borderColor: (() => {
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
        if (brand === 'facebook') return isDark ? colors.border : 'transparent';
        return alpha(colors.primary, isDark ? 0.5 : 0.4);
      })(),
    },
    content: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 6,
    },
    title: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
      lineHeight: 20,
      marginRight: 8,
    },
    category: {
      alignSelf: 'flex-start',
      backgroundColor: (() => {
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
        if (brand === 'facebook') return colors.surface;
        return alpha(colors.primary, isDark ? 0.18 : 0.12);
      })(),
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: (() => {
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
        if (brand === 'facebook') return colors.border;
        return alpha(colors.primary, isDark ? 0.45 : 0.35);
      })(),
    },
    categoryText: {
      fontSize: 10,
      color: brand === 'facebook' ? colors.textMuted : colors.primary,
      fontWeight: '600',
      flexWrap: 'wrap',
    },
    itemText: {
      fontSize: 14,
      color: colors.itemText,
      lineHeight: 18,
    },
    arrow: {
      marginLeft: 8,
      justifyContent: 'center',
    },
  });
