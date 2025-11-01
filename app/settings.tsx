import { View, Text, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';

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
import { LanguageSheet } from '../components/sheets/LanguageSheet';
import { AppearanceSheet } from '../components/sheets/AppearanceSheet';
import { SubmitSongModal } from '../components/sheets/SubmitSongModal';
import AboutCreditsModal from '../components/sheets/AboutCreditsModal';
// Minimal design: remove BrandTitle header usage
import { useAds } from '../ads/adsManager';
import Constants from 'expo-constants';

export default function Settings() {
  const { colors, isDark, toggleTheme, brand, setBrand } = useTheme();
  const prefStyles = createPreferencesStyles(colors);
  const { fontSize } = useFontSize();
  const { language } = useLanguage();
  const { isAdFree, adFreeRemainingMs, startAdFreeWithReward } = useAds();
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSubmitSongModal, setShowSubmitSongModal] = useState(false);
  const [showAboutCreditsModal, setShowAboutCreditsModal] = useState(false);
  const [showDataSourceSheet, setShowDataSourceSheet] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [adNotReady, setAdNotReady] = useState(false);
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
    if (adNotReady) return 'Ad not ready, come back again later';
    if (isAdFree) {
      const minutes = Math.ceil(adFreeRemainingMs / 60000);
      return `Ad-free active: ~${minutes} min left`;
    }
    return 'Watch an ad to remove ads for 1 hour';
  };

  // Minimal design; open sheets for language and appearance
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [showAppearanceSheet, setShowAppearanceSheet] = useState(false);

  const PreferenceRow = ({
    title,
    subtitle,
    icon,
    onPress,
    showSwitch = false,
    switchValue = false,
    onSwitchChange,
    rightAccessory,
  }: {
    title?: string;
    subtitle?: string;
    icon?: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    rightAccessory?: React.ReactNode;
  }) => (
    <TouchableOpacity style={prefStyles.row} activeOpacity={0.8} onPress={onPress} disabled={showSwitch}>
      {icon ? (
        <View style={{ width: 28, alignItems: 'center', marginRight: 12 }}>
          <Ionicons name={icon as any} size={22} color={colors.text} />
        </View>
      ) : null}
      <View style={prefStyles.itemTextArea}>
        <Text style={prefStyles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={prefStyles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.background}
        />
      ) : rightAccessory ? (
        <View style={{ marginLeft: 8 }}>{rightAccessory}</View>
      ) : null}
    </TouchableOpacity>
  );

  const Section = ({ title, children }: { title?: string; children: React.ReactNode }) => (
    <View style={{ marginTop: 12 }}>
      {title ? (
        <View style={{ paddingHorizontal: 16, paddingVertical: 6 }}>
          <Text style={{ color: colors.textMuted, fontSize: 12, letterSpacing: 0.4 }}>{title}</Text>
        </View>
      ) : null}
      {/* No card wrapper: render rows directly */}
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AnimatedPage>
        <SafeAreaView style={prefStyles.container}>
          <ScrollView style={{ flex: 1 }}>
            {/* Header title */}
            <View style={prefStyles.header}>
              <Text style={prefStyles.headerText}>Settings</Text>
            </View>

            {/* Minimal: Ad-Free row */}
            <Section>
              <PreferenceRow
                title="Ad-Free for 1 Hour"
                subtitle={getAdFreeSubtitle()}
                icon={isAdFree ? 'shield-checkmark-outline' : 'play-circle-outline'}
                onPress={async () => {
                  if (unlocking || isAdFree) return;
                  try {
                    setUnlocking(true);
                    setAdNotReady(false);
                    const ok = await startAdFreeWithReward();
                    if (!ok) {
                      setAdNotReady(true);
                    }
                  } finally {
                    setUnlocking(false);
                  }
                }}
                rightAccessory={
                  unlocking ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : undefined
                }
              />
            </Section>

            {/* General Section */}
            <Section title="General">
              <PreferenceRow title="Prayer Language" subtitle={getLanguageLabel()} icon="globe-outline" onPress={() => setShowLanguageSheet(true)} />
              <PreferenceRow title="Font Size" subtitle={`Currently: ${getFontSizeLabel()}`} icon="text-outline" onPress={() => setShowFontSizeModal(true)} />
            </Section>

            {/* Appearance Section */}
            <Section title="Appearance">
              <PreferenceRow
                title="Color Theme"
                subtitle={getBrandLabel()}
                icon="color-palette-outline"
                onPress={() => setShowAppearanceSheet(true)}
                rightAccessory={
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: colors.primary,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  />
                }
              />
              <PreferenceRow title="Dark Mode" subtitle={isDark ? 'On' : 'Off'} icon={isDark ? 'moon-outline' : 'sunny-outline'} onPress={() => setShowAppearanceSheet(true)} />
            </Section>

            {/* Data Section */}
            <Section title="Data">
              <PreferenceRow title="Data Source" subtitle="View and manage data sources" icon="cloud-outline" onPress={() => setShowDataSourceSheet(true)} />
            </Section>

            {/* Contributions */}
            <Section title="Contribute">
              <PreferenceRow title="Submit New Song" subtitle="Contribute to our song collection" icon="musical-notes-outline" onPress={() => setShowSubmitSongModal(true)} />
            </Section>

            {/* About */}
            <Section title="About">
              <PreferenceRow title="About & Credits" subtitle="Dedication and Attribution" icon="information-circle-outline" onPress={() => setShowAboutCreditsModal(true)} />
              <PreferenceRow title="Terms and Agreement" subtitle="View terms and conditions" icon="document-text-outline" onPress={() => setShowTermsModal(true)} />
              <PreferenceRow title="Contact Us" subtitle="Get help and support" icon="mail-outline" onPress={() => setShowContactModal(true)} />
            </Section>

            <View style={{ height: 10 }} />

            {/* Footer: minimal version text */}
            <View style={{ paddingVertical: 16, alignItems: 'center' }}>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                Version {Constants.nativeAppVersion ?? Constants.expoConfig?.version ?? '—'}
              </Text>
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

      <LanguageSheet visible={showLanguageSheet} onClose={() => setShowLanguageSheet(false)} />
      <AppearanceSheet visible={showAppearanceSheet} onClose={() => setShowAppearanceSheet(false)} />
    </View>
  );
}

// Minimal design: no helper functions needed for icon pills
