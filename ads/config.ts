// Centralized Ad Unit IDs
// Replace with your production IDs (provided by the user)
export const ADS = {
  APP_ID: 'ca-app-pub-8333503696162383~7377199936',
  APP_OPEN: 'ca-app-pub-8333503696162383/6568977735',
  BANNER: 'ca-app-pub-8333503696162383/3218562105',
  INTERSTITIAL: 'ca-app-pub-8333503696162383/2600010816',
  REWARDED: 'ca-app-pub-8333503696162383/2397376314',
} as const;

// Frequency to show interstitial after N interactions
export const INTERSTITIAL_FREQUENCY = 10; // show after 10 clicks

// Only count an interaction if at least this much time has passed since the last counted one
export const INTERACTION_COOLDOWN_MS = 20_000; // 20 seconds
