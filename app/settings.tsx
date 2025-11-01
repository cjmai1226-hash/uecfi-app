import { View, Text, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme, useFontSize, useLanguage } from '../hooks';
import { createPreferencesStyles } from '../assets/styles';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
// AppBackground removed; using plain View wrappers
import { AnimatedPage } from '../components/AnimatedPage';
import { FontSizeModal } from '../components/sheets/FontSizeModal';
import { TermsModal } from '../components/TermsModal';
import { ContactModal } from '../components/sheets/ContactModal';
import { DataSourceSheet } from '../components/sheets/DataSourceSheet';
import { SubmitSongModal } from '../components/sheets/SubmitSongModal';
import AboutCreditsModal from '../components/sheets/AboutCreditsModal';
import { BrandTitle } from '~/components/BrandTitle';
import { useAds } from '../ads/adsManager';
import Constants from 'expo-constants';

export default function Settings() {
  const { colors, isDark, toggleTheme, brand, setBrand } = useTheme();
  const prefStyles = createPreferencesStyles(colors);
  const { fontSize } = useFontSize();
  const { language, setLanguage } = useLanguage();
  const { isAdFree, adFreeRemainingMs, startAdFreeWithReward } = useAds();
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSubmitSongModal, setShowSubmitSongModal] = useState(false);
  const [showAboutCreditsModal, setShowAboutCreditsModal] = useState(false);
  const [showDataSourceSheet, setShowDataSourceSheet] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  // Profile removed: no profile photo state

  const getFontSizeLabel = () => {
    switch (fontSize) {
      case 'small':
        return 'Small';
      case 'medium':
        return 'Medium';
      case 'large':
        return 'Large';
      case 'extra-large':
        return 'Extra Large';
      default:
        return 'Medium';
    }
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'ilo':
        return 'Ilokano';
      case 'tag':
        return 'Tagalog';
      default:
        return 'Ilokano';
    }
  };

  const getBrandLabel = () => {
    switch (brand) {
      case 'facebook':
        return 'Strong Blue';
      case 'telegram':
      default:
        return 'Gentle Blue';
    }
  };

  // Human-friendly remaining time for ad-free mode
  const getAdFreeSubtitle = () => {
    if (unlocking) return 'Preparing ad…';
    if (isAdFree) {
      const minutes = Math.ceil(adFreeRemainingMs / 60000);
      return `Ad-free active: ~${minutes} min left`;
    }
    return 'Watch an ad to remove ads for 1 hour';
  };

  // iOS-like colored icon pills
  const iconPalette = (icon: string): { fg: string; bg: string } => {
    const map: Record<string, string> = {
      'color-palette-outline': colors.accent,
      'moon-outline': colors.warning,
      'sunny-outline': colors.warning,
      'globe-outline': colors.success,
      'text-outline': colors.info,
      'musical-notes-outline': colors.error,
      'information-circle-outline': colors.info,
      'shield-checkmark-outline': colors.success,
      'play-circle-outline': colors.primary,
      'mail-outline': colors.primary,
      'cloud-outline': colors.info,
      'cloud-offline-outline': colors.info,
      'document-text-outline': colors.primary,
    };
    const fg = map[icon] ?? colors.textMuted;
    return { fg, bg: hexToRgba(fg, 0.15) };
  };

  const handleLanguageToggle = () => {
    const newLanguage = language === 'ilo' ? 'tag' : 'ilo';
    setLanguage(newLanguage);
  };

  const PreferenceRow = ({
    title,
    subtitle,
    icon,
    onPress,
    showSwitch = false,
    switchValue = false,
    onSwitchChange,
    imageUri,
  }: {
    title?: string;
    subtitle?: string;
    icon: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    imageUri?: string | null;
  }) => (
    <TouchableOpacity
      style={prefStyles.row}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={showSwitch}>
      <View
        style={[
          prefStyles.iconArea,
          imageUri
            ? { borderWidth: 2, borderColor: colors.primary, backgroundColor: '#fff' }
      : { backgroundColor: iconPalette(icon).bg },
        ]}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            resizeMode="cover"
          />
        ) : (
          <Ionicons
            name={icon as any}
            size={18}
            color={iconPalette(icon).fg}
          />
        )}
      </View>
      <View style={prefStyles.itemTextArea}>
        <Text style={prefStyles.rowTitle}>{title}</Text>
        {subtitle && <Text style={prefStyles.rowSubtitle}>{subtitle}</Text>}
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.background}
        />
      ) : (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textMuted}
          style={prefStyles.chevron}
        />
      )}
    </TouchableOpacity>
  );

  const Section = ({ title, children }: { title?: string; children: React.ReactNode }) => (
    <View style={{ marginTop: 6 }}>
      {/* iOS Settings: hide section titles */}
      <View style={prefStyles.section} />
      <View style={prefStyles.groupCard}>{children}</View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AnimatedPage>
        <SafeAreaView style={prefStyles.container}>
          <ScrollView style={{ flex: 1 }}>
            {/* Header with brand */}
            <View style={prefStyles.header}>
              <BrandTitle label="Settings" size={24} />
            </View>
            {/* Feature card: Ad-Free */}
            <View style={prefStyles.item}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={async () => {
                  if (unlocking || isAdFree) return;
                  try {
                    setUnlocking(true);
                    await startAdFreeWithReward();
                  } finally {
                    setUnlocking(false);
                  }
                }}
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={[
                    prefStyles.iconArea,
                    {
                      marginRight: 14,
                      backgroundColor: iconPalette(
                        isAdFree ? 'shield-checkmark-outline' : 'play-circle-outline'
                      ).bg,
                    },
                  ]}>
                  <Ionicons
                    name={isAdFree ? 'shield-checkmark-outline' : 'play-circle-outline'}
                    size={18}
                    color={iconPalette(
                      isAdFree ? 'shield-checkmark-outline' : 'play-circle-outline'
                    ).fg}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={prefStyles.itemTitle}>Ad-Free for 1 Hour</Text>
                  <Text style={prefStyles.itemSubtitle}>{getAdFreeSubtitle()}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* General Section */}
            <Section title="General">
              <PreferenceRow
                title="Prayer Language"
                subtitle={getLanguageLabel()}
                icon="globe-outline"
                onPress={handleLanguageToggle}
              />
              <View style={prefStyles.rowDivider} />
              <PreferenceRow
                title="Font Size"
                subtitle={`Currently: ${getFontSizeLabel()}`}
                icon="text-outline"
                onPress={() => setShowFontSizeModal(true)}
              />
            </Section>

            {/* Appearance Section */}
            <Section title="Appearance">
              <PreferenceRow
                title="Color Theme"
                subtitle={getBrandLabel()}
                icon="color-palette-outline"
                onPress={() => {
                  const next = brand === 'facebook' ? 'telegram' : 'facebook';
                  setBrand(next as any);
                }}
              />
              <View style={prefStyles.rowDivider} />
              <PreferenceRow
                title="Dark Mode"
                subtitle={isDark ? 'On' : 'Off'}
                icon={isDark ? 'moon-outline' : 'sunny-outline'}
                showSwitch
                switchValue={isDark}
                onSwitchChange={toggleTheme}
              />
            </Section>

            {/* Data Section */}
            <Section title="Data">
              <PreferenceRow
                title="Data Source"
                subtitle="View and manage data sources"
                icon="cloud-outline"
                onPress={() => setShowDataSourceSheet(true)}
              />
            </Section>

            {/* Contributions */}
            <Section title="Contribute">
              <PreferenceRow
                title="Submit New Song"
                subtitle="Contribute to our song collection"
                icon="musical-notes-outline"
                onPress={() => setShowSubmitSongModal(true)}
              />
            </Section>

            {/* About */}
            <Section title="About">
              <PreferenceRow
                title="About & Credits"
                subtitle="Dedication and Attribution"
                icon="information-circle-outline"
                onPress={() => setShowAboutCreditsModal(true)}
              />
              <View style={prefStyles.rowDivider} />
              <PreferenceRow
                title="Terms and Agreement"
                subtitle="View terms and conditions"
                icon="document-text-outline"
                onPress={() => setShowTermsModal(true)}
              />
              <View style={prefStyles.rowDivider} />
              <PreferenceRow
                title="Contact Us"
                subtitle="Get help and support"
                icon="mail-outline"
                onPress={() => setShowContactModal(true)}
              />
            </Section>

            <View style={{ height: 10 }} />

            {/* Footer: App Version and Developer Credit */}
            <View style={{ paddingVertical: 16, alignItems: 'center' }}>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 8 }}>
                Version {Constants.nativeAppVersion ?? Constants.expoConfig?.version ?? '—'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>DEVELOP BY</Text>
                <Image
                  source={require('../assets/images/developer-icon.png')}
                  style={{ width: 20, height: 20, borderRadius: 3 }}
                />
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>Dev_Christian</Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </AnimatedPage>

      {/* Floating search removed from Settings */}

      {/* Modals placed directly under AppBackground so they overlay correctly */}
      <FontSizeModal visible={showFontSizeModal} onClose={() => setShowFontSizeModal(false)} />

      <TermsModal visible={showTermsModal} onClose={() => setShowTermsModal(false)} />

      <ContactModal visible={showContactModal} onClose={() => setShowContactModal(false)} />

      <SubmitSongModal
        visible={showSubmitSongModal}
        onClose={() => setShowSubmitSongModal(false)}
      />

      <AboutCreditsModal
        visible={showAboutCreditsModal}
        onClose={() => setShowAboutCreditsModal(false)}
      />

      <DataSourceSheet
        visible={showDataSourceSheet}
        onClose={() => setShowDataSourceSheet(false)}
      />
    </View>
  );
}

// Helpers – iOS-like colored icon pills
function hexToRgba(hex: string, alpha: number) {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized.length === 3
    ? sanitized.split('').map((c) => c + c).join('')
    : sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
// Note: color mapping is defined inside the component via iconPalette()
