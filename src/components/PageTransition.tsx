"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { useTransitionContext } from "@/lib/transition-context";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { projectTitle, setProjectTitle } = useTransitionContext();

  return (
    <div key={pathname}>
      {/* Exit overlay — solid ink-base wipe */}
      <motion.div
        className="fixed inset-0 z-[90] bg-ink-base"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: "top" }}
      />

      {/* Project title flash during transition */}
      {projectTitle && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center bg-ink-base"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => setProjectTitle(null)}
        >
          <span className="font-serif text-[12vw] leading-none text-paper-text">
            {projectTitle}
          </span>
        </motion.div>
      )}

      {/* Page content entrance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
