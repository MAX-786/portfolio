import Redis from "ioredis";

let redis: Redis | null = null;

/**
 * Returns a shared Redis client, or null if REDIS_URL is not configured.
 * Fails silently — callers should always have an in-memory / graceful fallback.
 */
export function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  redis = new Redis(url, { maxRetriesPerRequest: 1, lazyConnect: true });
  redis.on("error", () => {});
  return redis;
}
