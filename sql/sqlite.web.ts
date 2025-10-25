// Web stub for SQLite access. Expo's SQLite module requires a WASM worker on web,
// which we avoid by providing no-op implementations here. The app will render
// without data on web, but works fully on Android/iOS via sqlite.ts.

export async function ensureDatabase(): Promise<null> {
  return null;
}

export async function getAllSongs() {
  return [] as any[];
}

export async function getAllPrayers() {
  return [] as any[];
}

export async function getAllCenters() {
  return [] as any[];
}

export async function getCounts() {
  return { songs: 0, prayers: 0, centers: 0 };
}
