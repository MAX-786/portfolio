import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectShowcase from "@/components/ProjectShowcase";
import ArchiveSection from "@/components/ArchiveSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ProjectShowcase />
      <ArchiveSection />
      {/* Placeholder for contact footer */}
      <section className="flex h-screen items-center justify-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-terminal-muted">
          [ SECTION_05 :: CONNECT ]
        </p>
      </section>
    </main>
  );
}
