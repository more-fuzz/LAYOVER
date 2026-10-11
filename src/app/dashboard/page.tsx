'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { SAMPLE_ACTIVITIES, SAMPLE_SUBMISSIONS } from '@/data/sampleData';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { StatTile } from '@/components/ui/StatTile';
import { StatusTag } from '@/components/ui/StatusTag';

export default function DashboardPage() {
  const { profile, role } = useAuth();

  const userSubmissions = SAMPLE_SUBMISSIONS.filter(
    (s) => s.user_id === profile.id || s.user_id === 'u6'
  );

  const pendingSubmissions = userSubmissions.filter((s) => s.status === 'pending');
  const approvedSubmissions = userSubmissions.filter((s) => s.status === 'approved');

  return (
    <div className="field-container w-full py-8 md:py-12 space-y-10 page-rise">
      {/* 1. Header & Explorer Profile Card */}
      <div className="panel-ink p-6 md:p-8 border border-[var(--ink-line,#2D4C42)] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--citron,#D8F23C)] shrink-0">
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-label text-[10px] text-[var(--citron,#D8F23C)]">
                AUTHENTICATED EXPLORER
              </span>
              <span className="font-mono-label text-[9px] px-2 py-0.5 rounded bg-[var(--ink-2,#18302A)] border border-[var(--ink-line,#2D4C42)] text-[var(--sand,#EADFC8)]">
                {role.toUpperCase()}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-[var(--paper,#F6EFE2)]">
              {profile.display_name}
            </h1>
            <p className="font-mono-label text-xs text-[var(--sand,#EADFC8)]">
              @{profile.username}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="citron"
            size="sm"
            href="/rewards"
          >
            Redeem Points &rarr;
          </Button>
          <Button
            variant="flame"
            size="sm"
            href="/submissions/new"
            hasArrow
          >
            Record Completion
          </Button>
        </div>
      </div>

      {/* 2. Key Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile
          label="TOTAL EARNED"
          value={profile.total_earned_points ?? profile.points}
          unit="PTS"
          variant="ink"
          description="Competitive rank decided by lifetime accomplishments."
        />
        <StatTile
          label="REDEEMABLE NOW"
          value={profile.points}
          unit="PTS"
          variant="citron"
          description="Available for outfitter vouchers."
        />
        {typeof profile.rank === 'number' && (
          <StatTile
            label="YOUR STANDING"
            value={`#${profile.rank}`}
            variant="default"
            description="Global ranking on community leaderboard."
          />
        )}
      </div>

      {/* 3. Submissions Status Queue */}
      <div className="card-field p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--line,#D8CBB0)] pb-4">
          <div>
            <h2 className="font-display font-bold text-lg text-[var(--ink,#0F1F1A)]">
              Expedition Submissions
            </h2>
            <p className="text-xs text-[var(--muted,#5E675F)]">
              Live status of your submitted evidence dossiers.
            </p>
          </div>
          <Link
            href="/memoir"
            className="text-xs font-mono-label text-[var(--flame,#FF5A1F)] hover:underline font-bold"
          >
            View in Journal &rarr;
          </Link>
        </div>

        {userSubmissions.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono-label text-[var(--muted,#5E675F)]">
            No submissions recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {userSubmissions.slice(0, 4).map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 rounded-[var(--radius,14px)] bg-[var(--sand,#EADFC8)]/30 border border-[var(--line,#D8CBB0)] flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="font-display font-bold text-sm text-[var(--ink,#0F1F1A)]">
                    {sub.activity_name}
                  </div>
                  <div className="font-mono-label text-[10px] text-[var(--muted,#5E675F)] mt-0.5">
                    Submitted: {new Date(sub.submitted_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono-label font-bold text-[var(--ink,#0F1F1A)]">
                    +{sub.points} PTS
                  </span>
                  <StatusTag status={sub.status as any} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
