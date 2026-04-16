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

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

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

function TextScramble({ text, onComplete, scrambleSpeed = 30 }: {
  text: string;
  onComplete?: () => void;
  scrambleSpeed?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let frame = 0;
    const totalFrames = text.length * 2;
    const interval = setInterval(() => {
      frame++;
      const resolved = Math.floor(frame / 2);
      const chars = text.split("").map((char, i) => {
        if (char === " ") return " ";
        if (i < resolved) return text[i];
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      });
      setDisplayed(chars.join(""));
      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayed(text);
        onCompleteRef.current?.();
      }
    }, scrambleSpeed);
    return () => clearInterval(interval);
  }, [text, scrambleSpeed]);

  return <span>{displayed}</span>;
}

function ScrambleLoader({ base, isActive }: { base: string; isActive: boolean }) {
  const [displayed, setDisplayed] = useState(base);

  useEffect(() => {
    if (!isActive) { setDisplayed(base); return; }
    const interval = setInterval(() => {
      setDisplayed(
        base.split("").map(c =>
          c === " " ? " " : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        ).join("")
      );
    }, 50);
    return () => clearInterval(interval);
  }, [base, isActive]);

  return <span className={isActive ? "text-terminal-muted" : ""}>{displayed}</span>;
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { status, heroLine1, heroLine2, objective } = useBriefing();

  const [line1Done, setLine1Done] = useState(false);
  const isGenerating = status === "generating";
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
        <h1 className="relative z-10 flex flex-wrap items-baseline justify-center gap-[2vw]">
          <AnimatePresence mode="wait">
            {!briefingReady ? (
              <motion.span
                key="default"
                className="flex flex-wrap items-baseline justify-center gap-[2vw]"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className="font-serif text-[10vw] leading-none tracking-tight"
                  style={{ x: craftingX, opacity: textOpacity }}
                >
                  <ScrambleLoader base="Crafting" isActive={isGenerating} />
                </motion.span>
                <motion.span
                  className="font-serif text-[10vw] leading-none tracking-tight"
                  style={{ x: logicX, opacity: textOpacity }}
                >
                  <ScrambleLoader base="Logic." isActive={isGenerating} />
                </motion.span>
              </motion.span>
            ) : (
              <motion.span
                key="personalized"
                className="flex flex-wrap items-baseline justify-center gap-[2vw]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.span
                  className="font-serif text-[10vw] leading-none tracking-tight"
                  style={{ x: craftingX }}
                >
                  <TextScramble text={heroLine1!} onComplete={handleLine1Complete} />
                </motion.span>
                <motion.span
                  className="font-serif text-[10vw] leading-none tracking-tight"
                  style={{ x: logicX }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: line1Done ? 1 : 0 }}
                >
                  {line1Done ? <TextScramble text={heroLine2!} /> : null}
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
        </h1>

        {/* Hero objective subtitle — appears after briefing */}
        <AnimatePresence>
          {briefingReady && objective && line1Done && (
            <motion.p
              className="relative z-10 mt-6 font-mono text-sm tracking-wider text-terminal-muted md:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-crimson-accent">CURRENT_OBJECTIVE:</span>{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={objective}
                  className="text-paper-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {objective}
                </motion.span>
              </AnimatePresence>
            </motion.p>
          )}
        </AnimatePresence>

        {/* The Briefing — terminal prompt */}
        <BriefingPrompt />
      </div>
    </section>
  );
}
