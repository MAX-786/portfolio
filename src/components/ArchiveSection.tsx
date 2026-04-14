"use client";

import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ARCHIVE } from "@/lib/archive";

const SPRING_CONFIG = { stiffness: 200, damping: 25, mass: 0.5 };

function CursorPreview({ title, domain, visible }: { title: string; domain: string; visible: boolean }) {
  return (
    <motion.div
      className="pointer-events-none relative overflow-hidden border border-terminal-muted/30"
      style={{ width: 200, height: 140 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
        <filter id="archive-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={3} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#archive-noise)" />
      </svg>
      <div className="relative flex h-full flex-col justify-end p-3">
        <span className="font-serif text-lg leading-tight text-paper-text">{title}</span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-terminal-muted">
          {domain}
        </span>
      </div>
    </motion.div>
  );
}

export default function ArchiveSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const previewX = useSpring(mouseX, SPRING_CONFIG);
  const previewY = useSpring(mouseY, SPRING_CONFIG);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX + 20);
    mouseY.set(e.clientY - 70);
  };

  return (
    <section ref={ref} className="relative px-6 py-32 md:px-16 lg:px-24">
      {/* Section label */}
      <h2 className="mb-16 font-mono text-xs uppercase tracking-[0.3em] text-terminal-muted">
        [ 04 :: ARCHIVE ]
      </h2>

      {/* Table header */}
      <div className="mb-4 grid grid-cols-[100px_1fr_1fr_40px] gap-4 border-b border-terminal-muted/30 pb-4 font-mono text-xs uppercase tracking-[0.2em] text-terminal-muted md:grid-cols-[120px_1fr_200px_60px]">
        <span>Date</span>
        <span>Title</span>
        <span className="hidden md:block">Domain</span>
        <span className="text-right">Link</span>
      </div>

      {/* Table rows */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {ARCHIVE.map((entry, i) => (
          <motion.a
            key={entry.title}
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid grid-cols-[100px_1fr_1fr_40px] gap-4 border-b border-terminal-muted/10 py-5 font-mono text-sm transition-colors duration-300 md:grid-cols-[120px_1fr_200px_60px]"
            style={{
              opacity: hoveredIndex === null || hoveredIndex === i ? 1 : 0.2,
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            data-cursor="expand"
          >
            <span className="text-terminal-muted">{entry.date}</span>
            <span className="text-paper-text">{entry.title}</span>
            <span className="hidden text-terminal-muted md:block">{entry.domain}</span>
            <span className="text-right text-terminal-muted transition-colors group-hover:text-paper-text">
              ↗
            </span>
          </motion.a>
        ))}
      </div>

      {/* Cursor-following preview card */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 hidden md:block"
        style={{ x: previewX, y: previewY }}
      >
        <CursorPreview
          title={hoveredIndex !== null ? ARCHIVE[hoveredIndex].title : ""}
          domain={hoveredIndex !== null ? ARCHIVE[hoveredIndex].domain : ""}
          visible={hoveredIndex !== null}
        />
      </motion.div>
    </section>
  );
}
