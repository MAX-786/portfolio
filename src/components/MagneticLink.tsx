"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING_CONFIG = { stiffness: 150, damping: 15, mass: 0.1 };

interface MagneticLinkProps {
  href: string;
  label: string;
  hoverLabel: string;
  external?: boolean;
  className?: string;
}

export default function MagneticLink({
  href,
  label,
  hoverLabel,
  external = false,
  className = "",
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-grid overflow-hidden font-mono text-xs uppercase tracking-[0.3em] ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-cursor="expand"
    >
      {/* Both labels in same grid cell — container sizes to the wider one */}
      <span className="col-start-1 row-start-1">
        <motion.span
          className="block"
          animate={{ y: isHovered ? "-100%" : "0%" }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
        >
          {label}
        </motion.span>
      </span>
      <span className="col-start-1 row-start-1">
        <motion.span
          className="block"
          animate={{ y: isHovered ? "0%" : "100%" }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
        >
          {hoverLabel}
        </motion.span>
      </span>
    </motion.a>
  );
}
