"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface TapeEntry {
  date: string;
  project: string;
  text: string;
  tags?: string[];
  highlights?: string[];
}

interface PageResponse {
  entries: TapeEntry[];
  total: number;
  hasMore: boolean;
  nextPage: number | null;
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
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
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

        {entry.highlights && entry.highlights.length > 0 && (
          <ul className="mt-4 space-y-1 border-l border-terminal-muted/20 pl-3">
            {entry.highlights.map((h, i) => (
              <li key={i} className="font-mono text-xs leading-relaxed text-paper-text/50">
                › {h}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Left border accent on hover */}
      <div className="absolute top-0 left-0 h-full w-px bg-terminal-muted/0 transition-colors duration-300 group-hover:bg-crimson-accent/40" />
    </motion.div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block h-1 w-1 rounded-full bg-terminal-muted"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProcessTapeClient() {
  const [entries, setEntries] = useState<TapeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchPage = useCallback(async (page: number) => {
    try {
      const res = await fetch(`/api/process-tape?page=${page}&limit=10`);
      const data: PageResponse = await res.json();
      return data;
    } catch {
      return null;
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPage(0).then((data) => {
      if (data) {
        setEntries(data.entries);
        setTotal(data.total);
        setNextPage(data.nextPage);
      }
      setLoading(false);
    });
  }, [fetchPage]);

  // Infinite scroll sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && nextPage !== null && !loadingMore) {
          setLoadingMore(true);
          fetchPage(nextPage).then((data) => {
            if (data) {
              setEntries((prev) => [...prev, ...data.entries]);
              setNextPage(data.nextPage);
            }
            setLoadingMore(false);
          });
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [nextPage, loadingMore, fetchPage]);

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
              DAYS LOGGED
            </div>
            <div className="mt-1 font-mono text-sm text-paper-text">
              {loading ? "—" : total}
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
                  SHOWN
                </div>
                <div className="mt-1 font-mono text-sm text-paper-text">
                  {entries.length} / {total}
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

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-px" />

        {/* Loading more indicator */}
        {loadingMore && <LoadingSpinner />}

        {/* End of tape */}
        {!loading && !loadingMore && nextPage === null && entries.length > 0 && (
          <div className="mt-8 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-text/20">
              — end of tape —
            </span>
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
            {total} days logged
          </span>
        </div>
      </section>
    </div>
  );
}
