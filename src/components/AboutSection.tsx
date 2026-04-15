"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const IDENTITY = [
  { key: "Name", value: "Mohammad Hussain" },
  { key: "Alias", value: "HiPHEN" },
  { key: "Role", value: "SDE @ Sutra AI" },
  { key: "Stack", value: "TypeScript / Next.js / AWS" },
  { key: "Bio", value: "Open-source gardener: planting PRs, pruning bugs" },
  { key: "Speaks_At", value: "Plone Conf '24, Brasília" },
  { key: "Solves", value: "750+ on LeetCode" },
];

const PHILOSOPHY =
  "I ship things that matter to me \u2014 then open-source them for everyone else. From browser extensions that fix my daily workflow to CMS editors presented on international stages, I build at the intersection of personal frustration and public utility. My stack runs deep: TypeScript end-to-end, AWS orchestration, AI pipelines that actually reach production. The best code I\u2019ve written solved a problem I had at 2 AM. The second best code solved it for a thousand strangers by morning.";

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
