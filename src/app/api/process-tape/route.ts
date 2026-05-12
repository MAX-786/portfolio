import Redis from "ioredis";
import { NextRequest } from "next/server";

const REPO = "MAX-786/process-tape";
const META_CACHE_KEY = "process-tape:meta";
const LOG_CACHE_PREFIX = "process-tape:log:";
const META_CACHE_TTL = 3600;   // 1 hour
const LOG_CACHE_TTL = 86400;   // 24 hours — daily logs are immutable once written
const DEFAULT_PAGE_SIZE = 10;

let redis: Redis | null = null;
function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  redis = new Redis(url, { maxRetriesPerRequest: 1, lazyConnect: true });
  redis.on("error", () => {});
  return redis;
}

interface DailyLog {
  date: string;
  projects_touched: string[];
  summary: string;
  highlights: string[];
  tags: string[];
}

interface MetaJson {
  days: string[];       // sorted newest-first
  total_entries: number;
  total_days: number;
}

export interface TapeEntry {
  date: string;
  project: string;       // derived: projects_touched.join(", ")
  text: string;          // derived: summary
  tags?: string[];
  highlights?: string[];
}

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3.raw",
    "User-Agent": "mkhismkh-portfolio",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchMeta(): Promise<MetaJson | null> {
  const client = getRedis();
  if (client) {
    try {
      const cached = await client.get(META_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch { /* fall through */ }
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/meta.json`,
      { headers: githubHeaders(), cache: "no-store" }
    );
    if (!res.ok) return null;
    const data: MetaJson = await res.json();
    if (client) {
      try {
        await client.set(META_CACHE_KEY, JSON.stringify(data), "EX", META_CACHE_TTL);
      } catch { /* silent */ }
    }
    return data;
  } catch {
    return null;
  }
}

async function fetchLogEntry(date: string): Promise<TapeEntry | null> {
  const cacheKey = LOG_CACHE_PREFIX + date;
  const client = getRedis();

  if (client) {
    try {
      const cached = await client.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch { /* fall through */ }
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/logs/${date}.json`,
      { headers: githubHeaders(), cache: "no-store" }
    );
    if (!res.ok) return null;
    const log: DailyLog = await res.json();
    const entry: TapeEntry = {
      date: log.date,
      project: log.projects_touched.length > 0 ? log.projects_touched.join(", ") : "misc",
      text: log.summary,
      tags: log.tags,
      highlights: log.highlights,
    };
    if (client) {
      try {
        await client.set(cacheKey, JSON.stringify(entry), "EX", LOG_CACHE_TTL);
      } catch { /* silent */ }
    }
    return entry;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10));
  const limit = Math.min(
    20,
    Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_PAGE_SIZE), 10))
  );

  const meta = await fetchMeta();
  if (!meta) {
    return Response.json({ entries: [], total: 0, hasMore: false, nextPage: null });
  }

  const days = meta.days; // newest-first, maintained by build_meta.py
  const total = days.length;
  const start = page * limit;
  const slice = days.slice(start, start + limit);
  const hasMore = start + limit < total;

  const entries = (
    await Promise.all(slice.map((date) => fetchLogEntry(date)))
  ).filter(Boolean) as TapeEntry[];

  return Response.json({
    entries,
    total,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
  });
}
