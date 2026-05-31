import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";
import type { AnalyticsStats, AnalyticsStore, AnalyticsTrackPayload } from "./types";
import { emptyStore } from "./types";
import { applyAnalyticsEvent } from "./aggregate";

const STORE_KEY = "tagarshan:analytics:store";
const ANALYTICS_DIR = path.join(process.cwd(), ".analytics");
const ANALYTICS_FILE = path.join(ANALYTICS_DIR, "stats.json");

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function readFileStore(): Promise<AnalyticsStore> {
  try {
    const raw = await fs.readFile(ANALYTICS_FILE, "utf-8");
    return { ...emptyStore(), ...(JSON.parse(raw) as AnalyticsStore) };
  } catch {
    return emptyStore();
  }
}

async function writeFileStore(store: AnalyticsStore): Promise<void> {
  await fs.mkdir(ANALYTICS_DIR, { recursive: true });
  await fs.writeFile(ANALYTICS_FILE, JSON.stringify(store, null, 2), "utf-8");
}

async function readStore(): Promise<{ store: AnalyticsStore; storage: AnalyticsStats["storage"] }> {
  const redis = getRedis();
  if (redis) {
    const store = (await redis.get<AnalyticsStore>(STORE_KEY)) ?? emptyStore();
    return { store, storage: "redis" };
  }

  if (process.env.NODE_ENV === "development") {
    return { store: await readFileStore(), storage: "file" };
  }

  return { store: emptyStore(), storage: "none" };
}

async function saveStore(store: AnalyticsStore, storage: AnalyticsStats["storage"]): Promise<void> {
  if (storage === "redis") {
    const redis = getRedis();
    if (!redis) return;
    await redis.set(STORE_KEY, store);
    return;
  }

  if (storage === "file") {
    await writeFileStore(store);
  }
}

export async function recordAnalyticsEvent(
  payload: AnalyticsTrackPayload,
): Promise<{ ok: boolean; storage: AnalyticsStats["storage"] }> {
  const { store, storage } = await readStore();

  if (storage === "none") {
    return { ok: false, storage };
  }

  const updated = applyAnalyticsEvent(store, payload);
  await saveStore(updated, storage);
  return { ok: true, storage };
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const { store, storage } = await readStore();

  const daily = Object.entries(store.daily)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 30)
    .map(([date, values]) => ({
      date,
      visits: values.visits,
      pageViews: values.pageViews,
    }));

  const topPages = Object.entries(store.pages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  const topFeatures = Object.entries(store.features)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([feature, count]) => ({ feature, count }));

  return {
    totalVisits: store.totalVisits,
    uniqueSessions: store.sessions.length,
    totalPageViews: store.totalPageViews,
    totalFeatureUses: store.totalFeatureUses,
    topPages,
    topFeatures,
    daily,
    storage,
    updatedAt: new Date().toISOString(),
  };
}

export function isAnalyticsConfigured(): boolean {
  if (getRedis()) return true;
  return process.env.NODE_ENV === "development";
}

export function verifyAdminSecret(provided: string | null): boolean {
  const secret = process.env.ADMIN_STATS_SECRET;
  if (!secret) return process.env.NODE_ENV === "development";
  return Boolean(provided && provided === secret);
}
