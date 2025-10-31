import { View } from 'react-native';
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
import { useNavigation } from 'expo-router';

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
  const navigation = useNavigation();

  useEffect(() => {}, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.headerBackground }}>
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
        screenListeners={({ route }) => ({
          tabPress: () => {
            // Count tab press as an interaction towards interstitial
            trackInteraction();
          },
          focus: () => {
            // Clear search when switching tabs so the new tab starts fresh
            clearSearch();
            trackInteraction();
            // Update the Stack header title to reflect the active tab
            const label = route.name === 'prayers'
              ? 'Prayers'
              : route.name === 'bookmark'
              ? 'Bookmarks'
              : route.name === 'centers'
              ? 'Centers'
              : 'Songs';
            // This triggers a Stack header update; the custom header still renders DynamicHeader
            navigation.setOptions({ headerTitle: label });
          },
        })}>
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
