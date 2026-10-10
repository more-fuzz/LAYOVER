'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { SAMPLE_ACTIVITIES, SAMPLE_DESTINATIONS, SAMPLE_SUBMISSIONS } from '@/data/sampleData';
import SafeImage from '@/components/SafeImage';
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
  Locate,
} from 'lucide-react';

export default function DashboardPage() {
  const { profile, role } = useAuth();
  const [nearbyFilterEnabled, setNearbyFilterEnabled] = useState(false);

  const userSubmissions = SAMPLE_SUBMISSIONS.filter(
    (s) => s.user_id === profile.id || s.user_id === 'u6'
  );

  const approvedSubmissions = userSubmissions.filter((s) => s.status === 'approved');
  const pendingSubmissions = userSubmissions.filter((s) => s.status === 'pending');
  const pendingPoints = pendingSubmissions.reduce((sum, s) => sum + s.points, 0);

  const recommendedActivities = SAMPLE_ACTIVITIES.slice(0, 3);
  const spookySpotlight = SAMPLE_DESTINATIONS.find((d) => d.is_spooky);

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setNearbyFilterEnabled(true);
      },
      (err) => {
        alert(`Location permission denied: ${err.message}`);
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-10">
      {/* 1. Header & Explorer Profile Card */}
      <div className="rounded-2xl bg-[#FFFDF8] border-2 border-[#D6CCBC] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#D6CCBC] shrink-0">
            <SafeImage
              src={profile.avatar_url}
              alt={profile.display_name}
              aspectRatio="1/1"
              fallbackTitle={profile.display_name}
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="retro-stamp text-[10px]">
                {role === 'admin' ? 'REVIEW DISPATCHER' : 'VERIFIED PATHFINDER'}
              </span>
              <span className="text-xs text-[#6D685C] font-mono">@{profile.username}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#292820] font-sans">
              Welcome Back, {profile.display_name}
            </h1>
            <p className="text-xs text-[#6D685C]">
              Your field ledger is synchronized. You have {approvedSubmissions.length} verified adventure
              accomplishments.
            </p>
          </div>
        </div>

        {/* Quick Points & Review Counters */}
        <div className="flex items-center gap-3">
          <div className="bg-[#F5F0E7] px-5 py-3 rounded-xl border border-[#D6CCBC] text-center">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#6D685C]">
              Verified Points
            </div>
            <div className="text-2xl font-bold text-[#B85F43] flex items-center justify-center gap-1 font-mono mt-0.5">
              <Sparkles className="w-4 h-4 text-[#C6A45B]" />
              <span>{profile.points.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-[#F5F0E7] px-5 py-3 rounded-xl border border-[#D6CCBC] text-center">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#6D685C]">
              Pending Audit
            </div>
            <div className="text-2xl font-bold text-[#777A53] font-mono mt-0.5">
              +{pendingPoints} PTS
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <Link
          href="/explorer"
          className="p-4 rounded-xl bg-[#FFFDF8] hover:bg-[#EAE1D3] border border-[#D6CCBC] transition-colors group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-lg bg-[#EAE1D3] border border-[#D6CCBC] flex items-center justify-center text-[#777A53] mb-3">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#292820] font-sans">Explorer Map</div>
            <div className="text-[10px] text-[#6D685C] font-mono">Browse waypoints</div>
          </div>
        </Link>

        <Link
          href="/submissions/new"
          className="p-4 rounded-xl bg-[#FFFDF8] hover:bg-[#EAE1D3] border border-[#D6CCBC] transition-colors group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-lg bg-[#EAE1D3] border border-[#D6CCBC] flex items-center justify-center text-[#B85F43] mb-3">
            <PlusCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#292820] font-sans">Submit Proof</div>
            <div className="text-[10px] text-[#6D685C] font-mono">Verify trail</div>
          </div>
        </Link>

        <Link
          href="/arena"
          className="p-4 rounded-xl bg-[#FFFDF8] hover:bg-[#EAE1D3] border border-[#D6CCBC] transition-colors group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-lg bg-[#EAE1D3] border border-[#D6CCBC] flex items-center justify-center text-[#777A53] mb-3">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#292820] font-sans">Adventure Arena</div>
            <div className="text-[10px] text-[#6D685C] font-mono">Rules & Ledger</div>
          </div>
        </Link>

        <Link
          href="/brave-enough"
          className="p-4 rounded-xl bg-[#FFFDF8] hover:bg-[#EAE1D3] border border-[#D6CCBC] transition-colors group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-lg bg-[#EAE1D3] border border-[#D6CCBC] flex items-center justify-center text-[#B85F43] mb-3">
            <Ghost className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#292820] font-sans">Brave Enough?</div>
            <div className="text-[10px] text-[#6D685C] font-mono">Folklore enigmas</div>
          </div>
        </Link>

        <Link
          href="/memoir"
          className="p-4 rounded-xl bg-[#FFFDF8] hover:bg-[#EAE1D3] border border-[#D6CCBC] transition-colors group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-lg bg-[#EAE1D3] border border-[#D6CCBC] flex items-center justify-center text-[#777A53] mb-3">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#292820] font-sans">Travel Memoir</div>
            <div className="text-[10px] text-[#6D685C] font-mono">Personal journal</div>
          </div>
        </Link>

        <Link
          href="/rewards"
          className="p-4 rounded-xl bg-[#FFFDF8] hover:bg-[#EAE1D3] border border-[#D6CCBC] transition-colors group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-lg bg-[#EAE1D3] border border-[#D6CCBC] flex items-center justify-center text-[#B85F43] mb-3">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#292820] font-sans">Claim Rewards</div>
            <div className="text-[10px] text-[#6D685C] font-mono">Outfitter gear</div>
          </div>
        </Link>
      </div>

      {/* 3. Main Split: Recommended Activities & Pending Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Recommended Activities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#D6CCBC] pb-2">
            <div>
              <h2 className="text-lg font-bold text-[#292820] font-sans">Recommended Expeditions</h2>
              <p className="text-xs text-[#6D685C]">Curated trails matched to your field progression.</p>
            </div>
            {!nearbyFilterEnabled ? (
              <button
                type="button"
                onClick={handleRequestLocation}
                className="text-xs font-mono font-bold text-[#777A53] hover:underline flex items-center gap-1"
              >
                <Locate className="w-3.5 h-3.5" />
                <span>Show Nearby Trails</span>
              </button>
            ) : (
              <span className="retro-stamp text-[9px]">LOCAL RADIUS ACTIVE</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendedActivities.map((act) => (
              <div
                key={act.id}
                className="group flex flex-col rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] overflow-hidden shadow-xs hover:border-[#777A53] transition-colors"
              >
                <div className="relative w-full">
                  <SafeImage
                    src={act.image_url}
                    alt={act.name}
                    aspectRatio="4/3"
                    fallbackTitle={act.name}
                  />
                  <div className="absolute top-2 left-2 bg-[#FFFDF8]/90 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-[#777A53] uppercase border border-[#D6CCBC]">
                    {act.category}
                  </div>
                  <div className="absolute top-2 right-2 bg-[#B85F43] text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    +{act.base_points} PTS
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-bold text-xs text-[#292820] group-hover:text-[#B85F43] line-clamp-1 font-sans">
                      {act.name}
                    </h3>
                    <div className="text-[11px] text-[#6D685C] flex items-center gap-1 mt-0.5 font-mono">
                      <MapPin className="w-3 h-3 text-[#777A53]" />
                      <span className="truncate">{act.location_name}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#D6CCBC] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#8E8675]">
                      DIFF {act.difficulty}/5
                    </span>
                    <Link
                      href={`/activities/${act.id}`}
                      className="text-xs font-bold text-[#777A53] hover:underline"
                    >
                      Inspect &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Submission History */}
        <div className="space-y-4">
          <div className="border-b border-[#D6CCBC] pb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#292820] font-sans">Verification Status</h2>
            <Link
              href="/memoir"
              className="text-xs font-mono font-bold text-[#777A53] hover:underline"
            >
              Open Memoir &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {userSubmissions.slice(0, 3).map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#D6CCBC] shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#292820] truncate font-sans">
                    {sub.activity_name}
                  </span>
                  <span
                    className={`retro-stamp text-[9px] ${
                      sub.status === 'approved'
                        ? 'text-[#777A53] border-[#777A53]'
                        : sub.status === 'rejected'
                        ? 'text-[#B85F43] border-[#B85F43]'
                        : 'text-[#C6A45B] border-[#C6A45B]'
                    }`}
                  >
                    {sub.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-[11px] text-[#6D685C] flex items-center justify-between font-mono">
                  <span>Award: +{sub.points} PTS</span>
                  <span>{new Date(sub.submitted_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
