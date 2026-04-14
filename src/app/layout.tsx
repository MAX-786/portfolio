import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NoiseOverlay from "@/components/NoiseOverlay";
import GridOverlay from "@/components/GridOverlay";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import ReducedMotionProvider from "@/components/ReducedMotionProvider";
import { TransitionProvider } from "@/lib/transition-context";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohammad — Software Engineer",
  description: "Crafting Logic. A portfolio by Mohammad (hiphen). Engineering precision meets editorial elegance.",
  metadataBase: new URL("https://hiphen.dev"),
  openGraph: {
    title: "Mohammad — Software Engineer",
    description: "Crafting Logic. Engineering precision meets editorial elegance.",
    url: "https://hiphen.dev",
    siteName: "hiphen.dev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammad — Software Engineer",
    description: "Crafting Logic. Engineering precision meets editorial elegance.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="min-h-screen overflow-x-hidden bg-ink-base text-paper-text">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only fixed top-4 left-1/2 z-[200] -translate-x-1/2 bg-paper-text px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-base focus:outline-none"
        >
          Skip to content
        </a>
        <ReducedMotionProvider>
          <TransitionProvider>
            <SmoothScroll>
              <NoiseOverlay />
              <GridOverlay />
              <CustomCursor />
              <div id="main-content">{children}</div>
            </SmoothScroll>
          </TransitionProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
