"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const IDENTITY = [
  { key: "Name", value: "Mohammad" },
  { key: "Alias", value: "hiphen" },
  { key: "Role", value: "Software Engineer" },
  { key: "Current_Objective", value: "Redefining UX" },
  { key: "Stack", value: "Next.js / React / Node" },
  { key: "Location", value: "Building in public" },
];

const PHILOSOPHY =
  "I believe software should feel inevitable — every interaction considered, every transition purposeful. I build collaborative tools and platforms where engineering precision meets editorial elegance. The best interfaces don't just work; they speak. They breathe rhythm into data, and poetry into logic. My craft sits at the intersection of systems thinking and sensory design — where architecture serves aesthetics, and function becomes feeling.";

function WordReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const words = text.split(" ");

  return (
    <p ref={ref} className="font-serif text-2xl leading-relaxed md:text-3xl md:leading-relaxed">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{
              duration: 0.5,
              delay: i * 0.02,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </p>
  );
}

function IdentityPayload() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className="font-mono text-sm leading-loose md:text-base">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-terminal-muted">{"// IDENTITY_PAYLOAD"}</span>
        <br />
        <span className="text-terminal-muted">{"{"}</span>
        {IDENTITY.map((item, i) => (
          <motion.div
            key={item.key}
            className="pl-6"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
          >
            <span className="text-terminal-muted">{item.key}:</span>{" "}
            <span className="text-paper-text">&quot;{item.value}&quot;</span>
            {i < IDENTITY.length - 1 && <span className="text-terminal-muted">,</span>}
          </motion.div>
        ))}
        <span className="text-terminal-muted">{"}"}</span>
      </motion.div>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.3"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen px-6 py-32 md:px-16 lg:px-24"
      style={{ y, opacity }}
    >
      <h2 className="sr-only">About</h2>
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2 md:gap-24">
        <div className="flex flex-col justify-center">
          <IdentityPayload />
        </div>
        <div className="flex flex-col justify-center">
          <WordReveal text={PHILOSOPHY} />
        </div>
      </div>

      {/* Decorative grid line */}
      <div className="absolute top-0 left-1/2 h-full w-px bg-terminal-muted/20" />
    </motion.section>
  );
}
