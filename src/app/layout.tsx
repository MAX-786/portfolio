import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NoiseOverlay from "@/components/NoiseOverlay";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
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
  description: "Crafting Logic. A portfolio by Mohammad (hiphen).",
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
        <TransitionProvider>
          <SmoothScroll>
            <NoiseOverlay />
            <CustomCursor />
            {children}
          </SmoothScroll>
        </TransitionProvider>
      </body>
    </html>
  );
}
