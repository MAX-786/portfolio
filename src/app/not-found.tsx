import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center px-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-terminal-muted">
        [ERROR :: 404]
      </div>
      <h1 className="mt-6 font-serif text-[15vw] leading-none tracking-tight">
        VOID.
      </h1>
      <p className="mt-8 max-w-[45ch] text-center font-mono text-sm leading-relaxed text-paper-text/60">
        The requested route does not exist in this system.
        The page may have been moved, deleted, or never initialized.
      </p>
      <Link
        href="/"
        className="mt-12 font-mono text-xs uppercase tracking-[0.3em] text-terminal-muted transition-colors hover:text-paper-text"
        data-cursor="expand"
      >
        &larr; RETURN_TO_INDEX
      </Link>
    </div>
  );
}
