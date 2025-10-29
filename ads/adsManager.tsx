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
  // Call on tab/page clicks so we can occasionally show interstitials
  trackInteraction: () => void;
  // Height of banner to offset FABs etc
  bannerOffset: number;
  setBannerOffset: (h: number) => void;
  // True while ads are disabled by reward or other policy
  isAdFree: boolean;
  // Milliseconds left in current ad-free window (0 when inactive)
  adFreeRemainingMs: number;
  // Starts a rewarded ad flow; returns true only when the user earns the reward
  startAdFreeWithReward: () => Promise<boolean>;
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
  adFreeUntilTs: '@ads_disable_until_ts',
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
  // Ad-free (rewarded) state
  const [adFreeUntil, setAdFreeUntil] = useState<number>(0);
  const [nowTick, setNowTick] = useState<number>(Date.now()); // used to recompute remaining time

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

  // Load persisted ad-free state and keep it updated
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.adFreeUntilTs);
        const ts = raw ? parseInt(raw, 10) : 0;
        if (mounted) setAdFreeUntil(ts);
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Re-render when the ad-free window is active so remaining time updates occasionally
  useEffect(() => {
    if (!adFreeUntil) return;
    const interval = setInterval(() => setNowTick(Date.now()), 30_000); // 30s heartbeat
    return () => clearInterval(interval);
  }, [adFreeUntil]);

  // When the ad-free window is set, schedule a timeout to flip it off exactly at expiry
  useEffect(() => {
    if (!adFreeUntil) return;
    const now = Date.now();
    const msLeft = Math.max(0, adFreeUntil - now);
    if (msLeft === 0) return;
    const to = setTimeout(() => {
      setAdFreeUntil(0);
      AsyncStorage.setItem(STORAGE_KEYS.adFreeUntilTs, '0').catch(() => {});
    }, msLeft);
    return () => clearTimeout(to);
  }, [adFreeUntil]);

  // Prepare App Open ad once per fresh app start
  useEffect(() => {
    if (!ready) return;
    const isExpoGo = Constants.appOwnership === 'expo';
    if (isExpoGo) return; // skip in Expo Go
    const mod = googleAdsModRef.current;
    if (!mod) return;
    if (Platform.OS !== 'android') return; // only targeting Android
    // Don't show app-open ads while ad-free
    if (Date.now() < adFreeUntil) return;

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
  // Recalculate if ad-free flips
  useEffect(() => {
    // no-op; dependency used to re-run app-open guard when adFreeUntil changes
  }, [adFreeUntil]);

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
        // Skip counting interactions if we're in an ad-free window
        if (Date.now() < adFreeUntil) return;
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
  }, [ensureInterstitial, adFreeUntil]);

  // Helper to start a rewarded ad flow that unlocks 1 hour ad-free on success
  const startAdFreeWithReward = useCallback(async (): Promise<boolean> => {
    try {
      const isExpoGo = Constants.appOwnership === 'expo';
      if (isExpoGo) return false;
      const mod = googleAdsModRef.current;
      if (!mod) return false;
      if (Platform.OS !== 'android') return false;

      // If already ad-free, simply return true
      if (Date.now() < adFreeUntil) return true;

      const rewarded = mod.RewardedAd.createForAdRequest(ADS.REWARDED);

      let resolvePromise: (v: boolean) => void = () => {};
      let settled = false;
      const outcome = new Promise<boolean>((resolve) => (resolvePromise = resolve));

      const cleanup = () => {
        try {
          rewarded.removeAllListeners();
        } catch {}
      };

      // When loaded, show it
      rewarded.addAdEventListener(mod.AdEventType.LOADED, () => {
        try {
          rewarded.show();
        } catch {
          if (!settled) {
            settled = true;
            cleanup();
            resolvePromise(false);
          }
        }
      });

      // When user earns the reward, grant 1 hour ad-free
      rewarded.addAdEventListener(mod.RewardedAdEventType.EARNED_REWARD, async () => {
        const until = Date.now() + 60 * 60 * 1000; // 1 hour
        setAdFreeUntil(until);
        await AsyncStorage.setItem(STORAGE_KEYS.adFreeUntilTs, String(until));
        if (!settled) {
          settled = true;
          cleanup();
          resolvePromise(true);
        }
      });

      // Closed without reward or after reward; if not settled by reward, resolve false
      rewarded.addAdEventListener(mod.AdEventType.CLOSED, () => {
        if (!settled) {
          settled = true;
          cleanup();
          resolvePromise(false);
        }
      });

      rewarded.addAdEventListener(mod.AdEventType.ERROR, () => {
        if (!settled) {
          settled = true;
          cleanup();
          resolvePromise(false);
        }
      });

      rewarded.load();
      return outcome;
    } catch {
      return false;
    }
  }, [adFreeUntil]);

  const isAdFree = Date.now() < adFreeUntil;
  const adFreeRemainingMs = Math.max(0, adFreeUntil - nowTick);

  const value = useMemo(
    () => ({
      trackInteraction,
      bannerOffset,
      setBannerOffset,
      isAdFree,
      adFreeRemainingMs,
      startAdFreeWithReward,
    }),
    [trackInteraction, bannerOffset, isAdFree, adFreeRemainingMs, startAdFreeWithReward]
  );

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
};
