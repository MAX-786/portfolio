"use client";

export default function GridOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-40"
      aria-hidden="true"
    >
      {/* Vertical center line */}
      <div className="absolute top-0 left-1/2 h-full w-px bg-terminal-muted/10" />
      {/* Horizontal center line */}
      <div className="absolute top-1/2 left-0 h-px w-full bg-terminal-muted/10" />
      {/* Vertical quarter lines */}
      <div className="absolute top-0 left-1/4 h-full w-px bg-terminal-muted/[0.05]" />
      <div className="absolute top-0 left-3/4 h-full w-px bg-terminal-muted/[0.05]" />
    </div>
  );
}
