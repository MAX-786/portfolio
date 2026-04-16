"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useBriefing } from "@/lib/briefing-context";
import BriefingPrompt from "./BriefingPrompt";

const CODE_SNIPPETS = [
  `const router = useRouter();`,
  `export async function GET(req: Request) {`,
  `prisma.user.findMany({ where: { active: true } })`,
  `<motion.div animate={{ opacity: 1 }} />`,
  `const [state, dispatch] = useReducer(reducer, init);`,
  `app.use(cors({ origin: process.env.CLIENT_URL }));`,
  `SELECT id, name FROM projects WHERE year = 2025;`,
  `git rebase -i HEAD~3 && git push --force-with-lease`,
  `docker compose up -d --build`,
  `const schema = z.object({ name: z.string().min(1) });`,
  `useEffect(() => { socket.on("msg", handler); }, []);`,
  `export default function Layout({ children }: Props) {`,
];

function Marquee({ reverse = false, speed = 40 }: { reverse?: boolean; speed?: number }) {
  const items = [...CODE_SNIPPETS, ...CODE_SNIPPETS];
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div
        className="flex gap-12 font-mono text-sm text-paper-text"
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {items.map((snippet, i) => (
          <span key={i} className="shrink-0">{snippet}</span>
        ))}
      </motion.div>
    </div>
  );
}

function Typewriter({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span>
      {displayed}
      {!done && (
        <span className="inline-block w-[0.5em] h-[0.8em] bg-crimson-accent animate-blink ml-0.5 align-baseline" />
      )}
    </span>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { status, heroLine1, heroLine2 } = useBriefing();

  const [line1Done, setLine1Done] = useState(false);
  const briefingReady = status === "done" && !!heroLine1 && !!heroLine2;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const craftingX = useTransform(scrollYProgress, [0, 0.6], ["0%", "-120%"]);
  const logicX = useTransform(scrollYProgress, [0, 0.6], ["0%", "120%"]);
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.6], [1, 0]);
  const marqueeOpacity = useTransform(scrollYProgress, [0, 0.4], [0.15, 0]);

  const handleLine1Complete = useCallback(() => {
    setLine1Done(true);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {/* Background code marquee */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-6"
          style={{ opacity: marqueeOpacity }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Marquee key={i} reverse={i % 2 === 1} speed={35 + i * 5} />
          ))}
        </motion.div>

        {/* Logo masthead — top left */}
        <motion.div
          className="absolute top-8 left-8 z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Image
            src="/logo-wide.png"
            alt="MKH — mkhismkh.com"
            width={120}
            height={65}
            priority
          />
        </motion.div>

        {/* Main title */}
        <h1 className="relative z-10 flex items-baseline gap-[2vw]">
          <AnimatePresence mode="wait">
            {!briefingReady ? (
              <motion.span
                key="default"
                className="flex items-baseline gap-[2vw]"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className="font-serif text-[10vw] leading-none tracking-tight"
                  style={{ x: craftingX, opacity: textOpacity }}
                >
                  Crafting
                </motion.span>
                <motion.span
                  className="font-serif text-[10vw] leading-none tracking-tight"
                  style={{ x: logicX, opacity: textOpacity }}
                >
                  Logic.
                </motion.span>
              </motion.span>
            ) : (
              <motion.span
                key="personalized"
                className="flex items-baseline gap-[2vw]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.span
                  className="font-serif text-[10vw] leading-none tracking-tight"
                  style={{ x: craftingX }}
                >
                  <Typewriter text={heroLine1!} onComplete={handleLine1Complete} />
                </motion.span>
                <motion.span
                  className="font-serif text-[10vw] leading-none tracking-tight"
                  style={{ x: logicX }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: line1Done ? 1 : 0 }}
                >
                  {line1Done ? <Typewriter text={heroLine2!} /> : null}
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
        </h1>

        {/* The Briefing — terminal prompt */}
        <BriefingPrompt />
      </div>
    </section>
  );
}
