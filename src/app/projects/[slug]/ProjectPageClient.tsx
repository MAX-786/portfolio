"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/projects";
import { PROJECTS } from "@/lib/projects";
import { useTransitionContext } from "@/lib/transition-context";

export default function ProjectPageClient({ project }: { project: Project }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: "-10%" });

  const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
  const { setProjectTitle } = useTransitionContext();

  return (
    <div className="min-h-screen">
      {/* Logo — home link */}
      <Link href="/" className="absolute top-8 left-8 z-10" data-cursor="expand">
        <Image
          src="/logo-wide.png"
          alt="MKH — back to home"
          width={100}
          height={54}
          priority
        />
      </Link>

      {/* Section A: Project Hero */}
      <section className="relative flex h-screen flex-col items-center justify-center">
        <motion.h1
          className="font-serif text-[12vw] leading-none tracking-tight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {project.title}
        </motion.h1>

        <motion.p
          className="mt-6 font-mono text-sm uppercase tracking-[0.3em] text-terminal-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {project.tagline}
        </motion.p>

        {/* Technical payload grid */}
        <motion.div
          className="absolute bottom-12 w-full px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8 border-t border-terminal-muted/30 pt-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-terminal-muted">
                [TYPE]
              </div>
              <div className="mt-2 font-mono text-sm text-paper-text">{project.type}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-terminal-muted">
                [PRIMARY_STACK]
              </div>
              <div className="mt-2 font-mono text-sm text-paper-text">
                {project.techStack.join(" / ")}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-terminal-muted">
                [YEAR]
              </div>
              <div className="mt-2 font-mono text-sm text-paper-text">{project.year}</div>
            </div>
          </div>
        </motion.div>

        {/* Scroll prompt */}
        <motion.div
          className="absolute bottom-4 font-mono text-[10px] uppercase tracking-[0.3em] text-terminal-muted"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SCROLL_TO_INITIATE
        </motion.div>
      </section>

      {/* Section B: Prose & Architecture */}
      <section ref={contentRef} className="mx-auto max-w-[65ch] px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <p className="font-mono text-sm leading-relaxed text-paper-text/80">
            {project.description}
          </p>

          <blockquote className="-mx-8 my-16 font-serif text-3xl leading-relaxed md:-mx-16 md:text-4xl">
            &ldquo;{project.quote}&rdquo;
          </blockquote>

          <p className="font-mono text-sm leading-relaxed text-paper-text/80">
            {project.details}
          </p>

          {/* Project links */}
          <div className="flex gap-8 border-t border-terminal-muted/30 pt-8">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-[0.3em] text-terminal-muted transition-colors hover:text-paper-text"
                data-cursor="expand"
              >
                LIVE_DEMO &rarr;
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-[0.3em] text-terminal-muted transition-colors hover:text-paper-text"
                data-cursor="expand"
              >
                SOURCE_CODE &rarr;
              </a>
            )}
          </div>
        </motion.div>
      </section>

      {/* Section C: Next Project Preview */}
      <section className="relative flex h-screen flex-col items-center justify-center border-t border-terminal-muted/20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-terminal-muted">
          NEXT_PROJECT
        </div>
        <Link
          href={`/projects/${nextProject.id}`}
          onClick={() => setProjectTitle(nextProject.title)}
          data-cursor="expand"
          className="mt-8"
        >
          <motion.span
            className="block font-serif text-[10vw] leading-none tracking-tight text-paper-text transition-colors hover:text-paper-text/60"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
          >
            {nextProject.title}
          </motion.span>
        </Link>
        <div className="mt-6 font-mono text-xs text-terminal-muted">
          {nextProject.tagline} &mdash; {nextProject.year}
        </div>

        {/* Back to home */}
        <Link
          href="/"
          className="absolute bottom-8 font-mono text-xs uppercase tracking-[0.3em] text-terminal-muted transition-colors hover:text-paper-text"
          data-cursor="expand"
        >
          &larr; BACK_TO_INDEX
        </Link>
      </section>
    </div>
  );
}
