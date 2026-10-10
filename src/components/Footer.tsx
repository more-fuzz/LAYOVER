'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, ExternalLink, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FFFDF8] border-t-2 border-[#D6CCBC] text-[#6D685C] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D6CCBC] flex items-center justify-center bg-[#FFFDF8] shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Trails & Tales Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-[#292820] text-base font-sans">Trails & Tales</span>
            </div>
            <p className="text-xs text-[#6D685C] leading-relaxed">
              An independent field guide and travel journal. Discover mountain routes, explore ancient folklore enigmas, verify physical achievements, and earn gear rewards.
            </p>
            <div className="pt-1 text-xs text-[#777A53] font-semibold flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-4 h-4 text-[#777A53]" />
              <span>Leave-No-Trace & Safety First</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#292820] font-bold text-xs uppercase tracking-wider mb-3 font-mono">
              Field Expeditions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explorer" className="hover:text-[#292820] hover:underline transition-colors">
                  Adventure Map & Route Planning
                </Link>
              </li>
              <li>
                <Link href="/arena" className="hover:text-[#292820] hover:underline transition-colors">
                  Adventure Arena & Points
                </Link>
              </li>
              <li>
                <Link href="/brave-enough" className="hover:text-[#B85F43] hover:underline transition-colors">
                  Am I Brave Enough? (Enigmas)
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="hover:text-[#292820] hover:underline transition-colors">
                  Rewards Catalogue
                </Link>
              </li>
            </ul>
          </div>

          {/* Gamification & Memoir */}
          <div>
            <h4 className="text-[#292820] font-bold text-xs uppercase tracking-wider mb-3 font-mono">
              Memoir & Verification
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/memoir" className="hover:text-[#292820] hover:underline transition-colors">
                  Personal Travel Memoir
                </Link>
              </li>
              <li>
                <Link href="/submissions/new" className="hover:text-[#292820] hover:underline transition-colors">
                  Submit Evidence for Review
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#292820] hover:underline transition-colors">
                  Traveler Dashboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#292820] hover:underline transition-colors">
                  Profile & Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Heritage & Safety Statement */}
          <div>
            <h4 className="text-[#292820] font-bold text-xs uppercase tracking-wider mb-3 font-mono">
              Heritage Protocol
            </h4>
            <p className="text-xs text-[#6D685C] leading-relaxed mb-3">
              All listed destinations adhere to certified national park and cultural heritage guidelines. Never trespass into restricted or hazardous locations.
            </p>
            <div className="text-[11px] text-[#8E8675] font-mono">
              Curated trail cartography & road navigation.
            </div>
          </div>
        </div>

        <div className="border-t border-[#D6CCBC] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E8675] gap-4 font-mono">
          <div>
            © 2026 Trails & Tales — Field Travel Journal.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="retro-stamp text-[9px]">FIELD GUIDE v2.0</span>
            <span className="text-[#777A53] font-bold">Verified Travel Records</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
