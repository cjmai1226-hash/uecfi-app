import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks';
import { createHomeStyles, createItemStyles } from '../assets/styles';
import { BottomBannerAd } from '../ads/BottomBannerAd';
import { useAds } from '../ads/adsManager';
import { useEffect } from 'react';

export default function LocationGuide() {
  const { colors, isDark } = useTheme();
  const homeStyles = createHomeStyles(colors);
  const itemStyles = createItemStyles(colors, isDark);
  const router = useRouter();
  const { bannerOffset, trackInteraction } = useAds();

  useEffect(() => {
    trackInteraction();
  }, [trackInteraction]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={homeStyles.headerarea}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
              alignSelf: 'flex-start',
            }}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.text}
              style={{ marginRight: 4 }}
            />
            <Text style={itemStyles.title}>Back</Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.itemText ?? colors.text,
              lineHeight: 30,
              marginBottom: 8,
            }}>
            Get Latitude & Longitude
          </Text>
          <Text style={{ color: colors.textMuted }}>
            Follow these steps to copy accurate coordinates from Google Maps.
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            paddingBottom: 100 + (bannerOffset || 0),
          }}>
          {/* Mobile App (Android/iOS) */}
          <View style={[itemStyles.card, { marginHorizontal: 0 }]}>
            <View style={[itemStyles.cardInner, { alignItems: 'flex-start' }]}>
              <View style={[itemStyles.icon]}>
                <Ionicons name="phone-portrait-outline" size={18} color={colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[itemStyles.title, { marginBottom: 8 }]}>
                  On Google Maps App (Android/iOS)
                </Text>
                <Text style={itemStyles.itemText}>
                  1. Open Google Maps and search for the chapel or zoom to the correct spot.
                </Text>
                <Text style={itemStyles.itemText}>
                  2. Tap and hold on the exact location to drop a red pin.
                </Text>
                <Text style={itemStyles.itemText}>
                  3. A panel appears at the bottom. Swipe it up.
                </Text>
                <Text style={itemStyles.itemText}>
                  4. Look for the coordinates (e.g., 14.5995, 120.9842). Tap to copy.
                </Text>
                <Text style={itemStyles.itemText}>
                  5. Paste the coordinates into the form’s Maps field.
                </Text>
              </View>
            </View>
          </View>

          {/* Web */}
          <View style={[itemStyles.card, { marginHorizontal: 0, marginTop: 12 }]}>
            <View style={[itemStyles.cardInner, { alignItems: 'flex-start' }]}>
              <View style={[itemStyles.icon]}>
                <Ionicons name="laptop-outline" size={18} color={colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[itemStyles.title, { marginBottom: 8 }]}>On Google Maps (Web)</Text>
                <Text style={itemStyles.itemText}>
                  1. Go to maps.google.com and find the location.
                </Text>
                <Text style={itemStyles.itemText}>
                  2. Right-click on the exact spot of the chapel.
                </Text>
                <Text style={itemStyles.itemText}>
                  3. Click the top result showing coordinates (e.g., 14.5995, 120.9842).
                </Text>
                <Text style={itemStyles.itemText}>
                  4. The coordinates are copied to your clipboard.
                </Text>
                <Text style={itemStyles.itemText}>5. Paste into the form’s Maps field.</Text>
              </View>
            </View>
          </View>

          {/* Tips */}
          <View style={[itemStyles.card, { marginHorizontal: 0, marginTop: 12 }]}>
            <View style={[itemStyles.cardInner, { alignItems: 'flex-start' }]}>
              <View style={[itemStyles.icon]}>
                <Ionicons name="bulb-outline" size={18} color={colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[itemStyles.title, { marginBottom: 8 }]}>Tips</Text>
                <Text style={itemStyles.itemText}>
                  • Coordinates format: latitude, longitude (e.g., 14.5995, 120.9842).
                </Text>
                <Text style={itemStyles.itemText}>
                  • Drop the pin exactly on the chapel building for best accuracy.
                </Text>
                <Text style={itemStyles.itemText}>
                  • If you share a Google Maps link, we can extract the coordinates later.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomBannerAd />
    </View>
  );
}
