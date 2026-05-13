import { NextRequest } from "next/server";
import { getRedis } from "@/lib/redis";

const REPO = "MAX-786/process-tape";
const META_CACHE_KEY = "process-tape:meta";
const LOG_CACHE_PREFIX = "process-tape:log:";
const META_CACHE_TTL = 300;    // 5 minutes — new days appear quickly
const LOG_CACHE_TTL = 86400;   // 24 hours — past logs are immutable
const TODAY_LOG_CACHE_TTL = 300; // 5 minutes — today's log is still being written
const DEFAULT_PAGE_SIZE = 10;

function getTodayUTC(): string {
  return new Date().toISOString().slice(0, 10);
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
        const ttl = date === getTodayUTC() ? TODAY_LOG_CACHE_TTL : LOG_CACHE_TTL;
        await client.set(cacheKey, JSON.stringify(entry), "EX", ttl);
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

  // ?revalidate=1 + correct secret flushes all process-tape Redis keys immediately
  const revalidate = searchParams.get("revalidate") === "1";
  const secret = request.headers.get("x-log-secret");
  if (revalidate && secret === process.env.LOG_SECRET) {
    const client = getRedis();
    if (client) {
      try {
        const keys = await client.keys("process-tape:*");
        if (keys.length) await client.del(...keys);
      } catch { /* silent */ }
    }
  }

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
