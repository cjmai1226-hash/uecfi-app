import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createHomeStyles, createItemStyles } from '../assets/styles';
import { useTheme } from '../hooks';
import { ReportCenterModal, AddCenterContactModal } from '../components';
import { BottomBannerAd } from '../ads/BottomBannerAd';
import { useAds } from '../ads/adsManager';

type CenterDoc = {
  id: string;
  center?: string;
  address?: string;
  district?: string | number;
  status?: string; // active, inactive, etc.
  // Optional single contacts field added to Centers collection
  contacts?:
    | string
    | {
        name?: string;
        number?: string;
        role?: string;
      };
  // New field carrying precise coordinates. Accept a few common shapes.
  location?:
    | {
        latitude?: number | string;
        longitude?: number | string;
        lat?: number | string;
        lng?: number | string;
        // Firestore GeoPoint compatibility (SDK exposes .latitude/.longitude getters)
        _latitude?: number;
        _longitude?: number;
      }
    | string;
};

const toNum = (v: any): number | null => {
  if (v == null) return null;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? null : n;
  }
  return null;
};

export default function CenterDetails() {
  const { colors, isDark } = useTheme();
  const { bannerOffset, trackInteraction } = useAds();
  const homeStyles = createHomeStyles(colors);
  const itemStyles = createItemStyles(colors, isDark);
  const router = useRouter();
  const params = useLocalSearchParams();
  const center: CenterDoc | null = params.center ? JSON.parse(params.center as string) : null;
  const [reportVisible, setReportVisible] = useState(false);
  const [contactsVisible, setContactsVisible] = useState(false);

  // Count opening this details page as an interaction
  useEffect(() => {
    trackInteraction();
  }, [trackInteraction]);

  if (!center) {
    return (
      <View style={homeStyles.container}>
        <SafeAreaView style={homeStyles.safeArea}>
          <View style={homeStyles.loadingContainer}>
            <Text style={homeStyles.loadingText}>No center details found.</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const districtNum = toNum(center.district);
  const districtLabel =
    districtNum === 0 ? 'FOREIGN-BASED' : `DISTRICT ${String(center.district ?? '').toUpperCase()}`;

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

  // Try to normalize various possible "location" shapes into coordinates
  const extractCoords = (loc: CenterDoc['location']): { lat: number; lng: number } | null => {
    if (!loc) return null;

    const normalizeNum = (v: unknown): number | null => {
      if (typeof v === 'number' && Number.isFinite(v)) return v;
      if (typeof v === 'string') {
        const n = parseFloat(v.trim());
        return Number.isFinite(n) ? n : null;
      }
      return null;
    };

    const valid = (lat: number | null, lng: number | null) =>
      lat != null && lng != null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

    // String formats like "14.5995, 120.9842"
    if (typeof loc === 'string') {
      const m = loc.trim().match(/(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)/);
      if (m) {
        const lat = parseFloat(m[1]);
        const lng = parseFloat(m[2]);
        if (valid(lat, lng)) return { lat, lng };
      }
      return null;
    }

    // Object shapes: latitude/longitude, lat/lng, or Firestore GeoPoint-like
    const latCandidates = [
      normalizeNum((loc as any).latitude),
      normalizeNum((loc as any).lat),
      normalizeNum((loc as any)._latitude),
    ];
    const lngCandidates = [
      normalizeNum((loc as any).longitude),
      normalizeNum((loc as any).lng),
      normalizeNum((loc as any)._longitude),
    ];
    const lat = latCandidates.find((n) => n != null) ?? null;
    const lng = lngCandidates.find((n) => n != null) ?? null;
    if (valid(lat, lng)) return { lat: lat as number, lng: lng as number };

    return null;
  };

  const buildMapsUrl = (): string | null => {
    if (!center) return null;

    // 1) Prefer precise coordinates from `location`
    const coords = extractCoords(center.location);
    if (coords) {
      // Google Maps: query accepts "lat,lng"; we use search so it's universal
      return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
    }

    // 2) Fallback to address text
    if (center.address?.trim()) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.address.trim())}`;
    }

    return null;
  };

  const handleOpenMaps = async () => {
    const url = buildMapsUrl();
    if (!url) {
      Alert.alert('Location unavailable', 'No location or address was provided for this center.');
      return;
    }
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert('Cannot open maps', 'Your device cannot open the maps link.');
    } catch {
      Alert.alert('Error', 'Failed to open maps.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header Area */}
        <View style={homeStyles.headerarea}>
          {/* Back */}
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
            <Text style={itemStyles.title}>Centers</Text>
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
            {center.center || 'Unnamed Center'}
          </Text>

          {/* District chip */}
          {center.district != null && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={itemStyles.category}>
                <Text style={[itemStyles.categoryText, { fontSize: 12 }]}>{districtLabel}</Text>
              </View>
              {center.status && (
                <View
                  style={[
                    itemStyles.category,
                    {
                      backgroundColor: getStatusColor(center.status),
                    },
                  ]}>
                  <Text style={[itemStyles.categoryText, { fontSize: 12, color: '#FFFFFF' }]}>
                    {center.status.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            paddingBottom: 160 + bannerOffset,
          }}
          showsVerticalScrollIndicator={false}>
          {/* Address + Open in Maps (combined) */}
          <TouchableOpacity
            style={[itemStyles.card, { marginHorizontal: 0 }]}
            activeOpacity={0.7}
            onPress={handleOpenMaps}>
            <View style={[itemStyles.cardInner, { alignItems: 'center' }]}>
              <View style={[itemStyles.icon]}>
                <Ionicons name="location-outline" size={18} color={colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[itemStyles.title, { marginBottom: 4 }]}>UECFI Center Address</Text>
                <Text style={itemStyles.itemText}>{center.address || '—'}</Text>
                <Text
                  style={[
                    itemStyles.itemText,
                    { color: colors.textMuted, marginTop: 6, fontSize: 12 },
                  ]}>
                  Tap to open in Google Maps
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Contact (from Center document - single field) */}
          <View style={[itemStyles.card, { marginHorizontal: 0 }]}>
            <View style={[itemStyles.cardInner, { alignItems: 'flex-start' }]}>
              <View style={[itemStyles.icon]}>
                <Ionicons name="people-outline" size={18} color={colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[itemStyles.title, { marginBottom: 8 }]}>Contact</Text>
                {(() => {
                  const c = center.contacts as any;
                  if (typeof c === 'string') {
                    const s = c.trim();
                    if (s.length > 0) {
                      return <Text style={itemStyles.itemText}>{s}</Text>;
                    }
                    return (
                      <Text style={[itemStyles.itemText, { color: colors.textMuted }]}>
                        No contacts available for this center yet.
                      </Text>
                    );
                  }
                  if (c && (c.name || c.number || c.role)) {
                    const name = String(c.name || '—');
                    const role = c.role ? String(c.role).trim() : '';
                    const number = c.number ? String(c.number).trim() : '';
                    return (
                      <View>
                        <Text style={[itemStyles.itemText, { fontWeight: '700' }]}>
                          {name}
                          {role ? ` — ${role}` : ''}
                        </Text>
                        {number ? (
                          <Text style={[itemStyles.itemText, { color: colors.textMuted }]}>
                            {number}
                          </Text>
                        ) : null}
                      </View>
                    );
                  }
                  return (
                    <Text style={[itemStyles.itemText, { color: colors.textMuted }]}>
                      No contacts available for this center yet.
                    </Text>
                  );
                })()}
              </View>
            </View>
          </View>

          {/* Center Contacts */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setContactsVisible(true)}
            style={[itemStyles.card, { marginHorizontal: 0, backgroundColor: colors.surface }]}>
            <View style={[itemStyles.cardInner, { alignItems: 'center' }]}>
              <View style={[itemStyles.icon]}>
                <Ionicons name="people-outline" size={18} color={colors.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[itemStyles.title, { marginBottom: 4 }]}>Center Contacts</Text>
                <Text style={[itemStyles.itemText, { color: colors.textMuted }]}>
                  Add a point-of-contact for this center
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Help with Location */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setReportVisible(true)}
            style={[itemStyles.card, { marginHorizontal: 0, backgroundColor: colors.surface }]}>
            <View style={[itemStyles.cardInner, { alignItems: 'center' }]}>
              <View style={[itemStyles.icon]}>
                <Ionicons name="help-circle-outline" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[itemStyles.title, { marginBottom: 4, color: colors.primary }]}>
                  Location Not Accurate?
                </Text>
                <Text style={[itemStyles.itemText, { color: colors.textMuted }]}>
                  Help us pinpoint the local chapel location and its Status.
                </Text>
                <Text
                  style={[
                    itemStyles.itemText,
                    { color: colors.textMuted, marginTop: 4, fontSize: 12 },
                  ]}>
                  Tap to suggest an address correction or status update
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Report Modal */}
          <ReportCenterModal
            visible={reportVisible}
            onClose={() => setReportVisible(false)}
            initialValues={{
              centerName: center.center ?? '',
              address: center.address ?? '',
              district: center.district as any,
              status: (center.status as any) ?? 'unknown',
            }}
            onSubmit={() => {
              // Intentionally no backend submission yet per request
              Alert.alert(
                'Thanks!',
                'Your report has been prepared. Submission will be available soon.'
              );
            }}
          />

          {/* Add Contact Modal */}
          <AddCenterContactModal
            visible={contactsVisible}
            centerName={center.center ?? '—'}
            centerAddress={center.address ?? undefined}
            onClose={() => setContactsVisible(false)}
          />
        </ScrollView>
      </SafeAreaView>
      <BottomBannerAd />
    </View>
  );
}
