import { createHomeStyles, createItemStyles } from '../../assets/styles';
import { useTheme, useSearch } from '../../hooks';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FlatList, StatusBar, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
// Switch from Firestore to SQLite-backed data source
import { getAllSongs } from '../../sql/sqlite';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AnimatedPage } from '../../components/AnimatedPage';
import LoadingSpinner from '../../components/LoadingSpinner';
// AppBackground removed; using plain View wrappers
// BrandTitle moved to DynamicHeader

type Song = {
  id: string; // Firestore document ID
  title: string;
  content?: string;
  category?: string;
};

// Memoized row for a song item
const SongRow = React.memo(
  ({
    item,
    onPress,
    itemStyles,
    colors,
    isDark,
  }: {
    item: Song;
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
              {item.title}
            </Text>
          </View>
          {item.category && (
            <View style={itemStyles.category}>
              <Text style={[itemStyles.categoryText, { fontStyle: 'italic' }]}>
                {item.category.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
              </Text>
            </View>
          )}

          {item.content && (
            <Text style={itemStyles.itemText} numberOfLines={1}>
              {item.content}
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

export default function Songs() {
  const { colors, isDark, brand } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();
  const homeStyles = createHomeStyles(colors);
  const itemStyles = createItemStyles(colors, isDark, brand as any);
  const router = useRouter();

  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Manual refresh moved to Data Source page

  useEffect(() => {
    (async () => {
      try {
        const rows = await getAllSongs();
        setSongs(Array.isArray(rows) ? (rows as any) : []);
      } catch {
        setSongs([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // No in-page pull-to-refresh

  const query = searchQuery.trim().toLowerCase();

  // First-time loading: show an overlay loader only if there is no cached data yet
  const isFirstTimeLoading = isLoading && (!Array.isArray(songs) || songs.length === 0);

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      if (!query) return true;
      const title = (song.title || '').toLowerCase();
      const category = (song.category || '').toLowerCase();
      return title.includes(query) || category.includes(query);
    });
  }, [songs, query]);

  const renderSongItem = useCallback(
    ({ item }: { item: Song }) => (
      <SongRow
        item={item}
        itemStyles={itemStyles}
        colors={colors}
        isDark={isDark}
        onPress={() => {
          setSearchQuery('');
          router.push({ pathname: '/songDetails', params: { song: JSON.stringify(item) } });
        }}
      />
    ),
    [colors, isDark, itemStyles, router, setSearchQuery]
  );

  const keyExtractor = useCallback((item: Song, index: number) => {
    const raw = (item as any).id ?? (item as any)._id;
    const id = raw != null ? String(raw).trim() : '';
    return id.length > 0 ? id : `song-${index}`;
  }, []);

  const EmptyState = () => (
    <View style={homeStyles.emptyContainer}>
      <Text style={homeStyles.emptyText}>No Songs Found</Text>
      <Text style={homeStyles.emptySubtext}>
        {searchQuery ? 'Try adjusting your search terms' : 'Songs will appear here when available'}
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
            {isFirstTimeLoading && <LoadingSpinner />}

            {/* Inline header removed; DynamicHeader shows title. Show count only. */}
            {/* <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6 }}>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>{filteredSongs.length} items</Text>
            </View> */}

            {/* Songs List */}
            <FlatList
              data={filteredSongs}
              renderItem={renderSongItem}
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
              ListEmptyComponent={<EmptyState />}
            />
          </SafeAreaView>
        </View>
      </AnimatedPage>
    </View>
  );
}
