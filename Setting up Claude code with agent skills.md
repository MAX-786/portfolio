> From: https://claude.ai/chat/007444aa-fc45-4752-ad08-a248dc91546e

# you asked

[text/markdown] prd.md

want to build this using claude code, but i don't have any setup for this, have empty repo with just this prd.md, so  first thing first, explore the web and get me skills i should install first like impeccable and other agent skills available for claude code and get the exact actual steps to install them. Then other setup like claude.md and other stuff and also then we properly ask claude to build this with proper agent skills to use

---

# claude response

Great — I now have everything I need. Here's your complete, battle-tested setup guide for building this "Poetic Maximalist" portfolio with Claude Code.

---

# 🛠️ Claude Code Setup Guide for Your Portfolio

## Phase 1: Install Claude Code

If you don't have it yet:
```bash
npm install -g @anthropic-ai/claude-code
```
You need a Claude Pro ($20/mo) or Max ($100/mo) subscription. Then `cd` into your repo and run `claude` to start a session.

---

## Phase 2: Install Your Skills

Skills are `.md` files that teach Claude *how* to do things — no APIs, no servers, just markdown instructions loaded into context on demand.

### 1. **Impeccable** — The design quality enforcer ⭐ (Most important for your PRD)

This is the #1 skill for your project. It gives Claude a full design vocabulary (typography, vertical rhythm, color theory, spacing grids, motion) and 20 slash commands like `/polish`, `/audit`, `/overdrive`, `/critique`. It also ships an **anti-pattern library** — no Inter font, no purple gradients, no nested cards. Exactly what your "Poetic Maximalist" aesthetic needs.

```bash
# Fastest way — auto-detects Claude Code and installs to .claude/
npx skills add pbakaus/impeccable
```

Then run once inside Claude Code:
```
/teach-impeccable
```
This saves your project's design context (dark editorial aesthetic, crimson accents, serif+mono duality).

The `npx skills add` command auto-detects your AI harness and places files correctly — it creates `.claude/` folders for Claude Code automatically.

---

### 2. **Anthropic's Official `frontend-design` skill** — Already bundled inside Impeccable, but you can also install it standalone from Anthropic's skills repo. Impeccable *extends* it, so just installing Impeccable is enough.

---

## Phase 3: Install Your MCP Servers

MCPs are *protocol servers* — they give Claude actual tools (live docs lookup, browser interaction, etc.). These are the ones that matter for your stack.

### 1. **Context7** — Live docs for Next.js, Framer Motion, Tailwind, Lenis, Prisma

The one-liner install for Claude Code is:
```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

Once installed, a skill triggers automatically when you ask about libraries — no need to say "use context7" every time. You can also invoke it explicitly: `use context7 to show me how to set up Framer Motion scroll physics`.

This is critical because Claude's training data might be behind on Framer Motion's latest `useScroll`/`useSpring` APIs, Lenis v2 syntax, and Next.js App Router patterns.

---

### 2. **Chrome DevTools MCP** — Live browser interaction, screenshots, console errors

```bash
claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest
```

This lets your coding agent control and inspect a live Chrome browser, giving access to Chrome DevTools for automation, in-depth debugging, and performance analysis. Invaluable for testing scroll physics, custom cursor behavior, and blend modes visually.

---

### 3. **Playwright MCP** — Browser automation for testing interactions

```bash
claude mcp add playwright -- npx @playwright/mcp@latest
```

Good for verifying the cinematic transitions and horizontal scroll sections actually work.

---

## Phase 4: Create Your `CLAUDE.md`

This is the most important file. `CLAUDE.md` is a critical file for providing project-specific context to Claude Code — it serves as an onboarding guide for AI to your project requirements and codebase.

Next.js v16.2.0+ also generates `AGENTS.md` automatically via `create-next-app`, and `CLAUDE.md` can use `@import` syntax to include it — so Claude Code users get the same framework instructions without duplicating content.

Create this file at the root of your repo:

```markdown
# Portfolio: Poetic Maximalist
@AGENTS.md

## Project Identity
This is Mohammad's (alias: hiphen) personal developer portfolio.
Design language: "Poetic Maximalist" — collision of editorial serif and raw terminal aesthetics.
Stack: Next.js (App Router), Tailwind CSS, Framer Motion, Lenis, MDX.

## Design System (NEVER deviate from this)
- Background: #050505 (ink-base)
- Text: #EAE6DF (paper-text)
- Accent: #8B0000 (crimson-accent) — use SPARINGLY
- Borders/grid: #333333 (terminal-muted)
- Display font: Playfair Display (or Editorial New) — ONLY for massive headers
- Body font: JetBrains Mono — for ALL body copy, nav, metadata
- NO Inter. NO system fonts. NO purple gradients. NO glassmorphism.

## Architecture Rules
- Use Next.js App Router exclusively (no Pages Router)
- All animations via Framer Motion + spring physics (stiffness: 150, damping: 15, mass: 0.1)
- Smooth scroll via Lenis — wrap root layout
- Content via MDX with frontmatter schema defined in prd.md
- Custom cursor: always present, mix-blend-mode: difference on hover
- Noise overlay: fixed SVG feTurbulence, z-50, pointer-events-none, opacity-[0.03]

## Key Components (build these first)
1. NoiseOverlay.tsx — SVG grain texture, global
2. CustomCursor.tsx — Framer Motion spring, blend-mode inversion
3. HorizontalScrollSection.tsx — pinned scroll with GSAP/Framer scroll scrub
4. ProjectPanel.tsx — CSS background-clip: text mask on hover
5. CinematicTransition.tsx — AnimatePresence mode="wait" title scale

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Reference Docs
### PRD — `@prd.md`
**Read when:** Building any section or component. This is the source of truth.

## Constraints
- ALWAYS use context7 when working with Framer Motion, Lenis, or Next.js APIs
- Keep components under 150 lines — split if larger
- TypeScript strict mode — no `any`
- Never use plain `<a>` — use Next.js `<Link>`
```

---

## Phase 5: Scaffold the Project

In your repo (with just `prd.md`), run:

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

This scaffolds Next.js with App Router + TypeScript + Tailwind, and automatically generates `AGENTS.md` and `CLAUDE.md` stubs which you'll replace/extend with the content above.

Then install your animation libraries:
```bash
npm install framer-motion lenis @next/font
npm install -D @types/node
```

---

## Phase 6: The Master Build Prompt for Claude Code

Once you're inside `claude` (in your project directory), paste this as your first prompt:

```
Read @prd.md and @CLAUDE.md in full before doing anything.

Use context7 to fetch the latest docs for: Next.js App Router, Framer Motion useScroll/useSpring/AnimatePresence, and Lenis smooth scroll.

Then build the portfolio in this order, committing after each phase:

PHASE 1 — Foundation
- Global layout with Lenis smooth scroll wrapper
- NoiseOverlay.tsx (SVG feTurbulence grain)
- CustomCursor.tsx (Framer Motion spring, mix-blend-mode: difference)
- CSS variables for the full design token system (ink-base, paper-text, crimson-accent, terminal-muted)
- Google Fonts: Playfair Display + JetBrains Mono loaded via next/font

PHASE 2 — Hero Section (Section 1)
- 100vh sticky hero, "Crafting Logic." in massive Playfair Display
- Scrolling marquee of code snippets behind the text
- On scroll: "Crafting" slides left, "Logic" slides right, Section 2 rises from the gap
- Use Framer Motion useScroll + useTransform for the split animation

PHASE 3 — About Section (Section 2)
- 2-column layout: left = Monospace identity payload, right = Serif philosophy text
- Word-by-word reveal animation (unmasking from bottom, staggered)

PHASE 4 — Project Showcase (Section 3)
- Horizontal scroll pinned inside vertical scroll
- Full 100vw panels per project
- CSS background-clip: text mask for image/video reveal on hover
- Placeholder projects: Plottilo, Ozgaar

PHASE 5 — Archive (Section 4)
- Brutalist terminal-style table: Date, Title, Domain, Link
- Row hover: dim others, show floating image preview following cursor

PHASE 6 — Contact Footer (Section 5)
- 100vh, inverted colors
- Massive "CONNECT." in Playfair Display
- Text as mask revealing noise texture underneath
- Minimal monospace links

PHASE 7 — Cinematic Transitions
- AnimatePresence mode="wait" in root layout
- Project title scales to fill viewport → routes to project page → scales back down

PHASE 8 — Project Inner Pages (/projects/[slug])
- MDX parsing with custom components (styled <p>, <blockquote>, <code>, <CustomImageGrid>)
- Terminal-style code blocks with traffic light buttons
- Bottom "next project" preview

After each phase, run the dev server and use the Chrome DevTools MCP to screenshot the result. Fix any visual issues before moving to the next phase.

/impeccable run after completing each section.
```

---

## Quick Reference: Skill Commands You'll Use

| Command | What it does |
|---|---|
| `/teach-impeccable` | Set your project's design context once |
| `/audit` | Scan current file for design anti-patterns |
| `/polish` | Refine spacing, typography, hierarchy |
| `/overdrive` | Push past conventional limits — shaders, spring physics, scroll reveals |
| `/critique` | Full UX analysis: visual hierarchy, IA, emotional resonance |
| `/bolder` | Make typography and layout more dramatic |

---

## Summary Flow

```
1. npm install -g @anthropic-ai/claude-code
2. npx create-next-app@latest . (scaffold)
3. npx skills add pbakaus/impeccable (design skill)
4. claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
5. claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest
6. Create CLAUDE.md (paste the template above)
7. cd into project → run claude
8. Paste the master build prompt
```

The combination of **Impeccable** (design quality) + **Context7** (live Framer Motion / Next.js docs) + **Chrome DevTools MCP** (visual verification) + your detailed **CLAUDE.md** and **PRD** is essentially giving Claude Code a senior designer, a docs lookup engine, and a pair of eyes all at once. That's the setup that'll get your "Poetic Maximalist" vision built without the usual AI-slop drift.

---

# you asked

we have built it completely , and now i would want something interesting making it more unique and some extraoordinary feature. Lets brainstorm in to this figuring our something to have in my portfolio, enhancing the UI/ UX more , sticking to our base design which we set and further making it more attractive and adding something cool. Make sure whatever you build is well thought. Do not always agree with me and answer based on your own intelligence and thinking. I have this vague idea, so its upto you to brainstorm, and let me know what we can do more and how UI/UX be world class unique and closely talilored to me.

---

# claude response

Love that the portfolio is built. Let me think about this properly before throwing ideas at you.

A few things I want to understand about you first — this will shape what actually makes sense versus what's just a gimmick:

User: Design engineering (the overlap zone), Startup founders / early-stage companies, Playful and experimental — I enjoy surprises

Based on your answers, I want to think carefully before proposing anything. Let me be direct: most "unique portfolio features" people ask for are actually just gimmicks — cool for 10 seconds, then in the way. Since you're targeting **startup founders**, they're busy people who'll spend maybe 90 seconds on your site. Whatever we add needs to earn its place by either *communicating something* or *demonstrating craft* — not just existing for novelty.

Here's what I've genuinely been thinking through:

---

## The Honest Shortlist (with my actual take on each)

---

### 1. **"The Interrogation"** — An AI version of you that founders can actually talk to
*My strongest recommendation.*

Instead of a contact form or a mailto link, the footer's "CONNECT." section becomes an **embedded, character-driven AI chat** — trained on your actual thinking: your writing, your project decisions, your opinions on product and design. Founders don't email strangers. But they *will* ask a question if there's something to talk to.

The key is it must have a **distinct voice** — opinionated, a little dry, like you'd actually respond. Not "Hi! I'm Mohammad's AI assistant 😊". More like a terminal interface where they type a question and get a real answer that sounds like you wrote it. It can answer "what's your take on design systems?", "have you worked with [X type of product]?", "how do you approach working with non-technical founders?" — and naturally surface relevant projects.

**Why this works specifically for you:** Design engineers who can *also* build AI-integrated experiences are rare. This feature *is* the proof of concept. The portfolio doesn't just say you can build AI products — it *is* one.

**Risk:** If the responses feel generic, it actively hurts you. The personality has to be sharp.

---

### 2. **Live "Design Audit" Tool** — Paste any URL, get roasted
*Genuinely differentiated, but high maintenance.*

A section where a founder can paste their product's URL and get a fast, opinionated design/UX critique — generated by Claude, but filtered through *your* aesthetic sensibility and framed in your voice. Brutalist terminal output. Numbered findings. A score.

This turns your portfolio into a **tool they bookmark**. Founders *love* getting their product critiqued. It also demonstrates your exact skillset: you understand design, UX, and AI integration simultaneously.

**Why I'm hesitant:** It requires a live API, and if it's slow or the output is generic, it embarrasses you. You'd also need to be careful about what URLs get submitted. Doable, but needs real engineering care.

---

### 3. **"The Process Tape"** — A raw, behind-the-scenes feed of how you actually work
*Underrated, zero gimmick.*

Not a blog. More like a **changelog of your thinking** — short, dated entries (3-5 sentences max) about decisions you made on real projects. "Scrapped the glassmorphism navbar. It was visually interesting but added cognitive load on mobile. Replaced with a sticky monospace breadcrumb." Written in your voice, monospace, terminal-style.

This is what founders actually want to know: *how does this person think under pressure?* Case studies are polished retrospectives. This is raw. Nobody does this well.

**Why I'm hesitant about recommending it first:** It requires you to actually write it, consistently. Most people don't. If it's empty or stale, it reads as abandoned.

---

### 4. **Cursor Trail with Semantic Awareness**
*Solid craft enhancement, not a standalone feature.*

Your current custom cursor is already strong. One layer up: the cursor changes behavior depending on *what zone of the page it's in* — not just hover states on elements, but ambient zone detection. Over the hero text: caret mode. Over a project panel: circle with project color bleed. Over the archive section: it picks up a faint trailing "shadow" of the last 3 cursor positions, like a comet tail. Subtle, but it makes the whole page feel *inhabited*.

This isn't a feature — it's a polish pass. Worth doing, but not the headline.

---

## My actual recommendation

**Build #1 (The AI-you chat) + #4 (cursor zones) as the polish layer.**

Skip #2 unless you're willing to really engineer it properly. Skip #3 unless you already journal like this naturally.

The AI chat is the only one that does three things simultaneously: demonstrates your AI engineering capability, gives founders an actual reason to engage longer, and expresses your personality in a way no case study can. It also fits *perfectly* into the existing design — a terminal-style chat interface in the footer lives natively inside the "poetic maximalist" aesthetic without breaking anything.

---

Want me to spec out exactly how to build the AI chat — the system prompt architecture, personality design, and Claude Code prompt to implement it? That's where the real craft is.

---

# you asked

Q: What kind of work do you primarily do / want to be hired for?
A: Full-stack product engineering

Q: Who is the primary audience visiting this portfolio?
A: Startup founders / early-stage companies

Q: What's your personality when it comes to self-presentation?
A: Playful and experimental — I enjoy surprises

---

# claude response

Noted — full-stack, not just design engineering. That changes my thinking meaningfully.

The AI chat idea still holds, but the *framing* shifts. Founders hiring full-stack engineers aren't just looking at craft — they're asking "can this person own a product end-to-end, make technical decisions, and ship?" So whatever we add needs to signal **technical depth + product thinking**, not just visual flair.

Let me also push back on something: since you said playful and experimental, I want to make sure we don't confuse "playful" with "quirky animations." Playful with substance means the *interaction itself reveals something true about you* — not just that you can code a particle system.

Here's where my thinking landed after sitting with all three answers together:

---

## The One Feature I'd Actually Build

### **"The Briefing"** — A personalized, generative first impression

Here's the idea: when someone lands on your portfolio, before the hero even loads, there's a subtle terminal prompt in the corner:

```
> Who sent you?
```

They can type anything — a name, a company, "nobody", "Twitter", skip it entirely. Whatever they enter gets woven into the *actual experience* of the site from that point forward.

If they type `"Rahul from Zepto"` — the hero text doesn't say generic "Crafting Logic." It says something like:

```
> Crafting logic for people
  who move fast.
```

The about section's identity payload updates: `CURRENT_OBJECTIVE: Helping Zepto-scale products ship faster`. The project metadata subtly reorders to surface your most relevant work first. The footer's "CONNECT." pre-populates a context-aware message: *"Hey Rahul, I looked at what Zepto is building and..."*

None of this is hardcoded per-company. It's **generated in real-time by Claude** based on a brief web search + the input they gave, then injected into the page's copy at render time. The underlying layout and design never change — just the *text layer* personalizes.

**Why this is actually good and not a gimmick:**

Founders forward portfolios to their co-founders. They share links in Slack. This means the first impression is often *not* the founder themselves — it's someone cold. A personalized site creates a story. "Wait, how did it know?" is a conversation starter that gets you remembered. More importantly, it demonstrates *exactly* the skill set a startup founder needs: you understand users, you think in personalization, and you can implement it.

**Why I'm confident it fits your constraints:** It doesn't break the design system at all. The terminal prompt fits the monospace aesthetic perfectly. The personalization is invisible infrastructure — the site looks identical, the *words* change. And it's genuinely novel — I haven't seen this done well anywhere.

---

## The Second Thing (Complementary, Not a Replacement)

### **Live Stack Fingerprint** — Show your GitHub pulse, not your resume

In the archive/timeline section, instead of static project entries, pull your **actual recent GitHub activity** via GitHub's API and render it in the existing brutalist table format:

```
2025-04-14  pushed 3 commits    hiphen/plottilo     [Next.js, Prisma]
2025-04-12  opened PR #47       hiphen/ozgaar       [API refactor]  
2025-04-09  merged              hiphen/side-thing   [Auth, Edge fn]
```

Live. Auto-updating. No manual maintenance. It signals "this person is actively building" without you writing a single blog post. Founders respect that more than a polished case study timeline.

---

## What I'd Skip

I'd skip the design audit tool entirely for a full-stack positioning. It narrows you to design critique — that's not your primary sell. And I'd skip any "surprise" animations that don't carry information. Playful should mean *the interaction surprises you with what it reveals*, not that things bounce around unexpectedly.

---

## Build Order

1. **The Briefing** — this is the headline feature, build it first
2. **Live Stack Fingerprint** — bolt-on, two API calls, high signal
3. **Cursor zone awareness** from before — pure polish, low effort, high feel

---

Want me to fully spec out "The Briefing" — the Claude prompt architecture, how the web search + personalization pipeline works, the state management approach, and the exact Claude Code prompt to build it? That's where the interesting engineering lives.

---

# you asked

yes lets do it , think on your own, challenges, costings, and other stuff and lets dive in

---

# claude response

Let me think through this properly before writing a single line of prompt. The engineering here has some real gotchas.

Good. Now let me actually *think* through this before touching a diagram or code.

---

The core engineering challenge with "The Briefing" is a pipeline problem. There are three moving parts and each one has a real failure mode:

**Part 1: Capture input** — trivial. A terminal prompt on load. The tricky bit is timing: do you block the hero animation until they respond? Do you give them 5 seconds then auto-skip? What happens if they skip — does the site still feel personalized or does it fall flat? These UX decisions matter more than the code.

**Part 2: Generate personalized copy** — this is where most people would naively call Claude with "rewrite this hero text for Rahul from Zepto." That's wrong. You'd get inconsistent output, slow TTFB, and you can't pre-hydrate the page. The right architecture is a **streaming SSE endpoint** — Next.js Route Handler, streams Claude's response token by token, React updates the DOM as tokens arrive. The "typing" effect becomes the loading state. Feels like the site is *responding to them* in real time.

**Part 3: Web search for company context** — this is the expensive, slow part. You can't search for every company on every visit. The smart move is to batch it: when they submit the input, immediately start a fast "no-search" generation for the hero text (ships in ~800ms), then fire a background search for company context, then stream a secondary update to the About section copy 2-3 seconds later. Two-phase reveal. Feels intentional, not like loading.

**The cost reality:** Claude API calls per visit. At even moderate traffic (100 visits/day), you're looking at ~$3-8/day in API costs depending on context size. For a portfolio that's probably fine, but worth knowing. Caching by company name would help — same company input returns cached personalization.

**The real risk I keep coming back to:** if the personalization is *obviously* template-filling ("Hello Rahul! I see you work at Zepto!"), it's worse than nothing. The copy needs to feel like *you* actually wrote it for them. That means the system prompt has to carry your voice so strongly that the output sounds like you — not like a chatbot. This is actually the hardest part of the whole thing.

Let me map the full architecture first, then give you the build prompt.

![alt text](image.png)

Every node is clickable — each one surfaces an important sub-decision. Now here's the full build plan.

---

## The Decisions I Made For You

**On the skip/timeout:** 8 seconds, then the prompt fades out and the hero plays normally with default copy. No guilt, no blocking. If someone skips, the site is still world-class — personalization is an enhancement, not a dependency.

**On copy scope:** Three things personalize. The hero headline (replaces "Crafting Logic." with something contextually crafted). The identity payload in the About section (the `CURRENT_OBJECTIVE` line updates). The project panel order shifts — most relevant project surfaces first. Nothing else changes. Restraint is the point.

**On caching:** I'd cache by lowercase-trimmed company name with a 24-hour TTL using Vercel KV (free tier, zero infrastructure). Same company, same day → instant, no API call. This is important for the cost math.

**On voice:** This is the system prompt architecture that matters. It cannot say "you are Mohammad's assistant." It has to say "you *are* Mohammad" — first person, with actual opinions baked in. I'll write this for you in the Claude Code prompt below.

**On what I'd skip:** I'd skip reordering projects by relevance on the first version. It adds complexity (you need tags on projects, a scoring function) for marginal gain. Ship hero + identity payload first. Add project reordering in v2 if it feels worth it.

---

## The Complete Claude Code Build Prompt

Paste this into Claude Code after reading your `CLAUDE.md` and `prd.md`:

```
Read @prd.md and @CLAUDE.md fully before starting. Use context7 for all 
Next.js App Router, Vercel KV, and streaming APIs.

Build "The Briefing" — a personalized first-impression system. Full spec below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — THE TERMINAL PROMPT (UI layer)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create components/BriefingPrompt.tsx

UI: Fixed overlay at the very start of the page load. NOT a modal — a 
terminal-style single line in the bottom-left corner of the hero section, 
using JetBrains Mono. Matches the existing design system exactly.

Renders as:
  > WHO_SENT_YOU: █

The cursor blinks (CSS animation, crimson-accent color). The user types.
On Enter → submit. On Escape or after 8 seconds of inactivity → dismiss 
with a subtle fade, proceed with default copy.

State: store the raw input string in a React context 
(BriefingContext.tsx) accessible across the page.

Do NOT render this inside a modal or dialog. It lives inside the hero 
section itself, positioned absolute bottom-left, z-index above the 
marquee but below the main headline.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — THE ROUTE HANDLER (backend)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create app/api/briefing/route.ts

Accept POST with body: { input: string }

Step 1 — Cache check
  Use Vercel KV. Key: `briefing:${input.toLowerCase().trim()}`
  If cache hit → stream the cached result immediately, skip Steps 2-3.
  TTL: 86400 seconds (24h)

Step 2 — Phase 1 generation (fast, no search)
  Call Anthropic claude-sonnet-4-20250514 with streaming.
  max_tokens: 300
  
  System prompt (copy this EXACTLY — voice fidelity is critical):
  
  """
  You are Mohammad (hiphen) — a full-stack product engineer who builds 
  things that feel alive. You think in systems and ship in aesthetics. 
  You have opinions. You don't use filler words.

  Someone just landed on your portfolio and told you who sent them or 
  where they're coming from. Write two pieces of copy for them, in your 
  voice. Be specific if they gave you something specific. Be intriguing 
  if they were vague. Never be generic. Never be sycophantic.

  Return ONLY valid JSON. No markdown, no explanation, no preamble.
  Schema:
  {
    "hero_line_1": "string — 2-3 words, replaces 'Crafting'",
    "hero_line_2": "string — 1-2 words, replaces 'Logic'",
    "objective": "string — max 8 words, replaces the CURRENT_OBJECTIVE line",
    "phase": 1
  }

  Examples of good output for input "Aman from Zepto":
  {
    "hero_line_1": "Shipping conviction",
    "hero_line_2": "at speed.",
    "objective": "Helping Zepto-scale products stay human",
    "phase": 1
  }

  Examples of good output for input "Twitter / found you randomly":
  {
    "hero_line_1": "Building things",
    "hero_line_2": "that stick.",
    "objective": "Making the internet feel less corporate",
    "phase": 1
  }

  The hero lines together should read as one thought. Keep them punchy. 
  Mohammad's voice is: direct, slightly dry, technically precise, 
  occasionally poetic. Never enthusiastic. Never safe.
  """

  User message: `Who sent them: "${input}"`

  Stream this JSON to the client as it arrives.

Step 3 — Phase 2 generation (async, with web search — runs in background)
  After Phase 1 response is sent, if input contains what looks like a 
  company name (>3 chars, not "nobody"/"random"/"friend"):
  
  Fire a separate non-blocking fetch to a second internal endpoint 
  /api/briefing/enrich that:
  
  1. Searches for the company using Tavily API (env: TAVILY_API_KEY)
     Query: `${companyName} product startup what they build`
     max_results: 3
  
  2. Calls Claude again with search results:
     System prompt:
     """
     You are Mohammad. Given context about a company or person, write an 
     enhanced About section CURRENT_OBJECTIVE that shows you actually know 
     what they do. 1 sentence max, 12 words max. In Mohammad's voice — 
     direct, not impressed, genuinely curious. Return ONLY JSON:
     { "objective": "string", "phase": 2 }
     """
  
  3. Emits this as a second SSE event to the client after ~2-3s delay.
     Client updates the About section identity payload on receive.

  Cache the full result (both phases) under the same KV key.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — CLIENT CONSUMPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In the hero section (HeroSection.tsx):
- Import useBriefing() hook from BriefingContext
- When briefingData.hero_line_1 arrives → animate the existing hero text 
  OUT (translate + fade, 300ms), then type the new text IN character by 
  character using a typewriter effect (15ms per char). 
  Use the existing Framer Motion setup.
- The transition must feel like the site is *rewriting itself for them*, 
  not loading.

In the About section identity payload (IdentityPayload.tsx):
- The CURRENT_OBJECTIVE line is already rendered from a data object.
- When briefingData.objective updates (phase 1 or 2) → crossfade the 
  text, 400ms. No layout shift.
- On phase 2 update → add a subtle one-time indicator: a tiny blinking 
  dot next to CURRENT_OBJECTIVE that appears for 2 seconds then fades. 
  Signals that the site "learned more" about them. Don't explain it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENVIRONMENT VARIABLES NEEDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ANTHROPIC_API_KEY=
TAVILY_API_KEY=       # free tier at tavily.com, 1000 searches/month
KV_REST_API_URL=      # Vercel KV (free tier)
KV_REST_API_TOKEN=

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT TO BUILD FIRST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. BriefingContext.tsx and useBriefing() hook
2. BriefingPrompt.tsx UI component (terminal input, blink animation)
3. /api/briefing/route.ts with Phase 1 streaming (no search, no cache yet)
4. Wire hero text to update on briefingData arrival
5. Add Vercel KV caching
6. Add Phase 2 enrichment + About section update
7. Add the phase 2 "learned more" dot indicator

Test Phase 1 thoroughly before building Phase 2. 
Use the Chrome DevTools MCP to verify the streaming updates look correct.

After each step run /audit and check the terminal input renders correctly 
in the existing design system — JetBrains Mono, crimson-accent cursor, 
no visual breaks with the hero section.
```

---

## One More Thing I'd Add After This Ships

Once The Briefing is working — add a **`/api/briefing/log`** endpoint that silently writes each unique input to a private log (Vercel KV list, append-only). No personal data, just the raw strings. After a month you'll have a map of exactly who's finding your portfolio and from where. That's real signal — better than any analytics dashboard. It also tells you which companies keep coming back, which is leverage in conversations.

That's the build. The hardest part isn't the code — it's the system prompt voice. Read the examples in Phase 2 carefully and adjust them to match *how you actually sound* before shipping.