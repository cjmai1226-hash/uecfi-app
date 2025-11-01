import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, StatusBar, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useSearch } from '../../hooks';
import { getAllCenters } from '../../sql/sqlite';
import { createHomeStyles, createItemStyles } from '../../assets/styles';
// AppBackground removed; using plain View wrappers
import { AnimatedPage } from '../../components/AnimatedPage';
import LoadingSpinner from '../../components/LoadingSpinner';
// BrandTitle moved to DynamicHeader
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

type CenterDoc = {
  id: string;
  center?: string;
  address?: string;
  district?: string | number;
  status?: string; // active, inactive, etc.
};

// Memoized row for a center item
const CenterRow = React.memo(
  ({
    item,
    onPress,
    itemStyles,
    colors,
    isDark,
    districtLabel,
    statusColor,
  }: {
    item: CenterDoc;
    onPress: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemStyles: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    colors: any;
    isDark: boolean;
    districtLabel?: string | null;
    statusColor?: string | null;
  }) => (
    <TouchableOpacity style={itemStyles.card} activeOpacity={0.6} onPress={onPress}>
      <BlurView tint={isDark ? 'dark' : 'light'} intensity={isDark ? 50 : 30} style={StyleSheet.absoluteFillObject} />
      <View style={itemStyles.cardInner}>
        <View style={itemStyles.content}>
          <View style={itemStyles.titleRow}>
            <Text style={itemStyles.title} numberOfLines={2}>
              {item.center || 'Unnamed Center'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {districtLabel ? (
              <View style={itemStyles.category}>
                <Text style={itemStyles.categoryText}>{districtLabel}</Text>
              </View>
            ) : null}
            {statusColor ? (
              <View style={[itemStyles.category, { backgroundColor: statusColor }]}> 
                <Text style={[itemStyles.categoryText, { color: '#FFFFFF' }]}>
                  {String(item.status || '').toUpperCase()}
                </Text>
              </View>
            ) : null}
          </View>
          {item.address ? (
            <Text style={itemStyles.itemText} numberOfLines={2}>
              {item.address}
            </Text>
          ) : null}
        </View>
        <View style={itemStyles.arrow}>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  )
);

export default function CentersTab() {
  const { colors, isDark, brand } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();
  const homeStyles = createHomeStyles(colors);
  const itemStyles = createItemStyles(colors, isDark, brand as any);
  const [items, setItems] = useState<CenterDoc[]>([]);
  // Manual refresh moved to Data Source page

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const rows = await getAllCenters();
        setItems(Array.isArray(rows) ? (rows as any) : []);
      } catch {
        setItems([]);
      }
    })();
  }, []);

  // No in-page pull-to-refresh

  const renderItem = ({ item }: { item: CenterDoc }) => (
    <TouchableOpacity
      style={itemStyles.card}
      activeOpacity={0.6}
      onPress={() => {
        setSearchQuery('');
        router.push({ pathname: '/centerDetails', params: { center: JSON.stringify(item) } });
      }}>
      <BlurView tint={isDark ? 'dark' : 'light'} intensity={isDark ? 50 : 30} style={StyleSheet.absoluteFillObject} />
      <View style={itemStyles.cardInner}>
        <View style={itemStyles.content}>
          <View style={itemStyles.titleRow}>
            <Text style={itemStyles.title} numberOfLines={2}>
              {item.center || 'Unnamed Center'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {item.district != null && (
              <View style={itemStyles.category}>
                <Text style={itemStyles.categoryText}>
                  {(() => {
                    const n = toNum(item.district);
                    return n === 0
                      ? 'FOREIGN-BASED'
                      : `DISTRICT ${String(item.district).toUpperCase()}`;
                  })()}
                </Text>
              </View>
            )}
            {item.status && (
              <View style={[itemStyles.category, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={[itemStyles.categoryText, { color: '#FFFFFF' }]}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          {item.address ? (
            <Text style={itemStyles.itemText} numberOfLines={2}>
              {item.address}
            </Text>
          ) : null}
        </View>
        <View style={itemStyles.arrow}>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );

  // Search + sort
  const query = searchQuery.trim().toLowerCase();

  const filtered = useMemo(() => {
    return items.filter((c) => {
      if (!query) return true;
      const center = (c.center || '').toLowerCase();
      const address = (c.address || '').toLowerCase();
      const district = c.district != null ? String(c.district).toLowerCase() : '';
      const dnum =
        typeof c.district === 'number'
          ? c.district
          : typeof c.district === 'string'
            ? parseInt(c.district, 10)
            : NaN;
      const districtAlias = dnum === 0 ? 'foreign-based' : '';
      return center.includes(query) || address.includes(query) || district.includes(query) || (districtAlias && districtAlias.includes(query));
    });
  }, [items, query]);

  const toNum = (v: any): number | null => {
    if (v == null) return null;
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string') {
      const n = parseInt(v, 10);
      return Number.isNaN(n) ? null : n;
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return colors.success; // Green
      case 'inactive':
        return colors.error; // Red
      case 'unknown':
        return colors.textMuted; // Gray
      default:
        return colors.error; // Default to red for any other status
    }
  };

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      // Sort by district (ascending); items without district go last
      const da = toNum(a.district);
      const db = toNum(b.district);
      if (da == null && db == null) return 0;
      if (da == null) return 1;
      if (db == null) return -1;
      return da - db;
    });
  }, [filtered]);

  // First-time loading: show an overlay loader only if there is no cached data yet
  const isFirstTimeLoading = !Array.isArray(items) || items.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AnimatedPage>
        <View style={[homeStyles.container, { backgroundColor: 'transparent' }]}>
          <StatusBar barStyle={colors.statusBarStyle} />
          <StatusBar backgroundColor={colors.background} />
          <SafeAreaView style={[homeStyles.safeArea, { backgroundColor: 'transparent' }]}>
            {isFirstTimeLoading && <LoadingSpinner />}
            <FlatList
              data={sorted}
              keyExtractor={useCallback((item: CenterDoc, index: number) => {
                const raw = (item as any).id ?? (item as any)._id;
                const id = raw != null ? String(raw).trim() : '';
                return id.length > 0 ? id : `center-${index}`;
              }, [])}
              renderItem={useCallback(
                ({ item }: { item: CenterDoc }) => (
                  <CenterRow
                    item={item}
                    itemStyles={itemStyles}
                    colors={colors}
                    isDark={isDark}
                    districtLabel={(() => {
                      if (item.district == null) return null;
                      const n = toNum(item.district);
                      return n === 0 ? 'FOREIGN-BASED' : `DISTRICT ${String(item.district).toUpperCase()}`;
                    })()}
                    statusColor={item.status ? getStatusColor(item.status) : null}
                    onPress={() => {
                      setSearchQuery('');
                      router.push({ pathname: '/centerDetails', params: { center: JSON.stringify(item) } });
                    }}
                  />
                ),
                [colors, isDark, itemStyles, router, setSearchQuery]
              )}
              initialNumToRender={12}
              maxToRenderPerBatch={8}
              windowSize={5}
              removeClippedSubviews
              updateCellsBatchingPeriod={50}
              style={homeStyles.todoList}
              contentContainerStyle={homeStyles.todoListContent}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={() => (
                <View style={homeStyles.emptyContainer}>
                  <Text style={homeStyles.emptyText}>No Centers Found</Text>
                  <Text style={homeStyles.emptySubtext}>Centers will appear here when available</Text>
                </View>
              )}
            />
          </SafeAreaView>
        </View>
      </AnimatedPage>
    </View>
  );
}
