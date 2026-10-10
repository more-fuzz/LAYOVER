import type { Metadata } from "next";
import { Public_Sans, IBM_Plex_Mono, Caveat } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import SplashLoader from "@/components/SplashLoader";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trails & Tales — Field Guide & Adventure Journal",
  description: "Discover expedition challenges, navigate mysterious folklore destinations, verify completion, earn points, and curate your permanent adventure memoir.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${ibmPlexMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F5F0E7] text-[#292820] selection:bg-[#B85F43] selection:text-[#FFFDF8]">
        <SplashLoader />
        <AuthProvider>
          <Suspense fallback={<header className="h-16 bg-[#EAE1D3] border-b border-[#D6CCBC]" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 flex flex-col pb-16 lg:pb-0">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
