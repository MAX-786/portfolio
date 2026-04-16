"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING_CONFIG = { stiffness: 150, damping: 15, mass: 0.1 };

type CursorMode = "default" | "expand" | "caret";
type CursorZone = "hero" | "about" | "projects" | "archive" | "sprint" | "contact" | "none";

const TEXT_TAGS = new Set(["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "BLOCKQUOTE", "LABEL"]);

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, SPRING_CONFIG);
  const springY = useSpring(cursorY, SPRING_CONFIG);

  const [mode, setMode] = useState<CursorMode>("default");
  const [zone, setZone] = useState<CursorZone>("none");

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const zoneEl = (e.target as HTMLElement).closest("[data-cursor-zone]") as HTMLElement | null;
      const newZone = (zoneEl?.dataset.cursorZone ?? "none") as CursorZone;
      setZone(newZone);
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
  const isProjectZone = zone === "projects";

  const getSize = () => {
    if (isExpand) return { width: 60, height: 60, borderRadius: 30 };
    if (isCaret) return { width: 2, height: 24, borderRadius: 1 };
    if (isProjectZone) return { width: 40, height: 40, borderRadius: 20 };
    return { width: 8, height: 8, borderRadius: 4 };
  };

  const { width, height, borderRadius } = getSize();

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[100]"
      animate={{
        width,
        height,
        borderRadius,
      }}
      transition={{ type: "spring", ...SPRING_CONFIG }}
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        mixBlendMode: "difference",
        background: isProjectZone && !isExpand
          ? "radial-gradient(circle, rgba(139,0,0,0.6) 0%, rgba(255,255,255,0.8) 70%)"
          : "white",
      }}
    />
  );
}
