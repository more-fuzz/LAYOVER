'use client';

import React, { useState, useEffect, useCallback } from 'react';
import LogoMark from './LogoMark';

export function IntroLoader() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  const dismiss = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem('tt_intro_seen', '1');
      } catch {}
    }, 250);
  }, []);

  useEffect(() => {
    setMounted(true);

    // Check reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    try {
      const seen = sessionStorage.getItem('tt_intro_seen');
      if (seen) return;
    } catch {
      return;
    }

    setVisible(true);

    // Auto-dismiss after 1.85s
    const timer = setTimeout(() => {
      dismiss();
    }, 1850);

    // Keydown dismissal
    const handleKeyDown = (e: KeyboardEvent) => {
      dismiss();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismiss]);

  if (!mounted || !visible) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label="Trails & Tales loading introduction"
      onClick={dismiss}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer select-none transition-opacity duration-300 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundColor: 'var(--paper, #F6EFE2)',
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 90, 31, 0.08) 0%, transparent 60%)`,
      }}
    >
      <div className="flex flex-col items-center text-center space-y-5 px-6 animate-intro">
        {/* Animated Brand Logo */}
        <div className="relative p-4">
          <div className="absolute inset-0 rounded-full bg-[#FF5A1F]/10 blur-xl scale-125 pointer-events-none" />
          <LogoMark size={72} className="relative z-10 animate-spin-slow" />
        </div>

        {/* Wordmark */}
        <div className="space-y-1.5">
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-[var(--text,#1A241F)]"
            style={{ letterSpacing: '-0.03em' }}
          >
            Trails <span className="font-serif-italic text-[var(--flame,#FF5A1F)] text-4xl">&amp;</span> Tales
          </h1>
          <p className="text-xs sm:text-sm font-mono tracking-wider uppercase text-[var(--muted,#5E675F)]">
            Go somewhere worth remembering
          </p>
        </div>
      </div>

      {/* 3px Flame Progress Bar at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--line,#D8CBB0)]/40 overflow-hidden">
        <div
          className="h-full bg-[var(--flame,#FF5A1F)] transition-all duration-1800 ease-out"
          style={{
            animation: 'introProgress 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes introProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </aside>
  );
}

export default IntroLoader;
