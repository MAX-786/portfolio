import Redis from "ioredis";

const LOG_KEY = "briefing:log";
const memLog: { input: string; ts: number }[] = [];

let redis: Redis | null = null;
function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  redis = new Redis(url, { maxRetriesPerRequest: 1, lazyConnect: true });
  redis.on("error", () => {});
  return redis;
}

function sanitize(raw: string): string {
  return raw.trim().slice(0, 200).replace(/[<>]/g, "");
}

export async function POST(request: Request) {
  try {
    const { input } = await request.json();
    if (!input || typeof input !== "string") {
      return Response.json({ ok: false }, { status: 400 });
    }

    const clean = sanitize(input);
    if (!clean) return Response.json({ ok: false }, { status: 400 });

    const entry = JSON.stringify({ input: clean, ts: Date.now() });

    const client = getRedis();
    if (client) {
      await client.lpush(LOG_KEY, entry).catch(() => {});
    }

    if (memLog.length >= 500) memLog.shift();
    memLog.push(JSON.parse(entry));

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const secret = request.headers.get("x-log-secret");
  if (secret !== process.env.LOG_SECRET) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const client = getRedis();
  if (client) {
    try {
      const raw = await client.lrange(LOG_KEY, 0, 99);
      const entries = raw.map((r) => {
        try { return JSON.parse(r); } catch { return r; }
      });
      return Response.json({ entries, source: "redis" });
    } catch {
      // fall through to in-memory
    }
  }

  return Response.json({ entries: memLog, source: "memory" });
}
