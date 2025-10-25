// Ensure Firebase initializes before any hooks/components use it
import '../firebase/firebase';
import { View, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import {
  ThemeProvider,
  useTheme,
  SearchProvider,
  FontSizeProvider,
  LanguageProvider,
} from '../hooks';
// AppBackground removed; using plain View wrappers
import React, { useEffect } from 'react';
import { AdsProvider } from '../ads/adsManager';
// ads removed
import { ensureDatabase } from '../sql/sqlite';

const StackNavigator = () => {
  const { colors } = useTheme();
  // No auth: show app immediately
  useEffect(() => {
    // Initialize SQLite DB on startup
    ensureDatabase().catch(() => {});
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Global StatusBar using theme */}
      <StatusBar backgroundColor={colors.background} barStyle={colors.statusBarStyle} />
      {
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerTransparent: false,
            headerBlurEffect: 'none',
            headerStyle: {
              backgroundColor: colors.headerBackground,
            },
            animation: 'slide_from_right',
            animationDuration: 300,
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="songDetails" options={{ headerShown: false }} />
          <Stack.Screen name="prayerDetails" options={{ headerShown: false }} />
          <Stack.Screen name="centerDetails" options={{ headerShown: false }} />
          <Stack.Screen name="locationGuide" options={{ headerShown: false }} />
          <Stack.Screen name="favoriteDetails" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="dataSource" options={{ headerShown: false }} />
        </Stack>
      }
    </View>
  );
};

const Layout = () => {
  return (
    <ThemeProvider>
      <FontSizeProvider>
        <LanguageProvider>
          <SearchProvider>
            <AdsProvider>
              <StackNavigator />
            </AdsProvider>
          </SearchProvider>
        </LanguageProvider>
      </FontSizeProvider>
    </ThemeProvider>
  );
};

export default Layout;
