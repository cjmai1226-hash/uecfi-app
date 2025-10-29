import React, { useEffect, useMemo, useState } from 'react';
import { Platform, View } from 'react-native';
import { ADS } from './config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAds } from './adsManager';
import Constants from 'expo-constants';

// A persistent bottom banner that respects safe-area and notifies FABs for offset
export const BottomBannerAd: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { setBannerOffset, isAdFree } = useAds();
  const [height, setHeight] = useState(0);
  const [BannerAdComp, setBannerAdComp] = useState<null | (typeof import('react-native-google-mobile-ads'))['BannerAd']>(null);
  const [BannerAdSizeVal, setBannerAdSizeVal] = useState<null | (typeof import('react-native-google-mobile-ads'))['BannerAdSize']>(null);
  const isExpoGo = Constants.appOwnership === 'expo';

  useEffect(() => {
    setBannerOffset(height);
    return () => setBannerOffset(0);
  }, [height, setBannerOffset]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (Platform.OS !== 'android' || isExpoGo) return;
        const mod = await import('react-native-google-mobile-ads');
        if (cancelled) return;
        setBannerAdComp(() => mod.BannerAd);
        setBannerAdSizeVal(mod.BannerAdSize);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (Platform.OS !== 'android' || isExpoGo) return null;

  // While ad-free is active, make sure offset is cleared and don't render the ad
  if (isAdFree) {
    if (height !== 0) setHeight(0);
    setBannerOffset(0);
    return null;
  }

  if (!BannerAdComp || !BannerAdSizeVal) return null;

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: insets.bottom,
        backgroundColor: 'transparent',
        alignItems: 'center',
      }}>
      <BannerAdComp
        unitId={ADS.BANNER}
        size={BannerAdSizeVal.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => {
          // Adaptive banner height is automatic; estimate 50-100
          setHeight(100 + insets.bottom);
        }}
        onAdFailedToLoad={() => setHeight(0)}
      />
    </View>
  );
};
