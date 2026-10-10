'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MapComponent from '@/components/MapComponent';
import { SAMPLE_ACTIVITIES, SAMPLE_DESTINATIONS, ActivityItem, DestinationItem } from '@/data/sampleData';
import {
  Compass,
  Search,
  Filter,
  MapPin,
  Sparkles,
  Mountain,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';

export default function ExplorerPage() {
  const [activities, setActivities] = useState<ActivityItem[]>(SAMPLE_ACTIVITIES);
  const [destinations, setDestinations] = useState<DestinationItem[]>(SAMPLE_DESTINATIONS);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | 'all'>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(undefined);

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'hiking', label: '🥾 Hiking' },
    { id: 'climbing', label: '🧗 Climbing' },
    { id: 'diving', label: '🤿 Diving' },
    { id: 'kayaking', label: '🛶 Kayaking' },
    { id: 'paragliding', label: '🪂 Paragliding' },
    { id: 'caving', label: '🦇 Caving' },
    { id: 'biking', label: '🚵 Biking' },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <Compass className="w-4 h-4" />
            <span>Geographical Discovery</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            Adventure Explorer Map
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Locate verified climbing walls, alpine peaks, diving trenches, and ancient ruins.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities, locations..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111c16] border border-[#1e3427] text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-[#111c16] text-zinc-400 hover:text-white hover:bg-[#182920] border border-[#1b3125]'
            }`}
          >
            {cat.label}
          </button>
        ))}

        <div className="h-5 w-[1px] bg-[#1e3427] mx-1 shrink-0" />

        {/* Difficulty Selector */}
        <select
          value={selectedDifficulty}
          onChange={(e) =>
            setSelectedDifficulty(e.target.value === 'all' ? 'all' : Number(e.target.value))
          }
          className="bg-[#111c16] border border-[#1b3125] text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none"
        >
          <option value="all">Any Difficulty</option>
          <option value="1">★☆☆☆☆ (Beginner)</option>
          <option value="2">★★☆☆☆ (Easy)</option>
          <option value="3">★★★☆☆ (Intermediate)</option>
          <option value="4">★★★★☆ (Advanced)</option>
          <option value="5">★★★★★ (Expert)</option>
        </select>
      </div>

      {/* Interactive Map */}
      <MapComponent
        activities={filteredActivities}
        destinations={destinations}
        selectedId={selectedItemId}
        height="500px"
        onSelectMarker={(item) => setSelectedItemId(item.id)}
      />

      {/* Activities Grid Below Map */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            Matching Adventures ({filteredActivities.length})
          </h2>
          {selectedItemId && (
            <button
              type="button"
              onClick={() => setSelectedItemId(undefined)}
              className="text-xs text-amber-400 hover:underline"
            >
              Clear Selection
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
                className={`group cursor-pointer flex flex-col rounded-2xl bg-[#111c16] border overflow-hidden transition-all hover:-translate-y-1 ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/40'
                    : 'border-[#1e3427] hover:border-emerald-600'
                }`}
              >
                <div className="relative h-44 w-full">
                  <img
                    src={act.image_url}
                    alt={act.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300 uppercase">
                    {act.category}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-emerald-950/90 border border-emerald-700/60 px-2 py-0.5 rounded-full text-[11px] font-bold text-emerald-300">
                    +{act.base_points} pts
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 mb-1">
                      <MapPin className="w-3 h-3 text-emerald-500" />
                      <span>{act.location_name}</span>
                    </div>
                    <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {act.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                      {act.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#1a2d22] flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-bold">
                      {'★'.repeat(act.difficulty)}
                      <span className="text-zinc-600">{'★'.repeat(5 - act.difficulty)}</span>
                    </span>
                    <Link
                      href={`/activities/${act.id}`}
                      className="font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      View Details &rarr;
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
