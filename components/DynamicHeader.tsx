import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import { BrandTitle } from './BrandTitle';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, useSearch } from '../hooks';
import { usePathname, useRouter } from 'expo-router';
import { HEADER_HEIGHT } from '../lib/headerAnim';
import { createDynamicHeaderStyles } from '../assets/styles';

export const DynamicHeader = () => {
  const { colors, isDark } = useTheme();
  const { searchQuery, setSearchQuery, isSearchExpanded, setSearchExpanded, clearSearch } =
    useSearch();
  const router = useRouter();
  const inputRef = useRef<TextInput | null>(null);
  const pathname = usePathname();

  useEffect(() => {}, []);

  const styles = createDynamicHeaderStyles(colors as any, { isDark });
  const fbBlue = colors.primary;

  // Determine current tab label from the pathname
  const currentLabel = (() => {
    if (!pathname) return 'songs';
    if (pathname.endsWith('/prayers')) return 'prayers';
    if (pathname.endsWith('/bookmark')) return 'bookmarks';
    if (pathname.endsWith('/centers')) return 'centers';
    // index route for songs tab within (tabs)
    if (pathname.endsWith('/index') || pathname.endsWith('/(tabs)')) return 'Songs';
    return 'songs';
  })();

  return (
    <Animated.View style={[styles.root, { minHeight: HEADER_HEIGHT }]}>
      {/* Left Section - App Title (icon + current tab name) */}
      <View style={styles.left}>
        <BrandTitle label={currentLabel} size={30} />
      </View>

      {/* Middle Section - toggles between search icon and search bar */}
      <View style={styles.middle}>
        {isSearchExpanded ? (
          <View style={styles.searchBar}>
            <TouchableOpacity
              onPress={() => {
                clearSearch();
              }}
              style={styles.searchBackBtn}>
              <Ionicons name="arrow-back" size={20} color={isDark ? colors.primary : fbBlue} />
            </TouchableOpacity>
            <TextInput
              ref={(r) => {
                inputRef.current = r;
              }}
              style={[styles.searchInput, { color: isDark ? colors.text : '#050505' }]}
              placeholder={isDark ? 'Search here...' : 'Search here...'}
              placeholderTextColor={isDark ? colors.textMuted : '#65676B'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
            />
            {/* clear button moved to top-right for status-bar placement */}
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setSearchExpanded(true);
              setTimeout(() => inputRef.current?.focus?.(), 80);
            }}
            style={styles.searchButton}
            activeOpacity={0.8}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="search" size={16} color={isDark ? colors.primary : fbBlue} />
              <Text style={styles.searchButtonText}>Search here...</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Settings button */}
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          activeOpacity={0.8}
          style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Absolute clear button placed in the top-right / status-bar area when search is open */}
      {/* Clear button removed; back arrow clears the search now */}
    </Animated.View>
  );
};
