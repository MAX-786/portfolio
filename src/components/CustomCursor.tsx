"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING_CONFIG = { stiffness: 150, damping: 15, mass: 0.1 };

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, SPRING_CONFIG);
  const springY = useSpring(cursorY, SPRING_CONFIG);

  const cursorSize = useMotionValue(8);
  const springSize = useSpring(cursorSize, SPRING_CONFIG);

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

      cursorSize.set(isInteractive ? 60 : 8);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, [cursorX, cursorY, cursorSize]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full bg-white"
      style={{
        x: springX,
        y: springY,
        width: springSize,
        height: springSize,
        translateX: "-50%",
        translateY: "-50%",
        mixBlendMode: "difference",
      }}
    />
  );
}
