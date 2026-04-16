import Redis from "ioredis";

const GITHUB_USER = "MAX-786";
const CACHE_KEY = "github:events";
const CACHE_TTL = 3600; // 1 hour

let redis: Redis | null = null;
function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  redis = new Redis(url, { maxRetriesPerRequest: 1, lazyConnect: true });
  redis.on("error", () => {});
  return redis;
}

interface GitHubEvent {
  type: string;
  repo: { name: string };
  payload: Record<string, unknown>;
  created_at: string;
}

interface FingerprintEntry {
  date: string;
  action: string;
  repo: string;
  detail: string;
}

const RELEVANT_TYPES = new Set([
  "PushEvent",
  "PullRequestEvent",
  "CreateEvent",
  "IssueCommentEvent",
  "IssuesEvent",
  "ReleaseEvent",
]);

function formatEvent(event: GitHubEvent): FingerprintEntry | null {
  if (!RELEVANT_TYPES.has(event.type)) return null;

  const repo = event.repo.name.replace(`${GITHUB_USER}/`, "");
  const date = event.created_at.slice(0, 10);

  switch (event.type) {
    case "PushEvent": {
      const size = (event.payload.size as number) ?? 1;
      return {
        date,
        action: `pushed ${size} commit${size !== 1 ? "s" : ""}`,
        repo,
        detail: (event.payload.ref as string)?.replace("refs/heads/", "") ?? "main",
      };
    }
    case "PullRequestEvent": {
      const action = event.payload.action as string;
      const pr = event.payload.pull_request as { title?: string } | undefined;
      return {
        date,
        action: `${action} PR`,
        repo,
        detail: pr?.title?.slice(0, 50) ?? "",
      };
    }
    case "CreateEvent": {
      const refType = event.payload.ref_type as string;
      const ref = event.payload.ref as string;
      return {
        date,
        action: `created ${refType}`,
        repo,
        detail: ref ?? "",
      };
    }
    case "IssueCommentEvent": {
      const issue = event.payload.issue as { title?: string } | undefined;
      return {
        date,
        action: "commented on issue",
        repo,
        detail: issue?.title?.slice(0, 50) ?? "",
      };
    }
    case "IssuesEvent": {
      const action = event.payload.action as string;
      const issue = event.payload.issue as { title?: string } | undefined;
      return {
        date,
        action: `${action} issue`,
        repo,
        detail: issue?.title?.slice(0, 50) ?? "",
      };
    }
    case "ReleaseEvent": {
      const release = event.payload.release as { tag_name?: string } | undefined;
      return {
        date,
        action: "published release",
        repo,
        detail: release?.tag_name ?? "",
      };
    }
    default:
      return null;
  }
}

async function fetchGitHubEvents(): Promise<FingerprintEntry[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "mkhismkh-portfolio",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=30`,
    { headers, next: { revalidate: 3600 } }
  );

  if (!res.ok) return [];

  const events: GitHubEvent[] = await res.json();
  return events.map(formatEvent).filter((e): e is FingerprintEntry => e !== null);
}

export async function GET() {
  const client = getRedis();

  if (client) {
    try {
      const cached = await client.get(CACHE_KEY);
      if (cached) {
        return Response.json(JSON.parse(cached));
      }
    } catch { /* fall through */ }
  }

  const entries = await fetchGitHubEvents();

  if (client && entries.length > 0) {
    try {
      await client.set(CACHE_KEY, JSON.stringify(entries), "EX", CACHE_TTL);
    } catch { /* silent */ }
  }

  return Response.json(entries);
}
