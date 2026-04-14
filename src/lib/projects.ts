export interface Project {
  id: string;
  title: string;
  type: string;
  tagline: string;
  techStack: string[];
  year: string;
  coverImage: string;
}

export const PROJECTS: Project[] = [
  {
    id: "plottilo-01",
    title: "Plottilo",
    type: "Platform",
    tagline: "Collaborative Storytelling Engine",
    techStack: ["Next.js", "Prisma", "Tailwind", "Node.js"],
    year: "2025",
    coverImage: "/projects/plottilo.webp",
  },
  {
    id: "ozgaar-01",
    title: "Ozgaar",
    type: "Tool",
    tagline: "Decentralized Task Orchestrator",
    techStack: ["React", "TypeScript", "WebRTC", "Redis"],
    year: "2024",
    coverImage: "/projects/ozgaar.webp",
  },
  {
    id: "voidshell-01",
    title: "Voidshell",
    type: "CLI",
    tagline: "Terminal-First Development Environment",
    techStack: ["Rust", "WASM", "Node.js"],
    year: "2024",
    coverImage: "/projects/voidshell.webp",
  },
];
