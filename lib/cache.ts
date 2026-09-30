import fs from 'fs';
import path from 'path';
import os from 'os';

export interface CachedNewsSnapshot {
  timestamp: number;
  query: string;
  data: {
    status: string;
    totalResults: number;
    articles: Array<{
      title: string;
      description: string;
      url: string;
      urlToImage?: string;
      source: {
        name: string;
        icon?: string;
      };
      publishedAt: string;
    }>;
  };
}

// 24-hour cache window in milliseconds
export const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 86,400,000 ms

// L1 In-Memory Cache
const memoryCache = new Map<string, CachedNewsSnapshot>();

// Determine a writable cache directory (Supports local dev + Vercel / serverless environments)
function getCacheDirectory(): string {
  const localCacheDir = path.join(process.cwd(), '.cache', 'news');
  try {
    if (!fs.existsSync(localCacheDir)) {
      fs.mkdirSync(localCacheDir, { recursive: true });
    }
    fs.accessSync(localCacheDir, fs.constants.W_OK);
    return localCacheDir;
  } catch {
    // Fallback for Vercel / AWS Lambda read-only root filesystems
    const tmpCacheDir = path.join(os.tmpdir(), 'cryow3times_cache');
    try {
      if (!fs.existsSync(tmpCacheDir)) {
        fs.mkdirSync(tmpCacheDir, { recursive: true });
      }
    } catch {}
    return tmpCacheDir;
  }
}

export function normalizeCacheKey(query: string): string {
  return (query || 'cryptocurrency')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, '_');
}

export function getCachedNews(query: string): { hit: boolean; snapshot: CachedNewsSnapshot | null; isStale: boolean } {
  const key = normalizeCacheKey(query);
  const now = Date.now();

  // 1. Check L1 Memory Cache
  if (memoryCache.has(key)) {
    const cached = memoryCache.get(key)!;
    const isExpired = now - cached.timestamp >= CACHE_TTL_MS;
    if (!isExpired) {
      return { hit: true, snapshot: cached, isStale: false };
    }
  }

  // 2. Check L2 Persistent File Cache
  try {
    const cacheDir = getCacheDirectory();
    const filePath = path.join(cacheDir, `${key}.json`);

    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const snapshot: CachedNewsSnapshot = JSON.parse(raw);
      const isExpired = now - snapshot.timestamp >= CACHE_TTL_MS;

      // Populate L1 cache
      memoryCache.set(key, snapshot);

      if (!isExpired) {
        return { hit: true, snapshot, isStale: false };
      } else {
        return { hit: false, snapshot, isStale: true };
      }
    }
  } catch (err) {
    // File read error, treat as cache miss
  }

  return { hit: false, snapshot: memoryCache.get(key) || null, isStale: true };
}

export function setCachedNews(query: string, data: CachedNewsSnapshot['data']): void {
  const key = normalizeCacheKey(query);
  const snapshot: CachedNewsSnapshot = {
    timestamp: Date.now(),
    query,
    data,
  };

  // 1. Set L1 Memory Cache
  memoryCache.set(key, snapshot);

  // 2. Set L2 Persistent File Cache
  try {
    const cacheDir = getCacheDirectory();
    const filePath = path.join(cacheDir, `${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf-8');
  } catch (err) {
    // Silently ignore write errors on read-only environments
  }
}
