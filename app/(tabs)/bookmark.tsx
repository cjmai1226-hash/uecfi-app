import { createHomeStyles, createItemStyles } from '../../assets/styles';
import { LoadingSpinner } from '../../components';
import { useTheme, useLanguage, useSearch } from '../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
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

  if (isLoading) return <LoadingSpinner />;

  const renderBookmarkItem = ({ item, index }: { item: BookmarkItem; index: number }) => (
    <TouchableOpacity
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
      activeOpacity={0.6}
      style={itemStyles.card}>
      <BlurView tint={isDark ? 'dark' : 'light'} intensity={isDark ? 50 : 30} style={StyleSheet.absoluteFillObject} />
      <View style={itemStyles.cardInner}>
        {/* Content */}
        <View style={itemStyles.content}>
          <View style={itemStyles.titleRow}>
            <Text style={itemStyles.title} numberOfLines={2}>
              {(() => {
                // mirror prayers.tsx: show title1 when alt language active and available
                const alt = (item as any).title1 as string | undefined;
                return isAltLanguage && alt ? alt : item.title;
              })()}
            </Text>
          </View>
          {item.category && (
            <View style={itemStyles.category}>
              <Text style={itemStyles.categoryText}>{item.category.toUpperCase()}</Text>
            </View>
          )}

          {item.content && (
            <Text style={itemStyles.itemText} numberOfLines={2}>
              {(() => {
                const alt = (item as any).content1 as string | undefined;
                return isAltLanguage && alt ? alt : item.content;
              })()}
            </Text>
          )}
        </View>

        {/* Arrow indicator */}
        <View style={itemStyles.arrow}>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );

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
              data={bookmarkedItems}
              renderItem={renderBookmarkItem}
              keyExtractor={(item, index) => {
                const id = String((item as any).id ?? (item as any)._id ?? '').trim();
                return id.length > 0 ? id : `bookmark-${index}`;
              }}
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
