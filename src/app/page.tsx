import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectShowcase from "@/components/ProjectShowcase";
import ArchiveSection from "@/components/ArchiveSection";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ProjectShowcase />
      <ArchiveSection />
      <ContactFooter />
    </main>
  );
}
