'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogoMark } from '@/components/brand/LogoMark';
import { Icon, IconName } from '@/components/ui/Icon';

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, role, switchDemoRole, isDemoUser } = useAuth();

  const navLinks: { href: string; label: string; icon: IconName }[] = [
    { href: '/explorer', label: 'Explore', icon: 'compass' },
    { href: '/arena', label: 'Arena', icon: 'trophy' },
    { href: '/memoir', label: 'Journal', icon: 'book' },
    { href: '/rewards', label: 'Rewards', icon: 'ticket' },
  ];

  const mobileTabs: { href: string; label: string; icon: IconName }[] = [
    ...navLinks,
    { href: '/profile', label: 'Profile', icon: 'user' },
  ];

  const isAuthenticated = !!user || !isDemoUser;
  // Redeemable points balance: only show if present on profile
  const redeemablePoints = profile?.points;

  return (
    <>
      {/* 1. Desktop & Mobile Header Bar */}
      <header className="sticky top-0 z-40 bg-[var(--card,#FFFAF0)] border-b border-[var(--line,#D8CBB0)]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="logo flex items-center gap-3 group focus:outline-hidden">
              <LogoMark className="shrink-0" />
              <div className="flex items-baseline gap-1">
                <span className="font-display font-extrabold text-lg tracking-tight text-[var(--ink,#0F1F1A)]">
                  Trails
                </span>
                <span className="font-serif-accent text-lg text-[var(--flame,#FF5A1F)]">
                  &amp;
                </span>
                <span className="font-display font-extrabold text-lg tracking-tight text-[var(--ink,#0F1F1A)]">
                  Tales
                </span>
              </div>
            </Link>

            {/* Desktop Navigation (Explore · Arena · Journal · Rewards) */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-[var(--ink,#0F1F1A)] font-bold'
                        : 'text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 left-0 h-[3px] bg-[var(--flame,#FF5A1F)] transition-all duration-250 ease-[cubic-bezier(.2,.8,.2,1)] ${
                        isActive ? 'w-full' : 'w-0'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right Side: Points Chip & Avatar or Auth Actions */}
            <div className="flex items-center gap-3">
              {/* Optional Demo Persona Switcher (discreet pill for testing) */}
              <div className="hidden lg:flex items-center bg-[var(--sand,#EADFC8)] p-0.5 rounded-[var(--radius-sm,8px)] border border-[var(--line,#D8CBB0)] text-[10px] font-mono-label">
                <button
                  type="button"
                  onClick={() => switchDemoRole('traveler')}
                  className={`px-2 py-0.5 rounded-[6px] transition-colors ${
                    role === 'traveler'
                      ? 'bg-[var(--card,#FFFAF0)] text-[var(--ink,#0F1F1A)] font-bold shadow-xs'
                      : 'text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)]'
                  }`}
                  title="Switch to Traveler persona"
                >
                  Traveler
                </button>
                <button
                  type="button"
                  onClick={() => switchDemoRole('admin')}
                  className={`px-2 py-0.5 rounded-[6px] transition-colors ${
                    role === 'admin'
                      ? 'bg-[var(--flame,#FF5A1F)] text-[var(--ink,#0F1F1A)] font-bold shadow-xs'
                      : 'text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)]'
                  }`}
                  title="Switch to Admin persona"
                >
                  Admin
                </button>
              </div>

              {isAuthenticated ? (
                <>
                  {/* Citron points chip (shows redeemable balance only) */}
                  {typeof redeemablePoints === 'number' && (
                    <Link
                      href="/rewards"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius,14px)] bg-[var(--citron,#D8F23C)] text-[var(--ink,#0F1F1A)] border border-[var(--citron,#D8F23C)] font-mono-label text-xs font-bold transition-transform hover:-translate-y-0.5"
                      title="Redeemable points balance"
                    >
                      <Icon name="ticket" size={14} aria-hidden="true" />
                      <span className="tabular-nums font-bold">
                        {redeemablePoints.toLocaleString()} PTS
                      </span>
                    </Link>
                  )}

                  {/* Avatar button leading directly to Profile */}
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 p-1 rounded-full border border-[var(--line,#D8CBB0)] hover:border-[var(--flame,#FF5A1F)] transition-colors"
                    aria-label={`Profile for ${profile?.display_name || 'user'}`}
                  >
                    <img
                      src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={profile?.display_name || 'Profile'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/auth/login"
                    className="text-sm font-semibold text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)] px-3 py-2 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-field btn-flame text-sm py-2 px-4 shadow-xs"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Mobile Bottom Tab Bar (56px tall, icon + label, aria-current="page") */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[56px] bg-[var(--card,#FFFAF0)] border-t border-[var(--line,#D8CBB0)] flex items-center justify-around px-2 shadow-md pb-[env(safe-area-inset-bottom)]"
      >
        {mobileTabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center h-full py-1 text-[10px] font-semibold transition-colors ${
                isActive
                  ? 'text-[var(--flame,#FF5A1F)] font-bold'
                  : 'text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)]'
              }`}
            >
              <Icon
                name={tab.icon}
                size={20}
                className={`mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`}
                aria-hidden="true"
              />
              <span className="truncate max-w-[64px]">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
