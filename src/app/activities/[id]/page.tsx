import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getActivityById } from '@/services/activities';
import MapComponent from '@/components/MapComponent';
import { SAMPLE_ACTIVITIES } from '@/data/sampleData';
import {
  Compass,
  MapPin,
  Clock,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  DollarSign,
  ArrowLeft,
  ArrowRight,
  UploadCloud,
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/explorer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Adventure Explorer</span>
        </Link>
      </div>

      {/* Hero Media & Title Header */}
      <div className="relative rounded-3xl overflow-hidden border border-[#1e3427] shadow-2xl">
        <div className="relative h-72 sm:h-96 w-full">
          <img
            src={activity.image_url}
            alt={activity.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a100d] via-[#0a100d]/60 to-transparent" />

          {/* Overlaid Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-emerald-300">
              {activity.category}
            </span>
            <span className="bg-amber-950/90 border border-amber-600/60 px-3 py-1 rounded-lg text-xs font-bold text-amber-300">
              Difficulty: {activity.difficulty}/5
            </span>
          </div>

          <div className="absolute top-4 right-4 bg-emerald-950/90 border border-emerald-500/80 px-3.5 py-1.5 rounded-full text-sm font-black text-emerald-300 shadow-lg flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>+{activity.base_points} Points</span>
          </div>

          {/* Bottom Heading Info */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-2">
              <MapPin className="w-4 h-4" />
              <span>{activity.location_name}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              {activity.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Details & Sidebar Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="p-6 rounded-2xl bg-[#111c16] border border-[#1e3427] space-y-3">
            <h2 className="text-lg font-bold text-white">Expedition Overview</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {activity.description}
            </p>
          </div>

          {/* Safety & Protocol (Crucial requirement) */}
          <div className="p-6 rounded-2xl bg-amber-950/25 border border-amber-800/60 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>Mandatory Safety Guidelines & Protocols</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              {activity.safety_info}
            </p>
          </div>

          {/* Equipment Checklist & Prerequisites */}
          <div className="p-6 rounded-2xl bg-[#111c16] border border-[#1e3427] space-y-4">
            <h2 className="text-lg font-bold text-white">Prerequisites & Equipment Checklist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activity.requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#15231c] border border-[#22392b] flex items-center gap-2.5 text-xs text-zinc-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded Mini Leaflet Map */}
          <div className="p-6 rounded-2xl bg-[#111c16] border border-[#1e3427] space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Trailhead Coordinates</span>
            </h2>
            <div className="text-xs text-zinc-400 font-mono">
              Latitude: {activity.latitude.toFixed(6)} | Longitude: {activity.longitude.toFixed(6)}
            </div>
            <MapComponent
              activities={[activity]}
              center={[activity.latitude, activity.longitude]}
              zoom={7}
              height="300px"
              showFilters={false}
            />
          </div>
        </div>

        {/* Right Sidebar: Key Specs & Submit Proof CTA */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#14231b] to-[#101b15] border border-[#203a2c] shadow-xl space-y-6">
            <h3 className="font-bold text-base text-white border-b border-[#1f3529] pb-3">
              Expedition Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#1b2f24]">
                <span className="text-zinc-400">Award Points</span>
                <span className="font-bold text-emerald-400">+{activity.base_points} pts</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1b2f24]">
                <span className="text-zinc-400">Estimated Gear Cost</span>
                <span className="font-bold text-white">
                  {activity.estimated_cost ? `$${activity.estimated_cost}` : 'Free / Public Access'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1b2f24]">
                <span className="text-zinc-400">Expedition Duration</span>
                <span className="font-bold text-white">~{activity.duration_hours || 4} hours</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1b2f24]">
                <span className="text-zinc-400">Verification</span>
                <span className="font-bold text-teal-300">Photo Proof Required</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="space-y-2 pt-2">
              <Link
                href={`/submissions/new?activityId=${activity.id}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-950/60 transition-all text-center"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Submit Evidence of Completion</span>
              </Link>
              <p className="text-[11px] text-zinc-500 text-center">
                Requires summit photograph and timestamped GPS coordinates.
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
        <div className="max-w-5xl mx-auto px-4 py-20 text-center text-zinc-400">
          Loading adventure details...
        </div>
      }
    >
      <ActivityDetailContent params={params} />
    </Suspense>
  );
}
