'use client';

import React from 'react';
import Link from 'next/link';
import { LogoMark } from '@/components/brand/LogoMark';
import { Icon } from '@/components/ui/Icon';

export default function Footer() {
  return (
    <footer className="bg-[var(--sand,#EADFC8)] border-t border-[var(--line,#D8CBB0)] text-[var(--muted,#5E675F)] text-xs mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <LogoMark className="w-8 h-8 shrink-0" />
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-base text-[var(--ink,#0F1F1A)]">
                  Trails
                </span>
                <span className="font-serif-accent text-base text-[var(--flame,#FF5A1F)]">
                  &amp;
                </span>
                <span className="font-display font-bold text-base text-[var(--ink,#0F1F1A)]">
                  Tales
                </span>
              </div>
            </div>
            <p className="text-xs text-[var(--muted,#5E675F)] leading-relaxed">
              An independent adventure field guide, printed after dark. Discover mountain routes, explore ancient folklore enigmas, verify physical achievements, and earn gear rewards.
            </p>
            <div className="pt-1 text-xs text-[var(--jade-deep,#0B7A50)] font-semibold flex items-center gap-2 font-mono-label">
              <Icon name="shield-check" size={16} aria-hidden="true" />
              <span>Leave-No-Trace &amp; Safety First</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[var(--ink,#0F1F1A)] font-bold text-xs uppercase tracking-wider mb-4 font-mono-label">
              Field Expeditions
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/explorer" className="hover:text-[var(--ink,#0F1F1A)] hover:underline transition-colors">
                  Adventure Map &amp; Routes
                </Link>
              </li>
              <li>
                <Link href="/arena" className="hover:text-[var(--ink,#0F1F1A)] hover:underline transition-colors">
                  Adventure Arena &amp; Points
                </Link>
              </li>
              <li>
                <Link href="/brave-enough" className="hover:text-[var(--folklore,#B8390A)] hover:underline transition-colors">
                  Am I Brave Enough? (Enigmas)
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="hover:text-[var(--ink,#0F1F1A)] hover:underline transition-colors">
                  Rewards Catalogue
                </Link>
              </li>
            </ul>
          </div>

          {/* Memoir & Verification */}
          <div>
            <h4 className="text-[var(--ink,#0F1F1A)] font-bold text-xs uppercase tracking-wider mb-4 font-mono-label">
              Memoir &amp; Records
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/memoir" className="hover:text-[var(--ink,#0F1F1A)] hover:underline transition-colors">
                  Personal Travel Memoir
                </Link>
              </li>
              <li>
                <Link href="/submissions/new" className="hover:text-[var(--ink,#0F1F1A)] hover:underline transition-colors">
                  Record Completion
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[var(--ink,#0F1F1A)] hover:underline transition-colors">
                  Profile &amp; Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Heritage Notice */}
          <div>
            <h4 className="text-[var(--ink,#0F1F1A)] font-bold text-xs uppercase tracking-wider mb-4 font-mono-label">
              Heritage Protocol
            </h4>
            <p className="text-xs text-[var(--muted,#5E675F)] leading-relaxed mb-4">
              All listed destinations adhere to certified public trail guidelines. Respect private boundaries and sacred regional ground.
            </p>
            <div className="font-mono-label text-[10px] text-[var(--muted,#5E675F)]">
              Public, accessible places only.
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--line,#D8CBB0)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--muted,#5E675F)] gap-4">
          <p>&copy; {new Date().getFullYear()} Trails &amp; Tales. Field Guide Edition.</p>
          <p className="font-serif-accent text-sm text-[var(--ink,#0F1F1A)]">
            Go somewhere worth remembering.
          </p>
        </div>
      </div>
    </footer>
  );
}
