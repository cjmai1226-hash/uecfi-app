import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks';
import { createPreferencesStyles } from '../assets/styles';
// AppBackground removed; using plain View wrappers
import { AnimatedPage } from '../components/AnimatedPage';
import { BrandTitle } from '../components/BrandTitle';
import { getCounts } from '../sql/sqlite';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomBannerAd } from '../ads/BottomBannerAd';
import { useAds } from '../ads/adsManager';

export default function DataSourceScreen() {
  const { colors } = useTheme();
  const prefStyles = createPreferencesStyles(colors);
  const { bannerOffset, trackInteraction } = useAds();

  const [songsCount, setSongsCount] = useState(0);
  const [prayersCount, setPrayersCount] = useState(0);
  const [centersCount, setCentersCount] = useState(0);
  // const [isRefreshing, setIsRefreshing] = useState(false);
  // Pending concept removed for SQLite bundled data
  // const [pending] = useState<{ [k: string]: boolean }>({
  //   Songs: false,
  //   Prayers: false,
  //   Centers: false,
  // });

  const loadStatus = async () => {
    const { songs, prayers, centers } = await getCounts();
    setSongsCount(songs);
    setPrayersCount(prayers);
    setCentersCount(centers);
  };

  useEffect(() => {
    loadStatus();
    trackInteraction();
  }, [trackInteraction]);

  const ListItem = ({
    label,
    count,
    icon,
    tint,
    onRefresh,
    disabled,
  }: {
    label: string;
    count: number;
    icon: any;
    tint: string;
    onRefresh: () => void;
    disabled: boolean;
  }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        gap: 12,
      }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${tint}22`,
        }}>
        <Ionicons name={icon} size={20} color={tint} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>{label}</Text>
          {false && (
            <View
              style={{
                backgroundColor: colors.error,
                borderRadius: 6,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>NEW</Text>
            </View>
          )}
        </View>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>{`${count} items`}</Text>
      </View>
      {(() => {
        // const isUpToDate = true;
        const bg = 'transparent';
        const textColor = colors.textMuted;
        const borderW = 1;
        const borderC = colors.textMuted;
        return (
          <TouchableOpacity
            disabled
            onPress={onRefresh}
            style={{
              backgroundColor: bg,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              opacity: 1,
              borderWidth: borderW,
              borderColor: borderC,
            }}>
            <Text style={{ color: textColor, fontSize: 12, fontWeight: '600' }}>Bundled</Text>
          </TouchableOpacity>
        );
      })()}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AnimatedPage>
        <SafeAreaView style={prefStyles.container}>
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: 6,
            }}>
            <BrandTitle label="data source" size={24} />
          </View>

          <View style={{ height: 12 }} />

          {/* List of data sources */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}>
            <ListItem
              label="Songs"
              count={songsCount}
              icon="musical-notes-outline"
              tint="#D32F2F"
              onRefresh={() => {}}
              disabled
            />
            <ListItem
              label="Prayers"
              count={prayersCount}
              icon="book-outline"
              tint="#388E3C"
              onRefresh={() => {}}
              disabled
            />
            <ListItem
              label="Centers"
              count={centersCount}
              icon="business-outline"
              tint="#0288D1"
              onRefresh={() => {}}
              disabled
            />
          </View>

          <View style={{ height: 12 }} />

          {/* Pending updates list */}
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              Content is bundled with the app and loaded locally.
            </Text>
          </View>
        </SafeAreaView>
      </AnimatedPage>
      <BottomBannerAd />
    </View>
  );
}
