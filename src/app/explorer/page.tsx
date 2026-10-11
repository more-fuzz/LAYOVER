'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import MapComponent from '@/components/MapComponent';
import { adaptActivity, adaptDestination, UIActivity, UIDestination } from '@/lib/ui/adapters';
import { apiClient } from '@/lib/ui/api';
import { SearchField } from '@/components/ui/SearchField';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { DifficultyDots } from '@/components/ui/DifficultyDots';
import { StampBadge } from '@/components/ui/StampBadge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { ImageTile } from '@/components/ui/ImageTile';
import { ActivityItem, DestinationItem } from '@/data/sampleData';

function ExplorerContent() {
  const searchParams = useSearchParams();
  const initialDestId = searchParams.get('dest') || undefined;

  const [rawActivities, setRawActivities] = useState<ActivityItem[]>([]);
  const [rawDestinations, setRawDestinations] = useState<DestinationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedId, setSelectedItemId] = useState<string | undefined>(initialDestId);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [locateTarget, setLocateTarget] = useState<[number, number] | null>(null);

  // Load activities and destinations from API
  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [actRes, destRes] = await Promise.all([
        apiClient.get<ActivityItem[]>('/api/activities'),
        apiClient.get<DestinationItem[]>('/api/destinations'),
      ]);

      if (actRes.ok && Array.isArray(actRes.data)) {
        setRawActivities(actRes.data);
      } else if (!actRes.ok) {
        setErrorMessage(actRes.message);
      }

      if (destRes.ok && Array.isArray(destRes.data)) {
        setRawDestinations(destRes.data);
      }
    } catch {
      setErrorMessage("We can't reach the trail right now. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Adapt items
  const activities: UIActivity[] = rawActivities.map(adaptActivity);
  const destinations: UIDestination[] = rawDestinations.map(adaptDestination);

  // Derive unique categories from real data
  const realCategories = Array.from(
    new Set(activities.map((a) => a.category).filter(Boolean))
  );

  // Is After Dark mode active?
  const isAfterDark = selectedCategory === 'spooky';

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    if (isAfterDark) return false; // In spooky mode, show destinations only
    const matchesCategory = selectedCategory === 'all' || act.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDifficulty =
      selectedDifficulty === 'all' || act.difficultyString === selectedDifficulty;
    const matchesSearch =
      !search ||
      act.title.toLowerCase().includes(search.toLowerCase()) ||
      act.description.toLowerCase().includes(search.toLowerCase()) ||
      (act.locationName && act.locationName.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  // Filter destinations
  const filteredDestinations = destinations.filter((dest) => {
    if (!isAfterDark && selectedCategory !== 'all') return false;
    const matchesSearch =
      !search ||
      dest.name.toLowerCase().includes(search.toLowerCase()) ||
      dest.description.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  const totalResultsCount = filteredActivities.length + (isAfterDark || selectedCategory === 'all' ? filteredDestinations.length : 0);

  // Selected item object for sheet
  const selectedActivity = activities.find((a) => a.id === selectedId);
  const selectedDestination = destinations.find((d) => d.id === selectedId);

  return (
    <div className="field-container w-full py-6 md:py-10 space-y-6">
      {/* 1. Header row: "Where to next?" + Search Field */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--line,#D8CBB0)] pb-6">
        <div>
          <span className="font-mono-label text-[11px] text-[var(--muted,#5E675F)]">
            FIELD CARTOGRAPHY
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-[var(--ink,#0F1F1A)] mt-1">
            Where to <span className="font-serif-accent text-[var(--flame,#FF5A1F)]">next?</span>
          </h1>
        </div>

        <div className="w-full md:max-w-md">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search trails, locations, lore..."
          />
        </div>
      </div>

      {/* 2. Category Chips & Accessibility Announcement */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Chip
          label="All"
          active={selectedCategory === 'all'}
          onClick={() => setSelectedCategory('all')}
        />
        {realCategories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            active={selectedCategory === cat.toLowerCase()}
            onClick={() => setSelectedCategory(cat.toLowerCase())}
          />
        ))}
        {/* Spooky / After dark chip */}
        <Chip
          label="Am I brave enough?"
          icon="ghost"
          active={isAfterDark}
          onClick={() => setSelectedCategory(isAfterDark ? 'all' : 'spooky')}
          className={isAfterDark ? 'border-[var(--citron,#D8F23C)]' : ''}
        />

        {/* Live Result Counter */}
        <div
          aria-live="polite"
          className="ml-auto font-mono-label text-xs text-[var(--muted,#5E675F)] select-none hidden sm:block"
        >
          {isLoading ? 'Scanning...' : `${totalResultsCount} waypoint${totalResultsCount === 1 ? '' : 's'} charted`}
        </div>
      </div>

      {/* Mobile Toggle: List vs Map */}
      <div className="flex md:hidden items-center justify-between p-1 bg-[var(--sand,#EADFC8)] rounded-[var(--radius,14px)] border border-[var(--line,#D8CBB0)]">
        <button
          type="button"
          onClick={() => setMobileView('list')}
          className={`flex-1 py-2 text-xs font-bold rounded-[var(--radius-sm,8px)] transition-colors ${
            mobileView === 'list'
              ? 'bg-[var(--card,#FFFAF0)] text-[var(--ink,#0F1F1A)] shadow-xs'
              : 'text-[var(--muted,#5E675F)]'
          }`}
        >
          List View
        </button>
        <button
          type="button"
          onClick={() => setMobileView('map')}
          className={`flex-1 py-2 text-xs font-bold rounded-[var(--radius-sm,8px)] transition-colors ${
            mobileView === 'map'
              ? 'bg-[var(--card,#FFFAF0)] text-[var(--ink,#0F1F1A)] shadow-xs'
              : 'text-[var(--muted,#5E675F)]'
          }`}
        >
          Cartography Map
        </button>
      </div>

      {/* Error state */}
      {errorMessage && (
        <ErrorState
          title="Field data unavailable"
          message={errorMessage}
          onRetry={loadData}
        />
      )}

      {/* 3. Split View (List Left max 480px, Map Right min-height 620px) */}
      {!errorMessage && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* List Left Column */}
          <div
            className={`md:col-span-5 lg:col-span-5 space-y-4 max-h-[780px] overflow-y-auto pr-1 ${
              mobileView === 'map' ? 'hidden md:block' : 'block'
            }`}
          >
            {isLoading ? (
              <div className="space-y-4">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : totalResultsCount === 0 ? (
              <EmptyState
                title="Nothing here yet."
                description="Try a different search keyword or switch category filter to see available waypoints."
                actionLabel="Reset filters"
                onAction={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}
              />
            ) : (
              <div className="space-y-3">
                {/* 1. Activities List Rows */}
                {filteredActivities.map((act) => {
                  const isSelected = selectedId === act.id;
                  return (
                    <div
                      key={act.id}
                      onClick={() => setSelectedItemId(act.id)}
                      className={`p-4 rounded-[var(--radius,14px)] border transition-all cursor-pointer flex gap-4 items-start ${
                        isSelected
                          ? 'bg-[var(--ink,#0F1F1A)] text-[var(--paper,#F6EFE2)] border-[var(--ink,#0F1F1A)] shadow-lg translate-x-1'
                          : 'bg-[var(--card,#FFFAF0)] text-[var(--text,#1A241F)] border-[var(--line,#D8CBB0)] hover:translate-x-1 hover:border-[var(--ink-line,#2D4C42)]'
                      }`}
                    >
                      {/* Thumbnail tile */}
                      <div className="w-24 h-24 shrink-0 rounded-[var(--radius-sm,8px)] overflow-hidden">
                        <ImageTile
                          src={act.imageUrl}
                          alt={act.title}
                          aspectRatio="1/1"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`font-mono-label text-[10px] uppercase truncate ${
                                isSelected ? 'text-[var(--citron,#D8F23C)]' : 'text-[var(--muted,#5E675F)]'
                              }`}
                            >
                              {act.category}
                            </span>
                            <DifficultyDots difficulty={act.difficultyString} />
                          </div>
                          <h3
                            className={`font-display font-bold text-base line-clamp-1 mt-1 ${
                              isSelected ? 'text-[var(--paper,#F6EFE2)]' : 'text-[var(--ink,#0F1F1A)]'
                            }`}
                          >
                            {act.title}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--line,#D8CBB0)]/30">
                          <span className="font-mono-label text-[11px] font-bold">
                            {act.costLabel}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              isSelected ? 'text-[var(--citron,#D8F23C)]' : 'text-[var(--flame,#FF5A1F)]'
                            }`}
                          >
                            Select &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 2. Spooky / Folklore Destinations List */}
                {(isAfterDark || selectedCategory === 'all') &&
                  filteredDestinations.map((dest) => {
                    const isSelected = selectedId === dest.id;
                    return (
                      <div
                        key={dest.id}
                        onClick={() => setSelectedItemId(dest.id)}
                        className={`p-4 rounded-[var(--radius,14px)] border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-[var(--ink,#0F1F1A)] text-[var(--paper,#F6EFE2)] border-[var(--citron,#D8F23C)] shadow-lg translate-x-1'
                            : 'bg-[var(--card,#FFFAF0)] text-[var(--text,#1A241F)] border-[var(--line,#D8CBB0)] hover:translate-x-1 hover:border-[var(--folklore,#B8390A)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <StampBadge
                            variant={dest.hasFolklore ? 'folklore' : 'history'}
                            text={dest.hasFolklore ? 'Folklore' : 'Historical'}
                          />
                          <span
                            className={`font-mono-label text-[10px] ${
                              isSelected ? 'text-[var(--citron,#D8F23C)]' : 'text-[var(--muted,#5E675F)]'
                            }`}
                          >
                            {dest.category}
                          </span>
                        </div>
                        <h3
                          className={`font-display font-bold text-base line-clamp-1 ${
                            isSelected ? 'text-[var(--paper,#F6EFE2)]' : 'text-[var(--ink,#0F1F1A)]'
                          }`}
                        >
                          {dest.name}
                        </h3>
                        <p
                          className={`text-xs line-clamp-2 ${
                            isSelected ? 'text-[var(--sand,#EADFC8)]' : 'text-[var(--muted,#5E675F)]'
                          }`}
                        >
                          {dest.folkloreText || dest.historyText || dest.description}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Map Right Column (min-height 620px, 28px radius, 1.5px ink border) */}
          <div
            className={`md:col-span-7 lg:col-span-7 relative ${
              mobileView === 'list' ? 'hidden md:block' : 'block'
            }`}
          >
            <div className="relative rounded-[28px] overflow-hidden border-[1.5px] border-[var(--ink,#0F1F1A)] shadow-lg">
              <MapComponent
                activities={rawActivities}
                destinations={rawDestinations}
                selectedId={selectedId}
                onSelectMarker={(item) => setSelectedItemId(item.id)}
                isAfterDark={isAfterDark}
                locateTarget={locateTarget}
                height="620px"
              />

              {/* Bottom Selected Sheet */}
              {(selectedActivity || selectedDestination) && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-4 left-4 right-4 z-[400] bg-[var(--card,#FFFAF0)] text-[var(--ink,#0F1F1A)] border-[1.5px] border-[var(--ink,#0F1F1A)] rounded-[var(--radius,14px)] p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono-label text-[10px] text-[var(--muted,#5E675F)] uppercase">
                          {selectedActivity ? selectedActivity.category : selectedDestination?.category}
                        </span>
                        {selectedDestination && (
                          <StampBadge
                            variant={selectedDestination.hasFolklore ? 'folklore' : 'history'}
                            text={selectedDestination.hasFolklore ? 'Folklore' : 'Documented'}
                          />
                        )}
                        {selectedActivity && (
                          <DifficultyDots difficulty={selectedActivity.difficultyString} />
                        )}
                      </div>

                      <h4 className="font-display font-bold text-lg text-[var(--ink,#0F1F1A)] truncate">
                        {selectedActivity ? selectedActivity.title : selectedDestination?.name}
                      </h4>

                      <div className="flex items-center gap-3 text-xs text-[var(--muted,#5E675F)] mt-1 font-mono-label">
                        {selectedActivity && (
                          <>
                            <span>{selectedActivity.costLabel}</span>
                            {selectedActivity.durationMinutes && (
                              <span>~{selectedActivity.durationMinutes} min</span>
                            )}
                          </>
                        )}
                        {selectedDestination && (
                          <span>Public trail waypoint</span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons: Locate on map, View Details, Dismiss */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const item = selectedActivity || selectedDestination;
                          if (item?.latitude && item?.longitude) {
                            setLocateTarget([item.latitude, item.longitude]);
                          }
                        }}
                        title="Locate this waypoint on map"
                        aria-label="Locate this waypoint on map"
                        className="btn-field btn-outline text-xs font-mono-label py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Icon name="compass" size={12} aria-hidden="true" />
                        <span>Locate</span>
                      </button>

                      {selectedActivity && (
                        <Button
                          variant="ink"
                          size="sm"
                          href={`/activities/${selectedActivity.id}`}
                          hasArrow
                        >
                          View details
                        </Button>
                      )}
                      {selectedDestination && (
                        <Button
                          variant="ink"
                          size="sm"
                          href={`/brave-enough#${selectedDestination.id}`}
                          hasArrow
                        >
                          Dossier
                        </Button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedItemId(undefined)}
                        className="text-[var(--muted,#5E675F)] hover:text-[var(--ink,#0F1F1A)] p-1 rounded transition-colors"
                        aria-label="Close sheet"
                      >
                        <Icon name="close" size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <Suspense
      fallback={
        <div className="field-container w-full py-12 text-center">
          <div className="font-mono-label text-xs text-[var(--muted,#5E675F)]">
            Loading expedition cartography...
          </div>
        </div>
      }
    >
      <ExplorerContent />
    </Suspense>
  );
}

