# Mohammad Hussain — Portfolio

A "Poetic Maximalist" developer portfolio. Editorial serif typography collides with raw terminal aesthetics.

**Live:** [mkhismkh.com](https://mkhismkh.com)

## Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, static export)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **Animation:** [Framer Motion](https://www.framer.com/motion/) (scroll-linked, spring physics)
- **Smooth Scroll:** [Lenis](https://lenis.darkroom.engineering/)
- **Fonts:** Playfair Display (display) + JetBrains Mono (body)
- **Language:** TypeScript (strict)

## Getting Started

```bash
npm install
npm run dev       # → http://localhost:3000
npm run build     # production build
npm run lint      # eslint
```

## Architecture

```
src/
├── app/
│   ├── layout.tsx              # Root layout — fonts, overlays, providers
│   ├── template.tsx            # Page transition wrapper (remounts per route)
│   ├── page.tsx                # Home — composes all sections
│   ├── not-found.tsx           # Custom 404 ("VOID.")
│   ├── error.tsx               # Error boundary ("ERR.")
│   ├── sitemap.ts              # Dynamic sitemap
│   ├── robots.ts               # Crawl directives
│   └── projects/[slug]/        # Dynamic project pages
│       ├── page.tsx            # Server component + generateStaticParams
│       └── ProjectPageClient.tsx
├── components/
│   ├── HeroSection.tsx         # "Crafting Logic." + code marquees
│   ├── AboutSection.tsx        # Identity payload + word reveal
│   ├── ProjectShowcase.tsx     # Horizontal scroll pinned section
│   ├── ProjectPanel.tsx        # Individual project panel (text mask)
│   ├── ArchiveSection.tsx      # Terminal table + cursor preview
│   ├── SprintLogSection.tsx    # "AI in a Day" sprint log
│   ├── ContactFooter.tsx       # Inverted section + "CONNECT."
│   ├── NoiseOverlay.tsx        # SVG feTurbulence grain (z-50)
│   ├── GridOverlay.tsx         # Viewport grid lines (z-40)
│   ├── CustomCursor.tsx        # Spring cursor, 3 modes (dot/caret/expand)
│   ├── SmoothScroll.tsx        # Lenis wrapper
│   ├── MagneticLink.tsx        # Pull-toward cursor + text swap on hover
│   ├── PageTransition.tsx      # Route wipe + title flash
│   └── ReducedMotionProvider.tsx
└── lib/
    ├── projects.ts             # Project data (Prompy, Hydra, KYPE)
    ├── archive.ts              # Archive entries
    ├── sprints.ts              # AI in a Day tools
    └── transition-context.tsx  # Transition state (React Context)
```

## Design System

| Token             | Value     | Usage                         |
|-------------------|-----------|-------------------------------|
| `ink-base`        | `#050505` | Background                    |
| `paper-text`      | `#EAE6DF` | Primary text                  |
| `crimson-accent`  | `#8B0000` | Highlights (used sparingly)   |
| `terminal-muted`  | `#333333` | Borders, grid lines, metadata |

**Typography:** Playfair Display for massive display headers only. JetBrains Mono for everything else.

## Sections

1. **Hero** — Sticky "Crafting Logic." with scroll-driven word split and code marquees
2. **About** — JSON identity payload + serif philosophy (word reveal animation)
3. **Projects** — Horizontal scroll with full-viewport panels, background-clip text mask on hover
4. **Archive** — Terminal table with hover-dim + cursor-following preview card
5. **AI in a Day** — Sprint log of 7 one-shot AI tools with expand-on-hover
6. **Contact** — Inverted background, noise-masked "CONNECT.", magnetic links

## Key Interactions

- **Custom cursor** with 3 states: dot (default), caret (text), circle (interactive)
- **Magnetic links** pull toward cursor and swap text on hover
- **Page transitions** with ink-base wipe and project title flash
- **Reduced motion** respected via `MotionConfig` + CSS `prefers-reduced-motion`
- **Keyboard accessible** with focus-visible outlines and skip-to-content link

## Deployment

Static export — deploy to any CDN (Vercel, Cloudflare Pages, S3 + CloudFront).

```bash
npm run build   # outputs to .next/
```

## License

MIT
