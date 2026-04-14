"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROJECTS } from "@/lib/projects";
import ProjectPanel from "@/components/ProjectPanel";

export default function ProjectShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const panelCount = PROJECTS.length;
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(panelCount - 1) * 100}vw`]);

  const labelOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    <section ref={sectionRef} style={{ height: `${panelCount * 100}vh` }} className="relative">
      {/* Section label */}
      <motion.div
        className="absolute top-8 left-8 z-10 font-mono text-xs uppercase tracking-[0.3em] text-terminal-muted"
        style={{ opacity: labelOpacity, position: "fixed" }}
      >
        [ 03 :: SELECTED_WORK ]
      </motion.div>

      {/* Horizontal scroll container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="flex h-full" style={{ x }}>
          {PROJECTS.map((project, i) => (
            <ProjectPanel key={project.id} project={project} index={i} />
          ))}
        </motion.div>

        {/* Scroll progress indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-4 font-mono text-xs text-terminal-muted">
            <motion.span>
              {String(1).padStart(2, "0")}
            </motion.span>
            <div className="relative h-px w-32 bg-terminal-muted/30">
              <motion.div
                className="absolute top-0 left-0 h-full bg-paper-text"
                style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
              />
            </div>
            <span>{String(panelCount).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
