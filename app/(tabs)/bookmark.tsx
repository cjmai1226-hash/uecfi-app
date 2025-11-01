import { createHomeStyles, createItemStyles } from '../../assets/styles';
import { LoadingSpinner } from '../../components';
import { useTheme, useLanguage, useSearch } from '../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from 'react';
import { FlatList, StatusBar, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AnimatedPage } from '../../components/AnimatedPage';

// Local Prayer/Song type for bookmarks
type BookmarkItem = {
  id: string; // Firestore document ID
  title: string;
  content?: string;
  category?: string;
  type?: 'song' | 'prayer'; // Type to distinguish content
};

// Memoized row for a bookmark item (expects precomputed displayTitle/content)
const BookmarkRow = React.memo(
  ({
    item,
    onPress,
    itemStyles,
    colors,
    isDark,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any;
    onPress: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemStyles: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    colors: any;
    isDark: boolean;
  }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={itemStyles.card}>
      <BlurView tint={isDark ? 'dark' : 'light'} intensity={isDark ? 50 : 30} style={StyleSheet.absoluteFillObject} />
      <View style={itemStyles.cardInner}>
        {/* Content */}
        <View style={itemStyles.content}>
          <View style={itemStyles.titleRow}>
            <Text style={itemStyles.title} numberOfLines={2}>
              {item.displayTitle}
            </Text>
          </View>
          {item.category && (
            <View style={itemStyles.category}>
              <Text style={[itemStyles.categoryText, { fontStyle: 'italic' }]}>
                {item.category.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </Text>
            </View>
          )}

          {item.displayContent && (
            <Text style={itemStyles.itemText} numberOfLines={1}>
              {item.displayContent}
            </Text>
          )}
        </View>

        {/* Arrow indicator */}
        <View style={itemStyles.arrow}>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  )
);

const Bookmark = () => {
  const { colors, isDark, brand } = useTheme();
  const { isAltLanguage } = useLanguage();
  const { setSearchQuery } = useSearch();
  const homeStyles = createHomeStyles(colors);
  const itemStyles = createItemStyles(colors, isDark, brand as any);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkItem[]>([]);

  // Function to load bookmarks directly from AsyncStorage
  const loadBookmarks = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const bookmarkKeys = keys.filter((key) => key.startsWith('@favorite_'));
      const storedBookmarks = await AsyncStorage.multiGet(bookmarkKeys);

      const rawList: (BookmarkItem | null)[] = storedBookmarks.map(([key, value]) => {
        if (!value) return null;
        try {
          const item = JSON.parse(value) as BookmarkItem;
          const rawId = (item as any).id ?? (item as any)._id ?? '';
          const id = String(rawId).trim();
          if (!id) return null; // drop empty-id entries to avoid duplicate empty keys
          return { ...item, id } as BookmarkItem;
        } catch {
          return null;
        }
      });

      // Deduplicate by id while preserving order
      const seen = new Set<string>();
      const bookmarks: BookmarkItem[] = [];
      for (const it of rawList) {
        if (!it) continue;
        if (seen.has(it.id)) continue;
        seen.add(it.id);
        bookmarks.push(it);
      }

      setBookmarkedItems(bookmarks);
    } catch (e) {
      console.error('Failed to load bookmarks:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Reload bookmarks every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadBookmarks();
    }, [])
  );

  // Use all bookmarked items without filtering
  const listBookmarks = useMemo(() => {
    return bookmarkedItems.map((item) => {
      const t1 = (item as any).title1 as string | undefined;
      const c1 = (item as any).content1 as string | undefined;
      return {
        ...item,
        displayTitle: isAltLanguage && t1 ? t1 : item.title,
        displayContent: isAltLanguage && c1 ? c1 : item.content,
      };
    });
  }, [bookmarkedItems, isAltLanguage]);

  const renderBookmarkItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <BookmarkRow
        item={item}
        itemStyles={itemStyles}
        colors={colors}
        isDark={isDark}
        onPress={() => {
          setSearchQuery('');
          router.push({
            pathname: '/favoriteDetails',
            params: {
              prayer: JSON.stringify(item),
              favorites: JSON.stringify(bookmarkedItems),
              initialIndex: index.toString(),
            },
          });
        }}
      />
    ),
    [bookmarkedItems, colors, isDark, itemStyles, router, setSearchQuery]
  );

  const keyExtractor = useCallback((item: any, index: number) => {
    const id = String((item as any).id ?? (item as any)._id ?? '').trim();
    return id.length > 0 ? id : `bookmark-${index}`;
  }, []);

  if (isLoading) return <LoadingSpinner />;

  const BookmarkEmptyState = () => (
    <View style={homeStyles.emptyContainer}>
      <Text style={homeStyles.emptyText}>No Bookmarks Yet!</Text>
      <Text style={homeStyles.emptySubtext}>
        Save your favorite prayers to access them quickly here
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AnimatedPage>
        <View style={[homeStyles.container, { backgroundColor: 'transparent' }]}>
          <StatusBar barStyle={colors.statusBarStyle} />
          <StatusBar backgroundColor={colors.background} />
          <SafeAreaView style={[homeStyles.safeArea, { backgroundColor: 'transparent' }]}>
            {/* Inline header removed; DynamicHeader shows title. Show count only. */}
            {/* <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6 }}>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>{bookmarkedItems.length} items</Text>
            </View> */}

            {/* Bookmarks List */}
            <FlatList
              data={listBookmarks}
              renderItem={renderBookmarkItem}
              keyExtractor={keyExtractor}
              initialNumToRender={12}
              maxToRenderPerBatch={8}
              windowSize={5}
              removeClippedSubviews
              updateCellsBatchingPeriod={50}
              style={homeStyles.todoList}
              contentContainerStyle={homeStyles.todoListContent}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={<BookmarkEmptyState />}
            />
          </SafeAreaView>
        </View>
      </AnimatedPage>
    </View>
  );
};

export default Bookmark;
