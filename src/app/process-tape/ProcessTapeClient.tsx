"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface TapeEntry {
  date: string;
  project: string;
  text: string;
  tags?: string[];
}

function EntryCard({ entry, index }: { entry: TapeEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      className="group relative grid gap-4 border-b border-terminal-muted/10 py-8 pl-4 md:grid-cols-[140px_1fr]"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
    >
      {/* Left: date + index */}
      <div className="flex items-start gap-4 md:flex-col md:gap-2">
        <span className="font-mono text-xs text-terminal-muted">{entry.date}</span>
        <span className="font-mono text-[10px] text-paper-text/20">
          {String(index + 1).padStart(3, "0")}
        </span>
      </div>

      {/* Right: content */}
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs text-crimson-accent/80">{entry.project}</span>
          {entry.tags?.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] uppercase tracking-[0.15em] text-terminal-muted"
            >
              [{tag}]
            </span>
          ))}
        </div>
        <p className="max-w-[60ch] font-mono text-sm leading-relaxed text-paper-text/80">
          {entry.text}
        </p>
      </div>

      {/* Left border accent on hover */}
      <div className="absolute top-0 left-0 h-full w-px bg-terminal-muted/0 transition-colors duration-300 group-hover:bg-crimson-accent/40" />
    </motion.div>
  );
}

export default function ProcessTapeClient() {
  const [entries, setEntries] = useState<TapeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    fetch("/api/process-tape")
      .then((res) => res.json())
      .then((data: TapeEntry[]) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

      {/* Hero */}
      <section ref={heroRef} className="flex min-h-[60vh] flex-col justify-end px-6 pb-16 pt-28 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-mono text-xs uppercase tracking-[0.3em] text-paper-text/40">
            [ PROCESS_TAPE ]
          </h1>
          <p className="mt-6 max-w-[45ch] font-serif text-4xl leading-tight md:text-5xl">
            How I actually think when{" "}
            <span className="text-crimson-accent">building</span>.
          </p>
          <p className="mt-6 max-w-[55ch] font-mono text-sm leading-relaxed text-terminal-muted">
            Short, dated entries about real decisions on real projects.
            Not a blog. Not polished. This is the raw tape.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="mt-12 flex gap-12 border-t border-terminal-muted/20 pt-6"
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-terminal-muted">
              ENTRIES
            </div>
            <div className="mt-1 font-mono text-sm text-paper-text">
              {loading ? "—" : entries.length}
            </div>
          </div>
          {entries.length > 0 && (
            <>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-terminal-muted">
                  LATEST
                </div>
                <div className="mt-1 font-mono text-sm text-paper-text">
                  {entries[0].date}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-terminal-muted">
                  EARLIEST
                </div>
                <div className="mt-1 font-mono text-sm text-paper-text">
                  {entries[entries.length - 1].date}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </section>

      {/* Entries */}
      <section className="px-6 pb-32 md:px-16 lg:px-24">
        {loading ? (
          <div className="space-y-6 border-t border-terminal-muted/30 pt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded bg-terminal-muted/5" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="border-t border-terminal-muted/30 pt-16 text-center">
            <p className="font-mono text-sm text-terminal-muted">
              No entries yet. The tape is rolling.
            </p>
          </div>
        ) : (
          <div className="border-t border-terminal-muted/30">
            {entries.map((entry, i) => (
              <EntryCard key={entry.date + entry.project + i} entry={entry} index={i} />
            ))}
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-16 flex items-center justify-between border-t border-terminal-muted/20 pt-8">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.3em] text-terminal-muted transition-colors hover:text-paper-text"
            data-cursor="expand"
          >
            ← BACK_TO_INDEX
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-text/20">
            {entries.length} entries logged
          </span>
        </div>
      </section>
    </div>
  );
}
