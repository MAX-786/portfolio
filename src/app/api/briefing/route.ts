import AnthropicBedrock from "@anthropic-ai/bedrock-sdk";

// In-memory cache (works in dev; swap for Upstash Redis in production)
const cache = new Map<string, { data: string; expires: number }>();
const CACHE_TTL = 86_400_000; // 24 hours in ms

const SKIP_INPUTS = new Set([
  "nobody",
  "no one",
  "noone",
  "random",
  "friend",
  "twitter",
  "x",
  "linkedin",
  "google",
  "search",
  "just browsing",
  "skip",
  "",
]);

const PHASE1_SYSTEM = `You are Mohammad (hiphen) — a full-stack product engineer. You ship things that matter to you, then open-source them for everyone else. You build at the intersection of personal frustration and public utility. TypeScript end-to-end, AWS orchestration, AI pipelines in production.

Someone just landed on your portfolio and told you who sent them. Generate personalized copy in your voice.

Rules:
- Be specific if they gave you something specific
- Be intriguing if they were vague
- NEVER be generic. NEVER be sycophantic. NEVER use exclamation marks.
- The two hero lines read as one continuous thought
- The objective sounds like a git commit message, not marketing copy

Return ONLY valid JSON, no markdown, no preamble, no code fences:
{
  "hero_line_1": "2-4 words, replaces 'Crafting'",
  "hero_line_2": "1-2 words, replaces 'Logic.'",
  "objective": "max 8 words, replaces CURRENT_OBJECTIVE line"
}`;

const PHASE2_SYSTEM = `You are Mohammad. Given context about a company or person, write an enhanced CURRENT_OBJECTIVE that shows you actually know what they do. 1 sentence max, 12 words max. In Mohammad's voice — direct, not impressed, genuinely curious. Return ONLY valid JSON, no markdown, no code fences:
{ "objective": "string", "phase": 2 }`;

function normalizeInput(input: string): string {
  return input.toLowerCase().trim().replace(/\s+/g, "-");
}

function getCached(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: string) {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

function looksLikeCompany(input: string): boolean {
  const normalized = input.toLowerCase().trim();
  if (normalized.length <= 2) return false;
  if (SKIP_INPUTS.has(normalized)) return false;
  if (/\bfrom\b/i.test(input)) return true;
  if (/^[A-Z]/.test(input.trim())) return true;
  return normalized.length > 3;
}

function extractCompanyName(input: string): string {
  const fromMatch = input.match(/from\s+(.+)/i);
  if (fromMatch) return fromMatch[1].trim();
  const atMatch = input.match(/at\s+(.+)/i);
  if (atMatch) return atMatch[1].trim();
  return input.trim();
}

function extractJson(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text);
  } catch {
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      try {
        return JSON.parse(fenceMatch[1].trim());
      } catch { /* fall through */ }
    }
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch { /* fall through */ }
    }
    return null;
  }
}

async function searchTavily(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return "";

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${query} product startup what they build`,
        max_results: 3,
        search_depth: "basic",
      }),
    });

    if (!res.ok) return "";

    const data = await res.json();
    const snippets = (data.results ?? [])
      .map((r: { content?: string }) => r.content ?? "")
      .join("\n")
      .slice(0, 800);
    return snippets;
  } catch {
    return "";
  }
}

function getClient(): AnthropicBedrock {
  return new AnthropicBedrock({
    awsRegion: process.env.BRIEFING_AWS_REGION ?? process.env.AWS_REGION ?? "us-east-1",
    awsAccessKey: (process.env.BRIEFING_AWS_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID) as string,
    awsSecretKey: (process.env.BRIEFING_AWS_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY) as string,
  });
}

function getModel(): string {
  return process.env.BRIEFING_BEDROCK_MODEL_ID ?? process.env.BEDROCK_MODEL_ID ?? "us.anthropic.claude-sonnet-4-20250514-v1:0";
}

export async function POST(request: Request) {
  const { input } = await request.json();

  if (!input || typeof input !== "string") {
    return new Response("Missing input", { status: 400 });
  }

  const cacheKey = `briefing:${normalizeInput(input)}`;
  const cached = getCached(cacheKey);

  if (cached) {
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`data: ${cached}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const accessKey = process.env.BRIEFING_AWS_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.BRIEFING_AWS_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKey || !secretKey) {
    return new Response("AWS Bedrock credentials not configured", { status: 500 });
  }

  const client = getClient();
  const model = getModel();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        // Phase 1: Fast generation, no search
        const phase1Response = await client.messages.create({
          model,
          max_tokens: 300,
          system: PHASE1_SYSTEM,
          messages: [{ role: "user", content: `Who sent them: "${input}"` }],
        });

        const phase1Text =
          phase1Response.content[0].type === "text"
            ? phase1Response.content[0].text
            : "";

        const phase1Data = extractJson(phase1Text);
        if (!phase1Data) {
          console.error("Phase 1: failed to parse JSON from:", phase1Text);
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }

        phase1Data.phase = 1;
        const phase1Json = JSON.stringify(phase1Data);
        controller.enqueue(encoder.encode(`data: ${phase1Json}\n\n`));

        // Phase 2: Enrichment with web search (if applicable)
        if (looksLikeCompany(input)) {
          const companyName = extractCompanyName(input);
          const searchResults = await searchTavily(companyName);

          if (searchResults) {
            const phase2Response = await client.messages.create({
              model,
              max_tokens: 100,
              system: PHASE2_SYSTEM,
              messages: [
                {
                  role: "user",
                  content: `Company: ${companyName}\n\nSearch results:\n${searchResults}`,
                },
              ],
            });

            const phase2Text =
              phase2Response.content[0].type === "text"
                ? phase2Response.content[0].text
                : "";

            const phase2Data = extractJson(phase2Text);
            if (phase2Data) {
              phase2Data.phase = 2;
              const phase2Json = JSON.stringify(phase2Data);

              const merged = { ...phase1Data, ...phase2Data };
              setCache(cacheKey, JSON.stringify(merged));

              controller.enqueue(encoder.encode(`data: ${phase2Json}\n\n`));
            } else {
              setCache(cacheKey, phase1Json);
            }
          } else {
            setCache(cacheKey, phase1Json);
          }
        } else {
          setCache(cacheKey, phase1Json);
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        console.error("Briefing API error:", error);
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
