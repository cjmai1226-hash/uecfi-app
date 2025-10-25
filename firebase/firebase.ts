// firebase.ts
// NOTE: Firestore reads are no longer used for Songs/Prayers/Centers.
// We keep minimal Firestore setup only for write helpers (submissions/reports).
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, initializeFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {} as any);

// Storage helpers removed (unused in current app)

// Auth helpers removed
/**
 * One-time fetch for a collection with cache fallback.
 * - Reads AsyncStorage cache (and Firestore local cache via helper) first.
 * - Returns cache if it's newer than CACHE_TTL_MS.
 * - Otherwise performs a single getDocs() request, updates the cache, and returns the fresh data.
 */
export async function listenToCollection(_collectionName: string): Promise<any[]> {
  return [];
}

/** Listen to a collection ordered by a given field (ascending) */
/** One-time fetch for a collection ordered by a given field (ascending) with cache fallback. */
export async function listenToCollectionByField(
  _collectionName: string,
  _field: string
): Promise<any[]> {
  return [];
}

// New function names preferred by app code: one-time loaders
export async function loadCollectionOnce(_collectionName: string): Promise<any[]> {
  return [];
}

export async function loadCollectionOnceByField(
  _collectionName: string,
  _field: string
): Promise<any[]> {
  return [];
}

/**
 * Read cached collection data from AsyncStorage.
 * Returns null when no cache is available.
 */
export const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours default

export type CachedCollection = { data: any[]; cachedAt: number };

/**
 * Read cached collection data from AsyncStorage.
 * Returns null when no cache is available.
 */
export async function getCachedCollection(
  collectionName: string
): Promise<CachedCollection | null> {
  try {
    const raw = await AsyncStorage.getItem(`cache:${collectionName}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.data) || typeof parsed.cachedAt !== 'number') return null;
    return parsed as CachedCollection;
  } catch (e) {
    console.warn('Failed to read cache for', collectionName, e);
    return null;
  }
}

// Helper: report cache presence, age, and freshness
export type CacheStatus = {
  hasCache: boolean;
  cachedAt: number | null;
  ageMs: number | null;
  isFresh: boolean; // age < CACHE_TTL_MS
};

export async function getCacheStatus(collectionName: string): Promise<CacheStatus> {
  const cached = await getCachedCollection(collectionName);
  if (!cached) {
    return { hasCache: false, cachedAt: null, ageMs: null, isFresh: false };
  }
  const ageMs = Date.now() - cached.cachedAt;
  return { hasCache: true, cachedAt: cached.cachedAt, ageMs, isFresh: ageMs < CACHE_TTL_MS };
}

// Fallback-aware getter: try AsyncStorage first, then Firestore local cache.
export async function getCachedCollectionWithFallback(
  _collectionName: string
): Promise<CachedCollection | null> {
  return null;
}

/**
 * Generic one-time fetch for any collection. Useful for pull-to-refresh.
 */
export async function fetchCollection(_collectionName: string): Promise<any[]> {
  return [];
}

/** Fetch collection ordered by a specific field (ascending) */
export async function fetchCollectionByField(
  _collectionName: string,
  _field: string
): Promise<any[]> {
  return [];
}

// -------- Lightweight Sync via SyncQueue --------

export async function syncCollection(
  _collectionName: string
): Promise<{ updatesApplied: number; entriesProcessed: number }> {
  return { updatesApplied: 0, entriesProcessed: 0 };
}

// ----- Meta helpers: Meta/{collectionName} -> { updatedAt: serverTimestamp }
export async function getMetaUpdatedAt(_collectionName: string): Promise<number> {
  return 0;
}

// Public helper: does this collection have pending updates since last sync?
export async function hasPendingUpdates(_collectionName: string): Promise<boolean> {
  return false;
}

// Removed unused admin/web song fetcher

// Removed unused User record types and helpers

export type SubmitPayload = {
  title: string;
  author: string;
  content: string;
  type: string;
  submittedAt: Date;
};

export async function addSubmission(payload: SubmitPayload): Promise<string> {
  try {
    const ref = await addDoc(collection(db, 'Submits'), payload as any);
    return ref.id;
  } catch (e) {
    console.error('addSubmission error', e);
    throw e;
  }
}

// Centro Contacts collection helpers
export type CentroContactPayload = {
  name: string;
  number?: string; // phone number
  role?: string;
  center: string;
  address?: string;
};

export async function addCentroContact(payload: CentroContactPayload): Promise<string> {
  try {
    const ref = await addDoc(collection(db, 'Centro Contacts'), payload as any);
    return ref.id;
  } catch (e) {
    console.error('addCentroContact error', e);
    throw e;
  }
}

// Centro Reports collection helpers
export type CentroReportPayload = {
  center: string;
  address: string;
  district: string; // e.g., DISTRICT 3 or FOREIGN-BASED
  status: 'active' | 'inactive' | 'unknown';
  lat?: number;
  lng?: number;
  gpsLink?: string; // original raw value if provided
  submittedAt: Date;
};

export async function addCentroReport(payload: CentroReportPayload): Promise<string> {
  try {
    const ref = await addDoc(collection(db, 'Centro Reports'), payload as any);
    return ref.id;
  } catch (e) {
    console.error('addCentroReport error', e);
    throw e;
  }
}
