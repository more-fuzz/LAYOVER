'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { adaptActivity, UIActivity } from '@/lib/ui/adapters';
import { ActivityItem } from '@/data/sampleData';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ImageTile } from '@/components/ui/ImageTile';
import { DifficultyDots } from '@/components/ui/DifficultyDots';
import MapComponent from '@/components/MapComponent';

interface ActivityDetailViewProps {
  activity: ActivityItem;
}

export function ActivityDetailView({ activity: rawActivity }: ActivityDetailViewProps) {
  const activity: UIActivity = adaptActivity(rawActivity);

  // UI-TODO: Bookmarks kept in-memory for session; no backend saved_activities table exists
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="field-container w-full py-8 md:py-12 space-y-8 page-rise">
      {/* Back button */}
      <div>
        <Link
          href="/explorer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)] transition-colors"
        >
          <Icon name="arrow-left" size={14} aria-hidden="true" />
          <span>Back to Adventure Map</span>
        </Link>
      </div>

      {/* Main Grid: Detail Content Left (8 cols), Sticky Action Panel Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Strict Order */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Image Tile (4:3) */}
          <div className="relative rounded-[var(--radius-lg,22px)] overflow-hidden border border-[var(--line,#D8CBB0)]">
            <ImageTile
              src={activity.imageUrl}
              alt={activity.title}
              aspectRatio="4/3"
              className="w-full h-full object-cover"
            />
            {/* Top Points Stamp */}
            {activity.basePoints > 0 && (
              <div className="absolute top-4 right-4 z-10 bg-[var(--citron,#D8F23C)] text-[var(--ink,#0F1F1A)] px-3 py-1.5 rounded-[var(--radius-sm,8px)] font-mono-label text-xs font-bold border border-[var(--citron,#D8F23C)] shadow-sm">
                +{activity.basePoints} PTS
              </div>
            )}
          </div>

          {/* 2. Category + Title */}
          <div className="space-y-2 border-b border-[var(--line,#D8CBB0)] pb-6">
            <div className="flex items-center gap-2">
              <span className="font-mono-label text-[11px] text-[var(--flame,#FF5A1F)] font-bold uppercase">
                {activity.category}
              </span>
              {activity.locationName && (
                <>
                  <span className="text-[var(--muted,#5E675F)]">&middot;</span>
                  <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
                    {activity.locationName}
                  </span>
                </>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-extrabold text-[var(--ink,#0F1F1A)] tracking-tight">
              {activity.title}
            </h1>
          </div>

          {/* 3. Difficulty and Cost and Duration Row */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-[var(--radius,14px)] bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] text-xs">
            <div>
              <span className="font-mono-label text-[10px] text-[var(--muted,#5E675F)] block mb-1">
                DIFFICULTY
              </span>
              <DifficultyDots difficulty={activity.difficultyString} />
            </div>
            <div>
              <span className="font-mono-label text-[10px] text-[var(--muted,#5E675F)] block mb-1">
                GEAR OUTLAY
              </span>
              <span className="font-mono-label text-xs font-bold text-[var(--ink,#0F1F1A)]">
                {activity.costLabel}
              </span>
            </div>
            <div>
              <span className="font-mono-label text-[10px] text-[var(--muted,#5E675F)] block mb-1">
                DURATION
              </span>
              <span className="font-mono-label text-xs font-bold text-[var(--ink,#0F1F1A)]">
                {activity.durationMinutes
                  ? `~${activity.durationMinutes} min`
                  : activity.durationHours
                  ? `~${activity.durationHours} hrs`
                  : 'Self-paced'}
              </span>
            </div>
          </div>

          {/* 4. Overview */}
          <div className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[var(--ink,#0F1F1A)]">
              Overview
            </h2>
            <p className="text-sm text-[var(--text,#1A241F)] leading-relaxed">
              {activity.description}
            </p>
          </div>

          {/* 5. Destination & Coordinates */}
          <div className="space-y-3 p-5 rounded-[var(--radius,14px)] bg-[var(--sand,#EADFC8)]/40 border border-[var(--line,#D8CBB0)]">
            <h2 className="font-display text-lg font-bold text-[var(--ink,#0F1F1A)]">
              Destination Coordinates
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono-label text-[var(--muted,#5E675F)]">
              {activity.locationName && (
                <div>Location: <span className="font-bold text-[var(--ink,#0F1F1A)]">{activity.locationName}</span></div>
              )}
              <div>Latitude: <span className="font-bold tabular-nums text-[var(--ink,#0F1F1A)]">{activity.latitude.toFixed(5)}</span></div>
              <div>Longitude: <span className="font-bold tabular-nums text-[var(--ink,#0F1F1A)]">{activity.longitude.toFixed(5)}</span></div>
            </div>
          </div>

          {/* 6. Requirements */}
          {activity.requirements.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-display text-xl font-bold text-[var(--ink,#0F1F1A)]">
                Requirements &amp; Prerequisites
              </h2>
              <ul className="space-y-2">
                {activity.requirements.map((req, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-[var(--radius-sm,8px)] bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] text-xs text-[var(--text,#1A241F)]"
                  >
                    <Icon name="check" size={16} className="text-[var(--jade-deep,#0B7A50)] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 7. Safety Considerations (NEVER COLLAPSED OR HIDDEN) */}
          <div className="p-6 rounded-[var(--radius-lg,22px)] border-2 border-[var(--folklore,#B8390A)]/40 bg-[#FBF3F0] space-y-3">
            <div className="flex items-center gap-2 text-[var(--folklore,#B8390A)] font-bold text-sm">
              <Icon name="shield-check" size={20} aria-hidden="true" />
              <h2 className="font-display text-base font-bold text-[var(--ink,#0F1F1A)]">
                Mandatory Safety Considerations
              </h2>
            </div>
            <p className="text-xs md:text-sm text-[var(--text,#1A241F)] leading-relaxed font-medium">
              {activity.safetyInfo ||
                'Carry sufficient hydration, monitor terrain weather conditions, and inform regional park rangers before departure. Never venture off designated trails.'}
            </p>
          </div>

          {/* 8. Directions (Embedded Map with OSRM) */}
          <div className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[var(--ink,#0F1F1A)]">
              Trailhead Directions
            </h2>
            <MapComponent
              activities={[rawActivity]}
              selectedId={activity.id}
              center={[activity.latitude, activity.longitude]}
              zoom={8}
              height="360px"
              showFilters={false}
              enableRouting={true}
            />
          </div>
        </div>

        {/* Right Sticky Action Panel (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="p-6 rounded-[var(--radius-lg,22px)] border border-[var(--line,#D8CBB0)] bg-[var(--card,#FFFAF0)] shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--line,#D8CBB0)] pb-4">
              <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
                FIELD ACTIONS
              </span>
              {activity.basePoints > 0 && (
                <span className="font-mono-label text-xs font-bold text-[var(--flame,#FF5A1F)]">
                  +{activity.basePoints} PTS AWARD
                </span>
              )}
            </div>

            {/* Primary Action: Record completion */}
            <div className="space-y-2">
              <Button
                variant="flame"
                size="lg"
                href={`/submissions/new?activityId=${activity.id}`}
                className="w-full"
                hasArrow
              >
                Record completion
              </Button>
              {/* Contextual helper line under Record completion */}
              <p className="text-[11px] text-[var(--muted,#5E675F)] leading-relaxed text-center px-1">
                A photo and approximate coordinates from the site are needed. Geotagged photos are evidence, not proof.
              </p>
            </div>

            {/* Secondary Action: Save toggle */}
            <Button
              variant={isSaved ? 'citron' : 'outline'}
              size="default"
              onClick={() => setIsSaved(!isSaved)}
              className="w-full"
              icon="bookmark"
            >
              {isSaved ? 'Saved to session' : 'Save adventure'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
