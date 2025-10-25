import { createHomeStyles, createItemStyles } from '../../assets/styles';
import { LoadingSpinner } from '../../components';
import { useTheme, useLanguage, useSearch } from '../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, StatusBar, Text, TouchableOpacity, View } from 'react-native';
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

      const bookmarks: BookmarkItem[] = storedBookmarks
        .map(([key, value]) => {
          if (!value) return null;
          try {
            // The stored value is the full prayer/song object
            const item = JSON.parse(value) as BookmarkItem;
            // Ensure the item object has a consistent 'id' field for the keyExtractor
            return { ...item, id: item.id ?? (item as any)._id };
          } catch {
            return null;
          }
        })
        .filter((item): item is BookmarkItem => item !== null && item.id != null);

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
              keyExtractor={(item) => item.id}
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
