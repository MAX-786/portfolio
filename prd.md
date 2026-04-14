# SSOT: The "Poetic Maximalist" Portfolio

## 1. Core Philosophy & Vibe
The design language is a collision of two worlds:
* **The Editorial (Human):** Massive, elegant serif typography, fluid pacing, and asymmetrical layouts reminiscent of high-end print magazines or classical poetry collections.
* **The Technical (Machine):** Monospace fonts, exposed grid lines, raw JSON/MDX data blocks, and terminal-like color accents. 

**The Golden Rule of UX:** Navigation is horizontal and vertical, driven by scroll physics. Information is never hidden behind a click if it can be revealed by a fluid scroll or hover.

---

## 2. Global Architecture & Stack
* **Framework:** Next.js (App Router) for modularity and server-side rendering.
* **Styling:** Tailwind CSS. 
* **Motion & Physics:** Framer Motion (for component animation) and Lenis (for buttery smooth scroll hijacking/easing).
* **Content Engine:** MDX (Markdown with JSX). This allows writing poetic, long-form case studies while embedding interactive React components directly into the text.

---

## 3. The Design System (The DNA)

### Typography
* **Primary Display (The Poet):** A dramatic, high-contrast Serif (e.g., *Playfair Display*, *Cinzel*, or *Editorial New*). Used *only* for massive section headers, dramatic quotes, and project titles.
* **Secondary Body (The Engineer):** A strict, legible Monospace (e.g., *JetBrains Mono*, *Geist Mono*). Used for all body copy, technical specs, navigation, and metadata.

### Color Palette (High Contrast)
* `ink-base`: `#050505` (Deep, almost-black background)
* `paper-text`: `#EAE6DF` (Off-white, slightly warm text for reduced eye strain)
* `crimson-accent`: `#8B0000` (Used sparsely for text selection, active states, or dramatic highlights)
* `terminal-muted`: `#333333` (For borders, grid lines, and background noise)

### Global UI Overlays
* **The Grain:** A fixed, `pointer-events-none` fullscreen div with a subtle SVG noise filter. It gives the digital screen a physical, paper-like texture.
* **The Grid:** Faint, 1px `terminal-muted` vertical and horizontal lines dividing the viewport into mathematical quadrants, contrasting with the fluid typography.

---

## 4. Micro-Interactions & Primitives

Every interactive element must feel deliberate. No standard pointer cursors; no standard blue outlines.

### The Custom Cursor
* **Default State:** A tiny `paper-text` dot (4px).
* **Hover State (Text):** Expands to a vertical line (like a text-editor caret).
* **Hover State (Media/Links):** Expands into a 60px circle with `mix-blend-mode: difference`, inverting the colors of whatever it hovers over.

### The Button / Link Component
* **Visual:** Text-only in uppercase Monospace. No background boxes.
* **Hover UX:** "Magnetic" physics. As the cursor approaches, the text slightly pulls toward the mouse. When hovered, the original text translates up and fades out, while a secondary phrase (e.g., hovering over "CONTACT" reveals "INITIATE_HANDSHAKE") translates up from the bottom.

### The Scroll Physics
* Vertical scrolling does not just move the page down; it acts as a timeline playhead. Scrolling scrubs through animations, unmasks text, and translates sections horizontally.

---

## 5. Section-by-Section Anatomy (The Narrative Flow)

Think of the page flow like the structure of a Ghazal—a striking opening (Matla), a rhythmic body (Ash'aar), and a signature closing (Maqta).

### Section 1: The Hook (Hero)
* **UI:** 100vh height, sticky positioning.
* **Content:** In the absolute center, a massive Serif statement: "Crafting Logic." Behind it, spanning the entire width and fading into the background, is a scrolling marquee of raw code snippets (React/Next.js/Prisma logic). 
* **UX:** As the user scrolls down, the word "Crafting" slides to the far left, and "Logic" slides to the far right. From the resulting gap in the center, Section 2 rises up.

### Section 2: The Introduction (About)
* **UI:** A strict 2-column layout. 
* **Left Column:** A massive, stylized Monospace block acting as an "Identity Payload" (Name: Mohammad, Alias: hiphen, Role: SDE, Current Objective: Redefining UX). 
* **Right Column:** A beautifully typeset Serif paragraph explaining your philosophy on software development and collaborative tools.
* **UX:** The text enters via a "Reveal" animation—each word unmasking from the bottom up, staggered, as if being typed by an elegant machine.

### Section 3: The Work (Project Showcase)
* **UI:** This is the most complex mechanism. It is a **Horizontal Scroll** section pinned within the vertical scroll.
* **Layout:** The user scrolls vertically, but the screen stops moving down and instead translates project panels from right to left.
* **The Panel Design:** Each project (e.g., Plottilo, Ozgaar) gets a full 100vw panel.
    * *Background:* Pitch black.
    * *Foreground Center:* The project title in massive, overlapping Serif text.
    * *Foreground Corners:* Monospace metadata (Year, Tech Stack, Role).
* **UX:** When the custom cursor hovers over the massive project title, the background instantly flashes with a high-res video or image of the project, bleeding through the text using a CSS mask.

### Section 4: The Archive (The Git/Timeline View)
* **UI:** A brutalist, terminal-style table listing all smaller projects, open-source contributions, and experiments.
* **Layout:** Rows consisting of Date, Title, Domain, and an external link arrow. 
* **UX:** Hovering over a row dims all other rows and slides an image preview next to the cursor, following the mouse movements.

### Section 5: The Signature (Footer/Contact)
* **UI:** 100vh height. The background color inverts (Background becomes `paper-text`, text becomes `ink-base`).
* **Content:** A massive, screen-filling Serif word: "CONNECT." Below it, minimal Monospace links (GitHub, LinkedIn, Email).
* **UX:** The `ink-base` text color is not solid; it is a mask revealing a slow-moving, dark fluid simulation or a dense noise texture underneath.

---

## 6. Data Architecture (MDX Schema)
Your projects will be driven by localized `.mdx` files. This is the exact frontmatter schema your parsing utility must enforce:

```yaml
---
id: "plottilo-01"
title: "Plottilo"
type: "Platform"
tagline: "Collaborative Storytelling Engine"
techStack: ["Next.js", "Prisma", "Tailwind", "Node.js"]
year: "2025"
repository: "https://github.com/..."
liveUrl: "https://..."
coverImage: "/assets/projects/plottilo.webp"
---
# Content goes here...
```

## 7. The Transition Architecture (The Cinematic Cut)

To make a Next.js multi-page app feel like a continuous cinematic experience, we must bridge the gap between the exiting route and the entering route. 

### The Tech Implementation
* **The Engine:** Framer Motion's `<AnimatePresence mode="wait">` wrapping the Next.js `children` inside a global `Template.tsx` or customized layout component. 
* **The State Manager:** We need a global state (Zustand or React Context) to track *which* project was clicked, so the outgoing animation knows exactly where the user's focus is.

### The UX Choreography (The Click to Page Load)
1. **The Outro (Home Page):** When you click on the "Plottilo" project panel, the scrolling locks. The standard pointer disappears. The massive Serif title of the project scales up exponentially until the letterforms become abstract shapes, acting as a solid color mask that fills the entire viewport. All other elements (grid lines, metadata) quickly fade to black.
2. **The Handshake (Routing):** Next.js handles the soft navigation in the background while the screen is masked by the expanded typography.
3. **The Intro (Project Page):** The new route mounts. The massive typography from the mask seamlessly scales back down to become the Hero Title of the new page. The new background (perhaps a massive, darkened cover image of the project) fades in behind it. 

---

## 8. The Project Deep Dive (`/projects/[slug]`)

The inner pages must not revert to generic blog layouts. They must feel like high-end editorial features analyzing software architecture.

### Section A: The Project Hero (The Matla)
* **UI:** 100vh height. 
* **Layout:** The massive project title dominates the center. A highly structured, terminal-style grid sits at the bottom of the screen containing the technical payload: `[DEPLOYMENT_STATUS]`, `[CORE_REPOSITORIES]`, and `[PRIMARY_STACK]`.
* **UX:** A subtle, continuous downward arrow or text reading "SCROLL_TO_INITIATE" pulses at the absolute bottom center.

### Section B: The Prose & Architecture (MDX Parsing)
The body of the project page is powered by the MDX files, but the React components we map to the Markdown tags will heavily stylize the content.

* **`<p>` (Paragraphs):** Rendered in the secondary Monospace font. Strict, left-aligned, maximum width of 65ch for perfect readability.
* **`<blockquote>` (The "Poetic" element):** Rendered in the massive primary Serif font, breaking out of the content container entirely and overlapping the margins. Used to highlight core problem statements or design philosophies.
* **`<code>` (Code Blocks):** Styled not as standard markdown boxes, but as floating, highly-detailed terminal windows. They include macOS-style traffic light buttons, file path headers, and syntax highlighting that uses the `terminal-green` and `crimson-accent` palette.
* **`<CustomImageGrid>` (Media):** An asymmetrical masonry layout component explicitly built to showcase UI details, wireframes, or database schemas. 

### Section C: The Outro (The Next Stanza)
* **UI:** The bottom of the project page does not just end. It previews the *next* project chronologically.
* **UX:** As the user reaches the bottom of the page, the current project's background fades to `ink-base`. The title of the *next* project slowly translates up from the bottom edge. Clicking it triggers the "Cinematic Cut" transition over again.


## 9\. The Presentation Layer (DOM-Native Physics & Textures)

To achieve the "Poetic Maximalist" aesthetic without the heavy payload of a WebGL canvas, we will rely on advanced CSS properties (`mix-blend-mode`, `backdrop-filter`, `clip-path`) paired with Framer Motion's spring physics.

### 9.1 The Organic Noise Texture (SVG Filter)

Instead of loading a heavy `.mp4` or `.gif` for background grain, we use a pure DOM-based SVG filter. This is performant and infinitely scalable.

  * **Implementation:** Create a global `NoiseOverlay.tsx` component.
  * **The Core Mechanism:** 
  ```html
    <svg className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay">
    <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  ```
  * **Effect:** This applies a subtle, persistent grit over the entire cinematic experience, marrying the raw terminal aesthetic with the physical feel of editorial paper.

### 9.2 The Fluid Magnetic Cursor (Framer Motion)

The cursor must feel like a physical object with weight and drag, not a perfectly tracked digital pointer.

  * **Implementation:** `CustomCursor.tsx` using Framer Motion's `useMotionValue` and `useSpring`.
  * **The Physics Configuration:**
      * Stiffness: `150`
      * Damping: `15`
      * Mass: `0.1`
  * **The Inversion Effect:** The cursor `div` must have `mix-blend-mode: difference` and a background color of `white`. When this hovers over `ink-base` (black), it appears white. When it hovers over a white image or text, it mathematically inverts the pixels beneath it to black, creating an incredibly high-end, bespoke interaction.

### 9.3 Typography Masking (CSS Text Fill)

For the massive Serif titles on the Project Panels (Section 3) and the Cinematic Handshake (Section 7), the text itself becomes the window to the project.

  * **Implementation:** Standard CSS, but pushed to the absolute limit of viewport scale.
  * **The Core Mechanism:**
    ```css
    .project-title-mask {
      background-image: url('/assets/project-preview.webp');
      background-size: cover;
      background-position: center;
      color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
    }
    ```
  * **UX Choreography:** By default, the text is a solid `paper-text` color. On hover, Framer Motion swaps the class to the `.project-title-mask`, instantly turning the elegant typography into a high-resolution video or image preview.

-----
