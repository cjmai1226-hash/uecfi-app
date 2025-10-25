// Firebase Auth declarations removed

// Expo public env typing for ads flag
declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_ADS_ENABLED?: string; // 'true' to enable ads
  }
}
