"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center px-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-crimson-accent">
        [SYSTEM :: FAULT]
      </div>
      <h1 className="mt-6 font-serif text-[10vw] leading-none tracking-tight">
        ERR.
      </h1>
      <p className="mt-8 max-w-[45ch] text-center font-mono text-sm leading-relaxed text-paper-text/60">
        An unexpected exception occurred during render.
        The process can be re-initialized.
      </p>
      <button
        onClick={reset}
        className="mt-12 font-mono text-xs uppercase tracking-[0.3em] text-terminal-muted transition-colors hover:text-paper-text"
        data-cursor="expand"
      >
        REINITIALIZE &rarr;
      </button>
    </div>
  );
}
