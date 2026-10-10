import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trails & Tales — Field Guide & Gamified Adventure Journal",
  description: "Discover expedition challenges, navigate mysterious folklore destinations with OpenStreetMap & OSRM, verify completion, earn points, and curate your permanent adventure memoir.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F5F0E7] text-[#292820] selection:bg-[#B85F43] selection:text-[#FFFDF8]">
        <AuthProvider>
          <Suspense fallback={<header className="h-16 bg-[#EAE1D3] border-b border-[#D6CCBC]" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
