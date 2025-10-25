import React, { createContext, useContext } from 'react';

interface AdsContextValue {
  trackInteraction: () => void;
  bannerOffset: number;
  setBannerOffset: (h: number) => void;
}

const noop = () => {};

const AdsContext = createContext<AdsContextValue>({
  trackInteraction: noop,
  bannerOffset: 0,
  setBannerOffset: noop,
});

export const useAds = () => useContext(AdsContext);

export const AdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AdsContext.Provider value={{ trackInteraction: noop, bannerOffset: 0, setBannerOffset: noop }}>
      {children}
    </AdsContext.Provider>
  );
};
