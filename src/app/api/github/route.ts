import Redis from "ioredis";

const GITHUB_USER = "MAX-786";
const CACHE_KEY = "github:fingerprint:v6";
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
  tags: string[];
  _repoFull?: string;
}

const RELEVANT_TYPES = new Set([
  "PushEvent",
  "PullRequestEvent",
  "CreateEvent",
  "IssueCommentEvent",
  "IssuesEvent",
  "ReleaseEvent",
]);


function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "mkhismkh-portfolio",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function repoDisplay(fullName: string): string {
  return fullName;
}

async function getRepoTags(repoFullName: string): Promise<string[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repoFullName}`, {
      headers: getHeaders(),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const raw: string[] = [];
    if (data.language) raw.push(data.language);
    if (data.topics?.length) {
      for (const t of data.topics) {
        if (!raw.includes(t)) raw.push(t);
      }
    }
    return raw.slice(0, 2);
  } catch {
    return [];
  }
}

async function getCommitCount(repoFullName: string, before: string, head: string): Promise<number> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repoFullName}/compare/${before}...${head}`,
      { headers: getHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return 1;
    const data = await res.json();
    const count = data.total_commits ?? 1;
    return Math.min(count, 50);
  } catch {
    return 1;
  }
}

interface PushGroup {
  date: string;
  repoFullName: string;
  totalCommits: number;
}

async function fetchGitHubEvents(): Promise<FingerprintEntry[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=30`,
    { headers: getHeaders(), next: { revalidate: 3600 } }
  );

  if (!res.ok) return [];
  const events: GitHubEvent[] = await res.json();

  const entries: FingerprintEntry[] = [];
  const pushGroups = new Map<string, PushGroup>();
  const pushOrder: string[] = [];

  const tagCache = new Map<string, Promise<string[]>>();
  function getTags(repoFullName: string): Promise<string[]> {
    if (!tagCache.has(repoFullName)) {
      tagCache.set(repoFullName, getRepoTags(repoFullName));
    }
    return tagCache.get(repoFullName)!;
  }

  const commitCountPromises: Promise<void>[] = [];

  for (const event of events) {
    if (!RELEVANT_TYPES.has(event.type)) continue;

    const date = event.created_at.slice(0, 10);
    const repoFullName = event.repo.name;

    if (event.type === "PushEvent") {
      const groupKey = `${date}:${repoFullName}`;
      const before = event.payload.before as string;
      const head = event.payload.head as string;

      if (!pushGroups.has(groupKey)) {
        pushGroups.set(groupKey, { date, repoFullName, totalCommits: 0 });
        pushOrder.push(groupKey);
      }

      const group = pushGroups.get(groupKey)!;
      commitCountPromises.push(
        getCommitCount(repoFullName, before, head).then((count) => {
          group.totalCommits += count;
        })
      );
      continue;
    }

    if (event.type === "PullRequestEvent") {
      const action = event.payload.action as string;
      const pr = event.payload.pull_request as {
        number?: number;
        title?: string;
        merged?: boolean;
      } | undefined;

      const prNum = pr?.number ? ` #${pr.number}` : "";
      const isMerged = action === "closed" && pr?.merged;
      const actionStr = isMerged ? `merged${prNum}` : `${action} PR${prNum}`;

      entries.push({
        date,
        action: actionStr,
        repo: repoDisplay(repoFullName),
        tags: [],
        _repoFull: repoFullName,
      });
      getTags(repoFullName);
      continue;
    }

    if (event.type === "IssueCommentEvent") {
      const issue = event.payload.issue as { number?: number } | undefined;
      entries.push({
        date,
        action: `commented #${issue?.number ?? ""}`,
        repo: repoDisplay(repoFullName),
        tags: [],
        _repoFull: repoFullName,
      });
      getTags(repoFullName);
      continue;
    }

    if (event.type === "IssuesEvent") {
      const action = event.payload.action as string;
      const issue = event.payload.issue as { number?: number } | undefined;
      entries.push({
        date,
        action: `${action} issue #${issue?.number ?? ""}`,
        repo: repoDisplay(repoFullName),
        tags: [],
        _repoFull: repoFullName,
      });
      getTags(repoFullName);
      continue;
    }

    if (event.type === "ReleaseEvent") {
      const release = event.payload.release as { tag_name?: string } | undefined;
      entries.push({
        date,
        action: "released",
        repo: repoDisplay(repoFullName),
        tags: release?.tag_name ? [release.tag_name] : [],
        _repoFull: repoFullName,
      });
      continue;
    }

    if (event.type === "CreateEvent") {
      const refType = event.payload.ref_type as string;
      if (refType === "repository") {
        entries.push({
          date,
          action: "created repo",
          repo: repoDisplay(repoFullName),
          tags: [],
          _repoFull: repoFullName,
        });
      }
    }
  }

  await Promise.all(commitCountPromises);

  const result: FingerprintEntry[] = [];

  const allItems: { date: string; isPush: boolean; index: number }[] = [];

  for (let i = 0; i < pushOrder.length; i++) {
    const group = pushGroups.get(pushOrder[i])!;
    allItems.push({ date: group.date, isPush: true, index: i });
  }
  for (let i = 0; i < entries.length; i++) {
    allItems.push({ date: entries[i].date, isPush: false, index: i });
  }

  allItems.sort((a, b) => b.date.localeCompare(a.date));

  const seen = new Set<number>();
  const seenEntries = new Set<number>();

  for (const item of allItems) {
    if (result.length >= 10) break;

    if (item.isPush) {
      if (seen.has(item.index)) continue;
      seen.add(item.index);
      const key = pushOrder[item.index];
      const group = pushGroups.get(key)!;
      const n = group.totalCommits || 1;
      const tags = await getTags(group.repoFullName);
      const action = n > 20
        ? "synced upstream"
        : `pushed ${n} commit${n !== 1 ? "s" : ""}`;
      result.push({
        date: group.date,
        action,
        repo: repoDisplay(group.repoFullName),
        tags,
      });
    } else {
      if (seenEntries.has(item.index)) continue;
      seenEntries.add(item.index);
      const entry = entries[item.index];
      if (!entry.tags.length && entry._repoFull) {
        entry.tags = await getTags(entry._repoFull);
      }
      delete entry._repoFull;
      result.push(entry);
    }
  }

  return result;
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
