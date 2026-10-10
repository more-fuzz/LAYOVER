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
    { href: '/explorer', label: 'Explorer', icon: Compass },
    { href: '/brave-enough', label: 'Am I Brave Enough?', icon: Ghost, highlight: true },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/rewards', label: 'Rewards', icon: Gift },
    { href: '/memoir', label: 'My Memoir', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0d1612]/95 backdrop-blur-md border-b border-[#1b2b22] text-zinc-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                Trails & Tales
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider uppercase text-emerald-400/80 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                Adventure
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 shadow-inner'
                      : link.highlight
                      ? 'text-amber-300 hover:bg-amber-950/30 hover:text-amber-200'
                      : 'text-zinc-300 hover:bg-[#15241c] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.highlight ? 'text-amber-400 animate-pulse' : ''}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {role === 'admin' && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  pathname === '/admin'
                    ? 'bg-purple-900/60 text-purple-200 border border-purple-600'
                    : 'text-purple-300 hover:bg-purple-950/40'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Admin Review</span>
              </Link>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Points Counter Pill */}
            <Link
              href="/rewards"
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-950 to-[#122b1f] border border-emerald-700/60 hover:border-emerald-500 px-3 py-1.5 rounded-full shadow-inner text-xs font-bold text-emerald-300 transition-colors"
              title="Verified Adventure Points"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{profile.points.toLocaleString()} pts</span>
            </Link>

            {/* Quick Evaluator Role Toggle */}
            <div className="hidden lg:flex items-center bg-[#13221a] p-0.5 rounded-lg border border-[#1f3529] text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => switchDemoRole('traveler')}
                className={`px-2 py-1 rounded-md transition-all ${
                  role === 'traveler'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Traveler
              </button>
              <button
                type="button"
                onClick={() => switchDemoRole('admin')}
                className={`px-2 py-1 rounded-md transition-all ${
                  role === 'admin'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Admin
              </button>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full bg-[#15241c] hover:bg-[#1d3326] border border-[#223d2e] transition-colors focus:outline-none"
              >
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/50"
                />
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 mr-1 hidden sm:inline" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-[#101b15] border border-[#21382b] rounded-xl shadow-2xl py-2 z-50 text-sm"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#1b2f24]">
                    <div className="font-semibold text-zinc-100">{profile.display_name}</div>
                    <div className="text-xs text-zinc-400">@{profile.username}</div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        role === 'admin' ? 'bg-purple-900/70 text-purple-300' : 'bg-emerald-950 text-emerald-400'
                      }`}>
                        {role}
                      </span>
                      {isDemoUser && (
                        <span className="text-[10px] text-amber-400/90 bg-amber-950/60 px-1.5 py-0.5 rounded">
                          Prototype Mode
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-[#17271e] text-zinc-200 transition-colors"
                  >
                    <User className="w-4 h-4 text-emerald-400" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-[#17271e] text-zinc-200 transition-colors"
                  >
                    <User className="w-4 h-4 text-emerald-400" />
                    My Profile
                  </Link>
                  <Link
                    href="/memoir"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-[#17271e] text-zinc-200 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-teal-400" />
                    Adventure Memoir
                  </Link>
                  {role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-purple-950/50 text-purple-300 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      Admin Review Panel
                    </Link>
                  )}
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-[#17271e] text-zinc-300 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    Auth & Sign In
                  </Link>

                  <div className="border-t border-[#1b2f24] my-1" />

                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-300 hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#15241c] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d1612] border-b border-[#1b2b22] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'
                    : 'text-zinc-300 hover:bg-[#16271e]'
                }`}
              >
                <Icon className={`w-5 h-5 ${link.highlight ? 'text-amber-400' : 'text-zinc-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-purple-300 bg-purple-950/40 border border-purple-800/50"
            >
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <span>Admin Review Panel</span>
            </Link>
          )}

          <div className="pt-3 border-t border-[#1b2f24] flex items-center justify-between">
            <span className="text-xs text-zinc-400">Evaluator Role:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('traveler');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 text-xs rounded-md ${
                  role === 'traveler' ? 'bg-emerald-600 text-white' : 'bg-[#15241c] text-zinc-400'
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
                  role === 'admin' ? 'bg-purple-600 text-white' : 'bg-[#15241c] text-zinc-400'
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
