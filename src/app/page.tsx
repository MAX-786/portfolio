import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      {/* Placeholder for upcoming sections */}
      <section className="flex h-screen items-center justify-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-terminal-muted">
          [ SECTION_02 :: ABOUT ]
        </p>
      </section>
    </main>
  );
}
