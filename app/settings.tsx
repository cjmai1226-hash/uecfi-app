import { View, Text, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme, useFontSize, useLanguage } from '../hooks';
import { createPreferencesStyles } from '../assets/styles';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
// AppBackground removed; using plain View wrappers
import { AnimatedPage } from '../components/AnimatedPage';
import { FontSizeModal } from '../components/FontSizeModal';
import { TermsModal } from '../components/TermsModal';
import { ContactModal } from '../components/ContactModal';
import { SubmitSongModal } from '../components/SubmitSongModal';
import AboutCreditsModal from '../components/AboutCreditsModal';
import { BrandTitle } from '~/components/BrandTitle';
import { useAds } from '../ads/adsManager';

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
          imageUri ? { borderWidth: 2, borderColor: colors.primary, backgroundColor: '#fff' } : {},
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
            size={22}
            color={(() => {
              switch (icon) {
                case 'color-palette-outline':
                  return colors.accent; // highlight theme control
                case 'moon-outline':
                case 'sunny-outline':
                  return colors.warning; // mode toggle
                case 'language-outline':
                  return colors.success; // language feels positive
                case 'text-outline':
                  return colors.info; // informational setting
                case 'musical-notes-outline':
                  return colors.error; // stands out (action)
                case 'information-circle-outline':
                  return colors.info;
                case 'shield-checkmark-outline':
                  return colors.success;
                case 'mail-outline':
                  return colors.primary;
                default:
                  return colors.textMuted;
              }
            })()}
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AnimatedPage>
        <SafeAreaView style={prefStyles.container}>
          <ScrollView style={{ flex: 1 }}>
            {/* Header with brand */}
            <View style={prefStyles.header}>
              <BrandTitle label="Settings" size={24} />
            </View>

            {/* Preferences (plain rows) */}
            <PreferenceRow
              title="Prayer Language"
              subtitle={getLanguageLabel()}
              icon="language-outline"
              onPress={handleLanguageToggle}
            />

            <View style={prefStyles.rowDivider} />
            {/* Rewarded Ad unlock for temporary ad-free */}
            <PreferenceRow
              title="Ad-Free for 1 Hour"
              subtitle={getAdFreeSubtitle()}
              icon={isAdFree ? 'shield-checkmark-outline' : 'play-circle-outline'}
              onPress={async () => {
                if (unlocking || isAdFree) return;
                try {
                  setUnlocking(true);
                  const ok = await startAdFreeWithReward();
                  // If ok is false, we do nothing; ads remain active per requirements
                } finally {
                  setUnlocking(false);
                }
              }}
            />
            <View style={prefStyles.rowDivider} />
            {/* Color Theme row (brand palette) */}
            <PreferenceRow
              title="Color Theme"
              subtitle={getBrandLabel()}
              icon="color-palette-outline"
              onPress={() => {
                // cycle through the two options: facebook <-> telegram
                const next = brand === 'facebook' ? 'telegram' : 'facebook';
                setBrand(next as any);
              }}
            />
            <View style={prefStyles.rowDivider} />
            <PreferenceRow
              title={isDark ? 'Dark Mode' : 'Light Mode'}
              subtitle={isDark ? 'Currently: Dark' : 'Currently: Light'}
              icon={isDark ? 'moon-outline' : 'sunny-outline'}
              onPress={toggleTheme}
            />
            <View style={prefStyles.rowDivider} />
            <PreferenceRow
              title="Font Size"
              subtitle={`Currently: ${getFontSizeLabel()}`}
              icon="text-outline"
              onPress={() => setShowFontSizeModal(true)}
            />
            <View style={prefStyles.rowDivider} />
            <PreferenceRow
              title="Submit New Song"
              subtitle="Contribute to our song collection"
              icon="musical-notes-outline"
              onPress={() => setShowSubmitSongModal(true)}
            />
            {/* Data Source Item */}
            <PreferenceRow
              title="Data Source"
              subtitle="View and manage data sources"
              icon="cloud-offline-outline"
              onPress={() => router.push('/dataSource')}
            />
            <View style={prefStyles.rowDivider} />
            <PreferenceRow
              title="About & Credits"
              subtitle="Dedication and Attribution"
              icon="ribbon-outline"
              onPress={() => setShowAboutCreditsModal(true)}
            />
            <View style={prefStyles.rowDivider} />
            <PreferenceRow
              title="Terms and Agreement"
              subtitle="View terms and conditions"
              icon="shield-checkmark-outline"
              onPress={() => setShowTermsModal(true)}
            />
            <View style={prefStyles.rowDivider} />
            <PreferenceRow
              title="Contact Us"
              subtitle="Get help and support"
              icon="mail-outline"
              onPress={() => setShowContactModal(true)}
            />

            <View style={prefStyles.rowDivider} />
            <PreferenceRow
              title="Version"
              subtitle="2.0.0"
              icon="information-circle-outline"
              onPress={() => {}}
            />

            <View style={{ height: 16 }} />
          </ScrollView>
        </SafeAreaView>
      </AnimatedPage>

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
    </View>
  );
}
