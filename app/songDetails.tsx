import { createHomeStyles, createItemStyles } from '../assets/styles';
import { useTheme, useFontSize } from '../hooks';
import React, { useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomBannerAd } from '../ads/BottomBannerAd';
import { useAds } from '../ads/adsManager';

type Song = {
  id: string;
  title: string;
  content?: string;
  category?: string;
};

// Highlight specific keywords (case-insensitive) inside a text by wrapping them in bold Text nodes
const highlightKeywords = (text?: string) => {
  if (!text) return null;
  // Order matters: match longer phrase first, allow optional trailing ':' and ensure whole-word matches
  const regex = /\b(Repeat\s+Coro|Chorus|Coro)\b:?/gi;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const [matched] = match;
    const start = match.index;
    const end = start + matched.length;

    if (start > lastIndex) {
      parts.push(<Text key={`t-${lastIndex}`}>{text.slice(lastIndex, start)}</Text>);
    }
    parts.push(
      <Text key={`b-${start}`} style={{ fontWeight: '700' }}>
        {matched}
      </Text>
    );
    lastIndex = end;
  }

  if (lastIndex < text.length) {
    parts.push(<Text key={`t-${lastIndex}`}>{text.slice(lastIndex)}</Text>);
  }

  // If no matches, return the original string
  return parts.length ? parts : text;
};

const SongDetailsScreen = () => {
  const { colors, isDark, brand } = useTheme();
  const { getFontSizeValue, getLineHeight } = useFontSize();
  const homeStyles = createHomeStyles(colors);
  const itemStyles = createItemStyles(colors, isDark, brand);
  const params = useLocalSearchParams();
  const router = useRouter();
  const { bannerOffset, trackInteraction } = useAds();

  // Parse the song data from the JSON parameter
  const song: Song = params.song ? JSON.parse(params.song as string) : null;

  useEffect(() => {
    trackInteraction();
  }, [trackInteraction]);

  if (!song) {
    return (
      <View style={homeStyles.container}>
        <SafeAreaView style={homeStyles.safeArea}>
          <View style={homeStyles.loadingContainer}>
            <Text style={homeStyles.loadingText}>No song details found.</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

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
              Songs
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
            {song.title || 'No title available.'}
          </Text>

          {/* Category */}
          {song.category && (
            <View style={itemStyles.category}>
              <Text style={[itemStyles.categoryText, { fontSize: 12 }]}>
                {song.category.toUpperCase()}
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
            paddingBottom: 120 + (bannerOffset ? 60 : 0),
          }}
          showsVerticalScrollIndicator={false}>
          <Text
            style={{
              fontSize: getFontSizeValue(),
              lineHeight: getLineHeight(),
              color: colors.itemText ?? colors.text,
              fontWeight: '400',
            }}>
            {highlightKeywords(song.content || 'No content available.')}
          </Text>
        </ScrollView>
        <BottomBannerAd />
      </SafeAreaView>
    </View>
  );
};

export default SongDetailsScreen;
