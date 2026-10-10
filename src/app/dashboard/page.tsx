'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { SAMPLE_ACTIVITIES, SAMPLE_DESTINATIONS, SAMPLE_SUBMISSIONS } from '@/data/sampleData';
import {
  Compass,
  Trophy,
  Gift,
  BookOpen,
  Ghost,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { profile, role } = useAuth();

  const userSubmissions = SAMPLE_SUBMISSIONS.filter(
    (s) => s.user_id === profile.id || s.user_id === 'u6'
  );

  const approvedSubmissions = userSubmissions.filter((s) => s.status === 'approved');
  const pendingSubmissions = userSubmissions.filter((s) => s.status === 'pending');

  const pendingPoints = pendingSubmissions.reduce((sum, s) => sum + s.points, 0);

  const recommendedActivities = SAMPLE_ACTIVITIES.slice(0, 3);
  const spookySpotlight = SAMPLE_DESTINATIONS.find((d) => d.is_spooky);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* 1. Header & User Greeting Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#12231a] via-[#101f17] to-[#0c1611] border border-[#1e382a] p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-emerald-500/30 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                  {role === 'admin' ? 'Administrator' : 'Verified Pathfinder'}
                </span>
                <span className="text-xs text-zinc-400">@{profile.username}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Greetings, {profile.display_name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                Your expedition log is live. You have {approvedSubmissions.length} verified adventure accomplishments.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-[#0b1611]/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-[#1b3325] text-center shadow-inner">
              <div className="text-xs text-zinc-400 font-medium">Verified Points</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Sparkles className="w-5 h-5 fill-amber-400" />
                <span>{profile.points.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-[#0b1611]/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-[#1b3325] text-center shadow-inner">
              <div className="text-xs text-zinc-400 font-medium">Pending Review</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300">
                +{pendingPoints}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Link
          href="/explorer"
          className="p-4 rounded-2xl bg-[#121e18] hover:bg-[#1a2d23] border border-[#1c3326] transition-all hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-300">
              Explorer Map
            </div>
            <div className="text-[11px] text-zinc-400">Browse trails</div>
          </div>
        </Link>

        <Link
          href="/submissions/new"
          className="p-4 rounded-2xl bg-[#121e18] hover:bg-[#1a2d23] border border-[#1c3326] transition-all hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-950 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-teal-300">
              Submit Proof
            </div>
            <div className="text-[11px] text-zinc-400">Claim points</div>
          </div>
        </Link>

        <Link
          href="/brave-enough"
          className="p-4 rounded-2xl bg-[#151221] hover:bg-[#1e1933] border border-[#2b2045] transition-all hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-950 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
            <Ghost className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-purple-300">
              Brave Enough?
            </div>
            <div className="text-[11px] text-purple-300">Spooky ruins</div>
          </div>
        </Link>

        <Link
          href="/leaderboard"
          className="p-4 rounded-2xl bg-[#121e18] hover:bg-[#1a2d23] border border-[#1c3326] transition-all hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-950 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-amber-300">
              Leaderboard
            </div>
            <div className="text-[11px] text-zinc-400">Rankings #6</div>
          </div>
        </Link>

        <Link
          href="/rewards"
          className="p-4 rounded-2xl bg-[#121e18] hover:bg-[#1a2d23] border border-[#1c3326] transition-all hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-950 flex items-center justify-center text-rose-400 mb-3 group-hover:scale-110 transition-transform">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-rose-300">
              Rewards
            </div>
            <div className="text-[11px] text-zinc-400">Gear catalog</div>
          </div>
        </Link>

        <Link
          href="/memoir"
          className="p-4 rounded-2xl bg-[#121e18] hover:bg-[#1a2d23] border border-[#1c3326] transition-all hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-blue-300">
              My Memoir
            </div>
            <div className="text-[11px] text-zinc-400">Interactive log</div>
          </div>
        </Link>
      </div>

      {/* 3. Main Dashboard Grid: Submissions Status & Spooky Feature */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Submission History & Status */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Your Activity Submissions</span>
            </h2>
            <Link
              href="/submissions/new"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>+ New Submission</span>
            </Link>
          </div>

          <div className="space-y-3">
            {userSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-2xl bg-[#111c16] border border-[#1e3427] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={sub.evidence_url}
                    alt={sub.activity_name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 ring-1 ring-emerald-600/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                        {sub.activity_category}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {new Date(sub.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-white mt-1">
                      {sub.activity_name}
                    </div>
                    {sub.review_notes && (
                      <div className="text-xs text-zinc-400 italic mt-0.5">
                        &quot;{sub.review_notes}&quot;
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-emerald-400">
                    +{sub.points} pts
                  </div>
                  <span
                    className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      sub.status === 'approved'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : sub.status === 'pending'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {sub.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Earned Badges Showcase */}
          <div className="pt-4">
            <h3 className="text-lg font-bold text-white mb-4">Earned Explorer Badges</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#122218] border border-[#1f3829] text-center">
                <div className="text-3xl mb-1">🏔️</div>
                <div className="text-xs font-bold text-white">Alpine Pioneer</div>
                <div className="text-[10px] text-zinc-400">Summit 4,000m+</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#122218] border border-[#1f3829] text-center">
                <div className="text-3xl mb-1">🌊</div>
                <div className="text-xs font-bold text-white">Deep Blue Diver</div>
                <div className="text-[10px] text-zinc-400">Sub-marine 20m</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#122218] border border-[#1f3829] text-center">
                <div className="text-3xl mb-1">🧭</div>
                <div className="text-xs font-bold text-white">Trail Pathfinder</div>
                <div className="text-[10px] text-zinc-400">First 3 expeditions</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#161324] border border-[#2a1d47] text-center">
                <div className="text-3xl mb-1">👻</div>
                <div className="text-xs font-bold text-purple-300">Crypt Walker</div>
                <div className="text-[10px] text-purple-400/80">Spooky ruins visited</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Spooky Spotlight & Recommended */}
        <div className="space-y-6">
          {/* Spooky Spotlight Box */}
          {spookySpotlight && (
            <div className="rounded-3xl bg-gradient-to-b from-[#18112b] to-[#100b1e] border border-[#302157] p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-800">
                  Spooky Enigma Spotlight
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  {spookySpotlight.spooky_rating}/5 👻
                </span>
              </div>
              <img
                src={spookySpotlight.image_url}
                alt={spookySpotlight.name}
                className="w-full h-36 rounded-2xl object-cover mb-3"
              />
              <h3 className="font-bold text-base text-white mb-1">
                {spookySpotlight.name}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                {spookySpotlight.description}
              </p>
              <Link
                href="/brave-enough"
                className="block text-center w-full py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow transition-colors"
              >
                Explore Spooky Destinations &rarr;
              </Link>
            </div>
          )}

          {/* Recommended Next Adventures */}
          <div className="rounded-3xl bg-[#111c16] border border-[#1e3427] p-5">
            <h3 className="font-bold text-sm text-white mb-4">Recommended Next Adventures</h3>
            <div className="space-y-3">
              {recommendedActivities.map((act) => (
                <Link
                  key={act.id}
                  href={`/activities/${act.id}`}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#16271e] transition-colors group"
                >
                  <img
                    src={act.image_url}
                    alt={act.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                      {act.name}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      +{act.base_points} pts • {act.category}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
