"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

interface TapeEntry {
  date: string;
  project: string;
  text: string;
  tags?: string[];
}

const VISIBLE_COUNT = 2;
const STALE_DAYS = 60;

function isStale(entries: TapeEntry[]): boolean {
  if (entries.length === 0) return true;
  const latest = new Date(entries[0].date);
  const now = new Date();
  return (now.getTime() - latest.getTime()) / 86_400_000 > STALE_DAYS;
}

function TapeContent({ entries }: { entries: TapeEntry[] }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  const visible = entries.slice(0, VISIBLE_COUNT);
  const remaining = entries.length - VISIBLE_COUNT;

  return (
    <section ref={ref} className="relative px-6 py-32 md:px-16 lg:px-24" data-cursor-zone="about">
      <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-paper-text/40">
        [ 06 :: PROCESS_TAPE ]
      </h2>

      <motion.p
        className="mb-16 max-w-[50ch] font-serif text-2xl leading-relaxed md:text-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        Raw decisions. No <span className="font-mono text-lg text-crimson-accent">polish</span>.
      </motion.p>

      <div className="border-t border-terminal-muted/30">
        {visible.map((entry, i) => (
          <motion.div
            key={entry.date + entry.project}
            className="border-b border-terminal-muted/10 py-6"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className="mb-3 flex items-center gap-4">
              <span className="font-mono text-xs text-terminal-muted">{entry.date}</span>
              <span className="font-mono text-xs text-crimson-accent/70">{entry.project}</span>
              {entry.tags?.map((tag) => (
                <span key={tag} className="font-mono text-[9px] uppercase tracking-[0.15em] text-terminal-muted">
                  [{tag}]
                </span>
              ))}
            </div>
            <p className="max-w-[65ch] font-mono text-sm leading-relaxed text-paper-text/80">
              {entry.text}
            </p>
          </motion.div>
        ))}
      </div>

      {remaining > 0 && (
        <Link
          href="/process-tape"
          target="_blank"
          className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.2em] text-terminal-muted transition-colors hover:text-paper-text"
          data-cursor="expand"
        >
          [ + {remaining} more entries → ]
        </Link>
      )}
    </section>
  );
}

export default function ProcessTape() {
  const [entries, setEntries] = useState<TapeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/process-tape")
      .then((res) => res.json())
      .then((data: TapeEntry[]) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (entries.length === 0 || isStale(entries)) return null;

  return <TapeContent entries={entries} />;
}
