"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
        className="flex gap-12 font-mono text-sm text-terminal-muted"
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

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const craftingX = useTransform(scrollYProgress, [0, 0.6], ["0%", "-120%"]);
  const logicX = useTransform(scrollYProgress, [0, 0.6], ["0%", "120%"]);
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.6], [1, 0]);
  const marqueeOpacity = useTransform(scrollYProgress, [0, 0.4], [0.15, 0]);

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

        {/* Main title */}
        <h1 className="relative z-10 flex items-baseline gap-[2vw]">
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
        </h1>
      </div>
    </section>
  );
}
