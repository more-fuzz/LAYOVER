'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/ui/api';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { StampBadge } from '@/components/ui/StampBadge';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { ImageTile } from '@/components/ui/ImageTile';
import MapComponent from '@/components/MapComponent';
import { ActivityItem } from '@/data/sampleData';

interface MemoirEntry {
  id: string;
  activity_id: string;
  activity_name: string;
  category: string;
  completed_at: string;
  points_earned: number;
  latitude: number;
  longitude: number;
  evidence_url: string;
  notes?: string | null;
  location_name: string;
  badge_awarded?: string;
}

interface MemoirData {
  total_expeditions: number;
  total_points: number;
  badges: string[];
  entries: MemoirEntry[];
}

export default function MemoirPage() {
  const { user, profile, isDemoUser } = useAuth();
  const isAuthenticated = !!user || !isDemoUser;

  const [memoirData, setMemoirData] = useState<MemoirData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'map'>('timeline');

  const loadMemoir = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await apiClient.get<MemoirData>('/api/memoir');
      if (res.ok && res.data) {
        setMemoirData(res.data);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage("We can't reach your journal records right now. Check connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMemoir();
  }, []);

  const entries = memoirData?.entries || [];

  // Convert entries to ActivityItem shape for map
  const mapActivities: ActivityItem[] = entries.map((e) => ({
    id: e.activity_id,
    slug: e.id,
    name: e.activity_name,
    category: (e.category || 'hiking') as any,
    description: e.notes || `Verified expedition record at ${e.location_name}`,
    difficulty: 2,
    latitude: e.latitude,
    longitude: e.longitude,
    base_points: e.points_earned,
    estimated_cost: 0,
    requirements: [],
    safety_info: 'Verified complete.',
    is_published: true,
    image_url: e.evidence_url,
    location_name: e.location_name,
  }));

  return (
    <div className="field-container w-full py-8 md:py-12 space-y-8 page-rise">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line,#D8CBB0)] pb-6">
        <div>
          <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
            ARCHIVAL JOURNAL
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-[var(--ink,#0F1F1A)] mt-1">
            My <span className="font-serif-accent text-[var(--flame,#FF5A1F)]">Journal.</span>
          </h1>
          <p className="text-xs text-[var(--muted,#5E675F)] mt-1">
            Certified record of your completed expeditions. Evidence records are private to your passport.
          </p>
        </div>

        {/* Timeline / Map Toggle */}
        <div className="flex items-center gap-1 p-1 bg-[var(--sand,#EADFC8)] rounded-[var(--radius,14px)] border border-[var(--line,#D8CBB0)] self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            aria-pressed={viewMode === 'timeline'}
            className={`px-4 py-2 rounded-[var(--radius-sm,8px)] text-xs font-bold transition-colors ${
              viewMode === 'timeline'
                ? 'bg-[var(--card,#FFFAF0)] text-[var(--ink,#0F1F1A)] shadow-xs'
                : 'text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)]'
            }`}
          >
            Polaroid Timeline
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            aria-pressed={viewMode === 'map'}
            className={`px-4 py-2 rounded-[var(--radius-sm,8px)] text-xs font-bold transition-colors ${
              viewMode === 'map'
                ? 'bg-[var(--card,#FFFAF0)] text-[var(--ink,#0F1F1A)] shadow-xs'
                : 'text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)]'
            }`}
          >
            Waypoint Map
          </button>
        </div>
      </div>

      {/* Error state */}
      {errorMessage && (
        <ErrorState
          title="Journal unavailable"
          message={errorMessage}
          onRetry={loadMemoir}
        />
      )}

      {/* Loading state */}
      {isLoading && !errorMessage && (
        <div className="py-20 text-center font-mono-label text-xs text-[var(--muted,#5E675F)]">
          Opening personal adventure memoir...
        </div>
      )}

      {/* Empty State: Blank polaroid */}
      {!isLoading && !errorMessage && entries.length === 0 && (
        <div className="max-w-md mx-auto my-12 p-8 bg-[var(--card,#FFFAF0)] border border-[var(--line,#D8CBB0)] rounded-[var(--radius-lg,22px)] shadow-lg text-center space-y-6">
          {/* Blank Polaroid Frame */}
          <div className="w-56 h-64 mx-auto p-4 bg-white border border-[var(--line,#D8CBB0)] shadow-md rounded-[var(--radius-sm,8px)] flex flex-col justify-between transform -rotate-2">
            <div className="w-full h-44 bg-[var(--sand,#EADFC8)] border border-[var(--line,#D8CBB0)] flex items-center justify-center text-[var(--muted,#5E675F)]">
              <Icon name="compass" size={32} />
            </div>
            <div className="font-handwritten text-center text-sm text-[var(--muted,#5E675F)] select-none">
              first trail photo goes here ~
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-xl font-bold text-[var(--ink,#0F1F1A)]">
              Your first adventure goes here.
            </h3>
            <p className="text-xs text-[var(--muted,#5E675F)] leading-relaxed">
              Explore charted mountain passes, river routes, and folklore mysteries. Once completed, your verified entries appear here.
            </p>
          </div>

          <Button variant="flame" href="/explorer" hasArrow>
            Explore adventures
          </Button>
        </div>
      )}

      {/* Main Content: Polaroid Timeline View */}
      {!isLoading && !errorMessage && entries.length > 0 && viewMode === 'timeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="group p-4 bg-white border border-[var(--line,#D8CBB0)] rounded-[var(--radius-sm,8px)] shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Polaroid Image Area */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--sand,#EADFC8)] border border-[var(--line,#D8CBB0)] rounded-[4px]">
                <ImageTile
                  src={entry.evidence_url}
                  alt={entry.activity_name}
                  aspectRatio="4/3"
                  className="w-full h-full object-cover"
                />

                {/* Verified Stamp: Rotated -6deg, straightens on hover with spring ease */}
                <div className="absolute top-3 right-3 z-10 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300 ease-[cubic-bezier(.3,1.5,.5,1)]">
                  <StampBadge variant="verified" text="Verified Record" />
                </div>
              </div>

              {/* Polaroid Bottom Caption Area */}
              <div className="pt-4 pb-2 px-1 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono-label text-[var(--muted,#5E675F)]">
                  <span>{new Date(entry.completed_at).toLocaleDateString()}</span>
                  <span className="font-bold text-[var(--jade-deep,#0B7A50)]">
                    +{entry.points_earned} PTS
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-[var(--ink,#0F1F1A)] line-clamp-1">
                  {entry.activity_name}
                </h3>

                <p className="font-handwritten text-base text-[var(--text,#1A241F)] line-clamp-2 leading-tight">
                  {entry.notes || `Completed at ${entry.location_name}`}
                </p>

                <div className="pt-2 border-t border-[var(--line,#D8CBB0)]/40 flex items-center justify-between text-[10px] font-mono-label text-[var(--muted,#5E675F)]">
                  <span className="uppercase">{entry.category}</span>
                  <Link
                    href={`/activities/${entry.activity_id}`}
                    className="text-[var(--flame,#FF5A1F)] hover:underline font-bold"
                  >
                    View dossier &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content: Map View */}
      {!isLoading && !errorMessage && entries.length > 0 && viewMode === 'map' && (
        <div className="rounded-[var(--radius-lg,22px)] overflow-hidden border border-[var(--line,#D8CBB0)]">
          <MapComponent
            activities={mapActivities}
            height="580px"
            showFilters={false}
            enableRouting={false}
          />
        </div>
      )}
    </div>
  );
}
