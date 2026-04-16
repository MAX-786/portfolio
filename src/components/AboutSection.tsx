"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useBriefing } from "@/lib/briefing-context";

const IDENTITY = [
  { key: "Name", value: "Mohammad Hussain" },
  { key: "Alias", value: "HiPHEN" },
  { key: "Role", value: "SDE @ Sutra AI" },
  { key: "Stack", value: "TypeScript / Next.js / AWS" },
  { key: "Bio", value: "Open-source gardener: planting PRs, pruning bugs" },
  { key: "Speaks_At", value: "Plone Conf '24, Brasília" },
  { key: "Solves", value: "750+ on LeetCode" },
];

const DEFAULT_OBJECTIVE = "Building tools that solve 2 AM problems";

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
  const { objective, status } = useBriefing();

  const prevObjectiveRef = useRef<string | null>(null);
  const [showPhase2Dot, setShowPhase2Dot] = useState(false);

  const displayedObjective = (status === "done" && objective) ? objective : DEFAULT_OBJECTIVE;

  useEffect(() => {
    if (!objective || status !== "done") return;
    const isPhase2 = prevObjectiveRef.current !== null && prevObjectiveRef.current !== objective;
    prevObjectiveRef.current = objective;
    if (!isPhase2) return;
    setShowPhase2Dot(true);
    const timer = setTimeout(() => setShowPhase2Dot(false), 2000);
    return () => clearTimeout(timer);
  }, [objective, status]);

  const allEntries = [
    ...IDENTITY,
    { key: "Current_Objective", value: displayedObjective },
  ];

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
        {allEntries.map((item, i) => (
          <motion.div
            key={item.key}
            className="pl-6"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
          >
            <span className="text-terminal-muted">
              {item.key}
              {item.key === "Current_Objective" && showPhase2Dot && (
                <motion.span
                  className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-crimson-accent"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0] }}
                  transition={{ duration: 2, times: [0, 0.15, 0.7, 1] }}
                />
              )}
              :
            </span>{" "}
            {item.key === "Current_Objective" ? (
              <AnimatePresence mode="wait">
                <motion.span
                  key={displayedObjective}
                  className="text-paper-text"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.4 }}
                >
                  &quot;{displayedObjective}&quot;
                </motion.span>
              </AnimatePresence>
            ) : (
              <span className="text-paper-text">&quot;{item.value}&quot;</span>
            )}
            {i < allEntries.length - 1 && <span className="text-terminal-muted">,</span>}
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
