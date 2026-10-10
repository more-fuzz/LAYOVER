'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { SAMPLE_ACTIVITIES, SAMPLE_SUBMISSIONS } from '@/data/sampleData';
import MapComponent from '@/components/MapComponent';
import SafeImage from '@/components/SafeImage';
import {
  BookOpen,
  MapPin,
  Calendar,
  Sparkles,
  Share2,
  Award,
  CheckCircle2,
  Lock,
  Globe,
  Compass,
  ArrowRight,
  Map as MapIcon,
  List as ListIcon,
} from 'lucide-react';

export default function MemoirPage() {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [privacyPublic, setPrivacyPublic] = useState(true);
  const [viewMode, setViewMode] = useState<'timeline' | 'map'>('timeline');

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-10">
      {/* 1. Editorial Journal Header */}
      <div className="bg-[#FFFDF8] border-2 border-[#D6CCBC] rounded-3xl p-6 sm:p-12 shadow-sm space-y-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6CCBC] pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#777A53] bg-[#EAE1D3] px-3 py-1 rounded-md border border-[#D6CCBC]">
            <BookOpen className="w-3.5 h-3.5 text-[#B85F43]" />
            <span>FIELD LOG & ADVENTURE MEMOIR</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPrivacyPublic(!privacyPublic)}
              className="text-xs font-mono text-[#6D685C] bg-[#EAE1D3] hover:bg-[#D6CCBC] px-2.5 py-1 rounded-md border border-[#D6CCBC] flex items-center gap-1 transition-colors"
            >
              {privacyPublic ? (
                <>
                  <Globe className="w-3 h-3 text-[#777A53]" />
                  <span>Public View</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-[#B85F43]" />
                  <span>Private Log</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="btn-journal-primary text-xs flex items-center gap-1.5 py-1 px-3"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied! ✓' : 'Share Journal'}</span>
            </button>
          </div>
        </div>

        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-5xl font-bold text-[#292820] font-sans">
            {profile.display_name}&apos;s Adventure Memoir
          </h1>
          <p className="text-xs sm:text-sm text-[#6D685C] leading-relaxed">
            An authentic chronicle of verified mountain passes, river runs, and archaeological
            investigations. Only officially certified accomplishments appear in this personal field guide.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#D6CCBC]">
          <div className="p-4 rounded-xl bg-[#F5F0E7] border border-[#D6CCBC] text-center">
            <div className="text-2xl font-bold text-[#292820] font-mono">
              {completedActivities.length}
            </div>
            <div className="text-[11px] text-[#6D685C] font-mono mt-0.5 uppercase">
              Verified Expeditions
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#F5F0E7] border border-[#D6CCBC] text-center">
            <div className="text-2xl font-bold text-[#B85F43] font-mono">
              +{totalPoints} PTS
            </div>
            <div className="text-[11px] text-[#6D685C] font-mono mt-0.5 uppercase">
              Memoir Points Credited
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#F5F0E7] border border-[#D6CCBC] text-center">
            <div className="text-2xl font-bold text-[#777A53] font-mono">
              {profile.badge_title || 'Alpine Voyager'}
            </div>
            <div className="text-[11px] text-[#6D685C] font-mono mt-0.5 uppercase">
              Current Rank Badge
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#F5F0E7] border border-[#D6CCBC] text-center">
            <div className="text-2xl font-bold text-[#C6A45B] font-mono">100%</div>
            <div className="text-[11px] text-[#6D685C] font-mono mt-0.5 uppercase">
              Reviewer Audited
            </div>
          </div>
        </div>
      </div>

      {/* 2. Journal Content with View Toggle (Timeline vs Map) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D6CCBC] pb-3">
          <div>
            <h2 className="text-xl font-bold text-[#292820] font-sans">
              Personal Adventure Journal
            </h2>
            <p className="text-xs text-[#6D685C]">
              Chronological field polaroids authenticated by expedition review dispatchers.
            </p>
          </div>

          {/* Compact View Toggle */}
          <div className="flex items-center bg-[#EAE1D3] p-0.5 rounded-lg border border-[#D6CCBC] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-[#FFFDF8] text-[#292820] shadow-xs'
                  : 'text-[#6D685C] hover:text-[#292820]'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>Polaroids</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                viewMode === 'map'
                  ? 'bg-[#FFFDF8] text-[#292820] shadow-xs'
                  : 'text-[#6D685C] hover:text-[#292820]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* 3. Empty State (When no journal entries exist) */}
        {completedActivities.length === 0 ? (
          <div className="max-w-md mx-auto my-12 p-8 bg-[#FFFDF8] border-2 border-dashed border-[#D6CCBC] rounded-2xl text-center space-y-5 shadow-xs">
            {/* Blank Polaroid-Style Illustration */}
            <div className="w-48 aspect-4/3 mx-auto bg-[#F5F0E7] border-2 border-[#D6CCBC] rounded-lg p-2 pb-6 flex flex-col items-center justify-center space-y-2 shadow-xs">
              <Compass className="w-10 h-10 text-[#777A53] opacity-60" />
              <span className="font-handwritten text-lg text-[#6D685C] -rotate-2 select-none">
                field notes awaiting ~
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#292820] font-sans">
                Your first adventure goes here.
              </h3>
              <p className="text-xs text-[#6D685C] leading-relaxed">
                Complete a certified trailhead, submit your summit photograph, and build your lifelong expedition memoir.
              </p>
            </div>

            <Link
              href="/explorer"
              className="btn-journal-terracotta text-xs py-2 px-5 inline-flex items-center gap-2"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Adventures</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : viewMode === 'map' ? (
          /* Map View */
          <div className="rounded-2xl overflow-hidden border-2 border-[#D6CCBC] shadow-xs">
            <MapComponent
              activities={completedActivities.map((c) => c.activity).filter(Boolean) as any}
              height="520px"
              center={[30.0, 78.5]}
              zoom={5}
              enableRouting={true}
            />
          </div>
        ) : (
          /* Restrained Polaroid-Inspired Journal Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedActivities.map((item, idx) => {
              // Custom handwritten moment for each polaroid entry
              const handwrittenCaptions = [
                'field notes: early dawn river ascent ~',
                'summit achieved under clear skies ~',
                'boulder pitch clean, zero trace left ~',
              ];
              const note = handwrittenCaptions[idx % handwrittenCaptions.length];

              return (
                <div
                  key={item.id}
                  className="bg-[#FFFDF8] border-2 border-[#D6CCBC] rounded-xl p-3 pb-5 shadow-xs hover:border-[#777A53] transition-all flex flex-col justify-between space-y-3 relative group"
                >
                  {/* Photo Frame */}
                  <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden bg-[#EAE1D3] border border-[#D6CCBC]">
                    {item.activity && (
                      <SafeImage
                        src={item.activity.image_url}
                        alt={item.activity.name}
                        aspectRatio="4/3"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    )}

                    {/* Circular Verified Achievement Stamp */}
                    <div className="absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-[#FFFDF8]/95 border-2 border-[#777A53] flex flex-col items-center justify-center text-[#777A53] shadow-xs select-none">
                      <span className="text-[7px] font-mono font-extrabold uppercase leading-tight">
                        CERTIFIED
                      </span>
                      <span className="text-[6px] font-mono leading-none">VERIFIED</span>
                    </div>

                    {/* Category Stamp */}
                    <div className="absolute top-2.5 left-2.5 z-10 bg-[#FFFDF8]/90 border border-[#D6CCBC] px-2 py-0.5 rounded text-[9px] font-mono font-bold text-[#777A53] uppercase">
                      {item.activity_category}
                    </div>
                  </div>

                  {/* Polaroid Content */}
                  <div className="space-y-1.5 px-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#6D685C]">
                      <span>
                        {new Date(item.reviewed_at || item.submitted_at).toLocaleDateString()}
                      </span>
                      <span className="font-bold text-[#B85F43]">+{item.points} PTS</span>
                    </div>

                    <h3 className="font-bold text-base text-[#292820] font-sans truncate">
                      {item.activity_name}
                    </h3>

                    {/* Handwritten Personal Annotation */}
                    <div className="pt-0.5">
                      <span className="font-handwritten text-base text-[#B85F43] -rotate-1 select-none block">
                        &quot;{note}&quot;
                      </span>
                    </div>

                    {item.review_notes && (
                      <p className="text-[11px] text-[#6D685C] italic pt-1 border-t border-[#D6CCBC] line-clamp-2">
                        Arbitrator note: {item.review_notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
