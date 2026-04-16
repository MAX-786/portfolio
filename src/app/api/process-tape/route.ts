import Redis from "ioredis";

const REPO = "MAX-786/process-tape";
const FILE_PATH = "entries.json";
const CACHE_KEY = "process-tape:v5";
const CACHE_TTL = 3600;

let redis: Redis | null = null;
function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  redis = new Redis(url, { maxRetriesPerRequest: 1, lazyConnect: true });
  redis.on("error", () => {});
  return redis;
}

export interface TapeEntry {
  date: string;
  project: string;
  text: string;
  tags?: string[];
}

async function fetchEntries(): Promise<TapeEntry[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3.raw",
    "User-Agent": "mkhismkh-portfolio",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
      { headers, cache: "no-store" }
    );
    if (!res.ok) return [];
    const data: TapeEntry[] = await res.json();
    if (!Array.isArray(data)) return [];
    return data.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export async function GET() {
  const client = getRedis();

  if (client) {
    try {
      const cached = await client.get(CACHE_KEY);
      if (cached) return Response.json(JSON.parse(cached));
    } catch { /* fall through */ }
  }

  const entries = await fetchEntries();

  if (client && entries.length > 0) {
    try {
      await client.set(CACHE_KEY, JSON.stringify(entries), "EX", CACHE_TTL);
    } catch { /* silent */ }
  }

  return Response.json(entries);
}
