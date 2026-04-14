"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface TransitionState {
  projectTitle: string | null;
  setProjectTitle: (title: string | null) => void;
}

const TransitionContext = createContext<TransitionState>({
  projectTitle: null,
  setProjectTitle: () => {},
});

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [projectTitle, setProjectTitle] = useState<string | null>(null);
  return (
    <TransitionContext.Provider value={{ projectTitle, setProjectTitle }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionContext() {
  return useContext(TransitionContext);
}
