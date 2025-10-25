import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADS, INTERSTITIAL_FREQUENCY, INTERACTION_COOLDOWN_MS } from './config';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Context provides interaction tracking and ad triggers
interface AdsContextValue {
  trackInteraction: () => void; // call on tab/page clicks
  bannerOffset: number; // height of banner to offset FABs etc
  setBannerOffset: (h: number) => void;
}

const AdsContext = createContext<AdsContextValue | null>(null);

export const useAds = () => {
  const ctx = useContext(AdsContext);
  if (!ctx) throw new Error('useAds must be used within AdsProvider');
  return ctx;
};

// Keys for persistence to avoid app-open loops
const STORAGE_KEYS = {
  lastAppOpenShown: '@ads_last_app_open_shown',
  interactionCount: '@ads_interaction_count',
  lastInteractionTs: '@ads_last_interaction_ts',
};

// Helper with 1-day TTL to avoid showing app-open repeatedly on first launch
const APP_OPEN_COOLDOWN_MS = 1000 * 60 * 60 * 12; // 12 hours

export const AdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bannerOffset, setBannerOffset] = useState(0);
  // Hold references to the dynamically imported module and ad instances
  const googleAdsModRef = useRef<null | typeof import('react-native-google-mobile-ads')>(null);
  const interstitialRef = useRef<any>(null);
  const appOpenRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  // Initialize the SDK once
  useEffect(() => {
    // In Expo Go, the native module isn't present; skip initialization
    const isExpoGo = Constants.appOwnership === 'expo';
    if (isExpoGo) {
      setReady(true);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const mod = await import('react-native-google-mobile-ads');
        if (cancelled) return;
        googleAdsModRef.current = mod;
        await mod.default().initialize();
      } catch {
        // no-op; proceed without blocking UI
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Prepare App Open ad once per fresh app start
  useEffect(() => {
    if (!ready) return;
    const isExpoGo = Constants.appOwnership === 'expo';
    if (isExpoGo) return; // skip in Expo Go
    const mod = googleAdsModRef.current;
    if (!mod) return;
    if (Platform.OS !== 'android') return; // only targeting Android

    const loadAndMaybeShow = async () => {
      try {
        const last = await AsyncStorage.getItem(STORAGE_KEYS.lastAppOpenShown);
        const lastTs = last ? parseInt(last, 10) : 0;
        const now = Date.now();
        if (lastTs && now - lastTs < APP_OPEN_COOLDOWN_MS) {
          return; // within cooldown window
        }
        const appOpen = mod.AppOpenAd.createForAdRequest(ADS.APP_OPEN);
        appOpenRef.current = appOpen;

        const unsubscribe = appOpen.addAdEventListener(mod.AdEventType.LOADED, () => {
          try {
            appOpen.show();
            AsyncStorage.setItem(STORAGE_KEYS.lastAppOpenShown, String(Date.now()));
          } catch {}
        });

        const unsubClose = appOpen.addAdEventListener(mod.AdEventType.CLOSED, () => {
          unsubscribe();
          unsubClose();
        });

        appOpen.load();
      } catch {}
    };

    loadAndMaybeShow();
  }, [ready]);

  // Interstitial logic: show after N interactions
  const ensureInterstitial = useCallback(() => {
    if (interstitialRef.current) return;
    const mod = googleAdsModRef.current;
    if (!mod) return;
    interstitialRef.current = mod.InterstitialAd.createForAdRequest(ADS.INTERSTITIAL);
  }, []);

  useEffect(() => {
    ensureInterstitial();
  }, [ensureInterstitial]);

  const trackInteraction = useCallback(() => {
    (async () => {
      try {
        ensureInterstitial();
        const mod = googleAdsModRef.current;
        const isExpoGo = Constants.appOwnership === 'expo';
        if (isExpoGo || !mod) return; // skip in Expo Go or if module missing
        // Enforce cooldown between counted interactions
        const [rawCount, rawTs] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.interactionCount),
          AsyncStorage.getItem(STORAGE_KEYS.lastInteractionTs),
        ]);
        const current = rawCount ? parseInt(rawCount, 10) : 0;
        const lastTs = rawTs ? parseInt(rawTs, 10) : 0;
        const now = Date.now();

        // If within cooldown, do not count this interaction
        if (lastTs && now - lastTs < INTERACTION_COOLDOWN_MS) {
          return;
        }

        const next = current + 1;
        if (next >= INTERSTITIAL_FREQUENCY) {
          const interstitial = interstitialRef.current!;
          const onLoaded = () => {
            try {
              interstitial.show();
            } catch {}
          };
          const onClosed = () => {
            interstitial.removeAllListeners();
            interstitialRef.current = null; // create a fresh one next time
            ensureInterstitial();
          };
          interstitial.addAdEventListener(mod.AdEventType.LOADED, onLoaded);
          interstitial.addAdEventListener(mod.AdEventType.CLOSED, onClosed);
          interstitial.load();
          await Promise.all([
            AsyncStorage.setItem(STORAGE_KEYS.interactionCount, '0'),
            AsyncStorage.setItem(STORAGE_KEYS.lastInteractionTs, String(now)),
          ]);
        } else {
          await Promise.all([
            AsyncStorage.setItem(STORAGE_KEYS.interactionCount, String(next)),
            AsyncStorage.setItem(STORAGE_KEYS.lastInteractionTs, String(now)),
          ]);
        }
      } catch {}
    })();
  }, [ensureInterstitial]);

  const value = useMemo(
    () => ({ trackInteraction, bannerOffset, setBannerOffset }),
    [trackInteraction, bannerOffset]
  );

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
};
