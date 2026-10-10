'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  MapPin,
  Ghost,
  Trophy,
  Gift,
  BookOpen,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { profile, role, switchDemoRole, signOut, isDemoUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Discover' },
    { href: '/explorer', label: 'Adventure Map' },
    { href: '/arena', label: 'Adventure Arena' },
    { href: '/brave-enough', label: 'Am I Brave Enough?' },
    { href: '/memoir', label: 'Adventure Memoir' },
    { href: '/rewards', label: 'Rewards' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF8] border-b border-[#D6CCBC] text-[#292820] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-[#EAE1D3] border border-[#D6CCBC] flex items-center justify-center text-[#777A53] group-hover:border-[#777A53] transition-colors">
              <Compass className="w-5 h-5 text-[#777A53]" />
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#EAE1D3] text-[#292820] font-bold border border-[#D6CCBC]'
                      : 'text-[#6D685C] hover:text-[#292820] hover:bg-[#F5F0E7]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Hidden Admin Section: ONLY visible if authenticated user has admin role */}
            {role === 'admin' && (
              <Link
                href="/admin"
                className={`ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'bg-[#B85F43] text-white'
                    : 'text-[#B85F43] bg-[#EAE1D3] border border-[#B85F43]/40 hover:bg-[#B85F43]/10'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Review</span>
              </Link>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Verified Points Stamp Pill */}
            <Link
              href="/rewards"
              className="flex items-center gap-1.5 bg-[#EAE1D3] border border-[#D6CCBC] hover:border-[#777A53] px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-[#777A53] transition-colors"
              title="Verified Adventure Points"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C6A45B]" />
              <span>{profile.points.toLocaleString()} PTS</span>
            </Link>

            {/* Evaluator Role Toggle (Compact for testing) */}
            <div className="hidden sm:flex items-center bg-[#EAE1D3] p-0.5 rounded-md border border-[#D6CCBC] text-[10px] font-mono font-bold">
              <button
                type="button"
                onClick={() => switchDemoRole('traveler')}
                className={`px-2 py-0.5 rounded transition-all ${
                  role === 'traveler'
                    ? 'bg-[#FFFDF8] text-[#292820] shadow-xs'
                    : 'text-[#6D685C] hover:text-[#292820]'
                }`}
                title="Switch to Explorer persona"
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

            {/* User Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-lg bg-[#EAE1D3] hover:bg-[#D6CCBC]/60 border border-[#D6CCBC] transition-colors focus:outline-hidden"
              >
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="w-7 h-7 rounded-md object-cover border border-[#D6CCBC]"
                />
                <ChevronDown className="w-3.5 h-3.5 text-[#6D685C]" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-[#FFFDF8] border-2 border-[#D6CCBC] rounded-xl shadow-lg py-2 z-50 text-xs"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#D6CCBC]">
                    <div className="font-bold text-[#292820] font-sans">{profile.display_name}</div>
                    <div className="text-[11px] text-[#6D685C] font-mono">@{profile.username}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="retro-stamp text-[9px]">
                        ROLE: {role.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-[#292820] hover:bg-[#EAE1D3] transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[#777A53]" />
                    <span>Traveler Dashboard</span>
                  </Link>

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

                  {/* Show Admin review panel only when admin */}
                  {role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-[#B85F43] hover:bg-[#EAE1D3] transition-colors font-bold"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#B85F43]" />
                      <span>Admin Review Panel</span>
                    </Link>
                  )}

                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 px-4 py-2 text-[#6D685C] hover:bg-[#EAE1D3] transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6D685C]" />
                    <span>Authentication & Keys</span>
                  </Link>

                  <div className="border-t border-[#D6CCBC] my-1" />

                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-[#B85F43] hover:bg-[#EAE1D3] transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#6D685C] hover:text-[#292820] hover:bg-[#EAE1D3] focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#292820]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF8] border-b-2 border-[#D6CCBC] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold ${
                  isActive
                    ? 'bg-[#EAE1D3] text-[#292820] font-bold border border-[#D6CCBC]'
                    : 'text-[#6D685C] hover:bg-[#F5F0E7]'
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}

          {role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold text-[#B85F43] bg-[#EAE1D3] border border-[#B85F43]/40"
            >
              <ShieldCheck className="w-4 h-4 text-[#B85F43]" />
              <span>Admin Review Panel</span>
            </Link>
          )}

          <div className="pt-3 border-t border-[#D6CCBC] flex items-center justify-between">
            <span className="text-xs text-[#6D685C]">Evaluator Role:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('traveler');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 text-xs rounded-md ${
                  role === 'traveler'
                    ? 'bg-[#777A53] text-white'
                    : 'bg-[#EAE1D3] text-[#6D685C]'
                }`}
              >
                Traveler
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('admin');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 text-xs rounded-md ${
                  role === 'admin'
                    ? 'bg-[#B85F43] text-white'
                    : 'bg-[#EAE1D3] text-[#6D685C]'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
