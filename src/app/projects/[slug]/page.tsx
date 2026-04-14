import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/projects";
import ProjectPageClient from "./ProjectPageClient";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  return <ProjectPageClient project={project} />;
}
