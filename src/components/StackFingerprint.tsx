"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface FingerprintEntry {
  date: string;
  action: string;
  repo: string;
  tags: string[];
}

const VISIBLE_COUNT = 2;

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
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => res.json())
      .then((data: FingerprintEntry[]) => {
        setEntries(data.slice(0, 10));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && entries.length === 0) return null;

  const visibleEntries = expanded ? entries : entries.slice(0, VISIBLE_COUNT);
  const hasMore = entries.length > VISIBLE_COUNT;

  return (
    <div ref={ref} className="mt-24">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-paper-text/40">
          <LiveDot />
          LIVE_STACK_FINGERPRINT
        </h3>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper-text/20">
          via GitHub API
        </span>
      </div>

      <div className="mb-3 grid grid-cols-[90px_1fr_1fr] gap-4 border-b border-terminal-muted/20 pb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-paper-text/25 md:grid-cols-[100px_160px_1fr_1fr]">
        <span>Date</span>
        <span>Action</span>
        <span className="hidden md:block">Repo</span>
        <span className="hidden md:block">Tags</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-5 animate-pulse rounded bg-terminal-muted/5" />
          ))}
        </div>
      ) : (
        <>
          <div>
            <AnimatePresence initial={false}>
              {visibleEntries.map((entry, i) => (
                <motion.div
                  key={`${entry.date}-${entry.repo}-${entry.action}-${i}`}
                  className="grid grid-cols-[90px_1fr_1fr] gap-4 border-b border-terminal-muted/5 py-3 font-mono text-xs md:grid-cols-[100px_160px_1fr_1fr]"
                  initial={{ opacity: 0, height: 0 }}
                  animate={isInView ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: i < VISIBLE_COUNT ? i * 0.04 : (i - VISIBLE_COUNT) * 0.03 }}
                >
                  <span className="text-terminal-muted">{entry.date}</span>
                  <span className="text-paper-text/70">{entry.action}</span>
                  <span className="hidden truncate text-paper-text md:block">
                    {entry.repo}
                  </span>
                  <span className="hidden md:flex gap-2 text-terminal-muted">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="text-[10px]">[{tag}]</span>
                    ))}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hasMore && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-terminal-muted transition-colors hover:text-paper-text"
              data-cursor="expand"
            >
              {expanded
                ? `[ − collapse ${entries.length - VISIBLE_COUNT} entries ]`
                : `[ + ${entries.length - VISIBLE_COUNT} more entries ]`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
