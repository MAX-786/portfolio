import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/projects";

const BASE_URL = "https://mkhismkh.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectRoutes = PROJECTS.map((project) => ({
    url: `${BASE_URL}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectRoutes,
  ];
}
