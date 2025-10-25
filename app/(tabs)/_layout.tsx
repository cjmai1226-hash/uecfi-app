import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, useSearch } from '../../hooks';
import { useAds } from '../../ads/adsManager';
import { useEffect } from 'react';
import { DynamicHeader } from '../../components/DynamicHeader';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  any,
  MaterialTopTabNavigationEventMap
>(Navigator);

const Layout = () => {
  const { colors } = useTheme();
  const { clearSearch } = useSearch();
  const { trackInteraction } = useAds();

  useEffect(() => {}, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.headerBackground }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.headerBackground }}>
        <DynamicHeader />
      </SafeAreaView>
      <MaterialTopTabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarIndicatorStyle: {
            backgroundColor: colors.tabActive,
            height: 3,
          },
          tabBarStyle: {
            backgroundColor: colors.headerBackground,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            borderTopWidth: 0,
            paddingBottom: 5,
            paddingTop: 0,
          },
          animationEnabled: true,
          swipeEnabled: true,
          tabBarPressColor: colors.surface,
          tabBarPressOpacity: 0.8,
        }}
        screenListeners={{
          tabPress: () => {
            // Count tab press as an interaction towards interstitial
            trackInteraction();
          },
          focus: () => {
            // Clear search when switching tabs so the new tab starts fresh
            clearSearch();
            trackInteraction();
          },
        }}>
        <MaterialTopTabs.Screen
          name="prayers"
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'book' : 'book-outline'}
                size={24}
                color={focused ? colors.tabActive : colors.tabInactive}
              />
            ),
          }}
        />
        <MaterialTopTabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'musical-notes' : 'musical-notes-outline'}
                size={24}
                color={focused ? colors.tabActive : colors.tabInactive}
              />
            ),
          }}
        />
        <MaterialTopTabs.Screen
          name="bookmark"
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'heart' : 'heart-outline'}
                size={24}
                color={focused ? colors.tabActive : colors.tabInactive}
              />
            ),
          }}
        />
        <MaterialTopTabs.Screen
          name="centers"
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'list' : 'list-outline'}
                size={24}
                color={focused ? colors.tabActive : colors.tabInactive}
              />
            ),
          }}
        />
      </MaterialTopTabs>
    </View>
  );
};

// styles removed

export default Layout;
