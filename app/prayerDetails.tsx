import { createHomeStyles, createItemStyles } from '../assets/styles';
import { useTheme, useFontSize, useLanguage } from '../hooks';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { maybeAskForReview } from '../lib/storeReview';
import { BottomBannerAd } from '../ads/BottomBannerAd';
import { useAds } from '../ads/adsManager';

// Local Prayer type
type Prayer = {
  id: string; // Firestore document ID
  title: string;
  content?: string;
  category?: string;
};

const PrayerDetailsScreen = () => {
  const { colors, isDark, brand } = useTheme();
  const { getFontSizeValue, getLineHeight } = useFontSize();
  const { isAltLanguage } = useLanguage();
  const homeStyles = createHomeStyles(colors);
  const itemStyles = createItemStyles(colors, isDark, brand);
  const params = useLocalSearchParams();
  const router = useRouter();
  const { bannerOffset, trackInteraction } = useAds();

  // Parse the prayer data from the JSON parameter
  const prayer: Prayer = params.prayer ? JSON.parse(params.prayer as string) : null;

  // Helper: choose localized fields; handles empty/whitespace alt values safely
  const { displayTitle, displayContent } = useMemo(() => {
    const p = prayer as any;
    const altTitle = typeof p?.title1 === 'string' ? p.title1 : undefined;
    const altContent = typeof p?.content1 === 'string' ? p.content1 : undefined;

    const titleText =
      isAltLanguage && altTitle && altTitle.trim().length > 0 ? altTitle : prayer?.title;
    const contentText =
      isAltLanguage && altContent && altContent.trim().length > 0 ? altContent : prayer?.content;

    return { displayTitle: titleText, displayContent: contentText };
  }, [isAltLanguage, prayer]);

  // Use a local state to track the favorite status
  const [isFavorite, setIsFavorite] = useState(false);

  // Use useEffect to load favorite status from storage
  useEffect(() => {
    // Count viewing as interaction for interstitials
    trackInteraction();
    const loadFavoriteStatus = async () => {
      try {
        const normalizedId =
          (prayer as any).id ??
          (prayer as any)._id ??
          String((prayer as any)._id ?? (prayer as any).id ?? '');
        if (!normalizedId) return;
        const favoriteKey = `@favorite_${normalizedId}`;
        const storedPrayer = await AsyncStorage.getItem(favoriteKey);
        setIsFavorite(storedPrayer !== null); // if exists → is favorite
      } catch (e) {
        console.error('Failed to load favorite status from storage', e);
      }
    };
    if (prayer) {
      loadFavoriteStatus();
    }
  }, [prayer, trackInteraction]);

  const handleToggleFavorite = async () => {
    try {
      const normalizedId =
        (prayer as any).id ??
        (prayer as any)._id ??
        String((prayer as any)._id ?? (prayer as any).id ?? '');
      if (!normalizedId) return;

      const favoriteKey = `@favorite_${normalizedId}`;

      if (isFavorite) {
        // Unfavorite → remove from storage
        await AsyncStorage.removeItem(favoriteKey);
        setIsFavorite(false);
      } else {
        // Favorite → save the full prayer object
        await AsyncStorage.setItem(favoriteKey, JSON.stringify(prayer));
        setIsFavorite(true);
        // Signature interaction: user saved a favorite
        // Fire and forget; only attempt once per install
        maybeAskForReview().catch(() => {});
      }
    } catch (e) {
      console.error('Failed to toggle favorite:', e);
    }
  };

  // Text-to-speech removed

  if (!prayer) {
    return (
      <View style={homeStyles.container}>
        <SafeAreaView style={homeStyles.safeArea}>
          <View style={homeStyles.loadingContainer}>
            <Text style={homeStyles.loadingText}>No prayer details found.</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const fabIconName = isFavorite ? 'bookmark' : 'bookmark-outline';
  const fabIconColor = isFavorite ? '#ffffff' : colors.textMuted;
  const fabButtonColor = isFavorite ? colors.primary : colors.surface;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header Area */}
        <View style={homeStyles.headerarea}>
          {/* Back Button */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
              alignSelf: 'flex-start',
            }}
            onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.text}
              style={{ marginRight: 4 }}
            />
            <Text style={itemStyles.title}>Prayers</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.itemText ?? colors.text,
              lineHeight: 30,
              marginBottom: 8,
            }}>
            {displayTitle || 'No title available.'}
          </Text>

          {/* Category */}
          {prayer.category && (
            <View style={itemStyles.category}>
              <Text
                style={[itemStyles.categoryText, { fontSize: 12, fontStyle: 'italic' }]}>
                {prayer.category
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </Text>
            </View>
          )}
        </View>

        {/* Content Area */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            paddingBottom: 180 + (bannerOffset || 0),
          }}
          showsVerticalScrollIndicator={false}>
          <Text
            style={[
              itemStyles.itemText,
              {
                fontSize: getFontSizeValue(),
                lineHeight: getLineHeight(),
                color: colors.itemText ?? colors.text,
                fontWeight: '400',
                textAlign: 'justify',
              },
            ]}>
            {displayContent || 'No content available.'}
          </Text>
        </ScrollView>

        {/* Favorite Button */}
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={[
            homeStyles.fab,
            { backgroundColor: fabButtonColor, bottom: 100 + (bannerOffset ? 60 : 0) },
          ]}>
          <Ionicons name={fabIconName} size={28} color={fabIconColor} />
        </TouchableOpacity>
        <BottomBannerAd />
      </SafeAreaView>
    </View>
  );
};

export default PrayerDetailsScreen;
