"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
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
                [DEPLOYMENT_STATUS]
              </div>
              <div className="mt-2 font-mono text-sm text-paper-text">ACTIVE</div>
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
            {project.title} represents a focused exploration into the intersection of
            collaborative interfaces and real-time data orchestration. The architecture
            prioritizes developer experience without sacrificing end-user performance.
          </p>

          <blockquote className="-mx-8 my-16 font-serif text-3xl leading-relaxed md:-mx-16 md:text-4xl">
            &ldquo;The best tools disappear into the workflow — they amplify intent
            without introducing friction.&rdquo;
          </blockquote>

          <p className="font-mono text-sm leading-relaxed text-paper-text/80">
            Built with {project.techStack.join(", ")}, the system leverages server-side
            rendering for initial payload delivery while maintaining client-side reactivity
            for interactive components. The database layer uses optimistic updates with
            conflict resolution to handle concurrent editing sessions.
          </p>

          {/* Terminal-style code block */}
          <div className="overflow-hidden rounded-lg border border-terminal-muted/30">
            <div className="flex items-center gap-2 border-b border-terminal-muted/30 bg-terminal-muted/10 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
              <span className="ml-4 font-mono text-[10px] text-terminal-muted">
                ~/projects/{project.id}/src/index.ts
              </span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-loose">
              <code>
                <span className="text-terminal-muted">{"// Core application entry"}</span>
                {"\n"}
                <span className="text-crimson-accent">import</span>
                {" { createServer } "}
                <span className="text-crimson-accent">from</span>
                {" '"}
                <span className="text-paper-text/70">./server</span>
                {"';\n"}
                <span className="text-crimson-accent">import</span>
                {" { initDatabase } "}
                <span className="text-crimson-accent">from</span>
                {" '"}
                <span className="text-paper-text/70">./db</span>
                {"';\n\n"}
                <span className="text-crimson-accent">const</span>
                {" app = "}
                <span className="text-paper-text">createServer</span>
                {"({\n  port: "}
                <span className="text-paper-text/70">3000</span>
                {",\n  cors: "}
                <span className="text-crimson-accent">true</span>
                {",\n});\n\n"}
                <span className="text-crimson-accent">await</span>
                {" initDatabase();\napp.listen();"}
              </code>
            </pre>
          </div>

          <p className="font-mono text-sm leading-relaxed text-paper-text/80">
            The deployment pipeline automates testing, preview environments, and
            production rollouts through a single configuration file. Each commit
            triggers a full integration test suite before any merge is permitted.
          </p>
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
          {nextProject.tagline} — {nextProject.year}
        </div>

        {/* Back to home */}
        <Link
          href="/"
          className="absolute bottom-8 font-mono text-xs uppercase tracking-[0.3em] text-terminal-muted transition-colors hover:text-paper-text"
          data-cursor="expand"
        >
          ← BACK_TO_INDEX
        </Link>
      </section>
    </div>
  );
}
