'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { SAMPLE_ACTIVITIES, SAMPLE_SUBMISSIONS } from '@/data/sampleData';
import MapComponent from '@/components/MapComponent';
import {
  BookOpen,
  MapPin,
  Calendar,
  Sparkles,
  Share2,
  Award,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function MemoirPage() {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);

  // Completed verified submissions only
  const approvedSubmissions = SAMPLE_SUBMISSIONS.filter(
    (s) => s.status === 'approved' && (s.user_id === profile.id || s.user_id === 'u6')
  );

  const completedActivities = approvedSubmissions.map((sub) => {
    const act = SAMPLE_ACTIVITIES.find((a) => a.id === sub.activity_id);
    return {
      ...sub,
      activity: act,
    };
  });

  const totalPoints = approvedSubmissions.reduce((sum, s) => sum + s.points, 0);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Memoir Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-[#14231b] via-[#101b15] to-[#0a120e] border border-[#1d3426] shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800">
            <BookOpen className="w-4 h-4" />
            <span>Chronicle of Verified Feats</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {profile.display_name}&apos;s Adventure Memoir
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
            A permanent travel log of verified outdoor ascents, cave dives, and ancient enigmas. Only officially verified accomplishments appear in your official record.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-[#17271e] hover:bg-[#203629] text-emerald-300 border border-[#274433] shadow transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Memoir Link Copied! ✓' : 'Share Memoir'}</span>
          </button>
        </div>
      </div>

      {/* Accomplishment Stats & Badges Cabinet */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111c16] border border-[#1e3427] text-center">
          <div className="text-2xl font-black text-emerald-400">{completedActivities.length}</div>
          <div className="text-xs text-zinc-400 mt-0.5">Expeditions Verified</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#111c16] border border-[#1e3427] text-center">
          <div className="text-2xl font-black text-amber-400">+{totalPoints}</div>
          <div className="text-xs text-zinc-400 mt-0.5">Memoir Points Earned</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#111c16] border border-[#1e3427] text-center">
          <div className="text-2xl font-black text-teal-400">3</div>
          <div className="text-xs text-zinc-400 mt-0.5">Continents Explored</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#111c16] border border-[#1e3427] text-center">
          <div className="text-2xl font-black text-purple-400">4</div>
          <div className="text-xs text-zinc-400 mt-0.5">Badges Conquered</div>
        </div>
      </div>

      {/* Interactive Memoir Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <span>Map of Verified Accomplishments</span>
          </h2>
          <span className="text-xs text-zinc-400">Only approved milestones shown</span>
        </div>

        <MapComponent
          activities={completedActivities.map((c) => c.activity).filter(Boolean) as any}
          height="450px"
          center={[35.0, 20.0]}
          zoom={3}
          showFilters={false}
        />
      </div>

      {/* Visual Timeline & Scrapbook */}
      <div className="space-y-6 pt-4">
        <h2 className="text-2xl font-black text-white">
          Expedition Chronicle Timeline
        </h2>

        <div className="relative border-l-2 border-[#1e3527] ml-4 pl-6 space-y-8">
          {completedActivities.map((item, index) => (
            <div key={item.id} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-[#0a100d]" />

              <div className="rounded-3xl bg-[#111c16] border border-[#1e3427] overflow-hidden shadow-xl p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#182c20] pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded mr-2">
                      {item.activity_category}
                    </span>
                    <span className="text-xs text-zinc-400">
                      Completed on {new Date(item.reviewed_at || item.submitted_at).toLocaleDateString()}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {item.activity_name}
                    </h3>
                  </div>

                  <div className="text-sm font-extrabold text-emerald-400">
                    +{item.points} Points Awarded
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1 rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={item.evidence_url}
                      alt={item.activity_name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <div className="text-xs text-zinc-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{item.activity?.location_name || 'Adventure Coordinates'}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {item.activity?.description}
                    </p>

                    {item.review_notes && (
                      <div className="p-3 rounded-xl bg-[#14231b] border border-[#203a2c] text-xs text-emerald-200/90 italic">
                        Official reviewer note: &quot;{item.review_notes}&quot;
                      </div>
                    )}

                    <div className="pt-2 flex items-center gap-3">
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verified & Encrypted on Supabase</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
