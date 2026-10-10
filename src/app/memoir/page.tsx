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
  FileCheck2,
} from 'lucide-react';

export default function MemoirPage() {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [privacyPublic, setPrivacyPublic] = useState(true);

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
      {/* Editorial Journal Header */}
      <div className="bg-[#FFFDF8] border-2 border-[#D6CCBC] rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 relative overflow-hidden">
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
            An authorized chronicle of verified mountain passes, river runs, and archaeological
            investigations. Private verification proof remains securely shielded; only certified
            accomplishments appear in this public journal.
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

      {/* Interactive Accomplishments Cartography */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#D6CCBC] pb-2">
          <h2 className="text-lg font-bold text-[#292820] flex items-center gap-2 font-sans">
            <MapPin className="w-4 h-4 text-[#777A53]" />
            <span>Map of Verified Accomplishments</span>
          </h2>
          <span className="text-xs font-mono text-[#8E8675]">Authoritative Completed Waypoints</span>
        </div>

        <MapComponent
          activities={completedActivities.map((c) => c.activity).filter(Boolean) as any}
          height="440px"
          center={[30.0, 78.5]}
          zoom={5}
          showFilters={false}
          enableRouting={true}
        />
      </div>

      {/* Chronological Timeline & Scrapbook */}
      <div className="space-y-6 pt-4">
        <div className="border-b border-[#D6CCBC] pb-2">
          <h2 className="text-xl font-bold text-[#292820] font-sans">
            Expedition Chronicle Timeline
          </h2>
          <p className="text-xs text-[#6D685C]">
            Chronological records authenticated by platform review dispatchers.
          </p>
        </div>

        <div className="relative border-l-2 border-[#D6CCBC] ml-4 pl-6 space-y-8">
          {completedActivities.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline marker pin */}
              <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#B85F43] border-2 border-[#FFFDF8]" />

              <div className="rounded-2xl bg-[#FFFDF8] border border-[#D6CCBC] overflow-hidden shadow-xs p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D6CCBC] pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#777A53] bg-[#EAE1D3] px-2 py-0.5 rounded mr-2 border border-[#D6CCBC]">
                      {item.activity_category}
                    </span>
                    <span className="text-xs text-[#6D685C] font-mono">
                      Completed:{' '}
                      {new Date(item.reviewed_at || item.submitted_at).toLocaleDateString()}
                    </span>
                    <h3 className="text-lg font-bold text-[#292820] mt-1 font-sans">
                      {item.activity_name}
                    </h3>
                  </div>

                  <div className="text-xs font-mono font-extrabold text-[#B85F43] bg-[#F5F0E7] px-2.5 py-1 rounded border border-[#D6CCBC]">
                    +{item.points} PTS AWARDED
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {item.activity && (
                    <div className="md:col-span-4 rounded-xl overflow-hidden border border-[#D6CCBC]">
                      <SafeImage
                        src={item.activity.image_url}
                        alt={item.activity.name}
                        aspectRatio="4/3"
                        fallbackTitle={item.activity_name}
                      />
                    </div>
                  )}

                  <div className="md:col-span-8 space-y-3">
                    <p className="text-xs sm:text-sm text-[#6D685C] leading-relaxed">
                      &quot;{item.notes || 'Official trail completed with verified summit coordinates.'}&quot;
                    </p>

                    <div className="p-3 bg-[#EAE1D3]/50 rounded-lg border border-[#D6CCBC] text-xs space-y-1">
                      <div className="font-mono text-[10px] text-[#777A53] font-bold uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#777A53]" />
                        <span>Reviewer Verification Dispatch</span>
                      </div>
                      <div className="text-[#292820] text-xs">
                        Reviewer Decision: {item.review_notes || 'Photographic evidence matches summit benchmark.'}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#8E8675] font-mono">
                      <span>STATUS: CERTIFIED VERIFIED</span>
                      <span>•</span>
                      <span>REF: SUB-{item.id.toUpperCase()}</span>
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
