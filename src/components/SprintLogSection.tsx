"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SPRINTS } from "@/lib/sprints";

function SprintRow({ sprint, index, isInView }: {
  sprint: (typeof SPRINTS)[number];
  index: number;
  isInView: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.a
      href={sprint.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border-b border-terminal-muted/10"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      data-cursor="expand"
    >
      {/* Main row */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 py-5 md:grid-cols-[auto_200px_1fr_auto]">
        {/* Status dot + index */}
        <div className="flex items-center gap-3">
          <motion.div
            className="h-2 w-2 rounded-full bg-[#27C93F]"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
          />
          <span className="font-mono text-[10px] text-terminal-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Name in serif */}
        <span className="font-serif text-xl tracking-tight text-paper-text transition-colors group-hover:text-crimson-accent md:text-2xl">
          {sprint.name}
        </span>

        {/* Tagline — hidden on small screens */}
        <span className="hidden font-mono text-xs text-terminal-muted md:block">
          {sprint.tagline}
        </span>

        {/* Arrow */}
        <span className="font-mono text-xs text-terminal-muted transition-colors group-hover:text-paper-text">
          ↗
        </span>
      </div>

      {/* Expanded detail — revealed on hover */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 pb-6 pl-[38px] md:grid-cols-[200px_1fr] md:pl-[38px]">
              {/* Tagline on mobile */}
              <p className="font-mono text-xs text-terminal-muted md:hidden">
                {sprint.tagline}
              </p>

              {/* Description */}
              <p className="font-mono text-xs leading-relaxed text-paper-text/60 md:col-start-2">
                {sprint.description}
              </p>

              {/* Tags */}
              <div className="flex gap-2 md:col-start-2">
                {sprint.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] uppercase tracking-[0.15em] text-terminal-muted"
                  >
                    [{tag}]
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.a>
  );
}

export default function SprintLogSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <section ref={ref} className="relative px-6 py-32 md:px-16 lg:px-24">
      {/* Section header */}
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-paper-text/40">
          [ 05 :: AI_IN_A_DAY ]
        </h2>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-text/40">
          {SPRINTS.length}/{SPRINTS.length} DEPLOYED
        </div>
      </div>

      {/* Subheading */}
      <motion.p
        className="mb-16 max-w-[50ch] font-serif text-2xl leading-relaxed md:text-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        Sunrise to <span className="font-mono text-lg text-crimson-accent">git push</span>.
        {" "}Tools built in a day, open-sourced by night.
      </motion.p>

      {/* Sprint rows */}
      <div className="border-t border-terminal-muted/30">
        {SPRINTS.map((sprint, i) => (
          <SprintRow key={sprint.name} sprint={sprint} index={i} isInView={isInView} />
        ))}
      </div>

      {/* Footer note */}
      <motion.p
        className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-text/30"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        Built with AI coding assistants &middot; README.md has the full story on each
      </motion.p>
    </section>
  );
}
