export interface Project {
  id: string;
  title: string;
  type: string;
  tagline: string;
  techStack: string[];
  year: string;
  coverImage: string;
  description: string;
  quote: string;
  details: string;
  liveUrl?: string;
  repoUrl?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "prompy",
    title: "Prompy",
    type: "Extension",
    tagline: "Your Prompt Library, Everywhere",
    techStack: ["TypeScript", "React", "Node.js", "MongoDB"],
    year: "2024",
    coverImage: "/projects/prompy.webp",
    description:
      "A browser extension for AI prompt management that lives where you work. Secure OAuth2.0 flows, encrypted local storage, and search indexing tuned for sub-200ms retrieval. The backend syncs user libraries to a MongoDB Atlas cluster through RESTful endpoints built to handle the mess of real-world browser state.",
    quote:
      "The best prompts shouldn\u2019t live in a forgotten Google Doc. They should be one keystroke away.",
    details:
      "Prompy was born from frustration \u2014 copying prompts between tabs, losing good ones in chat history, rebuilding the same instructions weekly. The architecture prioritizes instant access: a persistent service worker indexes prompts locally while syncing upstream, so search feels native even offline. OAuth2.0 handles identity without passwords, and every payload is encrypted at rest.",
    liveUrl: "https://prompy.org",
    repoUrl: "https://github.com/MAX-786/prompy",
  },
  {
    id: "hydra",
    title: "Hydra",
    type: "Open Source",
    tagline: "Decoupled Visual Editor for Plone",
    techStack: ["React", "Volto", "REST API", "Python"],
    year: "2024",
    coverImage: "/projects/hydra.webp",
    description:
      "Built during Google Summer of Code 2024 with the Plone Foundation. Hydra turns Volto into a decoupled visual editor \u2014 any frontend can plug into Plone\u2019s content engine through a bridge layer that handles real-time editing, block selection, toolbar rendering, and live content synchronization without coupling to Volto\u2019s UI.",
    quote:
      "A CMS should serve the frontend, not own it. Hydra cuts the leash.",
    details:
      "The Hydra bridge implements progressive integration \u2014 frontends opt into editing capabilities at their own pace, from simple inline text to full block management with drag-and-drop reordering. Presented the architecture and live demos at Plone Conference 2024 in Bras\u00edlia, demonstrating how a React, Astro, or plain HTML frontend can all use the same content backend.",
    liveUrl: "https://hydra.pretagov.com",
    repoUrl: "https://github.com/collective/volto-hydra",
  },
  {
    id: "kype",
    title: "KYPE",
    type: "Platform",
    tagline: "Honest Professor Reviews",
    techStack: ["React", "MaterialUI", "MongoDB", "Firebase"],
    year: "2023",
    coverImage: "/projects/kype.webp",
    description:
      "A platform where students share unfiltered professor reviews \u2014 the kind of intel that actually matters when picking courses. JWT-authenticated submissions, faceted search across departments, and an async review pipeline that keeps the system responsive under load.",
    quote:
      "Rate My Professor, but built by someone who actually had to sit through those lectures.",
    details:
      "KYPE started as a dorm-room frustration and grew into a full-stack application serving real students. The React frontend renders review cards with composite ratings across teaching quality, difficulty, and workload. Firebase handles auth while MongoDB stores the reviews with indexed queries for fast filtering by department, course code, or rating threshold.",
    repoUrl: "https://github.com/MAX-786/ApnaProfessor",
  },
];
