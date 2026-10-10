'use client';

import React, { useEffect, useState } from 'react';

export default function SplashLoader() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    const hasSeen = sessionStorage.getItem('tt_journal_opened');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasSeen || prefersReducedMotion) {
      return;
    }

    setVisible(true);

    // Sequence: show for ~1.4s, then fade out smoothly for 350ms
    const timerFade = setTimeout(() => {
      setFading(true);
    }, 1400);

    const timerDismiss = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('tt_journal_opened', 'true');
    }, 1750);

    return () => {
      clearTimeout(timerFade);
      clearTimeout(timerDismiss);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F5F0E7] select-none transition-opacity duration-350 cursor-pointer ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Opening Trails & Tales Field Journal"
    >
      {/* Central Stamped Logo Container */}
      <div className="flex flex-col items-center space-y-4 max-w-xs text-center px-6">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          {/* Subtle warm metallic orbital ring reflection */}
          <div className="absolute inset-0 rounded-full border border-[#B85F43]/30 animate-spin-slow opacity-60" />
          <div className="absolute -inset-1.5 rounded-full border border-dashed border-[#C6A45B]/40 animate-reverse-spin opacity-40" />

          {/* Official Trails & Tales Logo Asset */}
          <img
            src="/logo.jpg"
            alt="Trails & Tales"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-full shadow-xs transform motion-safe:animate-fade-in"
          />
        </div>

        {/* Wordmark & Expedition Label */}
        <div className="space-y-1.5">
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#292820] font-sans">
            Trails & Tales
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#777A53] font-bold">
            Field Guide & Adventure Journal
          </div>
        </div>

        {/* Subtle Journal Opening Meter */}
        <div className="w-36 h-1 bg-[#D6CCBC] rounded-full overflow-hidden mt-3">
          <div className="h-full bg-[#B85F43] rounded-full animate-progress" />
        </div>
      </div>
    </div>
  );
}
