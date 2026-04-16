"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBriefing } from "@/lib/briefing-context";

const PROMPT_LABEL = "> WHO_SENT_YOU: ";
const TYPING_SPEED = 25;
const INACTIVITY_TIMEOUT = 12_000;

export default function BriefingPrompt() {
  const { status, submit, skip, startPrompting } = useBriefing();
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [typedLabel, setTypedLabel] = useState("");
  const [labelDone, setLabelDone] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dismissing, setDismissing] = useState(false);

  // Start prompting immediately on mount
  useEffect(() => {
    if (status !== "idle") return;
    startPrompting();
  }, [status, startPrompting]);

  // Typewriter for label — input is already focusable during this
  useEffect(() => {
    if (status !== "prompting") return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedLabel(PROMPT_LABEL.slice(0, i));
      if (i >= PROMPT_LABEL.length) {
        clearInterval(interval);
        setLabelDone(true);
      }
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, [status]);

  // Auto-focus input as soon as status is prompting
  useEffect(() => {
    if (status === "prompting") {
      inputRef.current?.focus();
    }
  }, [status]);

  // Inactivity timeout — starts after label finishes typing, resets on keypress
  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDismissing(true);
      setTimeout(() => skip(), 400);
    }, INACTIVITY_TIMEOUT);
  }, [skip]);

  useEffect(() => {
    if (labelDone && status === "prompting") {
      resetTimeout();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [labelDone, status, resetTimeout]);

  // Escape key to dismiss
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status === "prompting") {
        setDismissing(true);
        setTimeout(() => skip(), 400);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [status, skip]);

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDismissing(true);
    setTimeout(() => {
      if (trimmed) {
        submit(trimmed);
      } else {
        skip();
      }
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    resetTimeout();
  };

  const showPrompt = status === "prompting";

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          ref={containerRef}
          className="absolute bottom-8 left-8 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={
            dismissing
              ? { opacity: 0, y: 20 }
              : { opacity: 1, y: 0 }
          }
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex items-center font-mono text-sm md:text-base">
            <span className="text-terminal-muted whitespace-pre">
              {typedLabel}
            </span>
            <span className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent text-paper-text outline-none focus-visible:outline-none caret-transparent w-[200px] md:w-[300px]"
                autoComplete="off"
                spellCheck={false}
                aria-label="Who sent you here?"
              />
              {/* Blinking block cursor — tracks input length */}
              <span
                className="pointer-events-none absolute top-0 left-0 inline-block h-[1.1em] w-[0.6em] bg-crimson-accent animate-blink"
                style={{ transform: `translateX(${inputValue.length}ch)` }}
              />
            </span>
          </div>
          {/* Skip hint */}
          <motion.span
            className="mt-2 block font-mono text-xs text-terminal-muted/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: labelDone ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            [esc to skip]
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
