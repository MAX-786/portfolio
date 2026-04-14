"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ARCHIVE } from "@/lib/archive";

export default function ArchiveSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative px-6 py-32 md:px-16 lg:px-24">
      {/* Section label */}
      <div className="mb-16 font-mono text-xs uppercase tracking-[0.3em] text-terminal-muted">
        [ 04 :: ARCHIVE ]
      </div>

      {/* Table header */}
      <div className="mb-4 grid grid-cols-[100px_1fr_1fr_40px] gap-4 border-b border-terminal-muted/30 pb-4 font-mono text-xs uppercase tracking-[0.2em] text-terminal-muted md:grid-cols-[120px_1fr_200px_60px]">
        <span>Date</span>
        <span>Title</span>
        <span className="hidden md:block">Domain</span>
        <span className="text-right">Link</span>
      </div>

      {/* Table rows */}
      <div
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {ARCHIVE.map((entry, i) => (
          <motion.a
            key={entry.title}
            href={entry.url}
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
    </section>
  );
}
