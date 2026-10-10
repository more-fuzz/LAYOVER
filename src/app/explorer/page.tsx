'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MapComponent from '@/components/MapComponent';
import SafeImage from '@/components/SafeImage';
import { SAMPLE_ACTIVITIES, SAMPLE_DESTINATIONS, ActivityItem, DestinationItem } from '@/data/sampleData';
import {
  Compass,
  Search,
  Filter,
  MapPin,
  Sparkles,
  Mountain,
  ArrowRight,
  Navigation,
  SlidersHorizontal,
  X,
} from 'lucide-react';

export default function ExplorerPage() {
  const [activities, setActivities] = useState<ActivityItem[]>(SAMPLE_ACTIVITIES);
  const [destinations, setDestinations] = useState<DestinationItem[]>(SAMPLE_DESTINATIONS);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | 'all'>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(undefined);

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
    { id: 'all', label: 'All Disciplines' },
    { id: 'hiking', label: '🥾 Hiking & Treks' },
    { id: 'climbing', label: '🧗 Climbing' },
    { id: 'diving', label: '🤿 Diving' },
    { id: 'kayaking', label: '🛶 Kayaking' },
    { id: 'paragliding', label: '🪂 Paragliding' },
    { id: 'caving', label: '🦇 Spelunking' },
    { id: 'mountaineering', label: '🏔️ Mountaineering' },
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

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D6CCBC] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#777A53] bg-[#EAE1D3] px-2.5 py-0.5 rounded border border-[#D6CCBC] mb-2">
            <Compass className="w-3.5 h-3.5 text-[#B85F43]" />
            <span>FIELD CARTOGRAPHY & RECONNAISSANCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#292820] font-sans">
            Adventure Map & Route Explorer
          </h1>
          <p className="text-xs sm:text-sm text-[#6D685C] mt-1 max-w-xl">
            Locate verified climbing boulders, glacial summits, and river rapids with OpenStreetMap
            cartography. Calculate real driving and transit routes via the integrated OSRM engine.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6D685C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trails, peaks, regions..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FFFDF8] border border-[#D6CCBC] text-[#292820] text-xs placeholder:text-[#8E8675] focus:outline-hidden focus:border-[#777A53] shadow-xs"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === cat.id
                ? 'btn-journal-primary'
                : 'bg-[#FFFDF8] text-[#6D685C] hover:text-[#292820] hover:bg-[#EAE1D3] border border-[#D6CCBC]'
            }`}
          >
            {cat.label}
          </button>
        ))}

        <div className="h-5 w-[1px] bg-[#D6CCBC] mx-1 shrink-0" />

        {/* Difficulty Selector */}
        <select
          value={selectedDifficulty}
          onChange={(e) =>
            setSelectedDifficulty(e.target.value === 'all' ? 'all' : Number(e.target.value))
          }
          className="bg-[#FFFDF8] border border-[#D6CCBC] text-[#292820] text-xs font-semibold px-3 py-1.5 rounded-lg focus:outline-hidden"
        >
          <option value="all">Any Difficulty Scale</option>
          <option value="1">Level 1 (Novice)</option>
          <option value="2">Level 2 (Easy)</option>
          <option value="3">Level 3 (Moderate)</option>
          <option value="4">Level 4 (Demanding)</option>
          <option value="5">Level 5 (Expert Alpine)</option>
        </select>
      </div>

      {/* Interactive Map with OSRM Routing */}
      <MapComponent
        activities={filteredActivities}
        destinations={destinations}
        selectedId={selectedItemId}
        height="560px"
        enableRouting={true}
        onSelectMarker={(item) => setSelectedItemId(item.id)}
      />

      {/* Matching Activities Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#D6CCBC] pb-2">
          <h2 className="text-base font-bold text-[#292820] font-sans">
            Filtered Expeditions ({filteredActivities.length})
          </h2>
          {selectedItemId && (
            <button
              type="button"
              onClick={() => setSelectedItemId(undefined)}
              className="text-xs text-[#B85F43] font-mono hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Clear Pin Focus</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredActivities.map((act) => {
            const isSelected = selectedItemId === act.id;
            return (
              <div
                key={act.id}
                onClick={() => setSelectedItemId(act.id)}
                className={`group cursor-pointer flex flex-col rounded-2xl bg-[#FFFDF8] border overflow-hidden transition-all shadow-xs hover:-translate-y-0.5 ${
                  isSelected
                    ? 'border-[#B85F43] ring-2 ring-[#B85F43]/30'
                    : 'border-[#D6CCBC] hover:border-[#777A53]'
                }`}
              >
                <div className="relative w-full">
                  <SafeImage
                    src={act.image_url}
                    alt={act.name}
                    aspectRatio="4/3"
                    fallbackTitle={act.name}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#FFFDF8]/90 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#777A53] uppercase border border-[#D6CCBC]">
                    {act.category}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-[#B85F43] text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    +{act.base_points} PTS
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-[#6D685C] mb-1 font-mono">
                      <MapPin className="w-3 h-3 text-[#777A53]" />
                      <span className="truncate">{act.location_name}</span>
                    </div>
                    <h3 className="font-bold text-sm text-[#292820] group-hover:text-[#B85F43] transition-colors line-clamp-1 font-sans">
                      {act.name}
                    </h3>
                    <p className="text-xs text-[#6D685C] line-clamp-2 mt-1 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D6CCBC] flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-[#8E8675] uppercase">
                      Diff: {act.difficulty}/5
                    </span>
                    <Link
                      href={`/activities/${act.id}`}
                      className="font-bold text-[#777A53] hover:underline"
                    >
                      Field Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
