import { createHomeStyles, createItemStyles } from '../../assets/styles';
import { useTheme, useSearch, useLanguage } from '../../hooks';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FlatList, StatusBar, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllPrayers } from '../../sql/sqlite';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AnimatedPage } from '../../components/AnimatedPage';
import LoadingSpinner from '../../components/LoadingSpinner';
// AppBackground removed; using plain View wrappers
// BrandTitle moved to DynamicHeader

type Prayer = {
  id: string;
  title: string;
  content?: string;
  category?: string;
  // Optional alternate fields
  title1?: string;
  content1?: string;
  // New optional page field (number or string)
  page?: number | string;
};

// Memoized row for a prayer item (expects precomputed displayTitle/content)
const PrayerRow = React.memo(
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
      {/* Glass blur background */}
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

export default function Prayers() {
  const { colors, isDark, brand } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();
  const { isAltLanguage } = useLanguage();
  const homeStyles = createHomeStyles(colors);
  const itemStyles = createItemStyles(colors, isDark, brand as any);
  const router = useRouter();

  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Manual refresh moved to Data Source page

  useEffect(() => {
    (async () => {
      try {
        const rows = await getAllPrayers();
        setPrayers(Array.isArray(rows) ? (rows as any) : []);
      } catch {
        setPrayers([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // No in-page pull-to-refresh

  const getTitle = (p: Prayer) => {
    const alt = (p as any).title1 as string | undefined;
    return isAltLanguage && alt ? alt : p.title;
  };
  const getContent = (p: Prayer) => {
    const alt = (p as any).content1 as string | undefined;
    return isAltLanguage && alt ? alt : p.content;
  };

  const query = searchQuery.trim().toLowerCase();

  // First-time loading: show an overlay loader only if there is no cached data yet
  const isFirstTimeLoading = isLoading && (!Array.isArray(prayers) || prayers.length === 0);

  const filteredPrayers = prayers.filter((prayer) => {
    if (!query) return true;
    const title = (getTitle(prayer) || '').toLowerCase();
    const category = (prayer.category || '').toLowerCase();
    return title.includes(query) || category.includes(query);
  });

  // Sort by page ascending; fallback to title asc if page is missing
  const toNum = (v: any): number | null => {
    if (v == null) return null;
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string') {
      const n = parseInt(v, 10);
      return Number.isNaN(n) ? null : n;
    }
    return null;
  };
  const sortedPrayers = [...filteredPrayers].sort((a, b) => {
    const pa = toNum((a as any).page);
    const pb = toNum((b as any).page);
    if (pa == null && pb == null) {
      return (getTitle(a) || '').localeCompare(getTitle(b) || '', undefined, {
        sensitivity: 'base',
      });
    }
    if (pa == null) return 1; // items without page go last
    if (pb == null) return -1;
    return pa - pb;
  });
  // Precompute display fields to minimize render work per row
  const listPrayers = useMemo(() => {
    return sortedPrayers.map((p) => ({
      ...p,
      displayTitle: getTitle(p),
      displayContent: getContent(p),
    }));
  }, [sortedPrayers, isAltLanguage]);

  const renderPrayerItem = useCallback(
    ({ item }: { item: any }) => (
      <PrayerRow
        item={item}
        itemStyles={itemStyles}
        colors={colors}
        isDark={isDark}
        onPress={() => {
          setSearchQuery('');
          router.push({ pathname: '/prayerDetails', params: { prayer: JSON.stringify(item) } });
        }}
      />
    ),
    [colors, isDark, itemStyles, router, setSearchQuery]
  );

  const keyExtractor = useCallback((item: Prayer, index: number) => {
    const raw = (item as any).id ?? (item as any)._id;
    const id = raw != null ? String(raw).trim() : '';
    return id.length > 0 ? id : `prayer-${index}`;
  }, []);

  const EmptyState = () => (
    <View style={homeStyles.emptyContainer}>
      <Text style={homeStyles.emptyText}>No Prayers Found</Text>
      <Text style={homeStyles.emptySubtext}>
        {searchQuery
          ? 'Try adjusting your search terms'
          : 'Prayers will appear here when available'}
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
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>{sortedPrayers.length} items</Text>
            </View> */}

            {/* Prayers List */}
            <FlatList
              data={listPrayers}
              renderItem={renderPrayerItem}
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
