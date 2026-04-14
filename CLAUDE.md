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
