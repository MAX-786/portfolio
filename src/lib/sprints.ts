export interface Sprint {
  name: string;
  tagline: string;
  description: string;
  url: string;
  tags: string[];
}

export const SPRINTS: Sprint[] = [
  {
    name: "Nexus",
    tagline: "Your second brain. Not Big Tech's.",
    description:
      "BYOK knowledge tracker that auto-summarizes web content, builds a visual knowledge graph, and quizzes your memory. You own every byte.",
    url: "https://github.com/MAX-786/project-nexus",
    tags: ["Knowledge Graph", "BYOK", "AI"],
  },
  {
    name: "Fabric",
    tagline: "Orchestrate anything. Deploy everywhere.",
    description:
      "End-to-end AI automation platform. Chain models, transform data, trigger workflows — one config file to rule them all.",
    url: "https://github.com/MAX-786/fabric",
    tags: ["Automation", "Pipelines", "AI"],
  },
  {
    name: "ZenPiano",
    tagline: "AI hears what your ears forgive.",
    description:
      "Reads MIDI data from your keyboard, spots the wrong notes in real-time, and gently tells you that was not jazz. Learn piano with an honest teacher.",
    url: "https://github.com/MAX-786/zenpiano",
    tags: ["MIDI", "Music", "AI"],
  },
  {
    name: "DevGains",
    tagline: "Track macros like you track commits.",
    description:
      "Daily nutrition logger for developers who optimize everything except what they eat. Calorie counts, macro splits, streak tracking.",
    url: "https://github.com/MAX-786/devgains",
    tags: ["Health", "Tracking", "Utility"],
  },
  {
    name: "Gmailer",
    tagline: "Rich emails to many. Your Gmail, your rules.",
    description:
      "Send beautifully formatted HTML emails to multiple recipients through your own Gmail account. OAuth-secured, no third-party email service needed.",
    url: "https://github.com/MAX-786/gmailer",
    tags: ["Email", "OAuth", "Next.js"],
  },
  {
    name: "MCP Auth",
    tagline: "Claude Desktop deserved a bouncer.",
    description:
      "Authentication layer for Model Context Protocol servers. Plug it into Claude Desktop and stop worrying about who's calling your tools.",
    url: "https://github.com/MAX-786/demo-mcp-with-auth",
    tags: ["MCP", "Auth", "Claude"],
  },
  {
    name: "mkhismkh",
    tagline: "The digital garden. Serverless and alive.",
    description:
      "Personal site with daily journaling, deployed on AWS S3 & CloudFront with Lambda@Edge for dynamic content transforms. Built with Astro.",
    url: "https://github.com/MAX-786/mkhismkh",
    tags: ["Astro", "AWS", "Blog"],
  },
];
