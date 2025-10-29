import React, { createContext, useContext } from 'react';

interface AdsContextValue {
  trackInteraction: () => void;
  bannerOffset: number;
  setBannerOffset: (h: number) => void;
  isAdFree: boolean;
  adFreeRemainingMs: number;
  startAdFreeWithReward: () => Promise<boolean>;
}

const noop = () => {};

const AdsContext = createContext<AdsContextValue>({
  trackInteraction: noop,
  bannerOffset: 0,
  setBannerOffset: noop,
  isAdFree: false,
  adFreeRemainingMs: 0,
  startAdFreeWithReward: async () => false,
});

export const useAds = () => useContext(AdsContext);

export const AdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AdsContext.Provider
      value={{
        trackInteraction: noop,
        bannerOffset: 0,
        setBannerOffset: noop,
        isAdFree: false,
        adFreeRemainingMs: 0,
        startAdFreeWithReward: async () => false,
      }}>
      {children}
    </AdsContext.Provider>
  );
};
