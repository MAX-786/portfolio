"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";

const LINKS = [
  { label: "GITHUB", href: "https://github.com/hiphen" },
  { label: "LINKEDIN", href: "https://linkedin.com/in/hiphen" },
  { label: "EMAIL", href: "mailto:hello@hiphen.dev" },
];

export default function ContactFooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.3"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-paper-text"
      style={{ y }}
    >
      {/* Noise texture behind the text mask */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
        aria-hidden="true"
      >
        <filter id="footer-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves={4}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#footer-noise)" />
      </svg>

      {/* Massive title with noise mask */}
      <motion.h2
        className="relative select-none font-serif text-[18vw] leading-none tracking-tight"
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          color: "transparent",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          filter: "brightness(0.15)",
        }}
      >
        CONNECT.
      </motion.h2>

      {/* Links */}
      <motion.div
        className="relative mt-16 flex gap-12"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-mono text-xs uppercase tracking-[0.3em] text-ink-base/60 transition-colors duration-300 hover:text-ink-base"
            data-cursor="expand"
          >
            {link.label}
          </Link>
        ))}
      </motion.div>

      {/* Bottom signature */}
      <div className="absolute bottom-8 w-full px-8">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-base/30">
          <span>&copy; {new Date().getFullYear()} MOHAMMAD</span>
          <span>DESIGNED &amp; ENGINEERED BY HIPHEN</span>
        </div>
      </div>
    </motion.section>
  );
}
