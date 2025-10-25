import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';

// Prepopulated DB copied from app bundle to the sandbox on first run
const DB_NAME = 'uecfi.db';
// Ensure bundler includes the asset
// File is at lib/uecfi.db relative to this module

const DB_ASSET = require('../assets/db/uecfi.db');

let dbPromise: Promise<SQLite.SQLiteDatabase | null> | null = null;

export async function ensureDatabase(): Promise<SQLite.SQLiteDatabase | null> {
  if (Platform.OS === 'web') {
    // SQLite is not supported on web in Expo
    return null;
  }
  if (dbPromise) return dbPromise;
  dbPromise = (async () => {
    try {
      const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
      // Make sure the directory exists
      try {
        await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
      } catch {}

      const dbFileUri = `${sqliteDir}/${DB_NAME}`;
      const info = await FileSystem.getInfoAsync(dbFileUri);
      if (!info.exists) {
        // Copy bundled asset to the SQLite directory
        const asset = Asset.fromModule(DB_ASSET);
        await asset.downloadAsync();
        if (!asset.localUri) {
          throw new Error('Failed to resolve bundled DB asset URI');
        }
        await FileSystem.copyAsync({ from: asset.localUri, to: dbFileUri });
      }
      const db = SQLite.openDatabaseSync(DB_NAME);
      return db;
    } catch (e) {
      console.warn('SQLite initialization failed, falling back to empty dataset.', e);
      return null;
    }
  })();
  return dbPromise;
}

type Row = Record<string, any>;

function normalizeId<T extends Row>(row: T): T & { id: string } {
  const anyRow = row as any;
  const id = anyRow.id ?? anyRow._id ?? anyRow.docId ?? anyRow.key;
  return { ...(row as Row), id: String(id ?? '') } as T & { id: string };
}

// Generic helpers using modern async helpers
async function getAll<T extends Row>(
  sql: string,
  params: any[] = []
): Promise<(T & { id: string })[]> {
  const db = await ensureDatabase();
  if (!db) return [];
  const rows = await db.getAllAsync<Row>(sql, params);
  return rows.map((r: Row) => normalizeId<T>(r as T));
}

async function getCount(sql: string, params: any[] = []): Promise<number> {
  const db = await ensureDatabase();
  if (!db) return 0;
  const row = await db.getFirstAsync<{ count: number }>(sql, params);
  return row?.count ?? 0;
}

// Domain APIs
export async function getAllSongs() {
  // If table/column names differ slightly, SELECT * keeps flexibility
  return getAll('SELECT * FROM Songs ORDER BY title COLLATE NOCASE ASC');
}

export async function getAllPrayers() {
  // Sort by page if present, then title
  return getAll('SELECT * FROM Prayers');
}

export async function getAllCenters() {
  // Try numeric sort on district when possible, fallback to center name
  return getAll(
    'SELECT * FROM Centers ORDER BY CAST(district AS INTEGER) ASC, center COLLATE NOCASE ASC'
  );
}

export async function getCounts() {
  const [songs, prayers, centers] = await Promise.all([
    getCount('SELECT COUNT(*) as count FROM Songs'),
    getCount('SELECT COUNT(*) as count FROM Prayers'),
    getCount('SELECT COUNT(*) as count FROM Centers'),
  ]);
  return { songs, prayers, centers };
}

export type DbDiagnostics = {
  platform: string;
  assetResolved: boolean;
  copiedPath?: string;
  dbOpened: boolean;
  tables: {
    name: 'songs' | 'prayers' | 'centers';
    exists: boolean;
    count?: number;
    sampleColumns?: string[];
  }[];
  errors: string[];
};

export async function runDiagnostics(): Promise<DbDiagnostics> {
  const errors: string[] = [];
  const tables: DbDiagnostics['tables'] = [
    { name: 'songs', exists: false },
    { name: 'prayers', exists: false },
    { name: 'centers', exists: false },
  ];
  let assetResolved = false;
  let copiedPath: string | undefined;
  let dbOpened = false;

  try {
    const asset = Asset.fromModule(DB_ASSET);
    await asset.downloadAsync();
    assetResolved = !!asset.localUri;
  } catch (e: any) {
    errors.push(`Asset resolution failed: ${e?.message || String(e)}`);
  }

  const db = await ensureDatabase();
  if (!db) {
    errors.push('ensureDatabase returned null (likely Web platform or init error).');
    return { platform: Platform.OS, assetResolved, copiedPath, dbOpened, tables, errors };
  }
  dbOpened = true;

  try {
    // Determine the on-disk DB path we copied to
    // Note: This mirrors ensureDatabase logic

    const dir = `${FileSystem.documentDirectory}SQLite`;
    copiedPath = `${dir}/${DB_NAME}`;
  } catch {}

  try {
    const masterRows = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('Songs','Prayers','Centers')"
    );
    const present = new Set(masterRows.map((r) => r.name));
    for (const t of tables) {
      t.exists = present.has(t.name);
      if (t.exists) {
        try {
          const cnt = await db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM ${t.name}`
          );
          t.count = cnt?.count ?? 0;
        } catch (e: any) {
          errors.push(`${t.name} count failed: ${e?.message || String(e)}`);
        }
        try {
          const row = await db.getFirstAsync<Record<string, any>>(
            `SELECT * FROM ${t.name} LIMIT 1`
          );
          t.sampleColumns = row ? Object.keys(row) : [];
        } catch (e: any) {
          errors.push(`${t.name} sample read failed: ${e?.message || String(e)}`);
        }
      }
    }
  } catch (e: any) {
    errors.push(`sqlite_master query failed: ${e?.message || String(e)}`);
  }

  return { platform: Platform.OS, assetResolved, copiedPath, dbOpened, tables, errors };
}
