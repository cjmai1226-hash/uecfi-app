import * as StoreReview from 'expo-store-review';
import Constants from 'expo-constants';
import { Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Prompt the user to rate the app using expo-store-review.
 *
 * Strategy:
 * 1) If in-app review is available and has action, show native prompt.
 * 2) Else try to open configured store URL.
 * 3) Else, on Android, build a Play Store URL from the package and open that.
 */
export async function promptStoreReview(): Promise<'in-app' | 'store' | 'unavailable' | 'error'> {
  try {
    const isAvailable = await StoreReview.isAvailableAsync();
    const canShow = await StoreReview.hasAction();

    if (isAvailable && canShow) {
      await StoreReview.requestReview();
      return 'in-app';
    }

    const url = StoreReview.storeUrl();
    if (url) {
      await Linking.openURL(url);
      return 'store';
    }

    if (Platform.OS === 'android') {
      const pkg = Constants?.expoConfig?.android?.package;
      if (pkg) {
        const marketUrl = `market://details?id=${pkg}&showAllReviews=true`;
        const webUrl = `https://play.google.com/store/apps/details?id=${pkg}&showAllReviews=true`;
        try {
          await Linking.openURL(marketUrl);
        } catch {
          await Linking.openURL(webUrl);
        }
        return 'store';
      }
    }

    return 'unavailable';
  } catch {
    return 'error';
  }
}

/** Open the public store listing for this app without attempting in-app review. */
export async function openStoreListing(): Promise<'store' | 'unavailable' | 'error'> {
  try {
    const url = StoreReview.storeUrl();
    if (url) {
      await Linking.openURL(url);
      return 'store';
    }
    if (Platform.OS === 'android') {
      const pkg = Constants?.expoConfig?.android?.package;
      if (pkg) {
        const marketUrl = `market://details?id=${pkg}`;
        const webUrl = `https://play.google.com/store/apps/details?id=${pkg}`;
        try {
          await Linking.openURL(marketUrl);
        } catch {
          await Linking.openURL(webUrl);
        }
        return 'store';
      }
    }
    return 'unavailable';
  } catch {
    return 'error';
  }
}

const REVIEW_PROMPTED_KEY = '@review_prompted_v1';

export async function hasPromptedReview(): Promise<boolean> {
  try {
    const v = await AsyncStorage.getItem(REVIEW_PROMPTED_KEY);
    return v === '1';
  } catch {
    return false;
  }
}

export async function markPromptedReview(): Promise<void> {
  try {
    await AsyncStorage.setItem(REVIEW_PROMPTED_KEY, '1');
  } catch {}
}

/**
 * Attempt to show the in-app review prompt once in the app lifetime.
 * Returns true if a prompt was attempted in this call.
 */
export async function maybeAskForReview(): Promise<boolean> {
  if (await hasPromptedReview()) return false;
  const result = await promptStoreReview();
  await markPromptedReview();
  return result === 'in-app' || result === 'store';
}
