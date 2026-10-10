'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#09100d] border-t border-[#17261d] text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">Trails & Tales</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Gamified adventure travel and personal explorer memoirs. Discover extreme outdoor sports, explore ancient folklore enigmas, verify proof of completion, and earn real rewards.
            </p>
            <div className="pt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Leave-No-Trace & Safety First</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-zinc-200 font-semibold text-xs uppercase tracking-wider mb-3">Expeditions</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explorer" className="hover:text-emerald-400 transition-colors">
                  Interactive Adventure Explorer
                </Link>
              </li>
              <li>
                <Link href="/brave-enough" className="hover:text-amber-300 transition-colors">
                  &quot;Am I Brave Enough?&quot; Spooky Trails
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-emerald-400 transition-colors">
                  Global Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="hover:text-emerald-400 transition-colors">
                  Rewards Catalogue
                </Link>
              </li>
            </ul>
          </div>

          {/* Gamification & Memoir */}
          <div>
            <h4 className="text-zinc-200 font-semibold text-xs uppercase tracking-wider mb-3">Gamified Memoir</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/memoir" className="hover:text-emerald-400 transition-colors">
                  Personal Travel Memoir
                </Link>
              </li>
              <li>
                <Link href="/submissions/new" className="hover:text-emerald-400 transition-colors">
                  Submit Evidence for Review
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Traveler Dashboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-emerald-400 transition-colors">
                  Profile & Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Safety Statement */}
          <div>
            <h4 className="text-zinc-200 font-semibold text-xs uppercase tracking-wider mb-3">Heritage & Protocol</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              All listed destinations adhere to certified national park and cultural heritage guidelines. Do not trespass into restricted, private, or hazardous locations.
            </p>
            <div className="text-[11px] text-zinc-500">
              Built on Next.js 16, Supabase, Leaflet & Tailwind CSS.
            </div>
          </div>
        </div>

        <div className="border-t border-[#14231a] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <div>
            © 2026 Trails & Tales — Gamified Adventure Travel Platform.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-zinc-400">Prototype Release v1.0</span>
            <span className="text-emerald-500 font-medium">Remote Supabase Connected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
