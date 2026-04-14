"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { useTransitionContext } from "@/lib/transition-context";

export default function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const { setProjectTitle } = useTransitionContext();

  const handleClick = () => {
    setProjectTitle(project.title);
  };

  return (
    <div className="relative flex h-screen w-screen shrink-0 items-center justify-center overflow-hidden">
      {/* Corner metadata */}
      <div className="absolute top-8 left-8 font-mono text-xs uppercase tracking-[0.2em] text-terminal-muted">
        <div>{project.year}</div>
        <div className="mt-1 text-paper-text/40">{String(index + 1).padStart(2, "0")}</div>
      </div>

      <div className="absolute top-8 right-8 font-mono text-xs uppercase tracking-[0.2em] text-terminal-muted text-right">
        <div>{project.type}</div>
        <div className="mt-1 text-paper-text/40">{project.tagline}</div>
      </div>

      <div className="absolute bottom-8 left-8 font-mono text-xs text-terminal-muted">
        {project.techStack.map((tech) => `[${tech}]`).join(" ")}
      </div>

      <div className="absolute bottom-8 right-8 font-mono text-xs uppercase tracking-[0.2em] text-terminal-muted">
        VIEW_PROJECT →
      </div>

      {/* Massive project title — clickable link */}
      <Link
        href={`/projects/${project.id}`}
        onClick={handleClick}
        data-cursor="expand"
      >
        <motion.h2
          className="relative select-none font-serif text-[15vw] leading-none tracking-tight"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            backgroundImage: isHovered
              ? `linear-gradient(135deg, #8B0000 0%, #333 50%, #050505 100%)`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            WebkitBackgroundClip: isHovered ? "text" : "unset",
            backgroundClip: isHovered ? "text" : "unset",
            color: isHovered ? "transparent" : "var(--paper-text)",
            transition: "color 0.3s ease",
          }}
        >
          {project.title}
        </motion.h2>
      </Link>

      {/* Decorative border lines */}
      <div className="absolute inset-8 border border-terminal-muted/10 pointer-events-none" />
    </div>
  );
}
