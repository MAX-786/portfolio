"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type BriefingStatus = "idle" | "prompting" | "generating" | "done" | "skipped";

interface BriefingData {
  heroLine1: string | null;
  heroLine2: string | null;
  objective: string | null;
}

interface BriefingState extends BriefingData {
  status: BriefingStatus;
  submit: (input: string) => void;
  skip: () => void;
  startPrompting: () => void;
}

const BriefingContext = createContext<BriefingState>({
  status: "idle",
  heroLine1: null,
  heroLine2: null,
  objective: null,
  submit: () => {},
  skip: () => {},
  startPrompting: () => {},
});

export function BriefingProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<BriefingStatus>("idle");
  const [data, setData] = useState<BriefingData>({
    heroLine1: null,
    heroLine2: null,
    objective: null,
  });

  const startPrompting = useCallback(() => {
    setStatus("prompting");
  }, []);

  const skip = useCallback(() => {
    setStatus("skipped");
  }, []);

  const submit = useCallback(async (input: string) => {
    setStatus("generating");

    // Fire-and-forget log
    fetch("/api/briefing/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    }).catch(() => {});

    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!res.ok || !res.body) {
        setStatus("skipped");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const raw = line.slice(6).trim();
            if (raw === "[DONE]") continue;

            try {
              const payload = JSON.parse(raw);

              if (payload.hero_line_1 && payload.hero_line_2) {
                setData({
                  heroLine1: payload.hero_line_1,
                  heroLine2: payload.hero_line_2,
                  objective: payload.objective,
                });
                setStatus("done");
              } else if (payload.objective) {
                setData((prev) => ({
                  ...prev,
                  objective: payload.objective,
                }));
              }
            } catch {
              // skip malformed JSON chunks
            }
          }
        }
      }
    } catch {
      setStatus("skipped");
    }
  }, []);

  return (
    <BriefingContext.Provider
      value={{
        status,
        ...data,
        submit,
        skip,
        startPrompting,
      }}
    >
      {children}
    </BriefingContext.Provider>
  );
}

export function useBriefing() {
  return useContext(BriefingContext);
}
