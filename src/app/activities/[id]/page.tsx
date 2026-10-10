import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getActivityById } from '@/services/activities';
import MapComponent from '@/components/MapComponent';
import SafeImage from '@/components/SafeImage';
import { SAMPLE_ACTIVITIES } from '@/data/sampleData';
import {
  Compass,
  MapPin,
  Clock,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  ArrowLeft,
  UploadCloud,
  Navigation,
  FileCheck2,
} from 'lucide-react';

export function generateStaticParams() {
  return SAMPLE_ACTIVITIES.map((act) => ({
    id: act.id,
  }));
}

async function ActivityDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activity = await getActivityById(id);

  if (!activity) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/explorer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D685C] hover:text-[#292820] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Adventure Map</span>
        </Link>
      </div>

      {/* Hero Media & Title Header */}
      <div className="rounded-2xl overflow-hidden border-2 border-[#D6CCBC] bg-[#FFFDF8] shadow-sm">
        <div className="relative w-full">
          <SafeImage
            src={activity.image_url}
            alt={activity.name}
            aspectRatio="16/9"
            fallbackTitle={activity.name}
          />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-[#FFFDF8]/90 backdrop-blur-xs px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider text-[#777A53] border border-[#D6CCBC]">
              {activity.category}
            </span>
            <span className="bg-[#EAE1D3] text-[#292820] border border-[#D6CCBC] px-3 py-1 rounded-md text-xs font-mono font-bold">
              Difficulty: {activity.difficulty}/5
            </span>
          </div>

          <div className="absolute top-4 right-4 bg-[#B85F43] text-white px-3.5 py-1.5 rounded-lg text-xs font-mono font-extrabold shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{activity.base_points} PTS</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 border-t border-[#D6CCBC] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#777A53] font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#B85F43]" />
            <span>{activity.location_name}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#292820] font-sans">
            {activity.name}
          </h1>
        </div>
      </div>

      {/* Two Column Layout: Details & Sidebar Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] space-y-3 shadow-xs">
            <h2 className="text-lg font-bold text-[#292820] font-sans">Expedition Overview</h2>
            <p className="text-xs sm:text-sm text-[#6D685C] leading-relaxed">
              {activity.description}
            </p>
          </div>

          {/* Safety & Protocol */}
          <div className="p-6 rounded-2xl bg-[#EAE1D3]/60 border border-[#D6CCBC] space-y-3">
            <div className="flex items-center gap-2 text-[#B85F43] font-bold text-sm font-sans">
              <ShieldAlert className="w-4 h-4 text-[#B85F43]" />
              <span>Mandatory Safety Guidelines & Protocols</span>
            </div>
            <p className="text-xs sm:text-sm text-[#292820] leading-relaxed">
              {activity.safety_info}
            </p>
          </div>

          {/* Equipment Checklist & Prerequisites */}
          <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-[#292820] font-sans">
              Prerequisites & Equipment Checklist
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activity.requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#F5F0E7] border border-[#D6CCBC] flex items-center gap-2.5 text-xs text-[#292820]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#777A53] shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded Trailhead Map with OSRM Routing */}
          <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#292820] font-sans flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#777A53]" />
                  <span>Trailhead Coordinates & Route Calculation</span>
                </h2>
                <div className="text-xs text-[#6D685C] font-mono mt-0.5">
                  LAT: {activity.latitude.toFixed(5)} | LNG: {activity.longitude.toFixed(5)}
                </div>
              </div>
            </div>

            <MapComponent
              activities={[activity]}
              selectedId={activity.id}
              center={[activity.latitude, activity.longitude]}
              zoom={8}
              height="360px"
              showFilters={false}
              enableRouting={true}
            />
          </div>
        </div>

        {/* Right Sidebar: Key Specs & Submit Proof CTA */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#FFFDF8] border-2 border-[#D6CCBC] shadow-xs space-y-6">
            <h3 className="font-bold text-base text-[#292820] border-b border-[#D6CCBC] pb-3 font-sans">
              Field Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#D6CCBC]">
                <span className="text-[#6D685C]">Verified Points</span>
                <span className="font-bold text-[#B85F43] font-mono">+{activity.base_points} PTS</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D6CCBC]">
                <span className="text-[#6D685C]">Gear Outlay</span>
                <span className="font-bold text-[#292820]">
                  {activity.estimated_cost ? `$${activity.estimated_cost}` : 'Public Access / Self-Guided'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D6CCBC]">
                <span className="text-[#6D685C]">Estimated Duration</span>
                <span className="font-bold text-[#292820]">~{activity.duration_hours || 4} hours</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D6CCBC]">
                <span className="text-[#6D685C]">Evidence Protocol</span>
                <span className="font-bold text-[#777A53] font-mono">Photo + GPS Required</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="space-y-2 pt-2">
              <Link
                href={`/submissions/new?activityId=${activity.id}`}
                className="btn-journal-terracotta w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-center"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Submit Proof of Completion</span>
              </Link>
              <p className="text-[10px] text-[#8E8675] text-center leading-relaxed">
                Evidence is stored in encrypted private storage and validated by reviewers before points credit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-20 text-center text-[#6D685C]">
          Retrieving field dossier...
        </div>
      }
    >
      <ActivityDetailContent params={params} />
    </Suspense>
  );
}
