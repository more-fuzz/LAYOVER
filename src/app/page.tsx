import React from 'react';
import Link from 'next/link';
import { getPublishedActivities } from '@/services/activities';
import { getPublishedDestinations } from '@/services/destinations';
import SafeImage from '@/components/SafeImage';
import MapComponent from '@/components/MapComponent';
import {
  Compass,
  MapPin,
  Ghost,
  Trophy,
  Gift,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Mountain,
  Navigation,
  FileCheck2,
  BookOpen,
} from 'lucide-react';

export default async function Home() {
  const activities = await getPublishedActivities();
  const destinations = await getPublishedDestinations();

  const featuredActivities = activities.slice(0, 4);
  const featuredDestinations = destinations.slice(0, 3);

  const JOURNEY_STEPS = [
    {
      step: '01',
      title: 'DISCOVER',
      subtitle: 'Curated Waypoints',
      desc: 'Browse certified alpine routes, waterways, and ancient folklore enigmas mapped with OpenStreetMap coordinates.',
    },
    {
      step: '02',
      title: 'EXPERIENCE',
      subtitle: 'Field Expeditions',
      desc: 'Embark on self-guided treks or outfitter expeditions with strict safety and Leave-No-Trace adherence.',
    },
    {
      step: '03',
      title: 'VERIFY',
      subtitle: 'Inspected Proof',
      desc: 'Submit summit photographs and trail notes for official verification by our arbiters.',
    },
    {
      step: '04',
      title: 'EARN',
      subtitle: 'Official Points',
      desc: 'Accumulate verified points and exchange them for authentic outfitter gear and expedition rewards.',
    },
    {
      step: '05',
      title: 'REMEMBER',
      subtitle: 'Lifelong Memoir',
      desc: 'Maintain a chronological adventure memoir with earned qualifications, verified badges, and field notes.',
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-16 py-8 md:py-12">
      {/* 1. Minimal Editorial Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#FFFDF8] border-2 border-[#D6CCBC] rounded-3xl p-8 sm:p-14 shadow-sm relative overflow-hidden">
          {/* Subtle Top Stamped Annotation */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6CCBC] pb-5 mb-8">
            <div className="flex items-center gap-2">
              <span className="retro-stamp text-[10px]">EDITION NO. 2026-IV</span>
              <span className="text-xs font-mono text-[#6D685C]">
                EXPEDITION RECONNAISSANCE & MEMOIR
              </span>
            </div>
            <div className="text-xs font-mono text-[#777A53] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#777A53]" />
              <span>LEAVE-NO-TRACE PROTOCOL</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-6xl font-bold text-[#292820] leading-[1.1] font-sans tracking-tight">
              The Field Guide to Living Stories.
            </h1>
            <p className="text-base sm:text-lg text-[#6D685C] leading-relaxed">
              Trails & Tales is a curated expedition ledger. Map backcountry trails, investigate
              daylight folklore enigmas, verify physical summits via reviewer-inspected evidence, and
              redeem earned points for authentic tactical gear.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/explorer"
                className="btn-journal-terracotta text-sm flex items-center gap-2 py-3 px-6 shadow-xs"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Adventures</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/arena"
                className="btn-journal-secondary text-sm flex items-center gap-2 py-3 px-6"
              >
                <Trophy className="w-4 h-4 text-[#777A53]" />
                <span>How Adventure Arena Works</span>
              </Link>
            </div>
          </div>

          {/* Retro Editorial Stat Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[#D6CCBC]">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#292820] font-mono">
                {activities.length}+
              </div>
              <div className="text-xs text-[#6D685C] font-mono mt-0.5 uppercase tracking-wider">
                Certified Trails
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#B85F43] font-mono">
                100%
              </div>
              <div className="text-xs text-[#6D685C] font-mono mt-0.5 uppercase tracking-wider">
                Audited Evidence
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#777A53] font-mono">
                {destinations.length}
              </div>
              <div className="text-xs text-[#6D685C] font-mono mt-0.5 uppercase tracking-wider">
                Heritage Enigmas
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#C6A45B] font-mono">
                LIVE
              </div>
              <div className="text-xs text-[#6D685C] font-mono mt-0.5 uppercase tracking-wider">
                Expedition Routing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The 5-Step Journey Framework */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#D6CCBC] pb-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#777A53] mb-1">
              Methodology
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#292820] font-sans">
              The Five-Step Traveler Journey
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8E8675]">DISCOVER → REMEMBER</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {JOURNEY_STEPS.map((step) => (
            <div
              key={step.step}
              className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div>
                <div className="text-xs font-mono font-extrabold text-[#B85F43] bg-[#EAE1D3] inline-block px-2 py-0.5 rounded">
                  {step.step}
                </div>
                <h3 className="font-bold text-base text-[#292820] mt-3 font-sans">{step.title}</h3>
                <div className="text-[11px] font-mono text-[#777A53] uppercase font-bold mt-0.5">
                  {step.subtitle}
                </div>
                <p className="text-xs text-[#6D685C] mt-2 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Interactive Cartography Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#777A53] mb-1">
              Field Cartography
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#292820] font-sans">
              Interactive Expedition Map & Route Planner
            </h2>
            <p className="text-xs text-[#6D685C]">
              Select waypoints, inspect elevation difficulties, and calculate driving expeditions directly.
            </p>
          </div>
          <Link
            href="/explorer"
            className="btn-journal-primary text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Full-Screen Map Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <MapComponent
          activities={activities}
          destinations={destinations}
          height="520px"
          enableRouting={true}
        />
      </section>

      {/* 4. Featured Adventure Activities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#D6CCBC] pb-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#777A53] mb-1">
              Selected Waypoints
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#292820] font-sans">
              Featured Outdoor Disciplines
            </h2>
          </div>
          <Link
            href="/explorer?filter=activities"
            className="text-xs font-bold text-[#777A53] hover:underline flex items-center gap-1 font-mono"
          >
            <span>View All ({activities.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredActivities.map((act) => (
            <div
              key={act.id}
              className="group flex flex-col rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] hover:border-[#777A53] overflow-hidden shadow-xs transition-all hover:-translate-y-0.5"
            >
              <div className="relative w-full">
                <SafeImage
                  src={act.image_url}
                  alt={act.name}
                  aspectRatio="4/3"
                  fallbackTitle={act.name}
                />
                <div className="absolute top-3 left-3 bg-[#FFFDF8]/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#777A53] uppercase border border-[#D6CCBC]">
                  {act.category}
                </div>
                <div className="absolute top-3 right-3 bg-[#B85F43] text-white px-2 py-0.5 rounded text-[11px] font-mono font-bold shadow-xs">
                  +{act.base_points} PTS
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-sm text-[#292820] group-hover:text-[#B85F43] transition-colors font-sans line-clamp-1">
                    {act.name}
                  </h3>
                  <div className="text-xs text-[#6D685C] flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-[#777A53]" />
                    <span className="truncate">{act.location_name}</span>
                  </div>
                  <p className="text-xs text-[#6D685C] line-clamp-2 mt-2 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D6CCBC] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#8E8675] uppercase">
                    Diff: {act.difficulty}/5
                  </span>
                  <Link
                    href={`/activities/${act.id}`}
                    className="text-xs font-bold text-[#777A53] hover:underline"
                  >
                    Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Folklore & Mystery Section ("Am I Brave Enough?") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#D6CCBC] pb-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#B85F43] mb-1">
              Historical Enigmas
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#292820] font-sans">
              &quot;Am I Brave Enough?&quot; Field Studies
            </h2>
          </div>
          <Link
            href="/brave-enough"
            className="text-xs font-bold text-[#B85F43] hover:underline flex items-center gap-1 font-mono"
          >
            <span>Explore All Enigmas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group flex flex-col rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] hover:border-[#B85F43] overflow-hidden shadow-xs transition-all hover:-translate-y-0.5"
            >
              <div className="relative w-full">
                <SafeImage
                  src={dest.image_url}
                  alt={dest.name}
                  aspectRatio="16/9"
                  fallbackTitle={dest.name}
                />
                <div className="absolute top-3 left-3 bg-[#FFFDF8]/90 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#B85F43] uppercase border border-[#D6CCBC]">
                  {dest.category.replace('_', ' ')}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-base text-[#292820] group-hover:text-[#B85F43] transition-colors font-sans">
                    {dest.name}
                  </h3>
                  <div className="text-xs text-[#6D685C] flex items-center gap-1 mt-1 font-mono">
                    <MapPin className="w-3 h-3 text-[#B85F43]" />
                    <span>{dest.location_name}</span>
                  </div>

                  {dest.folklore_legend && (
                    <div className="mt-3 p-3 rounded-lg bg-[#F5F0E7] border border-[#D6CCBC] text-xs text-[#6D685C] italic leading-relaxed">
                      &quot;{dest.folklore_legend.substring(0, 110)}...&quot;
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#D6CCBC] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#8E8675]">
                    DAYLIGHT ACCESS ONLY
                  </span>
                  <Link
                    href={`/brave-enough#${dest.id}`}
                    className="text-xs font-bold text-[#B85F43] hover:underline"
                  >
                    Investigate &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
