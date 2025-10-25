import { createHomeStyles } from '../assets/styles';
import { useTheme, useFontSize, useLanguage } from '../hooks';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { BottomBannerAd } from '../ads/BottomBannerAd';
import { useAds } from '../ads/adsManager';

// Local Prayer type
export type Prayer = {
  id: string;
  title: string;
  content?: string;
  category?: string;
};

// type FavoriteDetailsParams = {
//   prayer: Prayer;
//   favorites?: Prayer[];
//   initialIndex?: number;
//   fromFavorites?: boolean;
// };

const FavoriteDetailsScreen = () => {
  const { colors } = useTheme();
  const { getFontSizeValue, getLineHeight } = useFontSize();
  const { isAltLanguage } = useLanguage();
  const homeStyles = createHomeStyles(colors);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { bannerOffset, trackInteraction } = useAds();

  // Parse parameters
  const prayer: Prayer = params.prayer ? JSON.parse(params.prayer as string) : null;
  const favorites: Prayer[] = useMemo(() => {
    return params.favorites ? JSON.parse(params.favorites as string) : [];
  }, [params.favorites]);
  const initialIndex = params.initialIndex ? parseInt(params.initialIndex as string) : 0;

  const [isFavorite, setIsFavorite] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!favorites?.length) return 0;
    if (initialIndex >= 0 && initialIndex < favorites.length) return initialIndex;
    const found = favorites.findIndex((p) => p.id === prayer.id);
    return found >= 0 ? found : 0;
  });

  // Only set initial index once when component mounts
  React.useEffect(() => {
    if (!favorites?.length) return;

    // Only set initial index if it hasn't been set yet (component mount)
    const shouldSetInitialIndex = currentIndex === 0 && initialIndex !== undefined;

    if (shouldSetInitialIndex && initialIndex >= 0 && initialIndex < favorites.length) {
      setCurrentIndex(initialIndex);
      return;
    }

    // Only find prayer if we're at index 0 and it's not the right prayer
    if (currentIndex === 0 && prayer?.id) {
      const found = favorites.findIndex((p) => p.id === prayer.id);
      if (found >= 0 && found !== currentIndex) {
        setCurrentIndex(found);
      }
    }
  }, [favorites, currentIndex, initialIndex, prayer?.id]);

  const currentPrayer = useMemo<Prayer>(() => {
    if (!favorites?.length) return prayer;
    return favorites[Math.min(Math.max(currentIndex, 0), favorites.length - 1)] ?? prayer;
  }, [favorites, currentIndex, prayer]);

  // Helper functions to get the correct content based on language
  const getTitle = (p: Prayer) => {
    const alt = (p as any).title1 as string | undefined;
    return isAltLanguage && alt ? alt : p.title;
  };

  const getContent = (p: Prayer) => {
    const alt = (p as any).content1 as string | undefined;
    return isAltLanguage && alt ? alt : p.content;
  };

  // Load favorite status whenever currentPrayer changes
  useEffect(() => {
    // Count viewing a favorite detail as an interaction
    trackInteraction();

    const loadFavoriteStatus = async () => {
      try {
        if (!currentPrayer) return;
        const normalizedId =
          (currentPrayer as any).id ??
          (currentPrayer as any)._id ??
          String((currentPrayer as any)._id ?? (currentPrayer as any).id ?? '');
        if (!normalizedId) return;
        const favoriteKey = `@favorite_${normalizedId}`;
        const stored = await AsyncStorage.getItem(favoriteKey);
        setIsFavorite(!!stored);
      } catch (e) {
        console.error('Failed to load favorite status from storage', e);
      }
    };
    loadFavoriteStatus();
  }, [currentPrayer, currentIndex, trackInteraction]); // Added currentIndex to dependencies

  const handleToggleFavorite = async () => {
    try {
      if (!currentPrayer) return;
      const normalizedId =
        (currentPrayer as any).id ??
        (currentPrayer as any)._id ??
        String((currentPrayer as any)._id ?? (currentPrayer as any).id ?? '');
      if (!normalizedId) return;
      const favoriteKey = `@favorite_${normalizedId}`;

      if (isFavorite) {
        await AsyncStorage.removeItem(favoriteKey);
        setIsFavorite(false);
      } else {
        await AsyncStorage.setItem(favoriteKey, JSON.stringify(currentPrayer));
        setIsFavorite(true);
      }
    } catch (e) {
      console.error('Failed to toggle favorite:', e);
    }
  };

  // Android hardware back: go back to previous screen
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.back();
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [router])
  );

  if (!currentPrayer) {
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
            <Text
              style={{
                fontSize: 16,
                color: colors.text,
                fontWeight: '500',
              }}>
              Favorites
            </Text>
          </TouchableOpacity>

          {/* Title */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.itemText ?? colors.text,
              lineHeight: 30,
              marginBottom: 8,
            }}>
            {getTitle(currentPrayer)}
          </Text>

          {/* Category and Index Info */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {currentPrayer.category && (
              <View
                style={{
                  backgroundColor: colors.surface,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.textMuted,
                    fontWeight: '600',
                  }}>
                  {currentPrayer.category.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Content Area */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            paddingBottom: 180 + (bannerOffset || 0), // Space for FAB + Banner
          }}
          showsVerticalScrollIndicator={false}>
          <Text
            style={{
              fontSize: getFontSizeValue(),
              lineHeight: getLineHeight(),
              color: colors.itemText ?? colors.text,
              fontWeight: '400',
              textAlign: 'justify',
            }}>
            {getContent(currentPrayer) || 'No content available.'}
          </Text>
        </ScrollView>

        {/* Floating Action Button for Favorite */}
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={[
            homeStyles.fab,
            { backgroundColor: fabButtonColor, bottom: 100 + (bannerOffset ? 60 : 0) },
          ]}>
          <Ionicons name={fabIconName} size={28} color={fabIconColor} />
        </TouchableOpacity>
      </SafeAreaView>
      <BottomBannerAd />
    </View>
  );
};

export default FavoriteDetailsScreen;
