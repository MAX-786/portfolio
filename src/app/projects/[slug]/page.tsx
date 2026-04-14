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
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="font-mono text-terminal-muted">PROJECT_NOT_FOUND</p>
      </div>
    );
  }

  return <ProjectPageClient project={project} />;
}
