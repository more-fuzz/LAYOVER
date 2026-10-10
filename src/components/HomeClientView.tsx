'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ActivityItem, DestinationItem } from '@/data/sampleData';
import SafeImage from '@/components/SafeImage';
import MapComponent from '@/components/MapComponent';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Trophy,
  ShieldCheck,
  MapPin,
  Clock,
} from 'lucide-react';

interface HomeClientViewProps {
  activities: ActivityItem[];
  destinations: DestinationItem[];
}

export default function HomeClientView({
  activities,
  destinations,
}: HomeClientViewProps) {
  const { user, profile, isDemoUser } = useAuth();
  const isAuthenticated = !!user || !isDemoUser;

  // Filter 3 beginner-friendly activities (difficulty <= 3)
  const beginnerAdventures = activities
    .filter((a) => a.difficulty <= 3)
    .slice(0, 3);

  // Fallback to first 3 if none found
  const startHereList =
    beginnerAdventures.length >= 3
      ? beginnerAdventures
      : activities.slice(0, 3);

  return (
    <div className="flex flex-col w-full space-y-12 sm:space-y-16 py-6 sm:py-10">
      {/* 1. Hero Section (New vs Returning Visitors) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#FFFDF8] border-2 border-[#D6CCBC] rounded-2xl p-6 sm:p-12 shadow-xs relative overflow-hidden">
          {/* Subtle Top Metadata Annotation */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D6CCBC] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="retro-stamp text-[9px]">FIELD GUIDE VOL. 2026</span>
              <span className="text-xs font-mono text-[#6D685C]">
                EXPEDITION DISCOVERY & MEMOIR
              </span>
            </div>
            <div className="text-xs font-mono text-[#777A53] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#777A53]" />
              <span>LEAVE-NO-TRACE CERTIFIED</span>
            </div>
          </div>

          {isAuthenticated ? (
            /* Returning Visitor Experience */
            <div className="space-y-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#777A53] bg-[#EAE1D3] px-2.5 py-0.5 rounded border border-[#D6CCBC]">
                  <span>EXPEDITION PASSPORT ACTIVE</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold text-[#292820] font-sans tracking-tight">
                  Welcome back, {profile.display_name}.
                </h1>
                <p className="text-sm sm:text-base text-[#6D685C] leading-relaxed">
                  Your expedition log is ready. Discover newly charted waypoints, track pending
                  summit evidence, or explore partner outfitter rewards.
                </p>

                {/* Single Dominant Next Action */}
                <div className="pt-2">
                  <Link
                    href="/explorer"
                    className="btn-journal-terracotta text-xs sm:text-sm py-2.5 px-5 inline-flex items-center gap-2 shadow-xs"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Continue Exploring Adventures</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Compact Statistics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-[#D6CCBC]">
                <div className="p-3 bg-[#F5F0E7] border border-[#D6CCBC] rounded-lg">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#6D685C]">
                    Total Earned Points
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#292820] mt-0.5">
                    {(profile.total_earned_points ?? profile.points).toLocaleString()} PTS
                  </div>
                </div>

                <div className="p-3 bg-[#F5F0E7] border border-[#D6CCBC] rounded-lg">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#6D685C]">
                    Redeemable Balance
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#C6A45B] mt-0.5">
                    {profile.points.toLocaleString()} PTS
                  </div>
                </div>

                <div className="p-3 bg-[#F5F0E7] border border-[#D6CCBC] rounded-lg col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#6D685C]">
                    Expedition Standing
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#777A53] mt-0.5 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-[#777A53]" />
                    <span>#4 Global</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* New Visitor Experience */
            <div className="max-w-2xl space-y-5">
              <h1 className="text-3xl sm:text-5xl font-bold text-[#292820] leading-[1.15] font-sans tracking-tight">
                Go somewhere worth remembering.
              </h1>
              <p className="text-base sm:text-lg text-[#6D685C] leading-relaxed">
                Find your next adventure. Keep the story.
              </p>

              {/* One prominent primary button */}
              <div className="pt-2">
                <Link
                  href="/explorer"
                  className="btn-journal-terracotta text-sm py-3 px-6 inline-flex items-center gap-2 shadow-xs"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Adventures</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Compact Map Preview with Handwritten Note */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#D6CCBC] pb-2">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#777A53] mb-0.5">
              WAYPOINT RECONNAISSANCE
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#292820] font-sans">
              Interactive Field Cartography
            </h2>
          </div>

          {/* Handwritten Annotation */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="font-handwritten text-xl text-[#B85F43] -rotate-2 select-none">
              your next story starts here ↗
            </span>
          </div>
        </div>

        {/* Compact Map Preview Frame */}
        <div className="relative rounded-xl overflow-hidden border-2 border-[#D6CCBC] shadow-xs group">
          <MapComponent
            activities={activities.slice(0, 5)}
            destinations={destinations.slice(0, 3)}
            height="320px"
            enableRouting={false}
          />

          {/* Bottom Caption Overlay: Clicking opens Explore */}
          <Link
            href="/explorer"
            className="absolute bottom-3 left-3 right-3 sm:right-auto z-10 bg-[#FFFDF8]/95 border border-[#D6CCBC] rounded-lg px-3.5 py-2 flex items-center justify-between gap-3 shadow-sm hover:border-[#B85F43] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#B85F43]" />
              <span className="text-xs text-[#292820] font-semibold">
                Your next story is somewhere out there.
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#B85F43] font-bold underline flex items-center gap-1">
              Open Explore <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>
      </section>

      {/* 3. Start-Here Recommendations (3 Beginner-Friendly Adventures) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-4">
        <div className="flex items-center justify-between border-b border-[#D6CCBC] pb-2">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#777A53]">
              BEGINNER-FRIENDLY
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#292820] font-sans">
              Start-Here Expeditions
            </h2>
          </div>
          <Link
            href="/explorer"
            className="text-xs font-semibold text-[#6D685C] hover:text-[#292820] underline flex items-center gap-1"
          >
            <span>View All ({activities.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {startHereList.map((act, index) => {
            // Difficulty 3-dot representation
            const dots = [1, 2, 3];
            const activeDots = Math.min(3, Math.max(1, act.difficulty));

            return (
              <div
                key={act.id}
                className="bg-[#FFFDF8] border border-[#D6CCBC] rounded-xl overflow-hidden flex flex-col justify-between shadow-xs hover:border-[#777A53] transition-all group relative"
              >
                {/* 4:3 Aspect Ratio Image */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-[#EAE1D3]">
                  <SafeImage
                    src={act.image_url}
                    alt={act.name}
                    aspectRatio="4/3"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />

                  {/* Monospace Category Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#292820] bg-[#FFFDF8]/90 border border-[#D6CCBC] px-2 py-0.5 rounded shadow-xs">
                      {act.category}
                    </span>
                  </div>

                  {/* Subtle Handwritten Note on Card #2 */}
                  {index === 1 && (
                    <div className="absolute bottom-2 right-2 z-10 bg-[#FFFDF8]/90 px-2 py-0.5 rounded border border-[#D6CCBC] shadow-xs">
                      <span className="font-handwritten text-base text-[#777A53] -rotate-3 select-none">
                        worth the detour ~
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-[#292820] font-sans group-hover:text-[#B85F43] transition-colors line-clamp-1">
                      {act.name}
                    </h3>
                    <p className="text-xs text-[#6D685C] line-clamp-2 mt-1 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  {/* Difficulty & Cost strip */}
                  <div className="pt-2 border-t border-[#D6CCBC] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5" title={`Difficulty: ${act.difficulty}/5`}>
                      <span className="text-[10px] font-mono uppercase text-[#6D685C]">Diff:</span>
                      <div className="flex gap-1">
                        {dots.map((d) => (
                          <span
                            key={d}
                            className={`w-2 h-2 rounded-full ${
                              d <= activeDots ? 'bg-[#B85F43]' : 'bg-[#D6CCBC]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-xs font-mono font-semibold text-[#292820]">
                      {act.estimated_cost ? `$${act.estimated_cost.toFixed(0)}` : 'Free / Public'}
                    </div>
                  </div>

                  {/* One Clear Primary Action */}
                  <Link
                    href={`/activities/${act.id}`}
                    className="btn-journal-primary text-xs py-2 w-full text-center mt-2"
                  >
                    View details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. The Product Loop (Subtle Editorial Strip) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#EAE1D3] border border-[#D6CCBC] rounded-xl p-4 sm:p-6 text-center">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#777A53] mb-1 font-bold">
            THE TRAILS & TALES PROTOCOL
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-[#292820] flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span className="hover:text-[#B85F43] transition-colors">Discover</span>
            <span className="text-[#8E8675]">·</span>
            <span className="hover:text-[#B85F43] transition-colors">Experience</span>
            <span className="text-[#8E8675]">·</span>
            <span className="hover:text-[#B85F43] transition-colors">Verify</span>
            <span className="text-[#8E8675]">·</span>
            <span className="hover:text-[#B85F43] transition-colors">Earn</span>
            <span className="text-[#8E8675]">·</span>
            <span className="hover:text-[#B85F43] transition-colors">Remember</span>
          </div>
        </div>
      </section>
    </div>
  );
}
