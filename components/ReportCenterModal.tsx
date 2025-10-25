import React, { useMemo, useState } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../hooks';
import { createPreferencesStyles } from '../assets/styles';
import { useRouter } from 'expo-router';
import { addCentroReport } from '../firebase/firebase';

export type ReportCenterForm = {
  centerName: string;
  address: string;
  district: string;
  status: 'active' | 'inactive' | 'unknown' | '';
  gpsLink?: string;
};

interface ReportCenterModalProps {
  visible: boolean;
  initialValues: Partial<ReportCenterForm>;
  onClose: () => void;
  onSubmit?: (values: ReportCenterForm) => void; // optional for now; can be wired later
}

const statusOptions: ReportCenterForm['status'][] = ['active', 'inactive', 'unknown'];

const toDisplayDistrict = (raw?: string | number) => {
  if (raw === undefined || raw === null) return '';
  const asNum = typeof raw === 'number' ? raw : parseInt(String(raw), 10);
  if (!Number.isFinite(asNum)) return String(raw);
  return asNum === 0 ? 'FOREIGN-BASED' : `DISTRICT ${asNum}`;
};

const ReportCenterModal: React.FC<ReportCenterModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const { colors } = useTheme();
  const router = useRouter();
  const prefStyles = createPreferencesStyles(colors);

  const [centerName] = useState(initialValues.centerName ?? ''); // read-only per request
  const [address, setAddress] = useState(initialValues.address ?? '');
  const [district] = useState(toDisplayDistrict(initialValues.district as any) || '');
  const [status, setStatus] = useState<ReportCenterForm['status']>(
    (initialValues.status as ReportCenterForm['status']) ?? 'unknown'
  );
  const [gpsLink, setGpsLink] = useState(initialValues.gpsLink ?? '');
  // notes removed per requirements

  const isValid = useMemo(() => {
    return centerName.trim().length > 0 && address.trim().length > 0 && district.trim().length > 0;
  }, [centerName, address, district]);

  // Track if any field has changed from the initial values
  const initialDisplayDistrict = useMemo(
    () => toDisplayDistrict(initialValues.district as any) || '',
    [initialValues.district]
  );
  const initialStatus = useMemo(
    () => (initialValues.status as ReportCenterForm['status']) ?? 'unknown',
    [initialValues.status]
  );
  const isDirty = useMemo(() => {
    const curr = {
      address: address.trim(),
      district: district.trim(),
      status: (status || 'unknown') as ReportCenterForm['status'],
      gpsLink: gpsLink.trim(),
    };
    const initVals = {
      address: (initialValues.address ?? '').trim(),
      district: initialDisplayDistrict.trim(),
      status: initialStatus,
      gpsLink: (initialValues.gpsLink ?? '').trim(),
    };
    return (
      curr.address !== initVals.address ||
      curr.district !== initVals.district ||
      curr.status !== initVals.status ||
      curr.gpsLink !== initVals.gpsLink
    );
  }, [
    address,
    district,
    status,
    gpsLink,
    initialValues.address,
    initialDisplayDistrict,
    initialStatus,
    initialValues.gpsLink,
  ]);

  // GPS field validator: detect coordinates vs Google Maps link
  const gpsKind: 'coords' | 'link' | 'unknown' = useMemo(() => {
    const v = gpsLink.trim();
    if (!v) return 'unknown';
    // Detect coordinates like: 14.5995, 120.9842 (allow spaces)
    const m = v.match(/^\s*(-?\d{1,2}(?:\.\d+)?)\s*[;,\s]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
    if (m) {
      const lat = parseFloat(m[1]);
      const lng = parseFloat(m[2]);
      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      ) {
        return 'coords';
      }
    }
    // Detect common Google Maps URLs
    if (/maps\.google|google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl/i.test(v)) return 'link';
    return 'unknown';
  }, [gpsLink]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!isValid) {
      Alert.alert('Incomplete Form', 'Please provide the address and district before submitting.');
      return;
    }
    // Extract coordinates if present
    const raw = gpsLink.trim();
    let lat: number | undefined;
    let lng: number | undefined;
    // Match "lat, lng"
    const m = raw.match(/(-?\d{1,2}(?:\.\d+)?)\s*[;,\s]\s*(-?\d{1,3}(?:\.\d+)?)/);
    if (m) {
      const pLat = parseFloat(m[1]);
      const pLng = parseFloat(m[2]);
      if (
        Number.isFinite(pLat) &&
        Number.isFinite(pLng) &&
        pLat >= -90 &&
        pLat <= 90 &&
        pLng >= -180 &&
        pLng <= 180
      ) {
        lat = pLat;
        lng = pLng;
      }
    }

    try {
      const newId = await addCentroReport({
        center: centerName.trim(),
        address: address.trim(),
        district: district.trim(),
        status: (status || 'unknown') as 'active' | 'inactive' | 'unknown',
        lat,
        lng,
        gpsLink: raw || undefined,
        submittedAt: new Date(),
      });
      Alert.alert('Submitted', `Thanks! Your report has been sent.\nID: ${newId}`);
      onClose();
    } catch (e: any) {
      Alert.alert('Error', `Failed to submit report.\n${e?.message || String(e)}`);
    }
  };

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={handleClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
          <TouchableOpacity onPress={handleClose} style={{ marginRight: 16, padding: 8 }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text, flex: 1 }}>
            Report Center Location
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!(isValid && isDirty)}
            style={{
              backgroundColor: !(isValid && isDirty) ? colors.border : colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Submit</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* Info */}
          <View style={prefStyles.groupCard}>
            <View style={prefStyles.row}>
              <Ionicons
                name="pin-outline"
                size={18}
                color={colors.textMuted}
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
                  Help us improve this location
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 14, lineHeight: 20 }}>
                  Provide the most accurate address, district label, status, and Maps coordinates
                  (preferred).
                </Text>
              </View>
            </View>
          </View>

          {/* Form */}
          <View style={[prefStyles.groupCard, { marginTop: 12 }]}>
            {/* Center (read-only/disabled) */}
            <View style={prefStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>Center</Text>
                <View
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}>
                  <Text style={{ color: colors.text, fontSize: 16 }}>{centerName || '—'}</Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 6 }}>
                  The center name is pre-filled and cannot be edited.
                </Text>
              </View>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* Address */}
            <View style={prefStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>Address *</Text>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter the complete address"
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 16,
                    color: colors.text,
                    minHeight: 80,
                  }}
                />
              </View>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* District (disabled) */}
            <View style={prefStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>
                  District *
                </Text>
                <TextInput
                  value={district}
                  editable={false}
                  placeholder="DISTRICT —"
                  placeholderTextColor={colors.textMuted}
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 16,
                    color: colors.text,
                    opacity: 0.8,
                  }}
                />
                <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 6 }}>
                  District is pre-filled and cannot be edited.
                </Text>
              </View>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* Status */}
            <View style={prefStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>Status *</Text>
                <View style={{ flexDirection: 'row' }}>
                  {statusOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setStatus(opt)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: status === opt ? colors.primary : colors.border,
                        backgroundColor: status === opt ? colors.primary : colors.background,
                        marginRight: 8,
                      }}>
                      <Text style={{ color: status === opt ? '#fff' : colors.text }}>
                        {opt.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* Optional GPS/coordinates */}
            <View style={prefStyles.row}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: colors.text, marginBottom: 6 }}>
                  Maps (Latitude | Longitude)
                </Text>
                <TextInput
                  value={gpsLink}
                  onChangeText={setGpsLink}
                  placeholder="Paste coordinates e.g., 14.5995, 120.9842 or a Google Maps link"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    fontSize: 16,
                    color: colors.text,
                  }}
                />
                {/* Dynamic hint */}
                {gpsLink.trim().length > 0 ? (
                  <Text
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      color:
                        gpsKind === 'coords'
                          ? colors.success
                          : gpsKind === 'link'
                            ? colors.primary
                            : colors.textMuted,
                    }}>
                    {gpsKind === 'coords'
                      ? 'Coordinates detected ✓ (preferred format).'
                      : gpsKind === 'link'
                        ? 'Google Maps link detected. Coordinates are preferred (e.g., 14.5995, 120.9842).'
                        : 'Format not recognized. Paste coordinates like 14.5995, 120.9842 or a Google Maps link.'}
                  </Text>
                ) : (
                  <Text style={{ marginTop: 6, fontSize: 12, color: colors.textMuted }}>
                    Tip: Coordinates are preferred for accuracy. Use the guide below if needed.
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    router.push('/locationGuide');
                  }}
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: 8,
                    paddingVertical: 6,
                    paddingHorizontal: 8,
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name="help-circle-outline"
                      size={16}
                      color={colors.primary}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={{ color: colors.primary, fontWeight: '600' }}>
                      How to get coordinates
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={prefStyles.rowDivider} />

            {/* Notes removed per requirements */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default ReportCenterModal;
