import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      {/* Placeholder for upcoming sections */}
      <section className="flex h-screen items-center justify-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-terminal-muted">
          [ SECTION_03 :: PROJECTS ]
        </p>
      </section>
    </main>
  );
}
