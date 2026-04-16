"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface FingerprintEntry {
  date: string;
  action: string;
  repo: string;
  detail: string;
}

function LiveDot() {
  return (
    <motion.span
      className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#27C93F]"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  );
}

export default function StackFingerprint() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const [entries, setEntries] = useState<FingerprintEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => res.json())
      .then((data: FingerprintEntry[]) => {
        setEntries(data.slice(0, 12));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && entries.length === 0) return null;

  return (
    <div ref={ref} className="mt-24">
      {/* Section label */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-paper-text/40">
          <LiveDot />
          LIVE_STACK_FINGERPRINT
        </h3>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper-text/20">
          via GitHub API
        </span>
      </div>

      {/* Table header */}
      <div className="mb-3 grid grid-cols-[80px_1fr_1fr] gap-3 border-b border-terminal-muted/20 pb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-paper-text/25 md:grid-cols-[90px_140px_120px_1fr]">
        <span>Date</span>
        <span>Action</span>
        <span className="hidden md:block">Repo</span>
        <span className="hidden md:block">Detail</span>
      </div>

      {/* Rows */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-5 animate-pulse rounded bg-terminal-muted/5" />
          ))}
        </div>
      ) : (
        <div>
          {entries.map((entry, i) => (
            <motion.div
              key={`${entry.date}-${entry.repo}-${i}`}
              className="grid grid-cols-[80px_1fr_1fr] gap-3 border-b border-terminal-muted/5 py-3 font-mono text-xs md:grid-cols-[90px_140px_120px_1fr]"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <span className="text-terminal-muted">{entry.date.slice(5)}</span>
              <span className="text-paper-text/70">{entry.action}</span>
              <span className="hidden truncate text-crimson-accent/70 md:block">
                {entry.repo}
              </span>
              <span className="hidden truncate text-terminal-muted md:block">
                {entry.detail}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
