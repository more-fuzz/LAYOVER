'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import MapComponent from '@/components/MapComponent';
import SafeImage from '@/components/SafeImage';
import { SAMPLE_ACTIVITIES, SAMPLE_DESTINATIONS, ActivityItem, DestinationItem } from '@/data/sampleData';
import {
  Compass,
  Search,
  MapPin,
  Ghost,
  X,
  Map as MapIcon,
  List as ListIcon,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

export default function ExplorerPage() {
  const [activities, setActivities] = useState<ActivityItem[]>(SAMPLE_ACTIVITIES);
  const [destinations, setDestinations] = useState<DestinationItem[]>(SAMPLE_DESTINATIONS);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | 'all'>('all');
  const [selectedBudget, setSelectedBudget] = useState<'all' | 'free' | 'under50' | 'under100'>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(undefined);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  const listContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [actRes, destRes] = await Promise.all([
          fetch('/api/activities'),
          fetch('/api/destinations'),
        ]);
        if (actRes.ok) {
          const json = await actRes.json();
          if (json.data && json.data.length > 0) setActivities(json.data);
        }
        if (destRes.ok) {
          const json = await destRes.json();
          if (json.data && json.data.length > 0) setDestinations(json.data);
        }
      } catch (err) {
        console.warn('API fetch failed in Explorer, using fixtures:', err);
      }
    }
    loadData();
  }, []);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'hiking', label: 'Hiking' },
    { id: 'climbing', label: 'Climbing' },
    { id: 'diving', label: 'Diving' },
    { id: 'kayaking', label: 'Kayaking' },
    { id: 'paragliding', label: 'Paragliding' },
    { id: 'caving', label: 'Spelunking' },
    { id: 'mountaineering', label: 'Mountaineering' },
    { id: 'biking', label: 'Biking' },
  ];

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    const matchesCategory = selectedCategory === 'all' || act.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || act.difficulty === selectedDifficulty;
    const matchesSearch =
      !search ||
      act.name.toLowerCase().includes(search.toLowerCase()) ||
      act.description.toLowerCase().includes(search.toLowerCase()) ||
      act.location_name.toLowerCase().includes(search.toLowerCase());

    let matchesBudget = true;
    if (selectedBudget === 'free') {
      matchesBudget = !act.estimated_cost || act.estimated_cost === 0;
    } else if (selectedBudget === 'under50') {
      matchesBudget = (act.estimated_cost ?? 0) <= 50;
    } else if (selectedBudget === 'under100') {
      matchesBudget = (act.estimated_cost ?? 0) <= 100;
    }

    return matchesCategory && matchesDifficulty && matchesSearch && matchesBudget;
  });

  const hasActiveFilters =
    search !== '' ||
    selectedCategory !== 'all' ||
    selectedDifficulty !== 'all' ||
    selectedBudget !== 'all';

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedBudget('all');
    setSelectedItemId(undefined);
  };

  const selectedActivity = activities.find((a) => a.id === selectedItemId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-6">
      {/* 1. Explorer Header & Secret Level Clue */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D6CCBC] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#777A53] bg-[#EAE1D3] px-2 py-0.5 rounded border border-[#D6CCBC] mb-1.5">
            <Compass className="w-3.5 h-3.5 text-[#B85F43]" />
            <span>FIELD RECONNAISSANCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292820] font-sans">
            Explore Adventures
          </h1>
          <p className="text-xs sm:text-sm text-[#6D685C] mt-0.5">
            Discover verified routes, mountain peaks, and remote river runs on the interactive map.
          </p>
        </div>

        {/* Secret Level Clue: "Am I Brave Enough?" subtle discoverable entry point */}
        <Link
          href="/brave-enough"
          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EAE1D3]/70 hover:bg-[#EAE1D3] border border-dashed border-[#BDB19C] text-[#6D685C] hover:text-[#292820] transition-colors self-start sm:self-auto"
          title="Curious? Open unverified folklore archives"
        >
          <Ghost className="w-3.5 h-3.5 text-[#777A53] group-hover:text-[#B85F43] transition-colors" />
          <span className="text-[10px] font-mono uppercase font-bold text-[#777A53]">
            ARCHIVE DOSSIER:
          </span>
          <span className="font-handwritten text-base text-[#B85F43] -rotate-1 select-none">
            legends whispered after dusk...
          </span>
        </Link>
      </div>

      {/* 2. Compact Search & Filter Controls */}
      <div className="space-y-3 bg-[#FFFDF8] border border-[#D6CCBC] rounded-xl p-3 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6D685C]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trails, peaks, regions..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] text-xs placeholder:text-[#8E8675] focus:outline-hidden focus:border-[#777A53]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-[#6D685C] hover:text-[#292820]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) =>
              setSelectedDifficulty(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] text-xs font-semibold px-3 py-2 rounded-lg focus:outline-hidden"
          >
            <option value="all">Any Difficulty</option>
            <option value="1">Level 1 (Novice)</option>
            <option value="2">Level 2 (Easy)</option>
            <option value="3">Level 3 (Moderate)</option>
            <option value="4">Level 4 (Demanding)</option>
            <option value="5">Level 5 (Alpine Expert)</option>
          </select>

          {/* Budget Filter */}
          <select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value as any)}
            className="bg-[#F5F0E7] border border-[#D6CCBC] text-[#292820] text-xs font-semibold px-3 py-2 rounded-lg focus:outline-hidden"
          >
            <option value="all">Any Budget</option>
            <option value="free">Free / Public Access</option>
            <option value="under50">Under $50</option>
            <option value="under100">Under $100</option>
          </select>

          {/* Reset Filters Action */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#B85F43] bg-[#EAE1D3] hover:bg-[#D6CCBC]/50 border border-[#D6CCBC] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          {/* Mobile View Toggle (List vs Map) */}
          <div className="flex md:hidden border border-[#D6CCBC] rounded-lg overflow-hidden shrink-0">
            <button
              type="button"
              onClick={() => setMobileView('list')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 ${
                mobileView === 'list'
                  ? 'bg-[#292820] text-[#FFFDF8]'
                  : 'bg-[#F5F0E7] text-[#6D685C]'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileView('map')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 ${
                mobileView === 'map'
                  ? 'bg-[#292820] text-[#FFFDF8]'
                  : 'bg-[#F5F0E7] text-[#6D685C]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* Compact Category Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#292820] text-[#FFFDF8]'
                  : 'bg-[#F5F0E7] text-[#6D685C] hover:text-[#292820] hover:bg-[#EAE1D3] border border-[#D6CCBC]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Balanced Split View: Left ~40% List, Right ~60% Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Activity List (40% width on Desktop) */}
        <div
          ref={listContainerRef}
          className={`lg:col-span-5 space-y-4 ${
            mobileView === 'map' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#D6CCBC] pb-2">
            <span className="text-xs font-mono font-bold text-[#6D685C] uppercase tracking-wider">
              {filteredActivities.length} Adventures Found
            </span>
            {selectedItemId && (
              <button
                type="button"
                onClick={() => setSelectedItemId(undefined)}
                className="text-xs text-[#B85F43] font-mono hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Clear Selection</span>
              </button>
            )}
          </div>

          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center bg-[#FFFDF8] border border-[#D6CCBC] rounded-xl space-y-3">
              <Compass className="w-8 h-8 text-[#8E8675] mx-auto opacity-60" />
              <h3 className="text-sm font-bold text-[#292820]">No expeditions match your filters</h3>
              <p className="text-xs text-[#6D685C]">
                Try adjusting your search terms, difficulty range, or budget criteria.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn-journal-secondary text-xs py-1.5 px-3"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1 scrollbar-thin">
              {filteredActivities.map((act) => {
                const isSelected = selectedItemId === act.id;
                const activeDots = Math.min(3, Math.max(1, act.difficulty));

                return (
                  <div
                    key={act.id}
                    onClick={() => setSelectedItemId(act.id)}
                    className={`cursor-pointer rounded-xl bg-[#FFFDF8] border transition-all overflow-hidden p-3 flex gap-3.5 ${
                      isSelected
                        ? 'border-[#B85F43] ring-2 ring-[#B85F43]/30 shadow-xs'
                        : 'border-[#D6CCBC] hover:border-[#777A53]'
                    }`}
                  >
                    {/* 4:3 Aspect Image */}
                    <div className="w-28 sm:w-32 aspect-4/3 rounded-lg overflow-hidden shrink-0 bg-[#EAE1D3] relative">
                      <SafeImage
                        src={act.image_url}
                        alt={act.name}
                        aspectRatio="4/3"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-[9px] font-mono uppercase font-bold text-[#777A53]">
                            {act.category}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[#B85F43]">
                            +{act.base_points} PTS
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-[#292820] font-sans truncate">
                          {act.name}
                        </h3>

                        <div className="flex items-center gap-1 text-[11px] text-[#6D685C] font-mono truncate mt-0.5">
                          <MapPin className="w-3 h-3 text-[#777A53] shrink-0" />
                          <span className="truncate">{act.location_name}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#D6CCBC] flex items-center justify-between text-xs">
                        {/* 3-Dot Difficulty */}
                        <div className="flex items-center gap-1" title={`Difficulty: ${act.difficulty}/5`}>
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map((d) => (
                              <span
                                key={d}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  d <= activeDots ? 'bg-[#B85F43]' : 'bg-[#D6CCBC]'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-mono text-[#6D685C] ml-1">
                            {act.estimated_cost ? `$${act.estimated_cost.toFixed(0)}` : 'Free'}
                          </span>
                        </div>

                        {/* One primary action */}
                        <Link
                          href={`/activities/${act.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="btn-journal-primary text-[11px] py-1 px-2.5 rounded shadow-2xs hover:bg-[#B85F43]"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Map (60% width on Desktop) */}
        <div
          className={`lg:col-span-7 sticky top-20 ${
            mobileView === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="rounded-xl overflow-hidden border-2 border-[#D6CCBC] shadow-xs relative">
            <MapComponent
              activities={filteredActivities}
              destinations={destinations}
              selectedId={selectedItemId}
              height="580px"
              enableRouting={true}
              onSelectMarker={(item) => setSelectedItemId(item.id)}
            />

            {/* Synchronized Compact Info Card at Bottom of Map */}
            {selectedActivity && (
              <div className="absolute bottom-3 left-3 right-3 z-[450] bg-[#FFFDF8]/95 border-2 border-[#B85F43] rounded-xl p-3 shadow-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono uppercase font-bold text-[#777A53] bg-[#EAE1D3] px-1.5 py-0.2 rounded">
                      {selectedActivity.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#B85F43]">
                      +{selectedActivity.base_points} PTS
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#292820] font-sans truncate mt-0.5">
                    {selectedActivity.name}
                  </h4>
                  <div className="text-[11px] text-[#6D685C] font-mono truncate">
                    📍 {selectedActivity.location_name}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/activities/${selectedActivity.id}`}
                    className="btn-journal-terracotta text-xs py-1.5 px-3"
                  >
                    View details
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedItemId(undefined)}
                    className="text-[#6D685C] hover:text-[#292820] p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
