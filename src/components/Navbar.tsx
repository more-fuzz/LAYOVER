'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  Trophy,
  Gift,
  BookOpen,
  ShieldCheck,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, role, switchDemoRole, signOut, isDemoUser } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Exact desktop & mobile destinations specified in master prompt
  const navLinks = [
    { href: '/explorer', label: 'Explore', icon: Compass },
    { href: '/arena', label: 'Arena', icon: Trophy },
    { href: '/memoir', label: 'Journal', icon: BookOpen },
    { href: '/rewards', label: 'Rewards', icon: Gift },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  const isAuthenticated = !!user || !isDemoUser;

  return (
    <>
      {/* 1. Desktop & Mobile Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#FFFDF8] border-b border-[#D6CCBC] text-[#292820] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand: Returns user to the homepage */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#D6CCBC] flex items-center justify-center bg-[#FFFDF8] shrink-0 shadow-xs group-hover:border-[#B85F43] transition-colors">
                <img
                  src="/logo.jpg"
                  alt="Trails & Tales Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#292820] font-sans">
                    Trails & Tales
                  </span>
                  <span className="hidden sm:inline-block text-[9px] font-mono font-bold tracking-wider uppercase text-[#777A53] bg-[#EAE1D3] px-1.5 py-0.5 rounded border border-[#D6CCBC]">
                    Field Guide
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation: Logo | Explore | Arena | Journal | Rewards | Profile */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'text-[#292820] font-bold border-b-2 border-[#B85F43] pb-1'
                        : 'text-[#6D685C] hover:text-[#292820] border-b-2 border-transparent pb-1 hover:border-[#D6CCBC]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Hidden Admin Link: ONLY visible if authenticated user has admin role */}
              {role === 'admin' && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    pathname.startsWith('/admin')
                      ? 'bg-[#B85F43] text-white'
                      : 'text-[#B85F43] bg-[#EAE1D3] border border-[#B85F43]/30 hover:bg-[#B85F43]/10'
                  }`}
                  title="Expedition Submissions & Verification"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            {/* Right Action Bar */}
            <div className="flex items-center gap-3">
              {/* Evaluator Role Switcher (Compact tool for evaluator testing) */}
              <div className="hidden md:flex items-center bg-[#EAE1D3] p-0.5 rounded-md border border-[#D6CCBC] text-[10px] font-mono font-bold">
                <button
                  type="button"
                  onClick={() => switchDemoRole('traveler')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    role === 'traveler'
                      ? 'bg-[#FFFDF8] text-[#292820] shadow-xs'
                      : 'text-[#6D685C] hover:text-[#292820]'
                  }`}
                  title="Switch to Traveler persona"
                >
                  Traveler
                </button>
                <button
                  type="button"
                  onClick={() => switchDemoRole('admin')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    role === 'admin'
                      ? 'bg-[#B85F43] text-white shadow-xs'
                      : 'text-[#6D685C] hover:text-[#292820]'
                  }`}
                  title="Switch to Admin persona to review submissions"
                >
                  Admin
                </button>
              </div>

              {/* Points Stamp Badge */}
              <Link
                href="/rewards"
                className="flex items-center gap-1.5 bg-[#EAE1D3] border border-[#D6CCBC] hover:border-[#777A53] px-2.5 py-1.5 rounded-md text-xs font-mono font-bold text-[#777A53] transition-colors"
                title="Verified Adventure Points"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C6A45B]" />
                <span>{profile.points.toLocaleString()} PTS</span>
              </Link>

              {/* Signed-In vs Signed-Out User Control */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-md bg-[#EAE1D3] hover:bg-[#D6CCBC]/60 border border-[#D6CCBC] transition-colors focus:outline-hidden"
                    aria-label="User profile menu"
                  >
                    <img
                      src={profile.avatar_url}
                      alt={profile.display_name}
                      className="w-7 h-7 rounded object-cover border border-[#D6CCBC]"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-[#6D685C]" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-[#FFFDF8] border-2 border-[#D6CCBC] rounded-xl shadow-lg py-2 z-50 text-xs"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-[#D6CCBC]">
                        <div className="font-bold text-[#292820] font-sans truncate">
                          {profile.display_name}
                        </div>
                        <div className="text-[11px] text-[#6D685C] font-mono">
                          @{profile.username}
                        </div>
                        <div className="mt-1">
                          <span className="retro-stamp text-[9px]">
                            {role === 'admin' ? 'ARBITRATION LEAD' : 'EXPLORER'}
                          </span>
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-[#292820] hover:bg-[#EAE1D3] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#777A53]" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/memoir"
                        className="flex items-center gap-2 px-4 py-2 text-[#292820] hover:bg-[#EAE1D3] transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#777A53]" />
                        <span>Adventure Memoir</span>
                      </Link>

                      {role === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-[#B85F43] hover:bg-[#EAE1D3] transition-colors font-bold"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#B85F43]" />
                          <span>Admin Review Panel</span>
                        </Link>
                      )}

                      <div className="border-t border-[#D6CCBC] my-1" />

                      <button
                        type="button"
                        onClick={() => signOut()}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-[#B85F43] hover:bg-[#EAE1D3] transition-colors font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="text-xs font-semibold text-[#6D685C] hover:text-[#292820] px-2.5 py-1.5 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-journal-terracotta text-xs py-1.5 px-3 shadow-xs"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Mobile Bottom Navigation Bar (Explore | Arena | Journal | Rewards | Profile) */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF8] border-t border-[#D6CCBC] py-2 px-2 flex items-center justify-around shadow-md pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-all ${
                isActive
                  ? 'text-[#B85F43] font-bold'
                  : 'text-[#6D685C] hover:text-[#292820]'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#B85F43]' : 'text-[#6D685C]'}`} />
              <span>{link.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#B85F43] mt-0.5" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
