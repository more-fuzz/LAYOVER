import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  Public_Sans,
  DM_Mono,
  Caveat,
} from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntroLoader from "@/components/brand/IntroLoader";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  style: "italic",
  weight: "400",
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trails & Tales — Field Guide, After Dark",
  description: "An independent adventure field guide, printed after dark. Discover places, collect experiences, and build your personal adventure memoir.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrumentSerif.variable} ${publicSans.variable} ${dmMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--paper,#F6EFE2)] text-[var(--text,#1A241F)] selection:bg-[var(--flame,#FF5A1F)] selection:text-[var(--ink,#0F1F1A)]">
        <IntroLoader />
        <AuthProvider>
          <Suspense fallback={<header className="h-16 bg-[var(--sand,#EADFC8)] border-b border-[var(--line,#D8CBB0)]" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 flex flex-col pb-16 md:pb-0">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
