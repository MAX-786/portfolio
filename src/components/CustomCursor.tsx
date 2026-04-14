"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING_CONFIG = { stiffness: 150, damping: 15, mass: 0.1 };

type CursorMode = "default" | "expand" | "caret";

const TEXT_TAGS = new Set(["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "BLOCKQUOTE", "LABEL"]);

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, SPRING_CONFIG);
  const springY = useSpring(cursorY, SPRING_CONFIG);

  const [mode, setMode] = useState<CursorMode>("default");

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.cursor === "expand";

      if (isInteractive) {
        setMode("expand");
      } else if (TEXT_TAGS.has(target.tagName)) {
        setMode("caret");
      } else {
        setMode("default");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, [cursorX, cursorY]);

  const isExpand = mode === "expand";
  const isCaret = mode === "caret";

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[100] bg-white"
      animate={{
        width: isExpand ? 60 : isCaret ? 2 : 8,
        height: isExpand ? 60 : isCaret ? 24 : 8,
        borderRadius: isExpand ? 30 : isCaret ? 1 : 4,
      }}
      transition={{ type: "spring", ...SPRING_CONFIG }}
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        mixBlendMode: "difference",
      }}
    />
  );
}
